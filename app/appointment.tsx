import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
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
import { useCanilander } from "@/context/canilander-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { combineDateAndTimeParts, formatTimeInputValue } from "@/lib/date";
import {
  REMINDER_OPTIONS,
  WEEKDAY_OPTIONS,
} from "@/types/domain";

const EMPTY_DOG_FORM = {
  name: "",
  address: "",
  ownerPhone: "",
  notes: "",
};

export default function AppointmentScreen() {
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
  } = useCanilander();
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
      : new Date();
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
  const [appointmentTime, setAppointmentTime] = useState(initialStartAt);
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
      setAppointmentTime(startAt);
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
        "Missing dog details",
        "Add the dog name, address, and owner phone number first.",
      );
      return;
    }

    if (dogMode === "existing" && !selectedDogId) {
      Alert.alert(
        "Choose a dog",
        "Select an existing dog or switch to a new dog profile.",
      );
      return;
    }

    if (isRecurring && recurrenceWeekdays.length === 0) {
      Alert.alert(
        "Pick repeat days",
        "Choose at least one weekday for the recurring walk.",
      );
      return;
    }

    const combinedStartAt = combineDateAndTimeParts(
      appointmentDate,
      appointmentTime,
    );

    if (!appointment && combinedStartAt.getTime() < Date.now()) {
      Alert.alert(
        "Past appointment",
        "New appointments need to be scheduled in the future.",
      );
      return;
    }

    await saveAppointment({
      id: appointment?.id,
      dog: {
        id: dogMode === "existing" ? (selectedDogId ?? undefined) : undefined,
        name: dogForm.name,
        address: dogForm.address,
        ownerPhone: dogForm.ownerPhone,
        notes: dogForm.notes,
      },
      startAt: combinedStartAt.toISOString(),
      notes,
      isRecurring,
      recurrenceWeekdays,
      reminderMinutesBefore,
    });

    router.back();
  }

  function handleDelete() {
    if (!appointment) {
      return;
    }

    Alert.alert(
      "Delete appointment?",
      "This removes the appointment and its scheduled reminders.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
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
          title: appointment ? "Edit Appointment" : "New Appointment",
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
          <ThemedText type="eyebrow" lightColor={palette.accent} darkColor={palette.accent}>
            Scheduler details
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {appointment ? "Edit appointment" : "New appointment"}
          </ThemedText>
          <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
            Capture the dog, pickup details, time, repeat pattern, and reminder
            in one place.
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
          <ThemedText type="sectionTitle" style={styles.sectionTitle}>Dog details</ThemedText>
          <View style={styles.toggleRow}>
            <ChoiceChip
              label="Saved dog"
              onPress={() => setDogMode("existing")}
              selected={dogMode === "existing"}
            />
            <ChoiceChip
              label="New dog"
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
                  No dogs saved yet. Switch to &quot;New dog&quot; to create the
                  first profile.
                </ThemedText>
              ) : (
                <>
                  <ThemedText
                    lightColor={palette.textMuted}
                    darkColor={palette.textMuted}
                    type="caption"
                  >
                    Choose a saved dog. The address, owner phone, and notes
                    shown in each card belong to that dog profile.
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
            label="Dog name"
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, name: value }))
            }
            placeholder="Milo"
            value={dogForm.name}
          />
          <InputField
            label="Pickup address"
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, address: value }))
            }
            placeholder="12 Bark Street"
            value={dogForm.address}
          />
          <InputField
            keyboardType="phone-pad"
            label="Owner phone"
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, ownerPhone: value }))
            }
            placeholder="+49 123 456 789"
            value={dogForm.ownerPhone}
          />
          <InputField
            label="Dog notes"
            multiline
            onChangeText={(value) =>
              setDogForm((current) => ({ ...current, notes: value }))
            }
            placeholder="Gate code, collar note, feeding reminder..."
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
            <ThemedText style={styles.inputLabel}>Date</ThemedText>
            <DateTimePicker
              display={Platform.OS === "ios" ? "compact" : "default"}
              mode="date"
              minimumDate={appointment ? undefined : new Date()}
              onChange={handleDateChange}
              value={appointmentDate}
            />
          </View>

          <View style={styles.pickerGroup}>
            <ThemedText style={styles.inputLabel}>Pickup time</ThemedText>
            <DateTimePicker
              display={Platform.OS === "ios" ? "compact" : "default"}
              mode="time"
              onChange={handleTimeChange}
              value={appointmentTime}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText style={styles.inputLabel}>Repeat weekly</ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
                type="caption"
              >
                {isRecurring
                  ? "Shows on every selected weekday."
                  : "Keeps this as a one-time appointment."}
              </ThemedText>
            </View>
            <ToggleSwitch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </View>

          {isRecurring ? (
            <View style={styles.chips}>
              {WEEKDAY_OPTIONS.map((option) => (
                <ChoiceChip
                  key={option.value}
                  label={option.label}
                  onPress={() => toggleWeekday(option.value)}
                  selected={recurrenceWeekdays.includes(option.value)}
                />
              ))}
            </View>
          ) : null}

          <View style={styles.pickerGroup}>
            <ThemedText style={styles.inputLabel}>
              Reminder lead time
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

          <InputField
            label="Appointment notes"
            multiline
            onChangeText={setNotes}
            placeholder="Meet owner at side entrance, bring extra towel..."
            value={notes}
          />

          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            type="caption"
          >
            Reminder time: {formatTimeInputValue(appointmentTime)} with a{" "}
            {reminderMinutesBefore}-minute heads-up.
          </ThemedText>
        </ThemedView>

        <View style={styles.footerActions}>
          <AppButton
            icon={appointment ? "square.and.pencil" : "plus.circle.fill"}
            label={appointment ? "Save changes" : "Create appointment"}
            onPress={handleSave}
          />
          {appointment ? (
            <AppButton
              icon="trash.fill"
              label="Delete appointment"
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
