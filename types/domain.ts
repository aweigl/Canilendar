export type NotificationPermissionState = "granted" | "denied" | "undetermined";
export type AppearanceMode = "system" | "light" | "dark";
export type AppLanguage = "en" | "de" | "fr" | "es";
export type LanguagePreference = "system" | AppLanguage;

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
  metadata?: string;
  createdAt: string;
  updatedAt: string;
};

export type Appointment = {
  id: string;
  dogId: string;
  startAt: string;
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
  appearanceMode: AppearanceMode;
  language: LanguagePreference;
};

export type PersistedAppState = {
  dogs: DogProfile[];
  appointments: Appointment[];
  settings: ReminderSettings;
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
  metadata?: string;
};

export type AppointmentInput = {
  id?: string;
  dog: DogInput;
  startAt: string;
  endAt?: string | null;
  notes?: string;
  metadata?: string;
  isRecurring: boolean;
  recurrenceWeekdays: number[];
  reminderMinutesBefore?: number;
};

export const REMINDER_OPTIONS = [15, 30, 60, 90];

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
  appearanceMode: "system",
  language: "system",
};
