import { env, getHostedLegalUrl } from "@/lib/env";

export const APPLE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";
const PLACEHOLDER_PREFIX = "YOUR_";

export const legalProfile = {
  appName: "Canilendar",
  controllerName: "YOUR_FULL_LEGAL_NAME",
  businessName: "YOUR_COMPANY_NAME",
  streetAddress: "YOUR_STREET_AND_NUMBER",
  postalCode: "YOUR_POSTAL_CODE",
  city: "YOUR_CITY",
  country: "Germany",
  email: "YOUR_PRIVACY_EMAIL@example.com",
  phone: "YOUR_PUBLIC_PHONE_NUMBER",
  website: "YOUR_PUBLIC_WEBSITE",
  managingDirector: "",
  commercialRegister: "",
  vatId: "",
  profession: "",
  supervisoryAuthority:
    "YOUR_COMPETENT_DATA_PROTECTION_AUTHORITY",
  lastUpdated: "2026-04-05",
} as const;

function hasPlaceholder(value: string) {
  return value.startsWith(PLACEHOLDER_PREFIX);
}

export function legalProfileNeedsAttention() {
  return [
    legalProfile.controllerName,
    legalProfile.businessName,
    legalProfile.streetAddress,
    legalProfile.postalCode,
    legalProfile.city,
    legalProfile.email,
    legalProfile.phone,
    legalProfile.website,
    legalProfile.supervisoryAuthority,
  ].some(hasPlaceholder);
}

export function getImprintUrl() {
  return getHostedLegalUrl(env.imprintUrl);
}

export function getPrivacyPolicyUrl() {
  return getHostedLegalUrl(env.privacyPolicyUrl);
}

export function getPrivacyChoicesUrl() {
  return getHostedLegalUrl(env.privacyChoicesUrl);
}

export function getLegalMailToUrl(subject: string) {
  return `mailto:${legalProfile.email}?subject=${encodeURIComponent(subject)}`;
}
