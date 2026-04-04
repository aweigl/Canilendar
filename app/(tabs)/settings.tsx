import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Linking,
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
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { detectSystemLanguage, resolveAppLanguage } from "@/i18n";
import { formatTimeInputValue, parseTimeValue } from "@/lib/date";
import {
  REMINDER_OPTIONS,
  type AppearanceMode,
  type LanguagePreference,
} from "@/types/domain";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const {
    isLoaded,
    notificationPermission,
    requestNotificationPermission,
    refreshNotificationPermission,
    settings,
    updateSettings,
    updateAppearanceMode,
  } = useCanilendar();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isLoaded) {
    return <LoadingView />;
  }

  async function handlePermissionAction() {
    const status = await requestNotificationPermission();

    if (status === "denied") {
      Alert.alert(
        t("settings.alerts.notificationsOffTitle"),
        t("settings.alerts.notificationsOffBody"),
      );
    }
  }

  async function handleRefreshPermission() {
    setIsRefreshing(true);
    await refreshNotificationPermission();
    setIsRefreshing(false);
  }

  function permissionCopy() {
    if (notificationPermission === "granted") {
      return t("settings.notificationsEnabled");
    }

    if (notificationPermission === "denied") {
      return t("settings.notificationsDenied");
    }

    return t("settings.notificationsUnknown");
  }

  function appearanceCopy() {
    if (settings.appearanceMode === "light") {
      return t("settings.appearanceLight");
    }

    if (settings.appearanceMode === "dark") {
      return t("settings.appearanceDark");
    }

    return t("settings.appearanceSystem");
  }

  const appearanceOptions: AppearanceMode[] = ["system", "light", "dark"];
  const languageOptions: LanguagePreference[] = [
    "system",
    "en",
    "de",
    "fr",
    "es",
  ];
  const deviceLanguage = detectSystemLanguage();
  const currentLanguage = resolveAppLanguage(settings.language);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ThemedText
            type="eyebrow"
            lightColor={palette.support}
            darkColor={palette.support}
          >
            {t("settings.eyebrow")}
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            {t("settings.title")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("settings.description")}
          </ThemedText>
        </View>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.support,
            },
          ]}
        >
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.notifications")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {permissionCopy()}
          </ThemedText>
          <View style={styles.actions}>
            <AppButton
              label={
                notificationPermission === "granted"
                  ? t("common.enabled")
                  : t("settings.enableReminders")
              }
              onPress={handlePermissionAction}
              variant={
                notificationPermission === "granted" ? "secondary" : "primary"
              }
            />
            <AppButton
              label={
                isRefreshing
                  ? t("settings.refreshingStatus")
                  : t("settings.refreshStatus")
              }
              onPress={handleRefreshPermission}
              variant="ghost"
            />
            {notificationPermission === "denied" ? (
              <AppButton
                label={t("settings.openSystemSettings")}
                onPress={() => Linking.openSettings()}
                variant="secondary"
              />
            ) : null}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText type="sectionTitle" style={styles.cardTitle}>
                {t("settings.dailySummary")}
              </ThemedText>
              <ThemedText
                lightColor={palette.support}
                darkColor={palette.support}
              >
                {t("settings.dailySummaryDescription")}
              </ThemedText>
            </View>
            <ToggleSwitch
              checked={settings.dailySummaryEnabled}
              onCheckedChange={(value) =>
                updateSettings({ dailySummaryEnabled: value })
              }
            />
          </View>

          {settings.dailySummaryEnabled ? (
            <View style={styles.timePickerWrap}>
              <ThemedText style={styles.inputLabel}>
                {t("settings.summaryTime")}
              </ThemedText>
              <DateTimePicker
                display={Platform.OS === "ios" ? "compact" : "default"}
                mode="time"
                onChange={(_, value) => {
                  if (!value) {
                    return;
                  }

                  updateSettings({
                    dailySummaryTime: formatTimeInputValue(value),
                  });
                }}
                value={parseTimeValue(settings.dailySummaryTime)}
              />
            </View>
          ) : null}
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.language")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("settings.languageCurrent", {
              language: t(`languages.${deviceLanguage}`),
              currentLanguage: t(`languages.${currentLanguage}`),
            })}
          </ThemedText>
          <ThemedText lightColor={palette.support} darkColor={palette.support}>
            {t("settings.languageDescription")}
          </ThemedText>
          <View style={styles.chips}>
            {languageOptions.map((language) => (
              <ChoiceChip
                key={language}
                label={
                  language === "system"
                    ? t("common.useDevice")
                    : t(`languages.${language}`)
                }
                onPress={() => updateSettings({ language })}
                selected={settings.language === language}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.appearance")}
          </ThemedText>
          <ThemedText lightColor={palette.support} darkColor={palette.support}>
            {appearanceCopy()}
          </ThemedText>
          <View style={styles.chips}>
            {appearanceOptions.map((mode) => (
              <ChoiceChip
                key={mode}
                label={
                  mode === "system"
                    ? t("common.system")
                    : mode === "light"
                      ? t("common.light")
                      : t("common.dark")
                }
                onPress={() => updateAppearanceMode(mode)}
                selected={settings.appearanceMode === mode}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.defaultReminder")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("settings.defaultReminderDescription")}
          </ThemedText>
          <View style={styles.chips}>
            {REMINDER_OPTIONS.map((minutes) => (
              <ChoiceChip
                key={minutes}
                label={`${minutes} min`}
                onPress={() =>
                  updateSettings({ defaultReminderMinutes: minutes })
                }
                selected={settings.defaultReminderMinutes === minutes}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.storage")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {t("settings.storageDescription")}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.md,
    padding: 20,
    paddingBottom: 140,
  },
  header: {
    gap: Spacing.xs,
  },
  title: {
    fontSize: 34,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: 18,
  },
  cardTitle: {
    fontSize: 22,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  actions: {
    gap: Spacing.xs,
  },
  timePickerWrap: {
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
});
