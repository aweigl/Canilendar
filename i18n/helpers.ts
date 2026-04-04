import i18n from '@/i18n';
import type { AppLanguage } from '@/types/domain';

const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export function getCurrentLanguage(): AppLanguage {
  const current = i18n.resolvedLanguage ?? i18n.language ?? 'en';

  if (current.startsWith('de')) {
    return 'de';
  }

  if (current.startsWith('fr')) {
    return 'fr';
  }

  if (current.startsWith('es')) {
    return 'es';
  }

  return 'en';
}

export function getFixedT(language?: AppLanguage) {
  return i18n.getFixedT(language ?? getCurrentLanguage());
}

export function getWeekdayTranslationKey(weekday: number) {
  const normalizedWeekday = weekday === 0 ? 6 : weekday - 1;
  return WEEKDAY_KEYS[normalizedWeekday];
}
