import {
  addDays,
  addMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  set,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMinutes,
} from 'date-fns';
import { de, enUS, es, fr } from 'date-fns/locale';

import { getCurrentLanguage, getFixedT, getWeekdayTranslationKey } from '@/i18n/helpers';
import type { Appointment, AppointmentOccurrence, DogProfile } from '@/types/domain';
import type { AppLanguage } from '@/types/domain';

const WEEK_STARTS_ON = 1;

function getDateFnsLocale(language: AppLanguage) {
  switch (language) {
    case 'de':
      return de;
    case 'fr':
      return fr;
    case 'es':
      return es;
    default:
      return enUS;
  }
}

function getLanguage(language?: AppLanguage) {
  return language ?? getCurrentLanguage();
}

export function getMonthGrid(visibleMonth: Date) {
  const firstDay = startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: WEEK_STARTS_ON });
  const lastDay = endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: WEEK_STARTS_ON });
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });
  const weeks: Date[][] = [];

  for (let index = 0; index < days.length; index += 7) {
    weeks.push(days.slice(index, index + 7));
  }

  return weeks;
}

export function isCurrentMonthDay(day: Date, visibleMonth: Date) {
  return isSameMonth(day, visibleMonth);
}

export function toDateKey(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatMonthLabel(date: Date, language?: AppLanguage) {
  return format(date, 'MMMM yyyy', { locale: getDateFnsLocale(getLanguage(language)) });
}

export function formatLongDate(date: Date, language?: AppLanguage) {
  return format(date, 'EEEE, MMMM d', { locale: getDateFnsLocale(getLanguage(language)) });
}

export function formatShortDate(date: Date, language?: AppLanguage) {
  return format(date, 'MMM d', { locale: getDateFnsLocale(getLanguage(language)) });
}

export function formatTimeLabel(date: Date, language?: AppLanguage) {
  return format(date, 'p', { locale: getDateFnsLocale(getLanguage(language)) });
}

export function formatTimeInputValue(date: Date) {
  return format(date, 'HH:mm');
}

export function formatDayNumber(date: Date) {
  return format(date, 'd');
}

export function getWeekdayShortLabel(weekday: number, language?: AppLanguage) {
  const t = getFixedT(language);
  return t(`common.weekdayShort.${getWeekdayTranslationKey(weekday)}`);
}

export function getWeekdayShortLabels(language?: AppLanguage) {
  return [1, 2, 3, 4, 5, 6, 0].map((weekday) => getWeekdayShortLabel(weekday, language));
}

export function combineDateAndTimeParts(date: Date, time: Date) {
  return set(date, {
    hours: time.getHours(),
    minutes: time.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });
}

export function parseTimeValue(timeValue: string) {
  const [hours, minutes] = timeValue.split(':').map((segment) => Number(segment));
  const value = new Date();

  value.setHours(Number.isFinite(hours) ? hours : 7, Number.isFinite(minutes) ? minutes : 0, 0, 0);

  return value;
}

export function getRecurrenceWeekdays(appointment: Appointment) {
  if (!appointment.isRecurring) {
    return [];
  }

  const fallbackWeekday = getDay(parseISO(appointment.startAt));
  const weekdays = appointment.recurrenceRule?.weekdays ?? [];

  return weekdays.length > 0 ? weekdays : [fallbackWeekday];
}

export function occursOnDate(appointment: Appointment, date: Date) {
  const startAt = parseISO(appointment.startAt);

  if (!appointment.isRecurring) {
    return isSameDay(startAt, date);
  }

  if (isBefore(startOfDay(date), startOfDay(startAt))) {
    return false;
  }

  return getRecurrenceWeekdays(appointment).includes(getDay(date));
}

export function getOccurrenceStartAt(appointment: Appointment, date: Date) {
  const startAt = parseISO(appointment.startAt);

  return set(date, {
    hours: startAt.getHours(),
    minutes: startAt.getMinutes(),
    seconds: 0,
    milliseconds: 0,
  });
}

export function buildOccurrence(
  appointment: Appointment,
  dog: DogProfile,
  date: Date
): AppointmentOccurrence {
  const startAt = getOccurrenceStartAt(appointment, date);
  const reminderAt = appointment.reminderMinutesBefore > 0
    ? subMinutes(startAt, appointment.reminderMinutesBefore)
    : null;

  return {
    occurrenceId: `${appointment.id}:${toDateKey(date)}`,
    occurrenceDate: toDateKey(date),
    startAt,
    reminderAt,
    appointment,
    dog,
  };
}

export function getOccurrencesForDate(
  appointments: Appointment[],
  dogs: DogProfile[],
  date: Date
) {
  const dogsById = new Map(dogs.map((dog) => [dog.id, dog]));

  return appointments
    .filter((appointment) => occursOnDate(appointment, date))
    .map((appointment) => {
      const dog = dogsById.get(appointment.dogId);

      return dog ? buildOccurrence(appointment, dog, date) : null;
    })
    .filter((occurrence): occurrence is AppointmentOccurrence => occurrence !== null)
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime());
}

export function getMarkedDateKeys(
  appointments: Appointment[],
  dogs: DogProfile[],
  visibleMonth: Date
) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(visibleMonth), { weekStartsOn: WEEK_STARTS_ON }),
    end: endOfWeek(endOfMonth(visibleMonth), { weekStartsOn: WEEK_STARTS_ON }),
  });
  const markedDates = new Set<string>();

  days.forEach((day) => {
    if (getOccurrencesForDate(appointments, dogs, day).length > 0) {
      markedDates.add(toDateKey(day));
    }
  });

  return markedDates;
}

export function getUpcomingOccurrences(
  appointments: Appointment[],
  dogs: DogProfile[],
  startDate: Date,
  windowDays: number
) {
  const days = eachDayOfInterval({
    start: startOfDay(startDate),
    end: startOfDay(addDays(startDate, windowDays - 1)),
  });

  return days.flatMap((date) => getOccurrencesForDate(appointments, dogs, date));
}

export function buildDailySummaryBody(occurrences: AppointmentOccurrence[], language?: AppLanguage) {
  const t = getFixedT(language);

  if (occurrences.length === 0) {
    return t('notifications.noAppointmentsToday');
  }

  const headline = occurrences
    .slice(0, 3)
    .map((occurrence) => `${formatTimeLabel(occurrence.startAt, language)} ${occurrence.dog.name}`)
    .join(' • ');

  if (occurrences.length <= 3) {
    return headline;
  }

  return t('notifications.summaryMore', { headline, count: occurrences.length - 3 });
}

export function getNextNotificationTime(date: Date, timeValue: string) {
  const [hours, minutes] = timeValue.split(':').map((segment) => Number(segment));

  return set(date, {
    hours: Number.isFinite(hours) ? hours : 7,
    minutes: Number.isFinite(minutes) ? minutes : 0,
    seconds: 0,
    milliseconds: 0,
  });
}

export function describeRecurrence(appointment: Appointment, language?: AppLanguage) {
  const t = getFixedT(language);

  if (!appointment.isRecurring) {
    return t('recurrence.oneTime');
  }

  const labels = [...getRecurrenceWeekdays(appointment)]
    .sort((left, right) => (left === 0 ? 7 : left) - (right === 0 ? 7 : right))
    .map((weekday) => getWeekdayShortLabel(weekday, language));

  return t('recurrence.every', { days: labels.join(', ') });
}

export function describeReminder(minutes: number, language?: AppLanguage) {
  const t = getFixedT(language);

  if (minutes < 60) {
    return t('reminder.beforeMinutes', { count: minutes });
  }

  if (minutes % 60 === 0) {
    const hours = minutes / 60;
    return t('reminder.beforeHours', { count: hours });
  }

  return t('reminder.beforeHoursMinutes', {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  });
}

export function withReminderOffset(date: Date, minutes: number) {
  return addMinutes(date, -minutes);
}
