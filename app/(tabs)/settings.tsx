import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
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
import { useAppSession } from "@/context/app-session-context";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { detectSystemLanguage, resolveAppLanguage } from "@/i18n";
import { formatTimeInputValue, parseTimeValue } from "@/lib/date";
import { APPLE_SUBSCRIPTIONS_URL, getPrivacyChoicesUrl } from "@/lib/legal";
import { showDevNotification } from "@/lib/notifications";
import {
  revenueCatPurchasesAreSupported,
  revenueCatUiIsReady,
} from "@/lib/revenuecat";
import {
  DAILY_APPOINTMENT_LIMIT_OPTIONS,
  REMINDER_OPTIONS,
  type AppearanceMode,
  type LanguagePreference,
} from "@/types/domain";
import { router } from "expo-router";
import { CheckCircle2Icon } from "lucide-react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const {
    authUser,
    isAppleAuthEnabled,
    isPro,
    isRevenueCatReady,
    isRevenueCatPurchaseSupported,
    openCustomerCenter,
    deleteAccount,
    presentPaywall,
    signOut,
    subscriptionStatus,
  } = useAppSession();
  const {
    isLoaded,
    markChecklistStepSeen,
    notificationPermission,
    requestNotificationPermission,
    resetLocalData,
    refreshNotificationPermission,
    settings,
    updateSettings,
    updateAppearanceMode,
  } = useCanilendar();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isShowingDevNotification, setIsShowingDevNotification] =
    useState(false);
  const [isShowingSplashPreview, setIsShowingSplashPreview] = useState(false);
  const purchasesSupported = revenueCatPurchasesAreSupported();
  const hostedUiReady = revenueCatUiIsReady();
  const privacyChoicesUrl = getPrivacyChoicesUrl();
  const contentBottomPadding = 0;

  useEffect(() => {
    if (isLoaded) {
      markChecklistStepSeen("settings");
    }
  }, [isLoaded, markChecklistStepSeen]);

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

  async function handleShowDevNotification() {
    setIsShowingDevNotification(true);
    const status = await requestNotificationPermission();

    if (status !== "granted") {
      setIsShowingDevNotification(false);

      if (status === "denied") {
        Alert.alert(
          t("settings.alerts.notificationsOffTitle"),
          t("settings.alerts.notificationsOffBody"),
        );
      }

      return;
    }

    try {
      await showDevNotification(resolveAppLanguage(settings.language));
    } finally {
      setIsShowingDevNotification(false);
    }
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
  const signedInLabel = authUser?.email || authUser?.appleUserId || "";

  async function handleCustomerCenter() {
    const error = await openCustomerCenter();

    if (error) {
      Alert.alert(t("settings.pro.customerCenterTitle"), error);
    }
  }

  function handleResetLocalData() {
    Alert.alert(t("settings.devReset.title"), t("settings.devReset.body"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.devReset.confirm"),
        style: "destructive",
        onPress: () => {
          resetLocalData();
        },
      },
    ]);
  }

  function handleSignOut() {
    Alert.alert(
      t("settings.account.signOutTitle"),
      t("settings.account.signOutBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.account.signOut"),
          style: "destructive",
          onPress: () => {
            signOut();
          },
        },
      ],
    );
  }

  function handleDeleteAccount() {
    Alert.alert(
      t("settings.account.deleteTitle"),
      t("settings.account.deleteBody"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.account.deleteAction"),
          style: "destructive",
          onPress: () => {
            confirmDeleteAccount();
          },
        },
      ],
    );
  }

  async function confirmDeleteAccount() {
    if (isDeletingAccount) {
      return;
    }

    setIsDeletingAccount(true);
    const error = await deleteAccount();
    setIsDeletingAccount(false);

    if (error) {
      Alert.alert(t("settings.account.deleteFailedTitle"), error);
      return;
    }

    Alert.alert(
      t("settings.account.deleteSuccessTitle"),
      t("settings.account.deleteSuccessBody"),
      [
        {
          text: t("settings.account.manageSubscription"),
          onPress: () => {
            Linking.openURL(APPLE_SUBSCRIPTIONS_URL);
          },
        },
        { text: t("common.cancel"), style: "cancel" },
      ],
    );
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 32 }]}
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

        {isAppleAuthEnabled && authUser ? (
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
              {t("settings.account.title")}
            </ThemedText>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
            >
              {t("settings.account.description")}
            </ThemedText>
            <ThemedText
              lightColor={palette.support}
              darkColor={palette.support}
            >
              {t("settings.account.signedInAs", {
                value: signedInLabel,
              })}
            </ThemedText>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              type="caption"
            >
              {t("settings.account.revenueCatReference", {
                value: authUser.revenueCatAppUserId,
              })}
            </ThemedText>
            <AppButton
              label={t("settings.account.signOut")}
              onPress={handleSignOut}
              variant="secondary"
            />
          </ThemedView>
        ) : null}

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText
            type="sectionTitle"
            style={[styles.cardTitle, styles.marginBottom, styles.row]}
          >
            {t("settings.pro.title")}
            {isPro ? (
              <CheckCircle2Icon
                style={{ margin: 0, marginLeft: 8 }}
                color={palette.support}
              />
            ) : null}
          </ThemedText>
          <ThemedText
            style={(styles.marginBottom, styles.cardTitle, styles.active)}
            lightColor={palette.support}
            darkColor={palette.support}
          >
            {!isPro
              ? subscriptionStatus === "unavailable"
                ? t("settings.pro.unavailable")
                : t("settings.pro.freeTier")
              : null}
          </ThemedText>
          <View style={styles.actions}>
            {/* <AppButton
              label={
                isRestoring
                  ? t("settings.pro.restoring")
                  : t("settings.pro.restore")
              }
              onPress={handleRestorePurchases}
              disabled={
                isRestoring ||
                !isRevenueCatReady ||
                !isRevenueCatPurchaseSupported
              }
              variant="secondary"
            /> */}
            {isPro ? (
              <AppButton
                label={t("settings.pro.customerCenter")}
                onPress={handleCustomerCenter}
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
                onPress={() => presentPaywall("settings")}
                icon="crown.fill"
              />
            )}
            {/* {Platform.OS === "ios" ? (
              <AppButton
                label="Manage subscription"
                onPress={() =>
                  Linking.openURL(
                    "https://apps.apple.com/account/subscriptions",
                  )
                }
                variant="ghost"
              />
            ) : null} */}
          </View>
          {/* {currentOffering && !isPro ? (
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              type="caption"
            >
              {t("settings.pro.currentOffering", {
                identifier: currentOffering.identifier,
                count: currentOffering.availablePackages.length,
              })}
            </ThemedText>
          ) : null} */}
          {isRevenueCatReady && !purchasesSupported ? (
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
            >
              {t("settings.pro.expoGo")}
            </ThemedText>
          ) : null}
          {isRevenueCatReady && purchasesSupported && !hostedUiReady ? (
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              type="caption"
            >
              {t("settings.pro.hostedUi")}
            </ThemedText>
          ) : null}
        </ThemedView>

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
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            {t("settings.dailyAppointmentLimit")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={{ marginTop: Spacing.md, marginBottom: Spacing.md }}
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
                onPress={() => updateSettings({ dailyAppointmentLimit: limit })}
                selected={settings.dailyAppointmentLimit === limit}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              marginTop: Spacing.md,
              marginBottom: Spacing.md,
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <View
            style={[
              styles.row,
              { marginBottom: Spacing.sm, marginTop: Spacing.sm },
            ]}
          >
            <View style={styles.copy}>
              <ThemedText
                type="sectionTitle"
                style={[
                  styles.cardTitle,
                  {
                    marginTop: Spacing.md,
                  },
                ]}
              >
                {t("settings.dailySummary")}
              </ThemedText>
              <ThemedText
                style={{ marginTop: Spacing.md }}
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
            <View style={[styles.timePickerWrap, { marginBottom: Spacing.xl }]}>
              <ThemedText
                style={[
                  styles.inputLabel,
                  { marginBottom: Spacing.sm, marginTop: Spacing.sm },
                ]}
              >
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

          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
                marginTop: Spacing.md,
                marginBottom: Spacing.md,
              },
            ]}
          >
            <ThemedText
              type="sectionTitle"
              style={[
                styles.cardTitle,
                { marginTop: Spacing.md, marginBottom: Spacing.md },
              ]}
            >
              {t("settings.defaultReminder")}
            </ThemedText>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              style={{ marginBottom: Spacing.md, marginTop: Spacing.md }}
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
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
              marginBottom: Spacing.md,
              marginTop: Spacing.md,
            },
          ]}
        >
          <ThemedText
            type="sectionTitle"
            style={[
              styles.cardTitle,
              { marginBottom: Spacing.md, marginTop: Spacing.md },
            ]}
          >
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
            style={{ marginBottom: Spacing.md, marginTop: Spacing.md }}
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
          <ThemedText
            type="sectionTitle"
            style={[
              styles.cardTitle,
              { marginBottom: Spacing.md, marginTop: Spacing.md },
            ]}
          >
            {t("settings.appearance")}
          </ThemedText>
          <ThemedText
            lightColor={palette.support}
            darkColor={palette.support}
            style={{ marginBottom: Spacing.md, marginTop: Spacing.md }}
          >
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
          <ThemedText
            type="sectionTitle"
            style={[
              styles.cardTitle,
              { marginBottom: Spacing.md, marginTop: Spacing.md },
            ]}
          >
            {t("legal.sectionTitle")}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={{ marginBottom: Spacing.md, marginTop: Spacing.md }}
          >
            {t("legal.sectionDescription")}
          </ThemedText>
          <View style={styles.actions}>
            <AppButton
              label={t("legal.imprintTitle")}
              onPress={() => router.push("/legal/imprint")}
              variant="secondary"
            />
            <AppButton
              label={t("legal.privacyTitle")}
              onPress={() => router.push("/legal/privacy")}
              variant="secondary"
            />
            {privacyChoicesUrl ? (
              <AppButton
                label={t("legal.privacyChoicesAction")}
                onPress={() => {
                  Linking.openURL(privacyChoicesUrl);
                }}
                variant="ghost"
              />
            ) : null}
            {isAppleAuthEnabled && authUser ? (
              <AppButton
                label={
                  isDeletingAccount
                    ? t("settings.account.deletingAccount")
                    : t("settings.account.deleteAction")
                }
                onPress={handleDeleteAccount}
                variant="danger"
                disabled={isDeletingAccount}
                icon="trash.fill"
              />
            ) : null}
          </View>
        </ThemedView>

        {__DEV__ ? (
          <ThemedView
            style={[
              styles.card,
              {
                backgroundColor: palette.dangerSoft,
                borderColor: palette.danger,
              },
            ]}
          >
            <ThemedText
              type="sectionTitle"
              style={styles.cardTitle}
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              {t("settings.devTools.title")}
            </ThemedText>
            <ThemedText
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              {t("settings.devTools.description")}
            </ThemedText>
            <AppButton
              label={
                isShowingDevNotification
                  ? t("settings.devTools.showNotificationLoading")
                  : t("settings.devTools.showNotification")
              }
              onPress={handleShowDevNotification}
              variant="secondary"
              disabled={isShowingDevNotification}
              icon="bell.badge.fill"
            />
            <AppButton
              label={t("settings.devTools.showSplash")}
              onPress={() => setIsShowingSplashPreview(true)}
              variant="secondary"
              icon="apple.logo"
            />
            <AppButton
              label={t("settings.devReset.button")}
              onPress={handleResetLocalData}
              variant="danger"
              icon="trash.fill"
            />
          </ThemedView>
        ) : null}
      </ScrollView>

      <Modal
        animationType="fade"
        onRequestClose={() => setIsShowingSplashPreview(false)}
        statusBarTranslucent
        transparent={false}
        visible={isShowingSplashPreview}
      >
        <Pressable
          onPress={() => setIsShowingSplashPreview(false)}
          style={[
            styles.splashPreview,
            {
              backgroundColor: "#F8F1E6",
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={require("../../assets/images/splash-screen.png")}
            style={styles.splashImage}
          />
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  active: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.xl,
    padding: 24,
  },
  header: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 34,
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
  },
  splashPreview: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  splashImage: {
    height: 400,
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
});
