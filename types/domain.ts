export type ServiceKind = 'walk' | 'pickup' | 'vet' | 'grooming' | 'other';

export type NotificationPermissionState = 'granted' | 'denied' | 'undetermined';

export type RecurrenceRule = {
  frequency: 'weekly';
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
  kind: ServiceKind;
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
  kind: ServiceKind;
  notes?: string;
  metadata?: string;
  isRecurring: boolean;
  recurrenceWeekdays: number[];
  reminderMinutesBefore?: number;
};

export const SERVICE_KIND_OPTIONS: { value: ServiceKind; label: string }[] = [
  { value: 'walk', label: 'Walk' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'vet', label: 'Vet' },
  { value: 'grooming', label: 'Grooming' },
  { value: 'other', label: 'Other' },
];

export const REMINDER_OPTIONS = [15, 30, 60, 90];

export const WEEKDAY_OPTIONS = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 0, label: 'Sun' },
] as const;

export const DEFAULT_SETTINGS: ReminderSettings = {
  dailySummaryEnabled: true,
  dailySummaryTime: '07:00',
  defaultReminderMinutes: 60,
};
