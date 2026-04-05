import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

import { SubscriptionOptionCard } from "@/components/paywall/subscription-option-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAppSession } from "@/context/app-session-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  revenueCatPurchasesAreSupported,
  revenueCatUiIsReady,
} from "@/lib/revenuecat";
import type { PaywallTrigger } from "@/types/domain";
import type { PurchasesPackage } from "react-native-purchases";

const DEFAULT_COPY: Record<PaywallTrigger, string> = {
  dog_limit:
    "Free includes 1 dog profile. Upgrade to save unlimited dogs and keep your client list growing.",
  appointment_limit:
    "Free includes 1 appointment. Upgrade to schedule unlimited walks and recurring routes.",
  onboarding:
    "Upgrade when you need more than the first guided setup. Your initial dog and first appointment stay free.",
  settings:
    "Go pro to unlock unlimited dogs and appointments with the same calm workflow.",
};

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
    presentHostedPaywall,
    purchasePackage,
    restorePurchases,
  } = useAppSession();
  const [selectedId, setSelectedId] = useState<string | null>(
    currentOffering?.availablePackages[0]?.identifier ?? null,
  );
  const [isBusy, setIsBusy] = useState(false);
  const activeTrigger = trigger ?? "settings";

  useEffect(() => {
    posthog.capture("paywall_viewed", { trigger: activeTrigger });
  }, [posthog, activeTrigger]);
  const purchasesSupported = revenueCatPurchasesAreSupported();
  const hostedUiReady = revenueCatUiIsReady();
  const packages = useMemo(
    () => currentOffering?.availablePackages ?? [],
    [currentOffering],
  );
  const selectedPackage =
    packages.find((pkg) => pkg.identifier === selectedId) ??
    packages[0] ??
    null;

  const sortedPackages = useMemo(() => {
    return packages.sort((left, right) =>
      left.product.price > right.product.price ? 1 : -1,
    );
  }, [packages]);

  async function handlePurchase(pkg: PurchasesPackage | null) {
    if (!pkg) {
      return;
    }

    setIsBusy(true);
    const error = await purchasePackage(pkg);
    setIsBusy(false);

    if (error) {
      Alert.alert("Purchase failed", error);
      return;
    }

    posthog.capture("subscription_purchased", {
      package_identifier: pkg.identifier,
      product_identifier: pkg.product.identifier,
      price: pkg.product.price,
      currency_code: pkg.product.currencyCode,
      trigger: activeTrigger,
    });

    router.back();
  }

  function handleClose() {
    posthog.capture("paywall_dismissed", { trigger: activeTrigger });
    clearPaywall();
    router.back();
  }

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
          <ThemedText
            type="eyebrow"
            lightColor={palette.accent}
            darkColor={palette.accent}
          >
            Canilendar Pro
          </ThemedText>
          <ThemedText type="title">Unlock unlimited planning</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {DEFAULT_COPY[activeTrigger]}
          </ThemedText>
        </ThemedView>

        {sortedPackages.map((pkg) => {
          const isAnnual = pkg.product.identifier.includes("annual");
          return (
            <SubscriptionOptionCard
              key={pkg.identifier}
              title={isAnnual ? "Annual Pro" : "Monthly Pro"}
              price={pkg.product.priceString}
              cadence={isAnnual ? "per year" : "per month"}
              description={
                isAnnual
                  ? "Best value for regular walkers."
                  : "Try pro with the smallest commitment."
              }
              featured={isAnnual}
              selected={selectedPackage?.identifier === pkg.identifier}
              onPress={() => setSelectedId(pkg.identifier)}
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
              Purchases are not configured yet
            </ThemedText>
            <ThemedText
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              Add `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`, create the `pro`
              entitlement, and connect the monthly and annual products in
              RevenueCat.
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

        {isRevenueCatReady && purchasesSupported && !hostedUiReady ? (
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
              Hosted RevenueCat UI unavailable in this build
            </ThemedText>
            <ThemedText lightColor={palette.onInfo} darkColor={palette.onInfo}>
              Use the custom paywall below, or rebuild the app as an iOS
              development build to test RevenueCat Paywall UI and Customer
              Center.
            </ThemedText>
          </ThemedView>
        ) : null}

        <AppButton
          label={
            isBusy
              ? "Working..."
              : selectedPackage
                ? `Continue with ${selectedPackage.product.priceString}`
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
        {/* {Platform.OS === "ios" ? (
          <AppButton
            label="Manage subscription"
            onPress={() =>
              Linking.openURL("https://apps.apple.com/account/subscriptions")
            }
            variant="ghost"
          />
        ) : null} */}
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
});
