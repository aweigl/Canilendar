import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { ChoiceChip } from "@/components/ui/choice-chip";
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
import { set } from "date-fns/set";

export default function OnboardingAppointmentScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  const {
    dogs,
    appointments,
    settings,
    saveAppointment,
    validateAppointmentDailyLimit,
  } = useCanilendar();

  const dog = useMemo(() => dogs[0], [dogs]);
  const existingAppointment = useMemo(() => appointments[0], [appointments]);

  const initialStartAt = set(new Date(), {
    hours: 9,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
    date: new Date().getDate() + 1,
  });
  const [appointmentDate, setAppointmentDate] = useState(initialStartAt);
  const [hasPickupTime, setHasPickupTime] = useState(false);
  const [appointmentTime, setAppointmentTime] = useState(
    getDefaultPickupTime(initialStartAt),
  );
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceWeekdays, setRecurrenceWeekdays] = useState<number[]>([
    initialStartAt.getDay(),
  ]);
  const [reminderMinutesBefore, setReminderMinutesBefore] = useState(
    settings.defaultReminderMinutes,
  );
  const [isFormVisible, setIsFormVisible] = useState(
    Boolean(existingAppointment),
  );

  useEffect(() => {
    if (existingAppointment) {
      setIsFormVisible(true);
    }
  }, [existingAppointment]);

  function toggleWeekday(weekday: number) {
    setRecurrenceWeekdays((current) => {
      if (current.includes(weekday)) {
        return current.filter((value) => value !== weekday);
      }

      return [...current, weekday].sort((left, right) => left - right);
    });
  }

  async function handleContinue() {
    if (!dog) {
      Alert.alert(
        t("onboarding.appointment.missingDogTitle"),
        t("onboarding.appointment.missingDogBody"),
      );
      router.replace("/onboarding/dog");
      return;
    }

    if (isRecurring && recurrenceWeekdays.length === 0) {
      Alert.alert(
        t("appointment.alerts.repeatDaysTitle"),
        t("appointment.alerts.repeatDaysBody"),
      );
      return;
    }

    const startAt = hasPickupTime
      ? combineDateAndTimeParts(appointmentDate, appointmentTime)
      : getDateOnlyStartAt(appointmentDate);

    if (
      hasPickupTime
        ? startAt.getTime() < Date.now()
        : startAt.getTime() < getDateOnlyStartAt(new Date()).getTime()
    ) {
      Alert.alert(
        t("appointment.alerts.pastAppointmentTitle"),
        t("onboarding.appointment.pastAppointmentBody"),
      );
      return;
    }

    const dailyLimitValidation = validateAppointmentDailyLimit({
      dog: {
        id: dog.id,
        name: dog.name,
        address: dog.address,
        ownerPhone: dog.ownerPhone,
        notes: dog.notes,
      },
      startAt: startAt.toISOString(),
      hasPickupTime,
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
      dog: {
        id: dog.id,
        name: dog.name,
        address: dog.address,
        ownerPhone: dog.ownerPhone,
        notes: dog.notes,
      },
      startAt: startAt.toISOString(),
      hasPickupTime,
      isRecurring,
      recurrenceWeekdays,
      reminderMinutesBefore,
    });

    if (!savedAppointment) {
      Alert.alert(
        t("appointment.alerts.saveFailedTitle"),
        t("appointment.alerts.saveFailedBody"),
      );
      return;
    }

    posthog.capture("onboarding_appointment_step_completed", {
      is_recurring: isRecurring,
      has_pickup_time: hasPickupTime,
    });

    router.push("/onboarding/reminders" as never);
  }

  const handleDatePickerChange = (_: DateTimePickerEvent, value?: Date) =>
    value ? setAppointmentDate(value) : null;

  const handleAppointmentTimeChange = (_: DateTimePickerEvent, value?: Date) =>
    value ? setAppointmentTime(value) : null;

  function handlePrimaryAction() {
    if (!isFormVisible) {
      setIsFormVisible(true);
      return;
    }

    handleContinue();
  }

  return (
    <OnboardingShell
      step={3}
      totalSteps={5}
      eyebrow={t("onboarding.appointment.eyebrow")}
      title="Book the first walk."
      description={
        dog
          ? `${dog.name} is ready. Pick the day, time, and repeat pattern.`
          : "Pick the day, time, and repeat pattern."
      }
      heroIcon="calendar.badge.plus"
      heroTone="info"
      illustration="appointment"
      footer={
        <AppButton
          label={
            isFormVisible
              ? t("onboarding.appointment.save")
              : "Create appointment"
          }
          onPress={handlePrimaryAction}
          icon="calendar.badge.plus"
        />
      }
    >
      {isFormVisible ? (
        <ThemedView
          style={[
            styles.card,
            { backgroundColor: palette.surface, borderColor: palette.border },
          ]}
        >
          <View style={(styles.pickerGroup, { marginBottom: Spacing.md })}>
            <ThemedText type="sectionTitle">
              {t("common.pickerDate")}
            </ThemedText>
            <DateTimePicker
              display={Platform.OS === "ios" ? "compact" : "default"}
              mode="date"
              minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
              onChange={handleDatePickerChange}
              value={appointmentDate}
            />
          </View>

          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <ThemedText type="sectionTitle">
                {t("common.pickupTime")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                type="caption"
              >
                {hasPickupTime
                  ? t("onboarding.appointment.pickupTimeEnabled")
                  : t("onboarding.appointment.pickupTimeDisabled")}
              </ThemedText>
            </View>
            <ToggleSwitch
              checked={hasPickupTime}
              onCheckedChange={setHasPickupTime}
            />
          </View>

          {hasPickupTime ? (
            <View style={(styles.pickerGroup, { marginBottom: Spacing.sm })}>
              <DateTimePicker
                style={{ marginBottom: Spacing.sm }}
                display={Platform.OS === "ios" ? "compact" : "default"}
                mode="time"
                onChange={handleAppointmentTimeChange}
                value={appointmentTime}
              />
              <View>
                <ThemedText style={{ marginBottom: Spacing.sm }} type="eyebrow">
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
            </View>
          ) : null}

          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <ThemedText type="sectionTitle">
                {t("appointment.repeatWeekly")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                type="caption"
              >
                {isRecurring
                  ? t("appointment.recurringOn")
                  : t("onboarding.appointment.oneTime")}
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
          <ThemedText
            lightColor={palette.support}
            darkColor={palette.support}
            type="caption"
            style={{ marginTop: Spacing.sm }}
          >
            {hasPickupTime
              ? t("appointment.reminderPreview", {
                  time: formatTimeInputValue(appointmentTime),
                  count: reminderMinutesBefore,
                })
              : t("onboarding.appointment.reminderDisabled")}
          </ThemedText>
        </ThemedView>
      ) : null}
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  pickerGroup: {
    gap: Spacing.sm,
  },
  switchRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "nowrap",
    marginBottom: Spacing.md,
  },
  switchCopy: {
    flex: 1,
    flexWrap: "nowrap",
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
});
