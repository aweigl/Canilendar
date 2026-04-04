import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import Purchases from "react-native-purchases";

import { isRevenueCatConfigured } from "@/lib/env";
import {
  CANILENDAR_PRO_ENTITLEMENT_ID,
  configureRevenueCat,
  getRevenueCatCustomerInfo,
  getRevenueCatOfferings,
  hasActiveProEntitlement,
  PAYWALL_RESULT,
  presentRevenueCatCustomerCenter,
  presentRevenueCatPaywall,
  presentRevenueCatPaywallIfNeeded,
  purchaseRevenueCatPackage,
  refreshRevenueCatCustomerInfo,
  restoreRevenueCatPurchases,
  revenueCatPurchasesAreSupported,
  revenueCatUiIsReady,
  type RevenueCatOffering,
} from "@/lib/revenuecat";
import type { PaywallTrigger, SubscriptionStatus } from "@/types/domain";

type AppSessionContextValue = {
  subscriptionStatus: SubscriptionStatus;
  isReady: boolean;
  isRevenueCatReady: boolean;
  isRevenueCatPurchaseSupported: boolean;
  isPro: boolean;
  currentOffering: RevenueCatOffering;
  customerInfo: CustomerInfo | null;
  pendingPaywallTrigger: PaywallTrigger | null;
  refreshSubscriptionState: () => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<string | null>;
  restorePurchases: () => Promise<string | null>;
  presentHostedPaywall: (options?: {
    onlyIfNeeded?: boolean;
  }) => Promise<string | null>;
  openCustomerCenter: () => Promise<string | null>;
  presentPaywall: (trigger: PaywallTrigger) => void;
  clearPaywall: () => void;
};

const AppSessionContext = createContext<AppSessionContextValue | undefined>(
  undefined,
);

export function AppSessionProvider({ children }: PropsWithChildren) {
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus>("loading");
  const [currentOffering, setCurrentOffering] =
    useState<RevenueCatOffering>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [pendingPaywallTrigger, setPendingPaywallTrigger] =
    useState<PaywallTrigger | null>(null);
  const listenerRef = useRef<((info: CustomerInfo) => void) | null>(null);
  const listenerAttachedRef = useRef(false);
  const isRevenueCatReady = isRevenueCatConfigured();
  const isRevenueCatPurchaseSupported = revenueCatPurchasesAreSupported();
  const isRevenueCatUiReady = revenueCatUiIsReady();
  const isPro = hasActiveProEntitlement(customerInfo);

  function applySubscriptionState(
    nextCustomerInfo: CustomerInfo | null,
    nextOffering?: RevenueCatOffering,
  ) {
    setCustomerInfo(nextCustomerInfo);

    if (nextOffering !== undefined) {
      setCurrentOffering(nextOffering);
    }

    setSubscriptionStatus(
      hasActiveProEntitlement(nextCustomerInfo) ? "active" : "inactive",
    );
  }

  useEffect(() => {
    let isMounted = true;

    async function bootstrap() {
      await configureRevenueCat();

      if (!isRevenueCatReady) {
        if (isMounted) {
          setSubscriptionStatus("unavailable");
        }
        return;
      }

      try {
        const [nextCustomerInfo, nextOffering] = await Promise.all([
          getRevenueCatCustomerInfo(),
          getRevenueCatOfferings(),
        ]);

        if (!isMounted) {
          return;
        }

        applySubscriptionState(nextCustomerInfo, nextOffering);
      } catch (error) {
        console.warn("Unable to load RevenueCat state", error);
        if (isMounted) {
          setSubscriptionStatus("unavailable");
        }
      }
    }

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [isRevenueCatReady]);

  useEffect(() => {
    if (!isRevenueCatReady) {
      return;
    }

    if (!listenerRef.current) {
      listenerRef.current = (info) => {
        applySubscriptionState(info);
      };
    }

    if (!listenerAttachedRef.current && listenerRef.current) {
      Purchases.addCustomerInfoUpdateListener(listenerRef.current);
      listenerAttachedRef.current = true;
    }

    return () => {
      if (!listenerRef.current || !listenerAttachedRef.current) {
        return;
      }

      Purchases.removeCustomerInfoUpdateListener(listenerRef.current);
      listenerAttachedRef.current = false;
    };
  }, [isRevenueCatReady]);

  const refreshSubscriptionState = useCallback(
    async (options?: {
      forceCustomerInfo?: boolean;
      requiredEntitlementId?: string;
    }) => {
      if (!isRevenueCatReady) {
        setSubscriptionStatus("unavailable");
        return;
      }

      setSubscriptionStatus("loading");

      try {
        const [nextCustomerInfo, nextOffering] = await Promise.all([
          options?.forceCustomerInfo
            ? refreshRevenueCatCustomerInfo({
                requiredEntitlementId: options.requiredEntitlementId,
              })
            : getRevenueCatCustomerInfo(),
          getRevenueCatOfferings(),
        ]);
        applySubscriptionState(nextCustomerInfo, nextOffering);
      } catch (error) {
        console.warn("Unable to refresh RevenueCat state", error);
        setSubscriptionStatus("unavailable");
      }
    },
    [isRevenueCatReady],
  );

  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage) => {
      if (!isRevenueCatReady) {
        return "RevenueCat is not configured yet. Add the iOS API key first.";
      }

      if (!isRevenueCatPurchaseSupported) {
        return "RevenueCat purchases are running in Expo Go preview mode on this build. Use an iOS development build with `npx expo run:ios` to test real purchases.";
      }

      try {
        const result = await purchaseRevenueCatPackage(pkg);

        if (!result) {
          return "Purchases are unavailable on this build.";
        }

        const nextCustomerInfo = await refreshRevenueCatCustomerInfo({
          requiredEntitlementId: CANILENDAR_PRO_ENTITLEMENT_ID,
        });

        applySubscriptionState(nextCustomerInfo ?? result.customerInfo);
        setPendingPaywallTrigger(null);
        return null;
      } catch (error: any) {
        if (error?.userCancelled) {
          return null;
        }

        return error instanceof Error ? error.message : "Purchase failed.";
      }
    },
    [isRevenueCatReady, isRevenueCatPurchaseSupported],
  );

  const restorePurchases = useCallback(async () => {
    if (!isRevenueCatReady) {
      return "RevenueCat is not configured yet. Add the iOS API key first.";
    }

    if (!isRevenueCatPurchaseSupported) {
      return "Restore is not supported in Expo Go preview mode. Use an iOS development build with `npx expo run:ios` to test real purchases.";
    }

    try {
      const restored = await restoreRevenueCatPurchases();

      if (!restored) {
        return "Purchases are unavailable on this build.";
      }

      const nextCustomerInfo =
        (await refreshRevenueCatCustomerInfo()) ?? restored;

      applySubscriptionState(nextCustomerInfo);
      setPendingPaywallTrigger(null);
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : "Restore failed.";
    }
  }, [isRevenueCatReady, isRevenueCatPurchaseSupported]);

  const presentHostedPaywall = useCallback(
    async (options?: { onlyIfNeeded?: boolean }) => {
      if (!isRevenueCatReady) {
        return "RevenueCat is not configured yet. Add the iOS API key first.";
      }

      if (!isRevenueCatUiReady) {
        return "Hosted RevenueCat Paywalls require an iOS development build or production build with the native RevenueCat UI module. They will not work in Expo Go.";
      }

      try {
        const result = options?.onlyIfNeeded
          ? await presentRevenueCatPaywallIfNeeded(currentOffering)
          : await presentRevenueCatPaywall(currentOffering);

        if (!result) {
          return "RevenueCat Paywalls are unavailable on this build.";
        }

        if (
          result === PAYWALL_RESULT.PURCHASED ||
          result === PAYWALL_RESULT.RESTORED
        ) {
          await refreshSubscriptionState({
            forceCustomerInfo: true,
            requiredEntitlementId:
              result === PAYWALL_RESULT.PURCHASED
                ? CANILENDAR_PRO_ENTITLEMENT_ID
                : undefined,
          });
          setPendingPaywallTrigger(null);
        }

        return null;
      } catch (error) {
        return error instanceof Error
          ? error.message
          : "Could not present the RevenueCat Paywall.";
      }
    },
    [
      currentOffering,
      isRevenueCatReady,
      isRevenueCatUiReady,
      refreshSubscriptionState,
    ],
  );

  const openCustomerCenter = useCallback(async () => {
    if (!isRevenueCatReady) {
      return "RevenueCat is not configured yet. Add the iOS API key first.";
    }

    if (!isRevenueCatUiReady) {
      return "RevenueCat Customer Center requires an iOS development build or production build with the native RevenueCat UI module. It will not work in Expo Go.";
    }

    try {
      const didOpen = await presentRevenueCatCustomerCenter();

      if (!didOpen) {
        return "Customer Center is unavailable on this build.";
      }

      await refreshSubscriptionState();
      return null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Could not open RevenueCat Customer Center.";
    }
  }, [isRevenueCatReady, isRevenueCatUiReady, refreshSubscriptionState]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      subscriptionStatus,
      isReady: subscriptionStatus !== "loading",
      isRevenueCatReady,
      isRevenueCatPurchaseSupported,
      isPro,
      currentOffering,
      customerInfo,
      pendingPaywallTrigger,
      refreshSubscriptionState,
      purchasePackage,
      restorePurchases,
      presentHostedPaywall,
      openCustomerCenter,
      presentPaywall: setPendingPaywallTrigger,
      clearPaywall: () => setPendingPaywallTrigger(null),
    }),
    [
      currentOffering,
      customerInfo,
      isPro,
      isRevenueCatPurchaseSupported,
      isRevenueCatReady,
      openCustomerCenter,
      pendingPaywallTrigger,
      presentHostedPaywall,
      purchasePackage,
      refreshSubscriptionState,
      restorePurchases,
      subscriptionStatus,
    ],
  );

  return (
    <AppSessionContext.Provider value={value}>
      {children}
    </AppSessionContext.Provider>
  );
}

export function useAppSession() {
  const context = useContext(AppSessionContext);

  if (!context) {
    throw new Error("useAppSession must be used within an AppSessionProvider");
  }

  return context;
}
