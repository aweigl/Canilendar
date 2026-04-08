import * as StoreReview from "expo-store-review";

const REVIEW_PROMPT_DELAY_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export function getReviewEligibilityTimestamp(anchorIso: string) {
  return new Date(
    new Date(anchorIso).getTime() + REVIEW_PROMPT_DELAY_MS,
  ).toISOString();
}

export async function isStoreReviewAvailable() {
  return StoreReview.isAvailableAsync();
}

export async function requestStoreReview() {
  await StoreReview.requestReview();
}
