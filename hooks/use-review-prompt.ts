import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

import { posthog } from "@/lib/posthog";
import { isStoreReviewAvailable, requestStoreReview } from "@/lib/review";
import type { OnboardingStatus, ReviewPromptState } from "@/types/domain";

type UseReviewPromptParams = {
  isAuthenticated: boolean;
  isLoaded: boolean;
  isReady: boolean;
  onboardingStatus: OnboardingStatus;
  pathname: string;
  reviewPrompt: ReviewPromptState;
  topSegment: string;
  updateReviewPrompt: (partial: Partial<ReviewPromptState>) => void;
};

export function useReviewPrompt({
  isAuthenticated,
  isLoaded,
  isReady,
  onboardingStatus,
  pathname,
  reviewPrompt,
  topSegment,
  updateReviewPrompt,
}: UseReviewPromptParams) {
  const reviewCheckInFlightRef = useRef(false);
  const reviewSkipEventsRef = useRef(new Set<string>());

  const maybeRequestReview = useCallback(
    async (source: "app_foreground" | "route_change") => {
      if (
        reviewCheckInFlightRef.current ||
        !isReady ||
        !isLoaded ||
        !isAuthenticated ||
        onboardingStatus !== "complete" ||
        !reviewPrompt.eligibleAfter ||
        reviewPrompt.promptedAt
      ) {
        return;
      }

      const eligibleAfterMs = Date.parse(reviewPrompt.eligibleAfter);

      if (Number.isNaN(eligibleAfterMs) || eligibleAfterMs > Date.now()) {
        return;
      }

      const nowIso = new Date().toISOString();

      if (!reviewPrompt.eligibilityTrackedAt) {
        posthog.capture("review_prompt_eligible", {
          eligible_after: reviewPrompt.eligibleAfter,
          source,
        });
        updateReviewPrompt({
          eligibilityTrackedAt: nowIso,
          lastCheckedAt: nowIso,
        });
      }

      const isBlockedRoute =
        topSegment === "welcome" ||
        topSegment === "onboarding" ||
        topSegment === "paywall";

      if (isBlockedRoute) {
        const skipKey = `${source}:blocked_route:${pathname}:${reviewPrompt.eligibleAfter}`;

        if (!reviewSkipEventsRef.current.has(skipKey)) {
          reviewSkipEventsRef.current.add(skipKey);
          posthog.capture("review_prompt_skipped", {
            reason: "blocked_route",
            source,
            pathname,
          });
        }

        updateReviewPrompt({ lastCheckedAt: nowIso });
        return;
      }

      reviewCheckInFlightRef.current = true;

      try {
        const isAvailable = await isStoreReviewAvailable();

        if (!isAvailable) {
          const skipKey = `${source}:unavailable_api:${pathname}:${reviewPrompt.eligibleAfter}`;

          if (!reviewSkipEventsRef.current.has(skipKey)) {
            reviewSkipEventsRef.current.add(skipKey);
            posthog.capture("review_prompt_skipped", {
              reason: "unavailable_api",
              source,
              pathname,
            });
          }

          updateReviewPrompt({ lastCheckedAt: nowIso });
          return;
        }

        await requestStoreReview();
        const promptedAt = new Date().toISOString();

        posthog.capture("review_prompt_requested", {
          source,
          pathname,
        });
        updateReviewPrompt({
          promptedAt,
          lastCheckedAt: promptedAt,
          eligibilityTrackedAt: reviewPrompt.eligibilityTrackedAt ?? promptedAt,
        });
      } catch {
        const skipKey = `${source}:request_failed:${pathname}:${reviewPrompt.eligibleAfter}`;

        if (!reviewSkipEventsRef.current.has(skipKey)) {
          reviewSkipEventsRef.current.add(skipKey);
          posthog.capture("review_prompt_skipped", {
            reason: "request_failed",
            source,
            pathname,
          });
        }

        updateReviewPrompt({ lastCheckedAt: new Date().toISOString() });
      } finally {
        reviewCheckInFlightRef.current = false;
      }
    },
    [
      isAuthenticated,
      isLoaded,
      isReady,
      onboardingStatus,
      pathname,
      reviewPrompt,
      topSegment,
      updateReviewPrompt,
    ],
  );

  useEffect(() => {
    maybeRequestReview("route_change");
  }, [maybeRequestReview]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        maybeRequestReview("app_foreground");
      }
    });

    return () => {
      subscription.remove();
    };
  }, [maybeRequestReview]);
}
