import DateTimePicker from "@react-native-community/datetimepicker";
import { CheckCircle2Icon } from "lucide-react-native";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { ChoiceChip } from "@/components/ui/choice-chip";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { formatTimeInputValue, parseTimeValue } from "@/lib/date";
import {
  DAILY_APPOINTMENT_LIMIT_OPTIONS,
  REMINDER_OPTIONS,
  type AppearanceMode,
  type AuthSession,
  type LanguagePreference,
  type ReminderSettings,
  type SubscriptionStatus,
} from "@/types/domain";

type Palette = (typeof Colors)["light"];

type SettingsCardProps = {
  backgroundColor?: string;
  borderColor?: string;
  children: ReactNode;
  palette: Palette;
};

type SettingsAccountSectionProps = {
  authUser: AuthSession | null;
  isAppleAuthEnabled: boolean;
  onSignOut: () => void;
  palette: Palette;
  signedInLabel: string;
};

type SettingsSubscriptionSectionProps = {
  hostedUiReady: boolean;
  isPro: boolean;
  isRevenueCatPurchaseSupported: boolean;
  isRevenueCatReady: boolean;
  onOpenCustomerCenter: () => void;
  onUpgrade: () => void;
  palette: Palette;
  subscriptionStatus: SubscriptionStatus;
};

type SettingsSchedulingSectionProps = {
  onUpdateSettings: (partial: Partial<ReminderSettings>) => void;
  palette: Palette;
  settings: ReminderSettings;
};

type SettingsLanguageSectionProps = {
  currentLanguage: LanguagePreference;
  deviceLanguage: LanguagePreference;
  languageOptions: LanguagePreference[];
  onChangeLanguage: (language: LanguagePreference) => void;
  palette: Palette;
  settings: ReminderSettings;
};

type SettingsAppearanceSectionProps = {
  appearanceCopy: string;
  appearanceOptions: AppearanceMode[];
  onChangeAppearance: (mode: AppearanceMode) => void;
  palette: Palette;
  settings: ReminderSettings;
};

type SettingsLegalSectionProps = {
  canDeleteAccount: boolean;
  isDeletingAccount: boolean;
  onDeleteAccount: () => void;
  onOpenImprint: () => void;
  onOpenPrivacy: () => void;
  onOpenPrivacyChoices: () => void;
  palette: Palette;
  privacyChoicesUrl: string | null;
};

type SettingsDeveloperToolsSectionProps = {
  isShowingDevNotification: boolean;
  onPreviewAppleSignIn: () => void;
  onResetLocalData: () => void;
  onRestartOnboarding: () => void;
  onSeedSampleData: () => void;
  onShowDevNotification: () => void;
  onShowSplash: () => void;
  palette: Palette;
};

function SettingsCard({
  backgroundColor,
  borderColor,
  children,
  palette,
}: SettingsCardProps) {
  return (
    <ThemedView
      style={[
        styles.card,
        {
          backgroundColor: backgroundColor ?? palette.surface,
          borderColor: borderColor ?? palette.border,
        },
      ]}
    >
      {children}
    </ThemedView>
  );
}

export function SettingsAccountSection({
  authUser,
  isAppleAuthEnabled,
  onSignOut,
  palette,
  signedInLabel,
}: SettingsAccountSectionProps) {
  const { t } = useTranslation();

  if (!isAppleAuthEnabled || !authUser) {
    return null;
  }

  return (
    <SettingsCard palette={palette}>
      <ThemedText type="sectionTitle" style={styles.cardTitle}>
        {t("settings.account.title")}
      </ThemedText>
      <AppButton
        label={t("settings.account.signOut")}
        onPress={onSignOut}
        variant="secondary"
      />
    </SettingsCard>
  );
}

export function SettingsSubscriptionSection({
  hostedUiReady,
  isPro,
  isRevenueCatPurchaseSupported,
  isRevenueCatReady,
  onOpenCustomerCenter,
  onUpgrade,
  palette,
  subscriptionStatus,
}: SettingsSubscriptionSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsCard palette={palette}>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: Spacing.sm,
          marginBottom: Spacing.md,
        }}
      >
        <ThemedText type="sectionTitle" style={[styles.cardTitle]}>
          {t("settings.pro.title")}
        </ThemedText>
        {isPro ? (
          <CheckCircle2Icon
            height={24}
            width={24}
            style={{ margin: 0 }}
            color={palette.support}
          />
        ) : null}
      </View>
      <View style={styles.actions}>
        {isPro ? (
          <AppButton
            label={t("settings.pro.customerCenter")}
            onPress={onOpenCustomerCenter}
            disabled={
              !isRevenueCatReady ||
              !isRevenueCatPurchaseSupported ||
              !hostedUiReady
            }
            variant="secondary"
          />
        ) : (
          <AppButton
            style={styles.marginBottom}
            label={t("settings.pro.upgrade")}
            onPress={onUpgrade}
            icon="crown.fill"
          />
        )}
      </View>
      <ThemedText
        style={[styles.marginBottom, styles.statusText]}
        lightColor={palette.support}
        darkColor={palette.support}
        type="caption"
      >
        {!isPro
          ? subscriptionStatus === "unavailable"
            ? t("settings.pro.unavailable")
            : t("settings.pro.freeTier")
          : null}
      </ThemedText>
      {isRevenueCatReady && !isRevenueCatPurchaseSupported ? (
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
        >
          {t("settings.pro.expoGo")}
        </ThemedText>
      ) : null}
      {isRevenueCatReady && isRevenueCatPurchaseSupported && !hostedUiReady ? (
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
          type="caption"
        >
          {t("settings.pro.hostedUi")}
        </ThemedText>
      ) : null}
    </SettingsCard>
  );
}

export function SettingsSchedulingSection({
  onUpdateSettings,
  palette,
  settings,
}: SettingsSchedulingSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      <SettingsCard palette={palette}>
        <ThemedText type="sectionTitle" style={styles.cardTitle}>
          {t("settings.dailyAppointmentLimit")}
        </ThemedText>
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
          style={styles.sectionParagraph}
        >
          {t("settings.dailyAppointmentLimitDescription", {
            count: settings.dailyAppointmentLimit,
          })}
        </ThemedText>
        <View style={styles.chips}>
          {DAILY_APPOINTMENT_LIMIT_OPTIONS.map((limit) => (
            <ChoiceChip
              key={limit}
              label={`${limit}`}
              onPress={() => onUpdateSettings({ dailyAppointmentLimit: limit })}
              selected={settings.dailyAppointmentLimit === limit}
            />
          ))}
        </View>
      </SettingsCard>

      <SettingsCard palette={palette}>
        <View style={[styles.row, styles.summaryHeader]}>
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
              onUpdateSettings({ dailySummaryEnabled: value })
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

                onUpdateSettings({
                  dailySummaryTime: formatTimeInputValue(value),
                });
              }}
              value={parseTimeValue(settings.dailySummaryTime)}
            />
          </View>
        ) : null}

        <SettingsCard palette={palette}>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.defaultReminder")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={styles.sectionParagraph}
          >
            {t("settings.defaultReminderDescription")}
          </ThemedText>
          <View style={styles.chips}>
            {REMINDER_OPTIONS.map((minutes) => (
              <ChoiceChip
                key={minutes}
                label={`${minutes} min`}
                onPress={() =>
                  onUpdateSettings({ defaultReminderMinutes: minutes })
                }
                selected={settings.defaultReminderMinutes === minutes}
              />
            ))}
          </View>
        </SettingsCard>
      </SettingsCard>
    </>
  );
}

export function SettingsLanguageSection({
  currentLanguage,
  deviceLanguage,
  languageOptions,
  onChangeLanguage,
  palette,
  settings,
}: SettingsLanguageSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsCard palette={palette}>
      <ThemedText type="sectionTitle" style={styles.cardTitle}>
        {t("settings.language")}
      </ThemedText>
      <ThemedText
        lightColor={palette.textMuted}
        darkColor={palette.textMuted}
        style={{ marginTop: Spacing.md }}
      >
        {t("settings.languageCurrent", {
          language: t(`languages.${deviceLanguage}`),
          currentLanguage: t(`languages.${currentLanguage}`),
        })}
      </ThemedText>
      <ThemedText
        lightColor={palette.support}
        darkColor={palette.support}
        style={styles.sectionParagraph}
      >
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
            onPress={() => onChangeLanguage(language)}
            selected={settings.language === language}
          />
        ))}
      </View>
    </SettingsCard>
  );
}

export function SettingsAppearanceSection({
  appearanceCopy,
  appearanceOptions,
  onChangeAppearance,
  palette,
  settings,
}: SettingsAppearanceSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsCard palette={palette}>
      <ThemedText type="sectionTitle" style={styles.cardTitle}>
        {t("settings.appearance")}
      </ThemedText>
      <ThemedText
        lightColor={palette.support}
        darkColor={palette.support}
        style={styles.sectionParagraph}
      >
        {appearanceCopy}
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
            onPress={() => onChangeAppearance(mode)}
            selected={settings.appearanceMode === mode}
          />
        ))}
      </View>
    </SettingsCard>
  );
}

export function SettingsLegalSection({
  canDeleteAccount,
  isDeletingAccount,
  onDeleteAccount,
  onOpenImprint,
  onOpenPrivacy,
  onOpenPrivacyChoices,
  palette,
  privacyChoicesUrl,
}: SettingsLegalSectionProps) {
  const { t } = useTranslation();

  return (
    <SettingsCard palette={palette}>
      <ThemedText type="sectionTitle" style={styles.cardTitle}>
        {t("legal.sectionTitle")}
      </ThemedText>
      <ThemedText
        lightColor={palette.textMuted}
        darkColor={palette.textMuted}
        style={styles.sectionParagraph}
      >
        {t("legal.sectionDescription")}
      </ThemedText>
      <View style={styles.actions}>
        <AppButton
          label={t("legal.imprintTitle")}
          onPress={onOpenImprint}
          variant="secondary"
        />
        <AppButton
          label={t("legal.privacyTitle")}
          onPress={onOpenPrivacy}
          variant="secondary"
        />
        {privacyChoicesUrl ? (
          <AppButton
            label={t("legal.privacyChoicesAction")}
            onPress={onOpenPrivacyChoices}
            variant="ghost"
          />
        ) : null}
        {canDeleteAccount ? (
          <AppButton
            label={
              isDeletingAccount
                ? t("settings.account.deletingAccount")
                : t("settings.account.deleteAction")
            }
            onPress={onDeleteAccount}
            variant="danger"
            disabled={isDeletingAccount}
            icon="trash.fill"
          />
        ) : null}
      </View>
    </SettingsCard>
  );
}

export function SettingsDeveloperToolsSection({
  isShowingDevNotification,
  onPreviewAppleSignIn,
  onResetLocalData,
  onRestartOnboarding,
  onSeedSampleData,
  onShowDevNotification,
  onShowSplash,
  palette,
}: SettingsDeveloperToolsSectionProps) {
  const { t } = useTranslation();

  if (!__DEV__) {
    return null;
  }

  return (
    <SettingsCard
      palette={palette}
      borderColor={palette.danger}
      backgroundColor={palette.dangerSoft}
    >
      <ThemedText
        type="sectionTitle"
        style={styles.cardTitle}
        lightColor={palette.onDanger}
        darkColor={palette.onDanger}
      >
        {t("settings.devTools.title")}
      </ThemedText>
      <ThemedText lightColor={palette.onDanger} darkColor={palette.onDanger}>
        {t("settings.devTools.description")}
      </ThemedText>
      <AppButton
        label={
          isShowingDevNotification
            ? t("settings.devTools.showNotificationLoading")
            : t("settings.devTools.showNotification")
        }
        onPress={onShowDevNotification}
        variant="secondary"
        disabled={isShowingDevNotification}
        icon="bell.badge.fill"
      />
      <AppButton
        label={t("settings.devTools.showSplash")}
        onPress={onShowSplash}
        variant="secondary"
        icon="apple.logo"
      />
      <AppButton
        label={t("settings.devTools.previewAppleSignIn")}
        onPress={onPreviewAppleSignIn}
        variant="secondary"
        icon="apple.logo"
      />
      <AppButton
        label={t("settings.devRestartOnboarding.button")}
        onPress={onRestartOnboarding}
        variant="secondary"
        icon="sparkles"
      />
      <AppButton
        label={t("settings.devSeed.button")}
        onPress={onSeedSampleData}
        variant="secondary"
        icon="square.stack.3d.up.fill"
      />
      <AppButton
        label={t("settings.devReset.button")}
        onPress={onResetLocalData}
        variant="danger"
        icon="trash.fill"
      />
    </SettingsCard>
  );
}

const styles = StyleSheet.create({
  statusText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: 24,
  },
  cardTitle: {
    fontSize: 22,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.md,
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
  actions: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  timePickerWrap: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "700",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  marginBottom: {
    marginBottom: Spacing.sm,
  },
  sectionParagraph: {
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  summaryHeader: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
