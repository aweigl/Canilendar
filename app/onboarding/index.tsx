import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { usePostHog } from "posthog-react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function OnboardingWelcomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const posthog = usePostHog();

  function handleStartSetup() {
    posthog.capture("onboarding_started");
    router.push("/onboarding/dog" as never);
  }

  return (
    <OnboardingShell
      step={1}
      totalSteps={5}
      eyebrow="Guided setup"
      title="Let’s build your first calm day."
      description="We’ll save one dog, create one appointment, and switch on reminders at the right moment."
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <View style={styles.row}>
          <ThemedText type="sectionTitle">1</ThemedText>
          <ThemedText>Save your first reusable dog profile.</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="sectionTitle">2</ThemedText>
          <ThemedText>Schedule the first appointment that should appear in your agenda.</ThemedText>
        </View>
        <View style={styles.row}>
          <ThemedText type="sectionTitle">3</ThemedText>
          <ThemedText>Turn on reminders after real data exists, so the prompt feels earned.</ThemedText>
        </View>
      </ThemedView>

      <AppButton
        label="Start setup"
        onPress={handleStartSetup}
        icon="arrow.right.circle.fill"
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
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: Spacing.md,
  },
});
