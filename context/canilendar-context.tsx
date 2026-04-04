import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import i18n, { resolveAppLanguage } from '@/i18n';
import {
  getMarkedDateKeys,
  getOccurrencesForDate,
} from '@/lib/date';
import { createId } from '@/lib/ids';
import {
  getNotificationPermissionState,
  requestNotificationAccess,
  syncScheduledNotifications,
} from '@/lib/notifications';
import { loadPersistedState, persistState } from '@/lib/storage';
import {
  DEFAULT_ONBOARDING_CHECKLIST,
  DEFAULT_SETTINGS,
  FREE_TIER_LIMITS,
  type AppearanceMode,
  type Appointment,
  type AppointmentInput,
  type ChecklistTarget,
  type DogInput,
  type DogProfile,
  type NotificationPermissionState,
  type OnboardingChecklistState,
  type OnboardingStatus,
  type PaywallTrigger,
  type ReminderSettings,
} from '@/types/domain';

type CanilendarContextValue = {
  dogs: DogProfile[];
  appointments: Appointment[];
  settings: ReminderSettings;
  onboardingChecklist: OnboardingChecklistState;
  onboardingStatus: OnboardingStatus;
  resolvedColorScheme: 'light' | 'dark';
  isLoaded: boolean;
  notificationPermission: NotificationPermissionState;
  canCreateDog: boolean;
  canCreateAppointment: boolean;
  getDogById: (dogId: string) => DogProfile | undefined;
  getAppointmentById: (appointmentId: string) => Appointment | undefined;
  getOccurrencesForDate: (date: Date) => ReturnType<typeof getOccurrencesForDate>;
  getMarkedDatesForMonth: (visibleMonth: Date) => Set<string>;
  saveDog: (input: DogInput) => DogProfile | null;
  deleteDog: (dogId: string) => boolean;
  saveAppointment: (input: AppointmentInput) => Promise<Appointment | null>;
  deleteAppointment: (appointmentId: string) => void;
  updateSettings: (partial: Partial<ReminderSettings>) => void;
  updateAppearanceMode: (mode: AppearanceMode) => void;
  markChecklistStepSeen: (target: ChecklistTarget) => void;
  dismissHomeChecklist: () => void;
  completeOnboarding: () => void;
  resetLocalData: () => void;
  refreshNotificationPermission: () => Promise<NotificationPermissionState>;
  requestNotificationPermission: () => Promise<NotificationPermissionState>;
};

const CanilendarContext = createContext<CanilendarContextValue | undefined>(undefined);

function normalizeText(value: string) {
  return value.trim();
}

function buildDogRecord(input: DogInput, currentDog?: DogProfile): DogProfile {
  const timestamp = new Date().toISOString();

  return {
    id: currentDog?.id ?? input.id ?? createId(),
    name: normalizeText(input.name),
    address: normalizeText(input.address),
    ownerPhone: normalizeText(input.ownerPhone),
    notes: normalizeText(input.notes ?? ''),
    metadata: normalizeText(input.metadata ?? ''),
    createdAt: currentDog?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
}

type CanilendarProviderProps = PropsWithChildren<{
  isPro: boolean;
  onRequireUpgrade: (trigger: PaywallTrigger) => void;
}>;

export function CanilendarProvider({
  children,
  isPro,
  onRequireUpgrade,
}: CanilendarProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [onboardingChecklist, setOnboardingChecklist] = useState(DEFAULT_ONBOARDING_CHECKLIST);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>('undetermined');
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedColorScheme: 'light' | 'dark' =
    settings.appearanceMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : settings.appearanceMode;
  const onboardingStatus: OnboardingStatus = isLoaded
    ? onboardingChecklist.completedAt
      ? 'complete'
      : 'incomplete'
    : 'loading';

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      const [persistedState, permissionState] = await Promise.all([
        loadPersistedState(),
        getNotificationPermissionState(),
      ]);

      if (!isMounted) {
        return;
      }

      setDogs(persistedState.dogs);
      setAppointments(persistedState.appointments);
      setSettings(persistedState.settings);
      setOnboardingChecklist({
        ...DEFAULT_ONBOARDING_CHECKLIST,
        ...(persistedState.onboarding ?? {}),
      });
      setNotificationPermission(permissionState);
      setIsLoaded(true);
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const language = resolveAppLanguage(settings.language);

    if (i18n.resolvedLanguage !== language) {
      void i18n.changeLanguage(language);
    }
  }, [isLoaded, settings.language]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    void persistState({
      dogs,
      appointments,
      settings,
      onboarding: onboardingChecklist,
    });
  }, [appointments, dogs, isLoaded, onboardingChecklist, settings]);

  useEffect(() => {
    if (!isLoaded || notificationPermission !== 'granted') {
      return;
    }

    void syncScheduledNotifications({
      dogs,
      appointments,
      settings,
      onboarding: onboardingChecklist,
    });
  }, [appointments, dogs, isLoaded, notificationPermission, onboardingChecklist, settings]);

  function getDogById(dogId: string) {
    return dogs.find((dog) => dog.id === dogId);
  }

  function getAppointmentById(appointmentId: string) {
    return appointments.find((appointment) => appointment.id === appointmentId);
  }

  function getOccurrencesByDate(date: Date) {
    return getOccurrencesForDate(appointments, dogs, date);
  }

  function getMarkedDatesForMonth(visibleMonth: Date) {
    return getMarkedDateKeys(appointments, dogs, visibleMonth);
  }

  const canCreateDog = isPro || dogs.length < FREE_TIER_LIMITS.dogs;
  const canCreateAppointment = isPro || appointments.length < FREE_TIER_LIMITS.appointments;

  function saveDog(input: DogInput) {
    const existingDog = input.id ? getDogById(input.id) : undefined;

    if (!existingDog && !canCreateDog) {
      onRequireUpgrade('dog_limit');
      return null;
    }

    const nextDog = buildDogRecord(input, existingDog);

    setDogs((currentDogs) => {
      if (existingDog) {
        return currentDogs.map((dog) => (dog.id === existingDog.id ? nextDog : dog));
      }

      return [...currentDogs, nextDog].sort((left, right) => left.name.localeCompare(right.name));
    });

    return nextDog;
  }

  function deleteDog(dogId: string) {
    if (appointments.some((appointment) => appointment.dogId === dogId)) {
      return false;
    }

    setDogs((currentDogs) => currentDogs.filter((dog) => dog.id !== dogId));
    return true;
  }

  async function requestPermission() {
    const permissionState = await requestNotificationAccess();
    setNotificationPermission(permissionState);

    if (permissionState === 'granted' && isLoaded) {
      await syncScheduledNotifications({
        dogs,
        appointments,
        settings,
        onboarding: onboardingChecklist,
      });
    }

    return permissionState;
  }

  async function refreshPermission() {
    const permissionState = await getNotificationPermissionState();
    setNotificationPermission(permissionState);

    return permissionState;
  }

  async function saveAppointment(input: AppointmentInput) {
    const currentAppointment = input.id ? getAppointmentById(input.id) : undefined;

    if (!currentAppointment && !canCreateAppointment) {
      onRequireUpgrade('appointment_limit');
      return null;
    }

    const savedDog = saveDog(input.dog);

    if (!savedDog) {
      return null;
    }

    const timestamp = new Date().toISOString();
    const reminderMinutesBefore = input.reminderMinutesBefore ?? settings.defaultReminderMinutes;
    const weekdays = input.isRecurring
      ? input.recurrenceWeekdays.length > 0
        ? input.recurrenceWeekdays
        : [new Date(input.startAt).getDay()]
      : [];
    const nextAppointment: Appointment = {
      id: currentAppointment?.id ?? input.id ?? createId(),
      dogId: savedDog.id,
      startAt: input.startAt,
      endAt: input.endAt ?? null,
      notes: normalizeText(input.notes ?? ''),
      metadata: normalizeText(input.metadata ?? ''),
      isRecurring: input.isRecurring,
      recurrenceRule: input.isRecurring
        ? {
            frequency: 'weekly',
            weekdays,
          }
        : null,
      reminderMinutesBefore,
      createdAt: currentAppointment?.createdAt ?? timestamp,
      updatedAt: timestamp,
    };

    setAppointments((currentAppointments) => {
      if (currentAppointment) {
        return currentAppointments
          .map((appointment) => (appointment.id === currentAppointment.id ? nextAppointment : appointment))
          .sort((left, right) => left.startAt.localeCompare(right.startAt));
      }

      return [...currentAppointments, nextAppointment].sort((left, right) =>
        left.startAt.localeCompare(right.startAt)
      );
    });

    if (notificationPermission === 'undetermined') {
      void requestPermission();
    }

    return nextAppointment;
  }

  function deleteAppointment(appointmentId: string) {
    setAppointments((currentAppointments) =>
      currentAppointments.filter((appointment) => appointment.id !== appointmentId)
    );
  }

  function updateSettings(partial: Partial<ReminderSettings>) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...partial,
    }));
  }

  function markChecklistStepSeen(target: ChecklistTarget) {
    setOnboardingChecklist((current) => {
      if (target === 'dogs' && current.hasVisitedDogs) {
        return current;
      }

      if (target === 'settings' && current.hasVisitedSettings) {
        return current;
      }

      return {
        ...current,
        hasVisitedDogs: target === 'dogs' ? true : current.hasVisitedDogs,
        hasVisitedSettings: target === 'settings' ? true : current.hasVisitedSettings,
      };
    });
  }

  function dismissHomeChecklist() {
    setOnboardingChecklist((current) => ({
      ...current,
      dismissed: true,
    }));
  }

  function completeOnboarding() {
    setOnboardingChecklist((current) => ({
      ...current,
      completedAt: current.completedAt ?? new Date().toISOString(),
    }));
  }

  function resetLocalData() {
    setDogs([]);
    setAppointments([]);
    setSettings(DEFAULT_SETTINGS);
    setOnboardingChecklist(DEFAULT_ONBOARDING_CHECKLIST);
  }

  return (
    <CanilendarContext.Provider
      value={{
        dogs,
        appointments,
        settings,
        onboardingChecklist,
        onboardingStatus,
        resolvedColorScheme,
        isLoaded,
        notificationPermission,
        canCreateDog,
        canCreateAppointment,
        getDogById,
        getAppointmentById,
        getOccurrencesForDate: getOccurrencesByDate,
        getMarkedDatesForMonth,
        saveDog,
        deleteDog,
        saveAppointment,
        deleteAppointment,
        updateSettings,
        updateAppearanceMode: (mode) => updateSettings({ appearanceMode: mode }),
        markChecklistStepSeen,
        dismissHomeChecklist,
        completeOnboarding,
        resetLocalData,
        refreshNotificationPermission: refreshPermission,
        requestNotificationPermission: requestPermission,
      }}>
      {children}
    </CanilendarContext.Provider>
  );
}

export function useCanilendar() {
  const context = useContext(CanilendarContext);

  if (!context) {
    throw new Error('useCanilendar must be used within a CanilendarProvider');
  }

  return context;
}

export function useOptionalCanilendar() {
  return useContext(CanilendarContext);
}
