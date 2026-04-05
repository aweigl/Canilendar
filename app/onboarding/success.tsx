import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AppButton } from "@/components/ui/app-button";
import { useCanilendar } from "@/context/canilendar-context";

export default function OnboardingSuccessScreen() {
  const { completeOnboarding } = useCanilendar();
  const posthog = usePostHog();

  function handleFinish() {
    posthog.capture("onboarding_completed");
    completeOnboarding();
    router.replace("/(tabs)" as never);
  }

  return (
    <OnboardingShell
      step={5}
      totalSteps={5}
      eyebrow="You’re ready"
      title="Your first day is live"
      description="Calendar, dogs, and settings are unlocked. The free tier stays usable, and pro only appears when you outgrow it."
    >
      <AppButton
        label="Open my calendar"
        onPress={handleFinish}
        icon="calendar.circle.fill"
      />
    </OnboardingShell>
  );
}
