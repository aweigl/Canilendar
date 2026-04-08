import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { revenueCatPurchasesAreSupported } from "@/lib/revenuecat";
import type { PaywallTrigger } from "@/types/domain";
import type {
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

type UsePaywallScreenParams = {
  clearPaywall: () => void;
  currentOffering: PurchasesOffering | null;
  purchasePackage: (pkg: PurchasesPackage) => Promise<string | null>;
  posthog: {
    capture: (event: string, properties?: any, options?: any) => void;
  };
  trigger?: PaywallTrigger;
};

export function usePaywallScreen({
  clearPaywall,
  currentOffering,
  purchasePackage,
  posthog,
  trigger,
}: UsePaywallScreenParams) {
  const [selectedId, setSelectedId] = useState<string | null>(
    currentOffering?.availablePackages[0]?.identifier ?? null,
  );
  const [isBusy, setIsBusy] = useState(false);
  const activeTrigger = trigger ?? "settings";
  const purchasesSupported = revenueCatPurchasesAreSupported();
  const packages = useMemo(
    () => currentOffering?.availablePackages ?? [],
    [currentOffering],
  );
  const sortedPackages = useMemo(
    () =>
      [...packages].sort((left, right) =>
        left.product.price > right.product.price ? 1 : -1,
      ),
    [packages],
  );
  const selectedPackage =
    sortedPackages.find((pkg) => pkg.identifier === selectedId) ??
    sortedPackages[0] ??
    null;

  useEffect(() => {
    posthog.capture("paywall_viewed", { trigger: activeTrigger });
  }, [activeTrigger, posthog]);

  useEffect(() => {
    if (!selectedPackage && sortedPackages[0]) {
      setSelectedId(sortedPackages[0].identifier);
    }
  }, [selectedPackage, sortedPackages]);

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

  return {
    activeTrigger,
    isBusy,
    purchasesSupported,
    selectedPackage,
    sortedPackages,
    handleClose,
    handlePurchase,
    selectPackage: setSelectedId,
  };
}
