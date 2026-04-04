import { Platform } from "react-native";

export const env = {
  revenueCatAppleApiKey: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY ?? "",
  enableAppleAuth: process.env.EXPO_PUBLIC_ENABLE_APPLE_AUTH === "true",
  appScheme: "canilendar",
  isIos: Platform.OS === "ios",
};

export function isRevenueCatConfigured() {
  return env.isIos && env.revenueCatAppleApiKey.length > 0;
}

export function isAppleAuthEnabled() {
  return env.isIos && env.enableAppleAuth;
}
