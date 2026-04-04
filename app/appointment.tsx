import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoadingView } from "@/components/loading-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { ChoiceChip } from "@/components/ui/choice-chip";
import { DogOptionCard } from "@/components/ui/dog-option-card";
import { InputField } from "@/components/ui/input-field";
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
import { REMINDER_OPTIONS, WEEKDAY_OPTIONS } from "@/types/domain";

const EMPTY_DOG_FORM = {
  name: "",
  address: "",
  ownerPhone: "",
  notes: "",
};

export default function AppointmentScreen() {
  const { t } = useTranslation();
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
  const [dogForm, setDogForm] = useState({
    name: appointmentDog?.name ?? dogs[0]?.name ?? EMPTY_DOG_FORM.name,
    address:
      appointmentDog?.address ?? dogs[0]?.address ?? EMPTY_DOG_FORM.address,
    ownerPhone:
      appointmentDog?.ownerPhone ??
      dogs[0]?.ownerPhone ??
      EMPTY_DOG_FORM.ownerPhone,
    notes: appointmentDog?.notes ?? dogs[0]?.notes ?? EMPTY_DOG_FORM.notes,
  });
  const [appointmentDate, setAppointmentDate] = useState(initialStartAt);
  const [hasPickupTime, setHasPickupTime] = useState(
    appointment?.hasPickupTime ?? false,
  );
  const [appointmentTime, setAppointmentTime] = useState(
    appointment?.hasPickupTime ? initialStartAt : getDefaultPickupTime(initialStartAt),
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

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (appointment && appointmentDog) {
      const startAt = new Date(appointment.startAt);

      setDogMode("existing");
      setSelectedDogId(appointmentDog.id);
      setDogForm({
        name: appointmentDog.name,
        address: appointmentDog.address,
        ownerPhone: appointmentDog.ownerPhone,
        notes: appointmentDog.notes ?? "",
      });
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

    setDogForm({
      name: selectedDog.name,
      address: selectedDog.address,
      ownerPhone: selectedDog.ownerPhone,
      notes: selectedDog.notes ?? "",
    });
  }, [dogMode, dogs, selectedDogId]);

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
            deleteAppointment(appointment.id);
            router.back();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <Stack.Screen
        options={{
          title: appointment
            ? t("appointment.screenTitleEdit")
            : t("appointment.screenTitleNew"),
        }}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[
            styles.hero,
            {
              backgroundColor: palette.surface,
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
            {appointment
              ? t("appointment.titleEdit")
              : t("appointment.titleNew")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("appointment.description")}
          </ThemedText>
        </ThemedView>

        <ThemedView
          style={[
            styles.section,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText type="sectionTitle" style={styles.sectionTitle}>
            {t("appointment.dogDetails")}
          </ThemedText>
          <View style={styles.toggleRow}>
            <ChoiceChip
              label={t("appointment.savedDog")}
              onPress={() => setDogMode("existing")}
              selected={dogMode === "existing"}
            />
            <ChoiceChip
              label={t("appointment.newDog")}
              onPress={() => setDogMode("new")}
              selected={dogMode === "new"}
            />
          </View>

          {dogMode === "existing" ? (
            <View style={styles.savedDogs}>
              {dogs.length === 0 ? (
                <ThemedText
                  lightColor={palette.textMuted}
                  darkColor={palette.textMuted}
                >
                  {t("appointment.noSavedDogs")}
                </ThemedText>
              ) : (
                <>
                  <ThemedText
                    lightColor={palette.textMuted}
                    darkColor={palette.textMuted}
                    type="caption"
                  >
                    {t("appointment.savedDogsHelp")}
                  </ThemedText>
                  {dogs.map((dog) => (
                    <DogOptionCard
                      key={dog.id}
                      dog={dog}
                      onPress={() => setSelectedDogId(dog.id)}
                      selected={selectedDogId === dog.id}
                    />
                  ))}
                </>
              )}
            </View>
          ) : null}

          <InputField
            label={t("appointment.dogName")}
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, name: value }))
            }
            placeholder={t("appointment.placeholders.dogName")}
            value={dogForm.name}
          />
          <InputField
            label={t("appointment.pickupAddress")}
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, address: value }))
            }
            placeholder={t("appointment.placeholders.pickupAddress")}
            value={dogForm.address}
          />
          <InputField
            keyboardType="phone-pad"
            label={t("appointment.ownerPhone")}
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, ownerPhone: value }))
            }
            placeholder={t("appointment.placeholders.ownerPhone")}
            value={dogForm.ownerPhone}
          />
          <InputField
            label={t("appointment.dogNotes")}
            multiline
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, notes: value }))
            }
            placeholder={t("appointment.placeholders.dogNotes")}
            value={dogForm.notes}
          />
        </ThemedView>

        <ThemedView
          style={[
            styles.section,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
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
            <View style={styles.pickerGroup}>
              <DateTimePicker
                display={Platform.OS === "ios" ? "compact" : "default"}
                mode="time"
                onChange={handleTimeChange}
                value={appointmentTime}
              />
            </View>
          ) : null}

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

          {hasPickupTime ? (
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
          ) : null}

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.lg,
    padding: 20,
    paddingBottom: 72,
  },
  hero: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: 24,
  },
  title: {
    fontSize: 28,
  },
  section: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: 24,
  },
  sectionTitle: {
    fontSize: 22,
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
    gap: Spacing.sm,
  },
  pickerGroup: {
    gap: Spacing.sm,
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
    gap: 6,
  },
  footerActions: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
});
