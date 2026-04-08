import { router } from "expo-router";
import { useEffect } from "react";

import type { OnboardingStatus, PaywallTrigger } from "@/types/domain";

type UseAppRouteGuardsParams = {
  isAuthenticated: boolean;
  isLoaded: boolean;
  isReady: boolean;
  onboardingStatus: OnboardingStatus;
  pathname: string;
  pendingPaywallTrigger: PaywallTrigger | null;
  topSegment: string;
};

export function useAppRouteGuards({
  isAuthenticated,
  isLoaded,
  isReady,
  onboardingStatus,
  pathname,
  pendingPaywallTrigger,
  topSegment,
}: UseAppRouteGuardsParams) {
  useEffect(() => {
    if (!isReady || !isLoaded) {
      return;
    }

    const isWelcomeRoute = topSegment === "welcome";
    const isOnboardingRoute = topSegment === "onboarding";
    const isPaywallRoute = topSegment === "paywall";
    const isLegalRoute = topSegment === "legal";

    if (!isAuthenticated) {
      if (!isWelcomeRoute && !isLegalRoute) {
        router.replace("/welcome" as never);
      }
      return;
    }

    if (onboardingStatus !== "complete") {
      if (!isOnboardingRoute && !isLegalRoute) {
        router.replace("/onboarding" as never);
      }
      return;
    }

    if (
      isWelcomeRoute ||
      isOnboardingRoute ||
      (!pendingPaywallTrigger && isPaywallRoute)
    ) {
      router.replace("/(tabs)" as never);
    }
  }, [
    isAuthenticated,
    isLoaded,
    isReady,
    onboardingStatus,
    pendingPaywallTrigger,
    topSegment,
  ]);

  useEffect(() => {
    if (
      !isReady ||
      !isLoaded ||
      !isAuthenticated ||
      onboardingStatus !== "complete" ||
      !pendingPaywallTrigger ||
      pathname === "/paywall"
    ) {
      return;
    }

    router.push({
      pathname: "/paywall",
      params: { trigger: pendingPaywallTrigger },
    } as never);
  }, [
    isAuthenticated,
    isLoaded,
    isReady,
    onboardingStatus,
    pathname,
    pendingPaywallTrigger,
  ]);
}
