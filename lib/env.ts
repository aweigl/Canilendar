import { Platform } from "react-native";

export const env = {
  revenueCatAppleApiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY ?? "",
  enableAppleAuth: process.env.EXPO_PUBLIC_ENABLE_APPLE_AUTH === "true",
  imprintUrl: process.env.EXPO_PUBLIC_IMPRINT_URL ?? "",
  privacyPolicyUrl: process.env.EXPO_PUBLIC_PRIVACY_POLICY_URL ?? "",
  privacyChoicesUrl: process.env.EXPO_PUBLIC_PRIVACY_CHOICES_URL ?? "",
  appScheme: "canilendar",
  isIos: Platform.OS === "ios",
};

export function isRevenueCatConfigured() {
  return env.isIos && env.revenueCatAppleApiKey.length > 0;
}

export function isAppleAuthEnabled() {
  return env.isIos && env.enableAppleAuth;
}

export function getHostedLegalUrl(value: string) {
  const normalizedValue = value.trim();

  if (!normalizedValue.startsWith("https://")) {
    return null;
  }

  return normalizedValue;
}
