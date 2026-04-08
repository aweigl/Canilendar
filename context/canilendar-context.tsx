import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

import i18n, { resolveAppLanguage } from "@/i18n";
import {
  getMarkedDateKeys,
  getOccurrencesForDate,
} from "@/lib/date";
import {
  buildAppointmentRecord,
  buildDogRecord,
  clampDailyAppointmentLimit,
  completeOnboardingState,
  markChecklistTargetSeen,
  type DailyLimitValidationResult,
  upsertAppointmentRecord,
  upsertDogRecord,
  validateAppointmentDailyLimit as validateDailyLimit,
} from "@/lib/canilendar-state";
import {
  getNotificationPermissionState,
  requestNotificationAccess,
  syncScheduledNotifications,
} from "@/lib/notifications";
import { loadScopedPersistedState, persistState } from "@/lib/storage";
import {
  DAILY_APPOINTMENT_LIMIT_MAX,
  DAILY_APPOINTMENT_LIMIT_MIN,
  DEFAULT_ONBOARDING_CHECKLIST,
  DEFAULT_REVIEW_PROMPT_STATE,
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
  type ReviewPromptState,
  type ReminderSettings,
} from "@/types/domain";

type CanilendarContextValue = {
  dogs: DogProfile[];
  appointments: Appointment[];
  settings: ReminderSettings;
  onboardingChecklist: OnboardingChecklistState;
  reviewPrompt: ReviewPromptState;
  onboardingStatus: OnboardingStatus;
  resolvedColorScheme: "light" | "dark";
  isLoaded: boolean;
  notificationPermission: NotificationPermissionState;
  canCreateDog: boolean;
  canCreateAppointment: boolean;
  getDogById: (dogId: string) => DogProfile | undefined;
  getAppointmentById: (appointmentId: string) => Appointment | undefined;
  getOccurrencesForDate: (
    date: Date,
  ) => ReturnType<typeof getOccurrencesForDate>;
  getMarkedDatesForMonth: (visibleMonth: Date) => Set<string>;
  validateAppointmentDailyLimit: (
    input: AppointmentInput,
  ) => DailyLimitValidationResult;
  saveDog: (input: DogInput) => DogProfile | null;
  deleteDog: (dogId: string) => boolean;
  saveAppointment: (input: AppointmentInput) => Promise<Appointment | null>;
  deleteAppointment: (appointmentId: string) => void;
  updateSettings: (partial: Partial<ReminderSettings>) => void;
  updateAppearanceMode: (mode: AppearanceMode) => void;
  markChecklistStepSeen: (target: ChecklistTarget) => void;
  dismissHomeChecklist: () => void;
  completeOnboarding: () => void;
  updateReviewPrompt: (partial: Partial<ReviewPromptState>) => void;
  resetLocalData: () => void;
  refreshNotificationPermission: () => Promise<NotificationPermissionState>;
  requestNotificationPermission: () => Promise<NotificationPermissionState>;
};

const CanilendarContext = createContext<CanilendarContextValue | undefined>(
  undefined,
);


type CanilendarProviderProps = PropsWithChildren<{
  isPro: boolean;
  onRequireUpgrade: (trigger: PaywallTrigger) => void;
  storageScopeKey: string | null;
}>;

export function CanilendarProvider({
  children,
  isPro,
  onRequireUpgrade,
  storageScopeKey,
}: CanilendarProviderProps) {
  const systemColorScheme = useSystemColorScheme();
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [onboardingChecklist, setOnboardingChecklist] = useState(
    DEFAULT_ONBOARDING_CHECKLIST,
  );
  const [reviewPrompt, setReviewPrompt] = useState(DEFAULT_REVIEW_PROMPT_STATE);
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermissionState>("undetermined");
  const [isLoaded, setIsLoaded] = useState(false);

  const resolvedColorScheme: "light" | "dark" =
    settings.appearanceMode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : settings.appearanceMode;
  const onboardingStatus: OnboardingStatus = isLoaded
    ? onboardingChecklist.completedAt
      ? "complete"
      : "incomplete"
    : "loading";

  useEffect(() => {
    let isMounted = true;

    setIsLoaded(false);

    async function bootstrap() {
      const permissionState = await getNotificationPermissionState();

      if (!storageScopeKey) {
        if (!isMounted) {
          return;
        }

        setDogs([]);
        setAppointments([]);
        setSettings(DEFAULT_SETTINGS);
        setOnboardingChecklist(DEFAULT_ONBOARDING_CHECKLIST);
        setReviewPrompt(DEFAULT_REVIEW_PROMPT_STATE);
        setNotificationPermission(permissionState);
        setIsLoaded(true);
        return;
      }

      const persistedState = await loadScopedPersistedState(storageScopeKey);

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
      setReviewPrompt({
        ...DEFAULT_REVIEW_PROMPT_STATE,
        ...(persistedState.reviewPrompt ?? {}),
      });
      setNotificationPermission(permissionState);
      setIsLoaded(true);
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [storageScopeKey]);

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
    if (!isLoaded || !storageScopeKey) {
      return;
    }

    void persistState(
      {
        dogs,
        appointments,
        settings,
        onboarding: onboardingChecklist,
        reviewPrompt,
      },
      storageScopeKey,
    );
  }, [
    appointments,
    dogs,
    isLoaded,
    onboardingChecklist,
    reviewPrompt,
    settings,
    storageScopeKey,
  ]);

  useEffect(() => {
    if (!isLoaded || notificationPermission !== "granted") {
      return;
    }

    void syncScheduledNotifications({
      dogs,
      appointments,
      settings,
      onboarding: onboardingChecklist,
      reviewPrompt,
    });
  }, [
    appointments,
    dogs,
    isLoaded,
    notificationPermission,
    onboardingChecklist,
    reviewPrompt,
    settings,
  ]);

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

  function validateAppointmentDailyLimit(
    input: AppointmentInput,
  ): DailyLimitValidationResult {
    return validateDailyLimit({
      appointments,
      currentAppointment: input.id ? getAppointmentById(input.id) : undefined,
      dailyAppointmentLimit: settings.dailyAppointmentLimit,
      defaultReminderMinutes: settings.defaultReminderMinutes,
      input,
    });
  }

  const canCreateDog = __DEV__
    ? true
    : isPro || dogs.length < FREE_TIER_LIMITS.dogs;
  const canCreateAppointment = __DEV__
    ? true
    : isPro || appointments.length < FREE_TIER_LIMITS.appointments;

  function saveDog(input: DogInput) {
    const existingDog = input.id ? getDogById(input.id) : undefined;

    if (!existingDog && !canCreateDog) {
      onRequireUpgrade("dog_limit");
      return null;
    }

    const nextDog = buildDogRecord(input, existingDog);

    setDogs((currentDogs) => upsertDogRecord(currentDogs, nextDog, existingDog));

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

    if (permissionState === "granted" && isLoaded) {
      await syncScheduledNotifications({
        dogs,
        appointments,
        settings,
        onboarding: onboardingChecklist,
        reviewPrompt,
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
    const currentAppointment = input.id
      ? getAppointmentById(input.id)
      : undefined;

    if (!currentAppointment && !canCreateAppointment) {
      onRequireUpgrade("appointment_limit");
      return null;
    }

    if (!validateAppointmentDailyLimit(input).isValid) {
      return null;
    }

    const savedDog = saveDog(input.dog);

    if (!savedDog) {
      return null;
    }

    const nextAppointment = buildAppointmentRecord({
      currentAppointment,
      defaultReminderMinutes: settings.defaultReminderMinutes,
      input,
      savedDogId: savedDog.id,
    });

    setAppointments((currentAppointments) =>
      upsertAppointmentRecord(
        currentAppointments,
        nextAppointment,
        currentAppointment,
      ),
    );

    if (notificationPermission === "undetermined") {
      void requestPermission();
    }

    return nextAppointment;
  }

  function deleteAppointment(appointmentId: string) {
    setAppointments((currentAppointments) =>
      currentAppointments.filter(
        (appointment) => appointment.id !== appointmentId,
      ),
    );
  }

  function updateSettings(partial: Partial<ReminderSettings>) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      ...partial,
      dailyAppointmentLimit:
        partial.dailyAppointmentLimit === undefined
          ? currentSettings.dailyAppointmentLimit
          : clampDailyAppointmentLimit(
              partial.dailyAppointmentLimit,
              DAILY_APPOINTMENT_LIMIT_MIN,
              DAILY_APPOINTMENT_LIMIT_MAX,
            ),
    }));
  }

  function markChecklistStepSeen(target: ChecklistTarget) {
    setOnboardingChecklist((current) => markChecklistTargetSeen(current, target));
  }

  function dismissHomeChecklist() {
    setOnboardingChecklist((current) => ({
      ...current,
      dismissed: true,
    }));
  }

  function completeOnboarding() {
    const nextState = completeOnboardingState(onboardingChecklist, reviewPrompt);

    setOnboardingChecklist(nextState.onboardingChecklist);
    setReviewPrompt(nextState.reviewPrompt);
  }

  function updateReviewPrompt(partial: Partial<ReviewPromptState>) {
    setReviewPrompt((current) => ({
      ...current,
      ...partial,
    }));
  }

  function resetLocalData() {
    setDogs([]);
    setAppointments([]);
    setSettings(DEFAULT_SETTINGS);
    setOnboardingChecklist(DEFAULT_ONBOARDING_CHECKLIST);
    setReviewPrompt(DEFAULT_REVIEW_PROMPT_STATE);
  }

  return (
    <CanilendarContext.Provider
      value={{
        dogs,
        appointments,
        settings,
        onboardingChecklist,
        reviewPrompt,
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
        validateAppointmentDailyLimit,
        saveDog,
        deleteDog,
        saveAppointment,
        deleteAppointment,
        updateSettings,
        updateAppearanceMode: (mode) =>
          updateSettings({ appearanceMode: mode }),
        markChecklistStepSeen,
        dismissHomeChecklist,
        completeOnboarding,
        updateReviewPrompt,
        resetLocalData,
        refreshNotificationPermission: refreshPermission,
        requestNotificationPermission: requestPermission,
      }}
    >
      {children}
    </CanilendarContext.Provider>
  );
}

export function useCanilendar() {
  const context = useContext(CanilendarContext);

  if (!context) {
    throw new Error("useCanilendar must be used within a CanilendarProvider");
  }

  return context;
}

export function useOptionalCanilendar() {
  return useContext(CanilendarContext);
}
