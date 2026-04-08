import { addDays, getDay, parseISO, startOfDay } from "date-fns";

import {
  getRecurrenceWeekdays,
  occursOnDate,
  toDateKey,
} from "@/lib/date";
import { createId } from "@/lib/ids";
import { getReviewEligibilityTimestamp } from "@/lib/review";
import type {
  Appointment,
  AppointmentInput,
  ChecklistTarget,
  DogInput,
  DogProfile,
  OnboardingChecklistState,
  ReviewPromptState,
} from "@/types/domain";

export type DailyLimitValidationResult = {
  exceededDates: Date[];
  isValid: boolean;
  limit: number;
};

function normalizeText(value: string) {
  return value.trim();
}

function getFirstOccurrenceOnOrAfter(startAt: Date, weekday: number) {
  const startDate = startOfDay(startAt);
  const dayOffset = (weekday - getDay(startDate) + 7) % 7;

  return addDays(startDate, dayOffset);
}

export function clampDailyAppointmentLimit(
  limit: number,
  min: number,
  max: number,
) {
  return Math.min(max, Math.max(min, Math.round(limit)));
}

export function buildDogRecord(input: DogInput, currentDog?: DogProfile) {
  const timestamp = new Date().toISOString();
  const normalizedPhotoUri = normalizeText(input.photoUri ?? "");

  return {
    id: currentDog?.id ?? input.id ?? createId(),
    name: normalizeText(input.name),
    address: normalizeText(input.address),
    ownerPhone: normalizeText(input.ownerPhone),
    notes: normalizeText(input.notes ?? ""),
    photoUri: normalizedPhotoUri || undefined,
    metadata: normalizeText(input.metadata ?? ""),
    createdAt: currentDog?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function upsertDogRecord(
  currentDogs: DogProfile[],
  nextDog: DogProfile,
  existingDog?: DogProfile,
) {
  if (existingDog) {
    return currentDogs.map((dog) => (dog.id === existingDog.id ? nextDog : dog));
  }

  return [...currentDogs, nextDog].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
}

export function buildDraftAppointment(
  input: AppointmentInput,
  defaultReminderMinutes: number,
  currentAppointment?: Appointment,
): Appointment {
  const recurrenceWeekdays = input.isRecurring
    ? input.recurrenceWeekdays.length > 0
      ? input.recurrenceWeekdays
      : [new Date(input.startAt).getDay()]
    : [];
  const timestamp = new Date().toISOString();

  return {
    id: currentAppointment?.id ?? input.id ?? "draft-appointment",
    dogId: currentAppointment?.dogId ?? input.dog.id ?? "draft-dog",
    startAt: input.startAt,
    hasPickupTime: input.hasPickupTime,
    endAt: input.endAt ?? currentAppointment?.endAt ?? null,
    notes: normalizeText(input.notes ?? currentAppointment?.notes ?? ""),
    metadata: normalizeText(
      input.metadata ?? currentAppointment?.metadata ?? "",
    ),
    isRecurring: input.isRecurring,
    recurrenceRule: input.isRecurring
      ? {
          frequency: "weekly" as const,
          weekdays: recurrenceWeekdays,
        }
      : null,
    reminderMinutesBefore:
      input.reminderMinutesBefore ??
      currentAppointment?.reminderMinutesBefore ??
      defaultReminderMinutes,
    createdAt: currentAppointment?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function validateAppointmentDailyLimit({
  appointments,
  currentAppointment,
  dailyAppointmentLimit,
  input,
  defaultReminderMinutes,
}: {
  appointments: Appointment[];
  currentAppointment?: Appointment;
  dailyAppointmentLimit: number;
  input: AppointmentInput;
  defaultReminderMinutes: number;
}): DailyLimitValidationResult {
  const candidateAppointment = buildDraftAppointment(
    input,
    defaultReminderMinutes,
    currentAppointment,
  );
  const comparisonAppointments = currentAppointment
    ? appointments.filter((appointment) => appointment.id !== currentAppointment.id)
    : appointments;
  const validationDates = new Map<string, Date>();
  const candidateStartAt = parseISO(candidateAppointment.startAt);
  const candidateWeekdays = candidateAppointment.isRecurring
    ? getRecurrenceWeekdays(candidateAppointment)
    : [getDay(candidateStartAt)];

  function addValidationDate(date: Date) {
    const normalizedDate = startOfDay(date);
    validationDates.set(toDateKey(normalizedDate), normalizedDate);
  }

  if (candidateAppointment.isRecurring) {
    candidateWeekdays.forEach((weekday) => {
      addValidationDate(getFirstOccurrenceOnOrAfter(candidateStartAt, weekday));
    });

    comparisonAppointments.forEach((appointment) => {
      const appointmentStartAt = parseISO(appointment.startAt);

      if (!appointment.isRecurring) {
        if (
          appointmentStartAt >= startOfDay(candidateStartAt) &&
          candidateWeekdays.includes(getDay(appointmentStartAt))
        ) {
          addValidationDate(appointmentStartAt);
        }

        return;
      }

      getRecurrenceWeekdays(appointment).forEach((weekday) => {
        if (!candidateWeekdays.includes(weekday)) {
          return;
        }

        const candidateDate = getFirstOccurrenceOnOrAfter(
          candidateStartAt,
          weekday,
        );
        const recurringStartDate = getFirstOccurrenceOnOrAfter(
          appointmentStartAt,
          weekday,
        );

        addValidationDate(
          recurringStartDate > candidateDate ? recurringStartDate : candidateDate,
        );
      });
    });
  } else {
    addValidationDate(candidateStartAt);
  }

  const candidateAndExistingAppointments = [
    ...comparisonAppointments,
    candidateAppointment,
  ];
  const exceededDates = [...validationDates.values()]
    .filter((date) => {
      const currentCount = appointments.filter((appointment) =>
        occursOnDate(appointment, date),
      ).length;
      const nextCount = candidateAndExistingAppointments.filter((appointment) =>
        occursOnDate(appointment, date),
      ).length;

      return nextCount > dailyAppointmentLimit && nextCount > currentCount;
    })
    .sort((left, right) => left.getTime() - right.getTime());

  return {
    exceededDates,
    isValid: exceededDates.length === 0,
    limit: dailyAppointmentLimit,
  };
}

export function buildAppointmentRecord({
  currentAppointment,
  defaultReminderMinutes,
  input,
  savedDogId,
}: {
  currentAppointment?: Appointment;
  defaultReminderMinutes: number;
  input: AppointmentInput;
  savedDogId: string;
}) {
  const timestamp = new Date().toISOString();
  const reminderMinutesBefore =
    input.reminderMinutesBefore ?? defaultReminderMinutes;
  const weekdays = input.isRecurring
    ? input.recurrenceWeekdays.length > 0
      ? input.recurrenceWeekdays
      : [new Date(input.startAt).getDay()]
    : [];

  return {
    id: currentAppointment?.id ?? input.id ?? createId(),
    dogId: savedDogId,
    startAt: input.startAt,
    hasPickupTime: input.hasPickupTime,
    endAt: input.endAt ?? null,
    notes: normalizeText(input.notes ?? ""),
    metadata: normalizeText(input.metadata ?? ""),
    isRecurring: input.isRecurring,
    recurrenceRule: input.isRecurring
      ? {
          frequency: "weekly" as const,
          weekdays,
        }
      : null,
    reminderMinutesBefore,
    createdAt: currentAppointment?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function upsertAppointmentRecord(
  currentAppointments: Appointment[],
  nextAppointment: Appointment,
  currentAppointment?: Appointment,
) {
  if (currentAppointment) {
    return currentAppointments
      .map((appointment) =>
        appointment.id === currentAppointment.id ? nextAppointment : appointment,
      )
      .sort((left, right) => left.startAt.localeCompare(right.startAt));
  }

  return [...currentAppointments, nextAppointment].sort((left, right) =>
    left.startAt.localeCompare(right.startAt),
  );
}

export function markChecklistTargetSeen(
  checklist: OnboardingChecklistState,
  target: ChecklistTarget,
) {
  if (target === "dogs" && checklist.hasVisitedDogs) {
    return checklist;
  }

  if (target === "settings" && checklist.hasVisitedSettings) {
    return checklist;
  }

  return {
    ...checklist,
    hasVisitedDogs: target === "dogs" ? true : checklist.hasVisitedDogs,
    hasVisitedSettings:
      target === "settings" ? true : checklist.hasVisitedSettings,
  };
}

export function completeOnboardingState(
  onboardingChecklist: OnboardingChecklistState,
  reviewPrompt: ReviewPromptState,
) {
  const completedAt = onboardingChecklist.completedAt ?? new Date().toISOString();

  return {
    onboardingChecklist: {
      ...onboardingChecklist,
      completedAt,
    },
    reviewPrompt: {
      ...reviewPrompt,
      eligibleAfter:
        reviewPrompt.eligibleAfter ??
        getReviewEligibilityTimestamp(completedAt),
    },
  };
}
