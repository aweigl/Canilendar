import { env, getHostedLegalUrl } from "@/lib/env";

export const APPLE_SUBSCRIPTIONS_URL =
  "https://apps.apple.com/account/subscriptions";

export const legalProfile = {
  appName: "Canilendar",
  controllerName: "Aaron Weigl",
  streetAddress: "Am Schmidtgrund 112",
  postalCode: "50765",
  city: "Köln",
  country: "Deutschland",
  email: "info@aaron-weigl.de",
  managingDirector: "",
  commercialRegister: "",
  vatId: "",
  profession: "",
  supervisoryAuthority:
    "BFDI - Bundesbeauftragte für den Datenschutz und die Informationsfreiheit",
  lastUpdated: "2026-04-05",
} as const;

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
