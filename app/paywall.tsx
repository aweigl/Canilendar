import { useLocalSearchParams } from "expo-router";
import { usePostHog } from "posthog-react-native";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SubscriptionOptionCard } from "@/components/paywall/subscription-option-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAppSession } from "@/context/app-session-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { usePaywallScreen } from "@/hooks/use-paywall-screen";
import {
  getHeroTitle,
  getIntroOfferLabel,
  getPackageDetails,
  getPaywallCopy,
  isOnboardingTrialTrigger,
} from "@/lib/paywall";
import type { PaywallTrigger } from "@/types/domain";

export default function PaywallScreen() {
  const { trigger } = useLocalSearchParams<{ trigger?: PaywallTrigger }>();
  const posthog = usePostHog();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const {
    clearPaywall,
    currentOffering,
    isRevenueCatReady,
    isRevenueCatPurchaseSupported,
    purchasePackage,
  } = useAppSession();
  const {
    activeTrigger,
    isBusy,
    purchasesSupported,
    selectedPackage,
    sortedPackages,
    handleClose,
    handlePurchase,
    selectPackage,
  } = usePaywallScreen({
    clearPaywall,
    currentOffering,
    purchasePackage,
    posthog,
    trigger,
  });
  const selectedIntroOfferLabel = getIntroOfferLabel(
    selectedPackage?.product.introPrice ?? null,
  );
  const heroCopy = getPaywallCopy(activeTrigger);
  const onboardingTrialTrigger = isOnboardingTrialTrigger(activeTrigger);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[
            styles.hero,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <ThemedText type="title" style={styles.marginTopBottom}>
            {getHeroTitle(activeTrigger, selectedIntroOfferLabel)}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={styles.marginTopBottom}
          >
            {heroCopy.body}
          </ThemedText>
        </ThemedView>

        {sortedPackages.map((pkg) => {
          const details = getPackageDetails(pkg, activeTrigger);

          return (
            <SubscriptionOptionCard
              key={pkg.identifier}
              title={details.title}
              price={pkg.product.priceString}
              cadence={details.cadence}
              description={details.description}
              note={details.note}
              featured={details.featured}
              badgeLabel={details.badgeLabel}
              selected={selectedPackage?.identifier === pkg.identifier}
              onPress={() => selectPackage(pkg.identifier)}
            />
          );
        })}

        {!isRevenueCatReady ? (
          <ThemedView
            style={[
              styles.noteCard,
              {
                backgroundColor: palette.dangerSoft,
                borderColor: palette.danger,
              },
            ]}
          >
            <ThemedText
              type="sectionTitle"
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              RevenueCat setup is incomplete
            </ThemedText>
            <ThemedText
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              Add `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`, create the
              `Canilendar Pro` entitlement in RevenueCat, and attach the
              monthly and annual products to the current offering.
            </ThemedText>
          </ThemedView>
        ) : null}

        {isRevenueCatReady && !purchasesSupported ? (
          <ThemedView
            style={[
              styles.noteCard,
              {
                backgroundColor: palette.infoSoft,
                borderColor: palette.info,
              },
            ]}
          >
            <ThemedText
              type="sectionTitle"
              lightColor={palette.onInfo}
              darkColor={palette.onInfo}
            >
              Purchases need a development build
            </ThemedText>
            <ThemedText lightColor={palette.onInfo} darkColor={palette.onInfo}>
              This app is running in Expo Go preview mode. Real RevenueCat
              purchases and restores need an iOS development build started with
              `npx expo run:ios`.
            </ThemedText>
          </ThemedView>
        ) : null}

        <AppButton
          label={
            isBusy
              ? "Working..."
              : selectedPackage
                ? onboardingTrialTrigger && selectedIntroOfferLabel
                  ? `Start ${selectedIntroOfferLabel}`
                  : `Continue with ${selectedPackage.product.priceString}`
                : "Continue with custom paywall"
          }
          onPress={() => handlePurchase(selectedPackage)}
          disabled={
            !selectedPackage ||
            isBusy ||
            !isRevenueCatReady ||
            !isRevenueCatPurchaseSupported
          }
          icon="creditcard.fill"
        />
        <AppButton label="Not now" onPress={handleClose} variant="ghost" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.lg,
    padding: 20,
    paddingBottom: 48,
  },
  hero: {
    borderRadius: Radius.hero,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  noteCard: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  marginTopBottom: {
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
