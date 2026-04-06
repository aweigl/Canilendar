import { appleAuth } from "@invertase/react-native-apple-authentication";
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
import { Platform } from "react-native";
import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";
import Purchases from "react-native-purchases";

import { isAppleAuthEnabled, isRevenueCatConfigured } from "@/lib/env";
import { clearScheduledNotifications } from "@/lib/notifications";
import { posthog } from "@/lib/posthog";
import {
  CANILENDAR_PRO_ENTITLEMENT_ID,
  configureRevenueCat,
  getRevenueCatCustomerInfo,
  getRevenueCatOfferings,
  hasActiveProEntitlement,
  logInRevenueCat,
  logOutRevenueCat,
  presentRevenueCatCustomerCenter,
  purchaseRevenueCatPackage,
  refreshRevenueCatCustomerInfo,
  revenueCatPurchasesAreSupported,
  revenueCatUiIsReady,
  type RevenueCatOffering,
} from "@/lib/revenuecat";
import {
  clearAuthSession,
  clearScopedPersistedState,
  loadAuthSession,
  persistAuthSession,
} from "@/lib/storage";
import type {
  AuthSession,
  PaywallTrigger,
  SubscriptionStatus,
} from "@/types/domain";

type RefreshSubscriptionStateOptions = {
  forceCustomerInfo?: boolean;
  requiredEntitlementId?: string;
};

type AppSessionContextValue = {
  authUser: AuthSession | null;
  subscriptionStatus: SubscriptionStatus;
  isReady: boolean;
  isAppleAuthEnabled: boolean;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isRevenueCatReady: boolean;
  isRevenueCatPurchaseSupported: boolean;
  isPro: boolean;
  currentOffering: RevenueCatOffering;
  customerInfo: CustomerInfo | null;
  pendingPaywallTrigger: PaywallTrigger | null;
  signInWithApple: () => Promise<string | null>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<string | null>;
  refreshSubscriptionState: (
    options?: RefreshSubscriptionStateOptions,
  ) => Promise<void>;
  purchasePackage: (pkg: PurchasesPackage) => Promise<string | null>;
  openCustomerCenter: () => Promise<string | null>;
  presentPaywall: (trigger: PaywallTrigger) => void;
  clearPaywall: () => void;
};

const AppSessionContext = createContext<AppSessionContextValue | undefined>(
  undefined,
);

export function AppSessionProvider({ children }: PropsWithChildren) {
  const [authUser, setAuthUser] = useState<AuthSession | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isRevenueCatLoaded, setIsRevenueCatLoaded] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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
  const appleAuthEnabled = isAppleAuthEnabled();
  const isRevenueCatPurchaseSupported = revenueCatPurchasesAreSupported();
  const isRevenueCatUiReady = revenueCatUiIsReady();
  const isPro = hasActiveProEntitlement(customerInfo);
  const isAuthenticated = !appleAuthEnabled || authUser !== null;
  const isReady = isAuthReady && isRevenueCatLoaded;

  const applySubscriptionState = useCallback(
    (
      nextCustomerInfo: CustomerInfo | null,
      nextOffering?: RevenueCatOffering,
    ) => {
      setCustomerInfo(nextCustomerInfo);

      if (nextOffering !== undefined) {
        setCurrentOffering(nextOffering);
      }

      setSubscriptionStatus(
        hasActiveProEntitlement(nextCustomerInfo) ? "active" : "inactive",
      );
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    async function bootstrapAuth() {
      if (!appleAuthEnabled) {
        if (isMounted) {
          setAuthUser(null);
          setIsAuthReady(true);
        }
        return;
      }

      try {
        const persistedSession = await loadAuthSession();
        let nextAuthUser = persistedSession;

        if (
          persistedSession &&
          Platform.OS === "ios" &&
          appleAuth.isSupported
        ) {
          try {
            const credentialState = await appleAuth.getCredentialStateForUser(
              persistedSession.appleUserId,
            );

            if (credentialState !== appleAuth.State.AUTHORIZED) {
              await clearAuthSession();
              nextAuthUser = null;
            }
          } catch {
            // Simulators can throw here; keep the persisted session.
          }
        }

        if (!isMounted) {
          return;
        }

        setAuthUser(nextAuthUser);
      } catch (error) {
        console.warn("Unable to restore Apple session", error);
        if (!isMounted) {
          return;
        }

        setAuthUser(null);
      } finally {
        if (isMounted) {
          setIsAuthReady(true);
        }
      }
    }

    void bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, [appleAuthEnabled]);

  useEffect(() => {
    if (!isAuthReady) {
      return;
    }

    let isMounted = true;
    setIsRevenueCatLoaded(false);
    setSubscriptionStatus("loading");

    async function bootstrapRevenueCat() {
      await configureRevenueCat();

      if (!isRevenueCatReady) {
        if (!isMounted) {
          return;
        }

        setCurrentOffering(null);
        setCustomerInfo(null);
        setSubscriptionStatus("unavailable");
        setIsRevenueCatLoaded(true);
        return;
      }

      try {
        if (authUser) {
          await logInRevenueCat(authUser.revenueCatAppUserId);
        } else {
          await logOutRevenueCat();
        }

        const [customerInfo, offering] = await Promise.all([
          getRevenueCatCustomerInfo(),
          getRevenueCatOfferings(),
        ]);

        if (!isMounted) {
          return;
        }

        applySubscriptionState(customerInfo, offering);
      } catch (error) {
        console.warn("Unable to load RevenueCat state", error);
        if (!isMounted) {
          return;
        }

        setCurrentOffering(null);
        setCustomerInfo(null);
        setSubscriptionStatus("unavailable");
      } finally {
        if (isMounted) {
          setIsRevenueCatLoaded(true);
        }
      }
    }

    void bootstrapRevenueCat();

    return () => {
      isMounted = false;
    };
  }, [applySubscriptionState, authUser, isAuthReady, isRevenueCatReady]);

  useEffect(() => {
    if (!isRevenueCatReady || !authUser) {
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
  }, [applySubscriptionState, authUser, isRevenueCatReady]);

  const signInWithApple = useCallback(async () => {
    if (!appleAuthEnabled) {
      return "Sign in with Apple is disabled for this build.";
    }

    if (Platform.OS !== "ios" || !appleAuth.isSupported) {
      return "Sign in with Apple is only available on iPhone and iPad.";
    }

    setIsAuthenticating(true);

    try {
      const response = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        user: authUser?.appleUserId,
      });
      const nextEmail =
        response.email?.trim().toLowerCase() ??
        (authUser?.appleUserId === response.user ? authUser.email : null);
      const nextAuthUser: AuthSession = {
        provider: "apple",
        appleUserId: response.user,
        revenueCatAppUserId: response.user,
        email: nextEmail,
        givenName: response.fullName?.givenName ?? authUser?.givenName ?? null,
        familyName:
          response.fullName?.familyName ?? authUser?.familyName ?? null,
      };

      await persistAuthSession(nextAuthUser);

      posthog.identify(nextAuthUser.appleUserId, {
        $set: {
          email: nextAuthUser.email ?? "__UNKNOWN_email__",
          given_name: nextAuthUser.givenName ?? "__UNKNOWN_given_name__",
          family_name: nextAuthUser.familyName ?? "__UNKNOWN_family_name__",
        },
        $set_once: { first_sign_in_date: new Date().toISOString() },
      });
      posthog.capture("user_signed_in", {
        provider: "apple",
      });

      setPendingPaywallTrigger(null);
      setAuthUser(nextAuthUser);
      return null;
    } catch (error: any) {
      if (error?.code === appleAuth.Error.CANCELED) {
        return null;
      }

      return error instanceof Error ? error.message : "Apple sign-in failed.";
    } finally {
      setIsAuthenticating(false);
    }
  }, [appleAuthEnabled, authUser]);

  const signOut = useCallback(async () => {
    if (!appleAuthEnabled) {
      return;
    }

    posthog.capture("user_signed_out");
    posthog.reset();

    await clearAuthSession();
    if (isRevenueCatReady) {
      await logOutRevenueCat();
    }
    setPendingPaywallTrigger(null);
    setCurrentOffering(null);
    setCustomerInfo(null);
    setSubscriptionStatus("inactive");
    setAuthUser(null);
  }, [appleAuthEnabled, isRevenueCatReady]);

  const deleteAccount = useCallback(async () => {
    if (appleAuthEnabled && !authUser) {
      return "Sign in with Apple first.";
    }

    try {
      await clearScheduledNotifications();
      await clearScopedPersistedState(authUser?.appleUserId);
      await clearAuthSession();

      if (isRevenueCatReady) {
        await logOutRevenueCat();
      }

      posthog.capture("account_deleted");
      posthog.reset();

      setPendingPaywallTrigger(null);
      setCurrentOffering(null);
      setCustomerInfo(null);
      setSubscriptionStatus("inactive");
      setAuthUser(null);
      return null;
    } catch (error) {
      return error instanceof Error
        ? error.message
        : "Account deletion failed.";
    }
  }, [appleAuthEnabled, authUser, isRevenueCatReady]);

  const refreshSubscriptionState = useCallback(
    async (options?: RefreshSubscriptionStateOptions) => {
      if (appleAuthEnabled && !authUser) {
        setCurrentOffering(null);
        setCustomerInfo(null);
        setSubscriptionStatus("inactive");
        return;
      }

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
    [appleAuthEnabled, applySubscriptionState, authUser, isRevenueCatReady],
  );

  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage) => {
      if (appleAuthEnabled && !authUser) {
        return "Sign in with Apple first.";
      }

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
    [
      applySubscriptionState,
      appleAuthEnabled,
      authUser,
      isRevenueCatPurchaseSupported,
      isRevenueCatReady,
    ],
  );

  const openCustomerCenter = useCallback(async () => {
    if (appleAuthEnabled && !authUser) {
      return "Sign in with Apple first.";
    }

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
  }, [
    appleAuthEnabled,
    authUser,
    isRevenueCatReady,
    isRevenueCatUiReady,
    refreshSubscriptionState,
  ]);

  const value = useMemo<AppSessionContextValue>(
    () => ({
      authUser,
      subscriptionStatus,
      isReady,
      isAppleAuthEnabled: appleAuthEnabled,
      isAuthenticated,
      isAuthenticating,
      isRevenueCatReady,
      isRevenueCatPurchaseSupported,
      isPro,
      currentOffering,
      customerInfo,
      pendingPaywallTrigger,
      signInWithApple,
      signOut,
      deleteAccount,
      refreshSubscriptionState,
      purchasePackage,
      openCustomerCenter,
      presentPaywall: setPendingPaywallTrigger,
      clearPaywall: () => setPendingPaywallTrigger(null),
    }),
    [
      authUser,
      appleAuthEnabled,
      currentOffering,
      customerInfo,
      isAuthenticated,
      isAuthenticating,
      isPro,
      isReady,
      isRevenueCatPurchaseSupported,
      isRevenueCatReady,
      openCustomerCenter,
      pendingPaywallTrigger,
      purchasePackage,
      refreshSubscriptionState,
      deleteAccount,
      signInWithApple,
      signOut,
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
