import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AppButton } from "@/components/ui/app-button";
import { Spacing } from "@/constants/theme";
import { useAppSession } from "@/context/app-session-context";
import { useCanilendar } from "@/context/canilendar-context";

export default function OnboardingSuccessScreen() {
  const { t } = useTranslation();
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
      title={t("onboarding.success.title")}
      description={t("onboarding.success.description")}
      illustration="success"
      footer={
        <AppButton
          style={styles.cta}
          label={t("onboarding.success.cta")}
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
