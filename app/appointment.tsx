import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";

import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { ChoiceChip } from "@/components/ui/choice-chip";
import { DogEditForm } from "@/components/ui/dog-edit-form";
import { DogTable, DogTableRow } from "@/components/ui/dog-table";
import { InputField } from "@/components/ui/input-field";
import { KeyboardAwareScrollView } from "@/components/ui/keyboard-aware-scroll-view";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { getWeekdayTranslationKey } from "@/i18n/helpers";
import {
  combineDateAndTimeParts,
  formatShortDate,
  formatTimeInputValue,
  getDateOnlyStartAt,
  getDefaultPickupTime,
} from "@/lib/date";
import {
  cleanupReplacedDraftDogPhoto,
  createDogFormState,
  createEmptyDogForm,
  deleteDogPhoto,
  discardDraftDogPhoto,
  pickDogPhoto,
  type DogFormState,
  type DogPhotoErrorReason,
  type DogPhotoSource,
} from "@/lib/dog-photos";
import { triggerNotification } from "@/lib/haptics";
import { REMINDER_OPTIONS, WEEKDAY_OPTIONS } from "@/types/domain";

export default function AppointmentScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const params = useLocalSearchParams<{
    appointmentId?: string;
    date?: string;
  }>();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const {
    dogs,
    settings,
    isLoaded,
    getAppointmentById,
    getDogById,
    saveAppointment,
    deleteAppointment,
    validateAppointmentDailyLimit,
  } = useCanilendar();
  const appointment = params.appointmentId
    ? getAppointmentById(params.appointmentId)
    : undefined;
  const appointmentDog = appointment
    ? getDogById(appointment.dogId)
    : undefined;
  const initialStartAt = appointment
    ? new Date(appointment.startAt)
    : params.date
      ? new Date(params.date)
      : new Date(Date.now() + 60 * 60 * 1000); // Default to 1 hour from now
  const [dogMode, setDogMode] = useState<"existing" | "new">(
    appointmentDog || dogs.length > 0 ? "existing" : "new",
  );
  const [selectedDogId, setSelectedDogId] = useState<string | null>(
    appointmentDog?.id ?? dogs[0]?.id ?? null,
  );

  const [dogForm, setDogForm] = useState<DogFormState>(() =>
    createDogFormState(appointmentDog ?? dogs[0]),
  );
  const [photoBusy, setPhotoBusy] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(initialStartAt);
  const [hasPickupTime, setHasPickupTime] = useState(
    appointment?.hasPickupTime ?? false,
  );
  const [appointmentTime, setAppointmentTime] = useState(
    appointment?.hasPickupTime
      ? initialStartAt
      : getDefaultPickupTime(initialStartAt),
  );
  const [notes, setNotes] = useState(appointment?.notes ?? "");
  const [isRecurring, setIsRecurring] = useState(
    appointment?.isRecurring ?? false,
  );
  const [recurrenceWeekdays, setRecurrenceWeekdays] = useState<number[]>(
    appointment?.recurrenceRule?.weekdays ?? [initialStartAt.getDay()],
  );
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(
    appointment?.reminderMinutesBefore ?? settings.defaultReminderMinutes,
  );
  const originalPhotoUriRef = useRef<string | null>(
    appointmentDog?.photoUri ?? dogs[0]?.photoUri ?? null,
  );
  const latestPhotoUriRef = useRef<string | null>(
    appointmentDog?.photoUri ?? dogs[0]?.photoUri ?? null,
  );
  const preservePickedPhotoOnUnmountRef = useRef(false);

  useEffect(() => {
    latestPhotoUriRef.current = dogForm.photoUri;
  }, [dogForm.photoUri]);

  useEffect(() => {
    return () => {
      if (preservePickedPhotoOnUnmountRef.current) {
        return;
      }

      discardDraftDogPhoto({
        currentPhotoUri: latestPhotoUriRef.current,
        originalPhotoUri: originalPhotoUriRef.current,
      });
    };
  }, []);

  function syncDogForm(dog?: (typeof dogs)[number] | null) {
    const nextForm = createDogFormState(dog);

    originalPhotoUriRef.current = nextForm.photoUri;
    latestPhotoUriRef.current = nextForm.photoUri;
    setDogForm(nextForm);
  }

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (appointment && appointmentDog) {
      const startAt = new Date(appointment.startAt);
      const nextForm = createDogFormState(appointmentDog);

      setDogMode("existing");
      setSelectedDogId(appointmentDog.id);
      originalPhotoUriRef.current = nextForm.photoUri;
      latestPhotoUriRef.current = nextForm.photoUri;
      setDogForm(nextForm);
      setAppointmentDate(startAt);
      setHasPickupTime(appointment.hasPickupTime);
      setAppointmentTime(
        appointment.hasPickupTime ? startAt : getDefaultPickupTime(startAt),
      );
      setNotes(appointment.notes ?? "");
      setIsRecurring(appointment.isRecurring);
      setRecurrenceWeekdays(
        appointment.recurrenceRule?.weekdays ?? [startAt.getDay()],
      );
      setReminderMinutesBefore(appointment.reminderMinutesBefore);
      return;
    }

    if (dogs.length > 0 && dogMode === "existing" && !selectedDogId) {
      setSelectedDogId(dogs[0].id);
    }
  }, [appointment, appointmentDog, dogMode, dogs, isLoaded, selectedDogId]);

  useEffect(() => {
    if (dogMode !== "existing") {
      return;
    }

    const selectedDog = dogs.find((dog) => dog.id === selectedDogId);

    if (!selectedDog) {
      return;
    }

    const nextForm = createDogFormState(selectedDog);

    originalPhotoUriRef.current = nextForm.photoUri;
    latestPhotoUriRef.current = nextForm.photoUri;
    setDogForm(nextForm);
  }, [dogMode, dogs, selectedDogId]);

  const dogTableDogs = useMemo(() => {
    return dogs.map((item) => ({
      ...item,
      selected: item.id === selectedDogId,
    }));
  }, [dogs, selectedDogId]);

  const selectedDog = useMemo(() => {
    return dogTableDogs.find((item) => !!item.selected);
  }, [dogTableDogs]);

  if (!isLoaded) {
    return <LoadingView />;
  }

  function handleDateChange(_: DateTimePickerEvent, value?: Date) {
    if (!value) {
      return;
    }

    setAppointmentDate(value);
  }

  function handleTimeChange(_: DateTimePickerEvent, value?: Date) {
    if (!value) {
      return;
    }

    setAppointmentTime(value);
  }

  function toggleWeekday(weekday: number) {
    setRecurrenceWeekdays((currentValue) => {
      if (currentValue.includes(weekday)) {
        return currentValue.filter((value) => value !== weekday);
      }

      return [...currentValue, weekday].sort((left, right) => left - right);
    });
  }

  function showPhotoError(reason: DogPhotoErrorReason) {
    const keyPrefix =
      reason === "camera-permission"
        ? "cameraPermission"
        : reason === "library-permission"
          ? "libraryPermission"
          : "photoProcessing";

    Alert.alert(
      t(`dogs.alerts.${keyPrefix}Title`),
      t(`dogs.alerts.${keyPrefix}Body`),
    );
  }

  async function handlePickPhoto(source: DogPhotoSource) {
    setPhotoBusy(true);

    const result = await pickDogPhoto(source);

    setPhotoBusy(false);

    if (result.canceled) {
      return;
    }

    if ("errorReason" in result) {
      showPhotoError(result.errorReason);
      return;
    }

    await cleanupReplacedDraftDogPhoto({
      currentPhotoUri: latestPhotoUriRef.current,
      nextPhotoUri: result.photoUri,
      originalPhotoUri: originalPhotoUriRef.current,
    });

    latestPhotoUriRef.current = result.photoUri;
    setDogForm((current) => ({ ...current, photoUri: result.photoUri }));
  }

  function handleRemovePhoto() {
    const currentPhotoUri = latestPhotoUriRef.current;

    if (currentPhotoUri && currentPhotoUri !== originalPhotoUriRef.current) {
      deleteDogPhoto(currentPhotoUri);
    }

    latestPhotoUriRef.current = null;
    setDogForm((current) => ({ ...current, photoUri: null }));
  }

  async function handleDogModeChange(nextMode: "existing" | "new") {
    if (nextMode === dogMode) {
      return;
    }

    if (nextMode === "new") {
      originalPhotoUriRef.current = null;
      latestPhotoUriRef.current = null;
      setDogForm(createEmptyDogForm());
      setDogMode("new");
      return;
    }

    await discardDraftDogPhoto({
      currentPhotoUri: latestPhotoUriRef.current,
      originalPhotoUri: originalPhotoUriRef.current,
    });

    const nextSelectedDog =
      dogs.find((dog) => dog.id === selectedDogId) ?? dogs[0] ?? null;

    setSelectedDogId(nextSelectedDog?.id ?? null);
    syncDogForm(nextSelectedDog);
    setDogMode("existing");
  }

  async function handleSave() {
    if (
      !dogForm.name.trim() ||
      !dogForm.address.trim() ||
      !dogForm.ownerPhone.trim()
    ) {
      Alert.alert(
        t("appointment.alerts.missingDogDetailsTitle"),
        t("appointment.alerts.missingDogDetailsBody"),
      );
      return;
    }

    if (dogMode === "existing" && !selectedDogId) {
      Alert.alert(
        t("appointment.alerts.chooseDogTitle"),
        t("appointment.alerts.chooseDogBody"),
      );
      return;
    }

    if (isRecurring && recurrenceWeekdays.length === 0) {
      Alert.alert(
        t("appointment.alerts.repeatDaysTitle"),
        t("appointment.alerts.repeatDaysBody"),
      );
      return;
    }

    const combinedStartAt = combineDateAndTimeParts(
      appointmentDate,
      appointmentTime,
    );
    const nextStartAt = hasPickupTime
      ? combinedStartAt
      : getDateOnlyStartAt(appointmentDate);

    if (
      !appointment &&
      (hasPickupTime
        ? nextStartAt.getTime() < Date.now()
        : nextStartAt.getTime() < getDateOnlyStartAt(new Date()).getTime())
    ) {
      Alert.alert(
        t("appointment.alerts.pastAppointmentTitle"),
        t("appointment.alerts.pastAppointmentBody"),
      );
      return;
    }

    const dailyLimitValidation = validateAppointmentDailyLimit({
      id: appointment?.id,
      dog: {
        id: dogMode === "existing" ? (selectedDogId ?? undefined) : undefined,
        name: dogForm.name,
        address: dogForm.address,
        ownerPhone: dogForm.ownerPhone,
        notes: dogForm.notes,
        photoUri: dogForm.photoUri ?? undefined,
      },
      startAt: nextStartAt.toISOString(),
      hasPickupTime,
      notes,
      isRecurring,
      recurrenceWeekdays,
      reminderMinutesBefore,
    });

    if (!dailyLimitValidation.isValid) {
      const previewDates = dailyLimitValidation.exceededDates
        .slice(0, 3)
        .map((date) => formatShortDate(date))
        .join(", ");
      const dateSummary =
        dailyLimitValidation.exceededDates.length > 3
          ? `${previewDates}, ...`
          : previewDates;

      Alert.alert(
        t("appointment.alerts.dayLimitTitle"),
        t("appointment.alerts.dayLimitBody", {
          dates: dateSummary,
          limit: dailyLimitValidation.limit,
        }),
      );
      return;
    }

    const savedAppointment = await saveAppointment({
      id: appointment?.id,
      dog: {
        id: dogMode === "existing" ? (selectedDogId ?? undefined) : undefined,
        name: dogForm.name,
        address: dogForm.address,
        ownerPhone: dogForm.ownerPhone,
        notes: dogForm.notes,
        photoUri: dogForm.photoUri ?? undefined,
      },
      startAt: nextStartAt.toISOString(),
      hasPickupTime,
      notes,
      isRecurring,
      recurrenceWeekdays,
      reminderMinutesBefore,
    });

    if (!savedAppointment) {
      return;
    }

    preservePickedPhotoOnUnmountRef.current = true;

    posthog.capture(
      appointment ? "appointment_updated" : "appointment_created",
      {
        is_recurring: isRecurring,
        has_pickup_time: hasPickupTime,
        reminder_minutes_before: reminderMinutesBefore,
        dog_mode: dogMode,
      },
    );

    await triggerNotification(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  function handleDelete() {
    if (!appointment) {
      return;
    }

    Alert.alert(
      t("appointment.alerts.deleteTitle"),
      t("appointment.alerts.deleteBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () => {
            posthog.capture("appointment_deleted");
            triggerNotification(Haptics.NotificationFeedbackType.Warning);
            deleteAppointment(appointment.id);
            router.back();
          },
        },
      ],
    );
  }

  const isEditingAppointment = !!appointment;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[
        {
          gap: Spacing.xl,
          paddingTop: Spacing.md,
          paddingBottom: Spacing.md,
        },
      ]}
      showsVerticalScrollIndicator={false}
      style={styles.scroll}
    >
      <ThemedView
        style={[
          styles.hero,
          {
            backgroundColor: palette.surfaceRaised,
            borderColor: palette.border,
          },
        ]}
      >
        <ThemedText
          type="eyebrow"
          lightColor={palette.accent}
          darkColor={palette.accent}
        >
          {t("appointment.eyebrow")}
        </ThemedText>
        <ThemedText type="title" style={styles.title}>
          {appointment ? t("appointment.titleEdit") : t("appointment.titleNew")}
        </ThemedText>
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
        >
          {t("appointment.description")}
        </ThemedText>
      </ThemedView>

      {isEditingAppointment && selectedDog ? (
        <DogTableRow dog={{ ...selectedDog, selected: false }} index={0} />
      ) : (
        <ThemedView
          style={[
            styles.section,
            {
              backgroundColor: palette.surfaceRaised,
              borderColor: palette.border,
            },
          ]}
        >
          <View style={styles.sectionBlock}>
            <ThemedText type="sectionTitle" style={styles.sectionTitle}>
              {t("appointment.dogDetails")}
            </ThemedText>
            <View style={styles.toggleRow}>
              <ChoiceChip
                label={t("appointment.savedDog")}
                onPress={() => {
                  handleDogModeChange("existing");
                }}
                selected={dogMode === "existing"}
              />
              <ChoiceChip
                label={t("appointment.newDog")}
                onPress={() => {
                  handleDogModeChange("new");
                }}
                selected={dogMode === "new"}
              />
            </View>
          </View>
          {dogMode === "new" ? (
            <DogEditForm
              editingDogId={selectedDogId}
              form={dogForm}
              setForm={setDogForm}
              pickFromCamera={() => {
                handlePickPhoto("camera");
              }}
              pickFromLibrary={() => {
                handlePickPhoto("library");
              }}
              removePhoto={handleRemovePhoto}
              photoBusy={photoBusy}
            />
          ) : (
            <DogTable dogs={dogTableDogs} onRowClick={setSelectedDogId} />
          )}
        </ThemedView>
      )}

      <ThemedView
        style={[
          styles.section,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        <View style={styles.sectionBlock}>
          <View style={styles.pickerGroup}>
            <ThemedText style={styles.inputLabel}>
              {t("common.pickerDate")}
            </ThemedText>
            <DateTimePicker
              display={Platform.OS === "ios" ? "compact" : "default"}
              mode="date"
              minimumDate={appointment ? undefined : new Date()}
              onChange={handleDateChange}
              value={appointmentDate}
            />
          </View>
        </View>

        <View
          style={[
            styles.sectionBlock,
            styles.sectionBlockSeparated,
            { borderColor: palette.border },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText style={styles.inputLabel}>
                {t("common.pickupTime")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                type="caption"
              >
                {hasPickupTime
                  ? t("appointment.pickupTimeEnabled")
                  : t("appointment.pickupTimeDisabled")}
              </ThemedText>
            </View>
            <ToggleSwitch
              checked={hasPickupTime}
              onCheckedChange={setHasPickupTime}
            />
          </View>

          {hasPickupTime ? (
            <>
              <View style={styles.pickerGroup}>
                <DateTimePicker
                  display={Platform.OS === "ios" ? "compact" : "default"}
                  mode="time"
                  onChange={handleTimeChange}
                  value={appointmentTime}
                />
              </View>
              <View style={styles.pickerGroup}>
                <ThemedText style={styles.inputLabel}>
                  {t("appointment.reminderLeadTime")}
                </ThemedText>
                <View style={styles.chips}>
                  {REMINDER_OPTIONS.map((minutes) => (
                    <ChoiceChip
                      key={minutes}
                      label={`${minutes} min`}
                      onPress={() => setReminderMinutesBefore(minutes)}
                      selected={reminderMinutesBefore === minutes}
                    />
                  ))}
                </View>
              </View>
            </>
          ) : null}
        </View>

        <View
          style={[
            styles.sectionBlock,
            styles.sectionBlockSeparated,
            { borderColor: palette.border },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText style={styles.inputLabel}>
                {t("appointment.repeatWeekly")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                type="caption"
              >
                {isRecurring
                  ? t("appointment.recurringOn")
                  : t("appointment.oneTime")}
              </ThemedText>
            </View>
            <ToggleSwitch
              checked={isRecurring}
              onCheckedChange={setIsRecurring}
            />
          </View>

          {isRecurring ? (
            <View style={styles.chips}>
              {WEEKDAY_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.value}
                  label={t(
                    `common.weekdayShort.${getWeekdayTranslationKey(option.value)}`,
                  )}
                  onPress={() => toggleWeekday(option.value)}
                  selected={recurrenceWeekdays.includes(option.value)}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View
          style={[
            styles.sectionBlock,
            styles.sectionBlockSeparated,
            { borderColor: palette.border },
          ]}
        >
          <InputField
            label={t("appointment.appointmentNotes")}
            multiline
            onChangeText={setNotes}
            placeholder={t("appointment.placeholders.appointmentNotes")}
            value={notes}
          />

          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            type="caption"
          >
            {hasPickupTime
              ? t("appointment.reminderPreview", {
                  time: formatTimeInputValue(appointmentTime),
                  count: reminderMinutesBefore,
                })
              : t("appointment.reminderDisabled")}
          </ThemedText>
        </View>
      </ThemedView>

      <View style={styles.footerActions}>
        <AppButton
          icon={appointment ? "square.and.pencil" : "plus.circle.fill"}
          label={
            appointment
              ? t("appointment.saveChanges")
              : t("appointment.createAppointment")
          }
          onPress={handleSave}
        />
        {appointment ? (
          <AppButton
            icon="trash.fill"
            label={t("appointment.deleteAppointment")}
            onPress={handleDelete}
            variant="danger"
          />
        ) : null}
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    padding: Spacing.lg,
  },
  content: {
    gap: Spacing.xl,
    padding: 24,
    paddingBottom: 96,
  },
  hero: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.md,
    padding: 28,
  },
  title: {
    fontSize: 28,
  },
  section: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.lg,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
  },
  sectionBlock: {
    gap: Spacing.md,
  },
  sectionBlockSeparated: {
    marginTop: Spacing.lg,
  },
  toggleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  savedDogs: {
    gap: Spacing.md,
  },
  pickerGroup: {
    gap: Spacing.md,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.md,
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
  footerActions: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
});
