import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useMemo, useState } from "react";
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
import { combineDateAndTimeParts, formatTimeInputValue } from "@/lib/date";
import { REMINDER_OPTIONS, WEEKDAY_OPTIONS } from "@/types/domain";

export default function OnboardingAppointmentScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { dogs, settings, saveAppointment } = useCanilendar();
  const dog = useMemo(() => dogs[0], [dogs]);
  const initialStartAt = new Date(Date.now() + 60 * 60 * 1000);
  const [appointmentDate, setAppointmentDate] = useState(initialStartAt);
  const [appointmentTime, setAppointmentTime] = useState(initialStartAt);
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
      Alert.alert("Missing dog", "Create the dog profile first.");
      router.replace("/onboarding/dog" as never);
      return;
    }

    if (isRecurring && recurrenceWeekdays.length === 0) {
      Alert.alert(
        "Pick repeat days",
        "Choose at least one weekday for the recurring walk.",
      );
      return;
    }

    const startAt = combineDateAndTimeParts(appointmentDate, appointmentTime);

    if (startAt.getTime() < Date.now()) {
      Alert.alert(
        "Past appointment",
        "The first appointment needs to be in the future.",
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
      isRecurring,
      recurrenceWeekdays,
      reminderMinutesBefore,
    });

    console.log("Saved appointment", savedAppointment);

    if (!savedAppointment) {
      return;
    }

    router.push("/onboarding/reminders" as never);
  }

  return (
    <OnboardingShell
      step={3}
      totalSteps={5}
      eyebrow="First appointment"
      title="Put the first walk on the calendar"
      description={
        dog
          ? `${dog.name} will be reused from the profile you just saved.`
          : "We’ll attach this appointment to the dog you just added."
      }
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <View style={styles.pickerGroup}>
          <ThemedText type="sectionTitle">Date</ThemedText>
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

        <View style={styles.pickerGroup}>
          <ThemedText type="sectionTitle">Pickup time</ThemedText>
          <DateTimePicker
            display={Platform.OS === "ios" ? "compact" : "default"}
            mode="time"
            onChange={(_: DateTimePickerEvent, value?: Date) =>
              value ? setAppointmentTime(value) : null
            }
            value={appointmentTime}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <ThemedText type="sectionTitle">Repeat weekly</ThemedText>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              type="caption"
            >
              {isRecurring
                ? "Shows on the weekdays you select."
                : "Keeps the first appointment as a one-time walk."}
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
                label={getWeekdayTranslationKey(option.value).slice(0, 3)}
                onPress={() => toggleWeekday(option.value)}
                selected={recurrenceWeekdays.includes(option.value)}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.pickerGroup}>
          <ThemedText type="sectionTitle">Reminder lead time</ThemedText>
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

        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
          type="caption"
        >
          Reminder preview: {formatTimeInputValue(appointmentTime)} with a{" "}
          {reminderMinutesBefore}-minute heads-up.
        </ThemedText>
      </ThemedView>

      <AppButton
        label="Save appointment"
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
