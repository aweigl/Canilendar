import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

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
  DEFAULT_SETTINGS,
  type AppearanceMode,
  type Appointment,
  type AppointmentInput,
  type DogInput,
  type DogProfile,
  type NotificationPermissionState,
  type ReminderSettings,
} from '@/types/domain';

type CanilanderContextValue = {
  dogs: DogProfile[];
  appointments: Appointment[];
  settings: ReminderSettings;
  resolvedColorScheme: 'light' | 'dark';
  isLoaded: boolean;
  notificationPermission: NotificationPermissionState;
  getDogById: (dogId: string) => DogProfile | undefined;
  getAppointmentById: (appointmentId: string) => Appointment | undefined;
  getOccurrencesForDate: (date: Date) => ReturnType<typeof getOccurrencesForDate>;
  getMarkedDatesForMonth: (visibleMonth: Date) => Set<string>;
  saveDog: (input: DogInput) => DogProfile;
  deleteDog: (dogId: string) => boolean;
  saveAppointment: (input: AppointmentInput) => Promise<Appointment>;
  deleteAppointment: (appointmentId: string) => void;
  updateSettings: (partial: Partial<ReminderSettings>) => void;
  updateAppearanceMode: (mode: AppearanceMode) => void;
  refreshNotificationPermission: () => Promise<NotificationPermissionState>;
  requestNotificationPermission: () => Promise<NotificationPermissionState>;
};

const CanilanderContext = createContext<CanilanderContextValue | undefined>(undefined);

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

export function CanilanderProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useSystemColorScheme();
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>('undetermined');
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedColorScheme: 'light' | 'dark' =
    settings.appearanceMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : settings.appearanceMode;

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

    void persistState({
      dogs,
      appointments,
      settings,
    });
  }, [appointments, dogs, isLoaded, settings]);

  useEffect(() => {
    if (!isLoaded || notificationPermission !== 'granted') {
      return;
    }

    void syncScheduledNotifications({
      dogs,
      appointments,
      settings,
    });
  }, [appointments, dogs, isLoaded, notificationPermission, settings]);

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

  function saveDog(input: DogInput) {
    const existingDog = input.id ? getDogById(input.id) : undefined;
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
    const savedDog = saveDog(input.dog);
    const currentAppointment = input.id ? getAppointmentById(input.id) : undefined;
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

  return (
    <CanilanderContext.Provider
      value={{
        dogs,
        appointments,
        settings,
        resolvedColorScheme,
        isLoaded,
        notificationPermission,
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
        refreshNotificationPermission: refreshPermission,
        requestNotificationPermission: requestPermission,
      }}>
      {children}
    </CanilanderContext.Provider>
  );
}

export function useCanilander() {
  const context = useContext(CanilanderContext);

  if (!context) {
    throw new Error('useCanilander must be used within a CanilanderProvider');
  }

  return context;
}
