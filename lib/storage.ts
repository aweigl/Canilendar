import AsyncStorage from '@react-native-async-storage/async-storage';

import { DEFAULT_SETTINGS, type PersistedAppState } from '@/types/domain';

const STORAGE_KEY = '@canilander/app-state-v1';

const FALLBACK_STATE: PersistedAppState = {
  dogs: [],
  appointments: [],
  settings: DEFAULT_SETTINGS,
};

export async function loadPersistedState(): Promise<PersistedAppState> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return FALLBACK_STATE;
    }

    const parsed = JSON.parse(rawValue) as Partial<PersistedAppState>;

    return {
      dogs: Array.isArray(parsed.dogs) ? parsed.dogs : [],
      appointments: Array.isArray(parsed.appointments) ? parsed.appointments : [],
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
