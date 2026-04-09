import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet } from "react-native";
import { usePostHog } from "posthog-react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { AppButton } from "@/components/ui/app-button";
import { useCanilendar } from "@/context/canilendar-context";
import { Spacing } from "@/constants/theme";

export default function OnboardingRemindersScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const { requestNotificationPermission } = useCanilendar();

  async function handleEnableReminders() {
    const permission = await requestNotificationPermission();

    posthog.capture("notification_permission_requested", {
      result: permission,
      source: "onboarding",
    });

    if (permission === "denied") {
      Alert.alert(
        t("onboarding.reminders.deniedTitle"),
        t("onboarding.reminders.deniedBody"),
      );
    }

    router.push("/onboarding/success" as never);
  }

  return (
    <OnboardingShell
      step={4}
      totalSteps={5}
      eyebrow={t("onboarding.reminders.eyebrow")}
      title={t("onboarding.reminders.title")}
      description="Timely nudges for pickups and the day ahead."
      heroIcon="bell.badge.fill"
      heroTone="accent"
      illustration="reminders"
      footer={
        <>
          <AppButton
            style={styles.primaryAction}
            label={t("settings.enableReminders")}
            onPress={handleEnableReminders}
            icon="bell.badge.fill"
          />
          <AppButton
            label={t("onboarding.reminders.maybeLater")}
            onPress={() => router.push("/onboarding/success" as never)}
            variant="ghost"
          />
        </>
      }
    >
      
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  primaryAction: {
    marginTop: Spacing.sm,
  },
});
