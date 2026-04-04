import { router } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function OnboardingRemindersScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { requestNotificationPermission } = useCanilendar();

  async function handleEnableReminders() {
    const permission = await requestNotificationPermission();

    if (permission === "denied") {
      Alert.alert(
        "Notifications are off",
        "You can still finish setup now and enable reminders later in Settings."
      );
    }

    router.push("/onboarding/success" as never);
  }

  return (
    <OnboardingShell
      step={4}
      totalSteps={5}
      eyebrow="Reminders"
      title="Turn on notifications when you’re ready"
      description="Your first dog and first appointment are saved already, so enabling reminders now immediately has value."
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <View style={styles.pointRow}>
          <ThemedText type="sectionTitle">Appointment alerts</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            Get a heads-up before pickup time.
          </ThemedText>
        </View>
        <View style={styles.pointRow}>
          <ThemedText type="sectionTitle">Daily summary</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            See the day ahead from one morning reminder.
          </ThemedText>
        </View>
      </ThemedView>

      <AppButton
        label="Enable reminders"
        onPress={handleEnableReminders}
        icon="bell.badge.fill"
      />
      <AppButton
        label="Maybe later"
        onPress={() => router.push("/onboarding/success" as never)}
        variant="ghost"
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
  pointRow: {
    gap: Spacing.xs,
  },
});
