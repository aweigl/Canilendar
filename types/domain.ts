export type NotificationPermissionState = "granted" | "denied" | "undetermined";
export type AppearanceMode = "system" | "light" | "dark";
export type AppLanguage = "en" | "de" | "fr" | "es";
export type LanguagePreference = "system" | AppLanguage;
export type OnboardingStatus = "loading" | "incomplete" | "complete";
export type SubscriptionStatus =
  | "loading"
  | "inactive"
  | "active"
  | "unavailable";
export type PaywallTrigger =
  | "dog_limit"
  | "appointment_limit"
  | "settings"
  | "onboarding"
  | "onboarding_complete";
export type ChecklistTarget = "dogs" | "settings";
export type AuthProvider = "apple";

export type RecurrenceRule = {
  frequency: "weekly";
  weekdays: number[];
};

export type DogProfile = {
  id: string;
  name: string;
  address: string;
  ownerPhone: string;
  notes?: string;
  photoUri?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  dogId: string;
  startAt: string;
  hasPickupTime: boolean;
  endAt?: string | null;
  notes?: string;
  metadata?: string;
  isRecurring: boolean;
  recurrenceRule?: RecurrenceRule | null;
  reminderMinutesBefore: number;
  createdAt: string;
  updatedAt: string;
};

export type ReminderSettings = {
  dailySummaryEnabled: boolean;
  dailySummaryTime: string;
  defaultReminderMinutes: number;
  dailyAppointmentLimit: number;
  appearanceMode: AppearanceMode;
  language: LanguagePreference;
};

export type OnboardingChecklistState = {
  completedAt: string | null;
  dismissed: boolean;
  hasVisitedDogs: boolean;
  hasVisitedSettings: boolean;
};

export type ReviewPromptState = {
  eligibleAfter: string | null;
  eligibilityTrackedAt: string | null;
  promptedAt: string | null;
  lastCheckedAt: string | null;
};

export type PersistedAppState = {
  dogs: DogProfile[];
  appointments: Appointment[];
  settings: ReminderSettings;
  onboarding: OnboardingChecklistState;
  reviewPrompt: ReviewPromptState;
};

export type AuthSession = {
  provider: AuthProvider;
  appleUserId: string;
  revenueCatAppUserId: string;
  email: string | null;
  givenName: string | null;
  familyName: string | null;
};

export type AppointmentOccurrence = {
  occurrenceId: string;
  occurrenceDate: string;
  startAt: Date;
  reminderAt: Date | null;
  appointment: Appointment;
  dog: DogProfile;
};

export type DogInput = {
  id?: string;
  name: string;
  address: string;
  ownerPhone: string;
  notes?: string;
  photoUri?: string;
  metadata?: string;
};

export type AppointmentInput = {
  id?: string;
  dog: DogInput;
  startAt: string;
  hasPickupTime: boolean;
  endAt?: string | null;
  notes?: string;
  metadata?: string;
  isRecurring: boolean;
  recurrenceWeekdays: number[];
  reminderMinutesBefore?: number;
};

export const REMINDER_OPTIONS = [15, 30, 60, 90];
export const DAILY_APPOINTMENT_LIMIT_MIN = 6;
export const DAILY_APPOINTMENT_LIMIT_MAX = 15;
export const DAILY_APPOINTMENT_LIMIT_OPTIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
] as const;

export const FREE_TIER_LIMITS = {
  dogs: 1,
  appointments: 1,
} as const;

export const WEEKDAY_OPTIONS = [
  { value: 1 },
  { value: 2 },
  { value: 3 },
  { value: 4 },
  { value: 5 },
  { value: 6 },
  { value: 0 },
] as const;

export const DEFAULT_SETTINGS: ReminderSettings = {
  dailySummaryEnabled: true,
  dailySummaryTime: "07:00",
  defaultReminderMinutes: 60,
  dailyAppointmentLimit: DAILY_APPOINTMENT_LIMIT_MIN,
  appearanceMode: "system",
  language: "system",
};

export const DEFAULT_ONBOARDING_CHECKLIST: OnboardingChecklistState = {
  completedAt: null,
  dismissed: false,
  hasVisitedDogs: false,
  hasVisitedSettings: false,
};

export const DEFAULT_REVIEW_PROMPT_STATE: ReviewPromptState = {
  eligibleAfter: null,
  eligibilityTrackedAt: null,
  promptedAt: null,
  lastCheckedAt: null,
};
