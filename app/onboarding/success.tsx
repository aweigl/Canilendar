import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { StyleSheet } from "react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AppButton } from "@/components/ui/app-button";
import { Spacing } from "@/constants/theme";
import { useAppSession } from "@/context/app-session-context";
import { useCanilendar } from "@/context/canilendar-context";

export default function OnboardingSuccessScreen() {
  const { completeOnboarding } = useCanilendar();
  const { presentPaywall } = useAppSession();
  const posthog = usePostHog();

  function handleFinish() {
    posthog.capture("onboarding_completed");
    completeOnboarding();
    presentPaywall("onboarding_complete");
    router.replace("/(tabs)" as never);
  }

  return (
    <OnboardingShell
      step={5}
      totalSteps={5}
      eyebrow="You’re ready"
      title="Your first day is live."
      description="Calendar unlocked. Dog saved. Ready to book more."
      heroIcon="party.popper.fill"
      heroTone="success"
      illustration="success"
      footer={
        <AppButton
          style={styles.cta}
          label="Open my calendar"
          onPress={handleFinish}
          icon="calendar.circle.fill"
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
