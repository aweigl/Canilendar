import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LoadingView } from "@/components/loading-view";
import { SettingsScreenHeader } from "@/components/settings/settings-screen-header";
import {
  SettingsAccountSection,
  SettingsAppearanceSection,
  SettingsDeveloperToolsSection,
  SettingsLanguageSection,
  SettingsLegalSection,
  SettingsSchedulingSection,
  SettingsSubscriptionSection,
} from "@/components/settings/settings-sections";
import { SplashPreviewModal } from "@/components/settings/splash-preview-modal";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useSettingsScreenController } from "@/hooks/use-settings-screen-controller";

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const controller = useSettingsScreenController();

  if (!controller.isLoaded) {
    return <LoadingView />;
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
        <SettingsScreenHeader palette={palette} />
        <SettingsAccountSection
          authUser={controller.authUser}
          isAppleAuthEnabled={controller.isAppleAuthEnabled}
          onSignOut={controller.handleSignOut}
          palette={palette}
          signedInLabel={controller.signedInLabel}
        />
        <SettingsSubscriptionSection
          hostedUiReady={controller.hostedUiReady}
          isPro={controller.isPro}
          isRevenueCatPurchaseSupported={
            controller.isRevenueCatPurchaseSupported
          }
          isRevenueCatReady={controller.isRevenueCatReady}
          onOpenCustomerCenter={controller.handleCustomerCenter}
          onUpgrade={controller.upgradeToPro}
          palette={palette}
          subscriptionStatus={controller.subscriptionStatus}
        />
        <SettingsSchedulingSection
          onUpdateSettings={controller.updateSettings}
          palette={palette}
          settings={controller.settings}
        />
        <SettingsLanguageSection
          currentLanguage={controller.currentLanguage}
          deviceLanguage={controller.deviceLanguage}
          languageOptions={controller.languageOptions}
          onChangeLanguage={(language) =>
            controller.updateSettings({ language })
          }
          palette={palette}
          settings={controller.settings}
        />
        <SettingsAppearanceSection
          appearanceCopy={controller.appearanceCopy}
          appearanceOptions={controller.appearanceOptions}
          onChangeAppearance={controller.updateAppearanceMode}
          palette={palette}
          settings={controller.settings}
        />
        <SettingsLegalSection
          canDeleteAccount={
            controller.isAppleAuthEnabled && Boolean(controller.authUser)
          }
          isDeletingAccount={controller.isDeletingAccount}
          onDeleteAccount={controller.handleDeleteAccount}
          onOpenImprint={controller.openImprint}
          onOpenPrivacy={controller.openPrivacy}
          onOpenPrivacyChoices={controller.openPrivacyChoices}
          palette={palette}
          privacyChoicesUrl={controller.privacyChoicesUrl}
        />
        <SettingsDeveloperToolsSection
          isShowingDevNotification={controller.isShowingDevNotification}
          onPreviewAppleSignIn={controller.openPreviewAppleSignIn}
          onResetLocalData={controller.handleResetLocalData}
          onRestartOnboarding={controller.handleRestartOnboarding}
          onSeedSampleData={controller.handleSeedSampleData}
          onShowDevNotification={controller.handleShowDevNotification}
          onShowSplash={controller.showSplashPreview}
          palette={palette}
        />
      </ScrollView>

      <SplashPreviewModal
        onClose={controller.hideSplashPreview}
        visible={controller.isShowingSplashPreview}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.xl,
    padding: 24,
  },
});
