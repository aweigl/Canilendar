import Constants from "expo-constants";
import { NativeModules, Platform, UIManager } from "react-native";
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";

import { env, isRevenueCatConfigured } from "@/lib/env";

let isConfigured = false;
let configurePromise: Promise<boolean> | null = null;
export const CANILENDAR_PRO_ENTITLEMENT_ID = "Canilendar Pro";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isUnsupportedCustomerInfoCacheError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.includes("invalidateCustomerInfoCache is not supported")
  );
}

export async function configureRevenueCat() {
  if (!isRevenueCatConfigured() || Platform.OS !== "ios") {
    return false;
  }

  if (isConfigured) {
    return true;
  }

  if (configurePromise) {
    return configurePromise;
  }

  configurePromise = (async () => {
    const alreadyConfigured = await Purchases.isConfigured();

    if (!alreadyConfigured) {
      Purchases.setLogLevel(LOG_LEVEL.WARN);
      Purchases.configure({
        apiKey: env.revenueCatAppleApiKey,
      });
    }

    isConfigured = true;
    return true;
  })();

  try {
    return await configurePromise;
  } finally {
    configurePromise = null;
  }
}

export function revenueCatIsReady() {
  return isConfigured && isRevenueCatConfigured();
}

export function revenueCatPurchasesAreSupported() {
  if (!revenueCatIsReady() || Platform.OS !== "ios") {
    return false;
  }

  return Constants.executionEnvironment !== "storeClient";
}

export function revenueCatUiIsReady() {
  if (!revenueCatPurchasesAreSupported()) {
    return false;
  }

  const hasPaywallModule =
    Boolean(NativeModules.RNPaywalls) &&
    UIManager.getViewManagerConfig("Paywall") != null;
  const hasCustomerCenterModule = Boolean(NativeModules.RNCustomerCenter);

  return hasPaywallModule && hasCustomerCenterModule;
}

export async function logInRevenueCat(appUserID: string) {
  if (!revenueCatIsReady()) {
    return null;
  }

  return Purchases.logIn(appUserID);
}

export async function logOutRevenueCat() {
  if (!revenueCatIsReady()) {
    return;
  }

  await Purchases.logOut();
}

export async function getRevenueCatOfferings() {
  if (!revenueCatIsReady()) {
    return null;
  }

  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function getRevenueCatCustomerInfo() {
  if (!revenueCatIsReady()) {
    return null;
  }

  return Purchases.getCustomerInfo();
}

type RefreshRevenueCatCustomerInfoOptions = {
  retries?: number;
  retryDelayMs?: number;
  requiredEntitlementId?: string;
};

export async function refreshRevenueCatCustomerInfo(
  options?: RefreshRevenueCatCustomerInfoOptions,
) {
  if (!revenueCatIsReady()) {
    return null;
  }

  const retries = options?.retries ?? 3;
  const retryDelayMs = options?.retryDelayMs ?? 400;
  const canInvalidateCustomerInfoCache = revenueCatPurchasesAreSupported();

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    if (canInvalidateCustomerInfoCache) {
      try {
        await Purchases.invalidateCustomerInfoCache();
      } catch (error) {
        if (!isUnsupportedCustomerInfoCacheError(error)) {
          throw error;
        }
      }
    }

    const customerInfo = await Purchases.getCustomerInfo();

    if (
      !options?.requiredEntitlementId ||
      customerInfo.entitlements.active[options.requiredEntitlementId]
    ) {
      return customerInfo;
    }

    if (attempt < retries) {
      await wait(retryDelayMs);
    }
  }

  return Purchases.getCustomerInfo();
}

export async function purchaseRevenueCatPackage(pkg: PurchasesPackage) {
  if (!revenueCatIsReady()) {
    return null;
  }

  return Purchases.purchasePackage(pkg);
}

export async function restoreRevenueCatPurchases() {
  if (!revenueCatIsReady()) {
    return null;
  }

  return Purchases.restorePurchases();
}

export async function presentRevenueCatPaywall(
  offering?: PurchasesOffering | null,
) {
  if (!revenueCatUiIsReady()) {
    return null;
  }

  return RevenueCatUI.presentPaywall({
    offering: offering ?? undefined,
    displayCloseButton: true,
  });
}

export async function presentRevenueCatPaywallIfNeeded(
  offering?: PurchasesOffering | null,
) {
  if (!revenueCatUiIsReady()) {
    return null;
  }

  return RevenueCatUI.presentPaywallIfNeeded({
    requiredEntitlementIdentifier: CANILENDAR_PRO_ENTITLEMENT_ID,
    offering: offering ?? undefined,
    displayCloseButton: true,
  });
}

export async function presentRevenueCatCustomerCenter() {
  if (!revenueCatUiIsReady()) {
    return false;
  }

  await RevenueCatUI.presentCustomerCenter();
  return true;
}

export function hasActiveProEntitlement(customerInfo: CustomerInfo | null) {
  console.log("isPro", customerInfo?.entitlements.active);
  return Boolean(
    customerInfo?.entitlements.active[CANILENDAR_PRO_ENTITLEMENT_ID],
  );
}

export type RevenueCatOffering = PurchasesOffering | null;
export { PAYWALL_RESULT };
