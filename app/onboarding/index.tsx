import { router } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AppButton } from "@/components/ui/app-button";
import { Spacing } from "@/constants/theme";

export default function OnboardingWelcomeScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();

  function handleStartSetup() {
    posthog.capture("onboarding_started");
    router.push("/onboarding/dog");
  }

  return (
    <OnboardingShell
      step={1}
      title={t("onboarding.welcome.title")}
      description={t("onboarding.welcome.description")}
      illustration="welcome"
      footer={
        <AppButton
          style={styles.cta}
          label={t("onboarding.welcome.cta")}
          onPress={handleStartSetup}
          icon="arrow.right.circle.fill"
        />
      }
    ></OnboardingShell>
  );
}

const styles = StyleSheet.create({
  cta: {
    marginTop: Spacing.sm,
  },
});
