import {
  addDays,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfDay,
} from "date-fns";

import {
  DEFAULT_REVIEW_PROMPT_STATE,
  type Appointment,
  type DogProfile,
  type PersistedAppState,
} from "@/types/domain";

type DogSeed = {
  id: string;
  name: string;
  address: string;
  ownerPhone: string;
  notes: string;
};

const DOG_SEEDS: DogSeed[] = [
  {
    id: "dog_bella",
    name: "Bella",
    address: "Lychener Str. 18, 10437 Berlin",
    ownerPhone: "+49 151 23456781",
    notes: "Shy at the door, warms up quickly.",
  },
  {
    id: "dog_bruno",
    name: "Bruno",
    address: "Sanderstr. 11, 12047 Berlin",
    ownerPhone: "+49 151 23456782",
    notes: "Loves long walks and tends to pull early on.",
  },
  {
    id: "dog_luna",
    name: "Luna",
    address: "Pappelallee 42, 10437 Berlin",
    ownerPhone: "+49 151 23456783",
    notes: "Can stay off leash in enclosed areas.",
  },
  {
    id: "dog_Eddi",
    name: "Eddi",
    address: "Reichenberger Str. 89, 10999 Berlin",
    ownerPhone: "+49 151 23456784",
    notes: "Needs medication reminder in the evening.",
  },
  {
    id: "dog_emma",
    name: "Emma",
    address: "Gneisenaustr. 54, 10961 Berlin",
    ownerPhone: "+49 151 23456785",
    notes: "Older dog, keep pace gentle.",
  },
  {
    id: "dog_rocky",
    name: "Rocky",
    address: "Kastanienallee 7, 10435 Berlin",
    ownerPhone: "+49 151 23456786",
    notes: "Very food motivated.",
  },
  {
    id: "dog_nala",
    name: "Nala",
    address: "Maybachufer 21, 12047 Berlin",
    ownerPhone: "+49 151 23456787",
    notes: "Reactive around scooters.",
  },
  {
    id: "dog_otto",
    name: "Otto",
    address: "Weserstr. 122, 12045 Berlin",
    ownerPhone: "+49 151 23456788",
    notes: "Friendly with other dogs.",
  },
];

function atLocalTime(baseDate: Date, hours: number, minutes: number) {
  return setMilliseconds(
    setSeconds(setMinutes(setHours(baseDate, hours), minutes), 0),
    0,
  );
}

function buildDogs(timestamp: string): DogProfile[] {
  return DOG_SEEDS.map((dog) => ({
    ...dog,
    metadata: "",
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

function buildAppointments(
  dogs: DogProfile[],
  timestamp: string,
): Appointment[] {
  const today = startOfDay(new Date());

  const [bella, bruno, luna, Eddi, emma, rocky, nala, otto] = dogs;

  return [
    {
      id: "appt_01",
      dogId: bella.id,
      startAt: atLocalTime(today, 7, 30).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(today, 8, 15).toISOString(),
      notes: "Morning walk before owner leaves for work.",
      metadata: "",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", weekdays: [1, 2, 3, 4, 5] },
      reminderMinutesBefore: 30,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_02",
      dogId: bruno.id,
      startAt: atLocalTime(today, 9, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(today, 10, 0).toISOString(),
      notes: "Training-focused walk.",
      metadata: "",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", weekdays: [1, 3, 5] },
      reminderMinutesBefore: 60,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_03",
      dogId: luna.id,
      startAt: atLocalTime(today, 10, 30).toISOString(),
      hasPickupTime: false,
      endAt: null,
      notes: "Midday check-in and feeding.",
      metadata: "",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", weekdays: [2, 4] },
      reminderMinutesBefore: 15,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_04",
      dogId: Eddi.id,
      startAt: atLocalTime(today, 12, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(today, 12, 45).toISOString(),
      notes: "Lunch walk and medication check.",
      metadata: "",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", weekdays: [1, 2, 3, 4, 5] },
      reminderMinutesBefore: 30,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_05",
      dogId: emma.id,
      startAt: atLocalTime(today, 14, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(today, 14, 30).toISOString(),
      notes: "Short afternoon round only.",
      metadata: "",
      isRecurring: true,
      recurrenceRule: { frequency: "weekly", weekdays: [1, 4] },
      reminderMinutesBefore: 15,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_06",
      dogId: rocky.id,
      startAt: atLocalTime(addDays(today, 1), 7, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(addDays(today, 1), 7, 45).toISOString(),
      notes: "Early run in the park.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 60,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_07",
      dogId: nala.id,
      startAt: atLocalTime(addDays(today, 1), 8, 30).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(addDays(today, 1), 9, 15).toISOString(),
      notes: "Choose the quieter route.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 30,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_08",
      dogId: otto.id,
      startAt: atLocalTime(addDays(today, 1), 10, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(addDays(today, 1), 11, 15).toISOString(),
      notes: "Group walk with a second dog later in the route.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 30,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_09",
      dogId: bella.id,
      startAt: atLocalTime(addDays(today, 2), 17, 30).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(addDays(today, 2), 18, 10).toISOString(),
      notes: "Evening relief walk.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 15,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_10",
      dogId: bruno.id,
      startAt: atLocalTime(addDays(today, 3), 13, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(addDays(today, 3), 14, 0).toISOString(),
      notes: "Longer afternoon walk.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 30,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_11",
      dogId: luna.id,
      startAt: atLocalTime(addDays(today, 4), 9, 30).toISOString(),
      hasPickupTime: false,
      endAt: null,
      notes: "Weekend feeding visit.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 15,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "appt_12",
      dogId: Eddi.id,
      startAt: atLocalTime(addDays(today, 5), 18, 0).toISOString(),
      hasPickupTime: true,
      endAt: atLocalTime(addDays(today, 5), 18, 40).toISOString(),
      notes: "Medication round before dinner.",
      metadata: "",
      isRecurring: false,
      recurrenceRule: null,
      reminderMinutesBefore: 30,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

export function createDevSampleState(): PersistedAppState {
  const timestamp = new Date().toISOString();
  const dogs = buildDogs(timestamp);

  return {
    dogs,
    appointments: buildAppointments(dogs, timestamp),
    settings: {
      dailySummaryEnabled: true,
      dailySummaryTime: "07:00",
      defaultReminderMinutes: 30,
      dailyAppointmentLimit: 12,
      appearanceMode: "system",
      language: "system",
    },
    onboarding: {
      completedAt: timestamp,
      dismissed: true,
      hasVisitedDogs: true,
      hasVisitedSettings: true,
    },
    reviewPrompt: {
      ...DEFAULT_REVIEW_PROMPT_STATE,
      eligibilityTrackedAt: timestamp,
      lastCheckedAt: timestamp,
    },
  };
}
