import { env, getHostedLegalUrl } from "@/lib/env";

export const APPLE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";
const PLACEHOLDER_PREFIX = "YOUR_";

export const legalProfile = {
  appName: "Canilendar",
  controllerName: "Aaron Weigl",
  streetAddress: "Am Schmidtgrund 112",
  postalCode: "50765",
  city: "Köln",
  country: "Deutschland",
  email: "info@aaron-weigl.de",
  website: "YOUR_PUBLIC_WEBSITE",
  managingDirector: "",
  commercialRegister: "",
  vatId: "",
  profession: "",
  supervisoryAuthority:
    "BFDI - Bundesbeauftragte für den Datenschutz und die Informationsfreiheit",
  lastUpdated: "2026-04-05",
} as const;

function hasPlaceholder(value: string) {
  return value.startsWith(PLACEHOLDER_PREFIX);
}

export function legalProfileNeedsAttention() {
  return [
    legalProfile.controllerName,
    legalProfile.streetAddress,
    legalProfile.postalCode,
    legalProfile.city,
    legalProfile.email,
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
