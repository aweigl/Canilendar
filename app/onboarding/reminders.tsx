import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, View } from "react-native";
import { usePostHog } from "posthog-react-native";

import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function OnboardingRemindersScreen() {
  const { t } = useTranslation();
  const posthog = usePostHog();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
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
      description={t("onboarding.reminders.description")}
    >
      <ThemedView
        style={[
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
        ]}
      >
        <View style={styles.pointRow}>
          <ThemedText type="sectionTitle">{t("onboarding.reminders.appointmentAlertsTitle")}</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("onboarding.reminders.appointmentAlertsBody")}
          </ThemedText>
        </View>
        <View style={styles.pointRow}>
          <ThemedText type="sectionTitle">{t("onboarding.reminders.dailySummaryTitle")}</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("onboarding.reminders.dailySummaryBody")}
          </ThemedText>
        </View>
      </ThemedView>

      <AppButton
        label={t("settings.enableReminders")}
        onPress={handleEnableReminders}
        icon="bell.badge.fill"
      />
      <AppButton
        label={t("onboarding.reminders.maybeLater")}
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
