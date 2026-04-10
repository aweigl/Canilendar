import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import { useAppSession } from "@/context/app-session-context";
import { useCanilendar } from "@/context/canilendar-context";
import { detectSystemLanguage, resolveAppLanguage } from "@/i18n";
import { APPLE_SUBSCRIPTIONS_URL, getPrivacyChoicesUrl } from "@/lib/legal";
import { showDevNotification } from "@/lib/notifications";
import { revenueCatUiIsReady } from "@/lib/revenuecat";
import type { AppearanceMode, LanguagePreference } from "@/types/domain";

const APPEARANCE_OPTIONS: AppearanceMode[] = ["system", "light", "dark"];
const LANGUAGE_OPTIONS: LanguagePreference[] = [
  "system",
  "en",
  "de",
  "fr",
  "es",
];

export function useSettingsScreenController() {
  const { t } = useTranslation();
  const {
    authUser,
    isAppleAuthEnabled,
    isPro,
    isRevenueCatPurchaseSupported,
    isRevenueCatReady,
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
    restartOnboarding,
    seedSampleData,
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
  const hostedUiReady = revenueCatUiIsReady();
  const privacyChoicesUrl = getPrivacyChoicesUrl();
  const deviceLanguage = detectSystemLanguage();
  const currentLanguage = resolveAppLanguage(settings.language);
  const signedInLabel = authUser?.email || authUser?.appleUserId || "";

  useEffect(() => {
    if (isLoaded) {
      markChecklistStepSeen("settings");
    }
  }, [isLoaded, markChecklistStepSeen]);

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

  const permissionCopy =
    notificationPermission === "granted"
      ? t("settings.notificationsEnabled")
      : notificationPermission === "denied"
        ? t("settings.notificationsDenied")
        : t("settings.notificationsUnknown");

  const appearanceCopy =
    settings.appearanceMode === "light"
      ? t("settings.appearanceLight")
      : settings.appearanceMode === "dark"
        ? t("settings.appearanceDark")
        : t("settings.appearanceSystem");

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

  function handleSeedSampleData() {
    Alert.alert(t("settings.devSeed.title"), t("settings.devSeed.body"), [
      { text: t("common.cancel"), style: "cancel" },
      {
        text: t("settings.devSeed.confirm"),
        onPress: () => {
          seedSampleData();
        },
      },
    ]);
  }

  function handleRestartOnboarding() {
    Alert.alert(
      t("settings.devRestartOnboarding.title"),
      t("settings.devRestartOnboarding.body"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("settings.devRestartOnboarding.confirm"),
          onPress: () => {
            restartOnboarding();
            router.replace("/onboarding" as never);
          },
        },
      ],
    );
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

  function openImprint() {
    router.push("/legal/imprint");
  }

  function openPrivacy() {
    router.push("/legal/privacy");
  }

  function openPreviewAppleSignIn() {
    router.push("/debug/apple-signin-preview");
  }

  function openPrivacyChoices() {
    if (privacyChoicesUrl) {
      Linking.openURL(privacyChoicesUrl);
    }
  }

  function openSystemSettings() {
    Linking.openSettings();
  }

  function showSplashPreview() {
    setIsShowingSplashPreview(true);
  }

  function hideSplashPreview() {
    setIsShowingSplashPreview(false);
  }

  function upgradeToPro() {
    presentPaywall("settings");
  }

  return {
    appearanceCopy,
    appearanceOptions: APPEARANCE_OPTIONS,
    authUser,
    currentLanguage,
    deviceLanguage,
    handleCustomerCenter,
    handleDeleteAccount,
    handlePermissionAction,
    handleRefreshPermission,
    handleResetLocalData,
    handleRestartOnboarding,
    handleSeedSampleData,
    handleShowDevNotification,
    handleSignOut,
    hideSplashPreview,
    hostedUiReady,
    isAppleAuthEnabled,
    isDeletingAccount,
    isLoaded,
    isPro,
    isRefreshing,
    isRevenueCatPurchaseSupported,
    isRevenueCatReady,
    isShowingDevNotification,
    isShowingSplashPreview,
    languageOptions: LANGUAGE_OPTIONS,
    notificationPermission,
    openImprint,
    openPreviewAppleSignIn,
    openPrivacy,
    openPrivacyChoices,
    openSystemSettings,
    permissionCopy,
    privacyChoicesUrl,
    settings,
    showSplashPreview,
    signedInLabel,
    subscriptionStatus,
    updateAppearanceMode,
    updateSettings,
    upgradeToPro,
  };
}
