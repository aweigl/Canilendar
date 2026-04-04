import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, type Appointment, type PersistedAppState } from '@/types/domain';

const STORAGE_KEY = '@canilendar/app-state-v1';

const FALLBACK_STATE: PersistedAppState = {
  dogs: [],
  appointments: [],
  settings: DEFAULT_SETTINGS,
};

function normalizeAppointment(value: unknown): Appointment | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.dogId !== 'string' ||
    typeof candidate.startAt !== 'string' ||
    typeof candidate.isRecurring !== 'boolean' ||
    typeof candidate.reminderMinutesBefore !== 'number' ||
    typeof candidate.createdAt !== 'string' ||
    typeof candidate.updatedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    dogId: candidate.dogId,
    startAt: candidate.startAt,
    endAt: typeof candidate.endAt === 'string' || candidate.endAt === null ? candidate.endAt : null,
    notes: typeof candidate.notes === 'string' ? candidate.notes : '',
    metadata: typeof candidate.metadata === 'string' ? candidate.metadata : '',
    isRecurring: candidate.isRecurring,
    recurrenceRule:
      candidate.recurrenceRule &&
      typeof candidate.recurrenceRule === 'object' &&
      (candidate.recurrenceRule as Record<string, unknown>).frequency === 'weekly' &&
      Array.isArray((candidate.recurrenceRule as Record<string, unknown>).weekdays)
        ? {
            frequency: 'weekly',
            weekdays: ((candidate.recurrenceRule as Record<string, unknown>).weekdays as unknown[]).filter(
              (weekday): weekday is number => typeof weekday === 'number'
            ),
          }
        : null,
    reminderMinutesBefore: candidate.reminderMinutesBefore,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
}

export async function loadPersistedState(): Promise<PersistedAppState> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return FALLBACK_STATE;
    }

    const parsed = JSON.parse(rawValue) as Partial<PersistedAppState>;

    return {
      dogs: Array.isArray(parsed.dogs) ? parsed.dogs : [],
      appointments: Array.isArray(parsed.appointments)
        ? parsed.appointments
            .map((appointment) => normalizeAppointment(appointment))
            .filter((appointment): appointment is Appointment => appointment !== null)
        : [],
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    return FALLBACK_STATE;
  }
}

export async function persistState(state: PersistedAppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
