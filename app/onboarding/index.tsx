import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { StyleSheet } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AppButton } from "@/components/ui/app-button";
import { Spacing } from "@/constants/theme";

export default function OnboardingWelcomeScreen() {
  const posthog = usePostHog();

  function handleStartSetup() {
    posthog.capture("onboarding_started");
    router.push("/onboarding/dog");
  }

  return (
    <OnboardingShell
      step={1}
      totalSteps={5}
      eyebrow="Guided setup"
      title="Build your first calm day."
      description="One dog. One walk. One reminder flow."
      heroIcon="sparkles"
      heroTone="accent"
      illustration="welcome"
      footer={
        <AppButton
          style={styles.cta}
          label="Start setup"
          onPress={handleStartSetup}
          icon="arrow.right.circle.fill"
        />
      }
    >
      
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: Spacing.sm,
  },
});
