import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import {
  DAILY_APPOINTMENT_LIMIT_MAX,
  DAILY_APPOINTMENT_LIMIT_MIN,
  DEFAULT_ONBOARDING_CHECKLIST,
  DEFAULT_REVIEW_PROMPT_STATE,
  DEFAULT_SETTINGS,
  type Appointment,
  type AuthSession,
  type DogProfile,
  type PersistedAppState,
} from '@/types/domain';

const STORAGE_KEY = '@canilendar/app-state-v3';
const STORAGE_KEY_PREFIX = '@canilendar/app-state-v2';
const LEGACY_STORAGE_KEY = '@canilendar/app-state-v1';
const AUTH_STORAGE_KEY = 'canilendar_auth_session_v1';
const LEGACY_AUTH_STORAGE_KEY = '@canilendar/auth-session-v1';
export const LOCAL_DEVICE_STORAGE_SCOPE = 'local-device';

const FALLBACK_STATE: PersistedAppState = {
  dogs: [],
  appointments: [],
  settings: DEFAULT_SETTINGS,
  onboarding: DEFAULT_ONBOARDING_CHECKLIST,
  reviewPrompt: DEFAULT_REVIEW_PROMPT_STATE,
};

function clampDailyAppointmentLimit(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_SETTINGS.dailyAppointmentLimit;
  }

  return Math.min(
    DAILY_APPOINTMENT_LIMIT_MAX,
    Math.max(DAILY_APPOINTMENT_LIMIT_MIN, Math.round(value))
  );
}

function normalizeDog(value: unknown): DogProfile | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.id !== 'string' ||
    typeof candidate.name !== 'string' ||
    typeof candidate.address !== 'string' ||
    typeof candidate.ownerPhone !== 'string' ||
    typeof candidate.createdAt !== 'string' ||
    typeof candidate.updatedAt !== 'string'
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    address: candidate.address,
    ownerPhone: candidate.ownerPhone,
    notes: typeof candidate.notes === 'string' ? candidate.notes : '',
    photoUri: typeof candidate.photoUri === 'string' ? candidate.photoUri : undefined,
    metadata: typeof candidate.metadata === 'string' ? candidate.metadata : '',
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
}

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
    hasPickupTime:
      typeof candidate.hasPickupTime === 'boolean' ? candidate.hasPickupTime : true,
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

function getScopedStorageKey(scopeKey: string) {
  return `${STORAGE_KEY}:${scopeKey}`;
}

function normalizeAuthSession(value: unknown): AuthSession | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    candidate.provider !== 'apple' ||
    typeof candidate.appleUserId !== 'string' ||
    typeof candidate.revenueCatAppUserId !== 'string'
  ) {
    return null;
  }

  return {
    provider: 'apple',
    appleUserId: candidate.appleUserId,
    revenueCatAppUserId: candidate.revenueCatAppUserId.includes('@')
      ? candidate.appleUserId
      : candidate.revenueCatAppUserId,
    email: typeof candidate.email === 'string' ? candidate.email : null,
    givenName: typeof candidate.givenName === 'string' ? candidate.givenName : null,
    familyName: typeof candidate.familyName === 'string' ? candidate.familyName : null,
  };
}

function normalizePersistedState(parsed: Partial<PersistedAppState>): PersistedAppState {
  return {
    dogs: Array.isArray(parsed.dogs)
      ? parsed.dogs
          .map((dog) => normalizeDog(dog))
          .filter((dog): dog is DogProfile => dog !== null)
      : [],
    appointments: Array.isArray(parsed.appointments)
      ? parsed.appointments
          .map((appointment) => normalizeAppointment(appointment))
          .filter((appointment): appointment is Appointment => appointment !== null)
      : [],
    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed.settings ?? {}),
      dailyAppointmentLimit: clampDailyAppointmentLimit(parsed.settings?.dailyAppointmentLimit),
    },
    onboarding: {
      ...DEFAULT_ONBOARDING_CHECKLIST,
      ...(parsed.onboarding ?? {}),
    },
    reviewPrompt: {
      ...DEFAULT_REVIEW_PROMPT_STATE,
      ...(parsed.reviewPrompt ?? {}),
    },
  };
}

export async function loadPersistedState(): Promise<PersistedAppState> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (rawValue) {
      return normalizePersistedState(JSON.parse(rawValue) as Partial<PersistedAppState>);
    }

    const allKeys = await AsyncStorage.getAllKeys();
    const migratedUserScopedKey = allKeys.find((key) => key.startsWith(`${STORAGE_KEY_PREFIX}:`));

    if (migratedUserScopedKey) {
      const migratedRawValue = await AsyncStorage.getItem(migratedUserScopedKey);

      if (migratedRawValue) {
        const migratedState = normalizePersistedState(
          JSON.parse(migratedRawValue) as Partial<PersistedAppState>
        );
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
        return migratedState;
      }
    }

    const legacyValue = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);

    if (!legacyValue) {
      return FALLBACK_STATE;
    }

    const migrated = normalizePersistedState(JSON.parse(legacyValue) as Partial<PersistedAppState>);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return FALLBACK_STATE;
  }
}

export async function loadScopedPersistedState(
  scopeKey: string | null | undefined,
): Promise<PersistedAppState> {
  if (!scopeKey) {
    return FALLBACK_STATE;
  }

  const scopedStorageKey = getScopedStorageKey(scopeKey);

  try {
    const scopedValue = await AsyncStorage.getItem(scopedStorageKey);

    if (scopedValue) {
      return normalizePersistedState(JSON.parse(scopedValue) as Partial<PersistedAppState>);
    }

    if (scopeKey !== LOCAL_DEVICE_STORAGE_SCOPE) {
      const localDeviceScopedKey = getScopedStorageKey(LOCAL_DEVICE_STORAGE_SCOPE);
      const localDeviceValue = await AsyncStorage.getItem(localDeviceScopedKey);

      if (localDeviceValue) {
        const migratedState = normalizePersistedState(
          JSON.parse(localDeviceValue) as Partial<PersistedAppState>
        );
        await AsyncStorage.setItem(scopedStorageKey, JSON.stringify(migratedState));
        await AsyncStorage.removeItem(localDeviceScopedKey);
        return migratedState;
      }
    }

    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (rawValue) {
      const migratedState = normalizePersistedState(JSON.parse(rawValue) as Partial<PersistedAppState>);
      await AsyncStorage.setItem(scopedStorageKey, JSON.stringify(migratedState));
      await AsyncStorage.removeItem(STORAGE_KEY);
      return migratedState;
    }

    const allKeys = await AsyncStorage.getAllKeys();
    const migratedUserScopedKey = allKeys.find((key) => key.startsWith(`${STORAGE_KEY_PREFIX}:`));

    if (migratedUserScopedKey) {
      const migratedRawValue = await AsyncStorage.getItem(migratedUserScopedKey);

      if (migratedRawValue) {
        const migratedState = normalizePersistedState(
          JSON.parse(migratedRawValue) as Partial<PersistedAppState>
        );
        await AsyncStorage.setItem(scopedStorageKey, JSON.stringify(migratedState));
        return migratedState;
      }
    }

    const legacyValue = await AsyncStorage.getItem(LEGACY_STORAGE_KEY);

    if (!legacyValue) {
      return FALLBACK_STATE;
    }

    const migrated = normalizePersistedState(JSON.parse(legacyValue) as Partial<PersistedAppState>);
    await AsyncStorage.setItem(scopedStorageKey, JSON.stringify(migrated));
    return migrated;
  } catch {
    return FALLBACK_STATE;
  }
}

export async function persistState(
  state: PersistedAppState,
  scopeKey?: string | null,
) {
  const storageKey = scopeKey ? getScopedStorageKey(scopeKey) : STORAGE_KEY;
  await AsyncStorage.setItem(storageKey, JSON.stringify(state));
}

export async function clearScopedPersistedState(
  scopeKey: string | null | undefined,
) {
  const keysToRemove = [STORAGE_KEY, LEGACY_STORAGE_KEY, getScopedStorageKey(LOCAL_DEVICE_STORAGE_SCOPE)];

  if (scopeKey) {
    keysToRemove.unshift(getScopedStorageKey(scopeKey));
  }

  await AsyncStorage.multiRemove(keysToRemove);
}

export async function loadAuthSession(): Promise<AuthSession | null> {
  try {
    const secureValue = await SecureStore.getItemAsync(AUTH_STORAGE_KEY);

    if (secureValue) {
      return normalizeAuthSession(JSON.parse(secureValue));
    }

    const rawValue = await AsyncStorage.getItem(LEGACY_AUTH_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    const session = normalizeAuthSession(JSON.parse(rawValue));

    if (session) {
      await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(session));
      await AsyncStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
    }

    return session;
  } catch {
    return null;
  }
}

export async function persistAuthSession(session: AuthSession) {
  await SecureStore.setItemAsync(AUTH_STORAGE_KEY, JSON.stringify(session));
  await AsyncStorage.removeItem(LEGACY_AUTH_STORAGE_KEY);
}

export async function clearAuthSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(AUTH_STORAGE_KEY),
    AsyncStorage.removeItem(LEGACY_AUTH_STORAGE_KEY),
  ]);
}
