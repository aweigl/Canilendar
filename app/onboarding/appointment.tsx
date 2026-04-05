import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";
import { usePostHog } from "posthog-react-native";

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

export default function OnboardingAppointmentScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { dogs, settings, saveAppointment, validateAppointmentDailyLimit } =
    useCanilendar();
  const dog = useMemo(() => dogs[0], [dogs]);
  const initialStartAt = new Date(Date.now() + 60 * 60 * 1000);
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
      router.replace("/onboarding/dog" as never);
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
      return;
    }

    posthog.capture("onboarding_appointment_step_completed", {
      is_recurring: isRecurring,
      has_pickup_time: hasPickupTime,
    });

    router.push("/onboarding/reminders" as never);
  }

  return (
    <OnboardingShell
      step={3}
      totalSteps={5}
      eyebrow={t("onboarding.appointment.eyebrow")}
      title={t("onboarding.appointment.title")}
      description={
        dog
          ? t("onboarding.appointment.descriptionWithDog", { name: dog.name })
          : t("onboarding.appointment.descriptionWithoutDog")
      }
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <View style={styles.pickerGroup}>
          <ThemedText type="sectionTitle">{t("common.pickerDate")}</ThemedText>
          <DateTimePicker
            display={Platform.OS === "ios" ? "compact" : "default"}
            mode="date"
            minimumDate={new Date()}
            onChange={(_: DateTimePickerEvent, value?: Date) =>
              value ? setAppointmentDate(value) : null
            }
            value={appointmentDate}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <ThemedText type="sectionTitle">{t("common.pickupTime")}</ThemedText>
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
          <View style={styles.pickerGroup}>
            <DateTimePicker
              display={Platform.OS === "ios" ? "compact" : "default"}
              mode="time"
              onChange={(_: DateTimePickerEvent, value?: Date) =>
                value ? setAppointmentTime(value) : null
              }
              value={appointmentTime}
            />
          </View>
        ) : null}

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <ThemedText type="sectionTitle">{t("appointment.repeatWeekly")}</ThemedText>
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

        {hasPickupTime ? (
          <View style={styles.pickerGroup}>
            <ThemedText type="sectionTitle">{t("appointment.reminderLeadTime")}</ThemedText>
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
            : t("onboarding.appointment.reminderDisabled")}
        </ThemedText>
      </ThemedView>

      <AppButton
        label={t("onboarding.appointment.save")}
        onPress={handleContinue}
        icon="calendar.badge.plus"
      />
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
  },
  switchCopy: {
    flex: 1,
    gap: Spacing.xs,
    paddingRight: Spacing.md,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
});
