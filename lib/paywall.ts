import type {
  PurchasesIntroPrice,
  PurchasesPackage,
} from "react-native-purchases";

import type { PaywallTrigger } from "@/types/domain";

type PaywallCopy = {
  title: string;
  body: string;
};

type PaywallPackageDetails = {
  title: string;
  cadence: string;
  description: string;
  note?: string;
  badgeLabel?: string;
  featured: boolean;
};

const PAYWALL_COPY: Record<PaywallTrigger, PaywallCopy> = {
  dog_limit: {
    title: "Unlock unlimited planning",
    body: "Free includes 1 dog profile. Upgrade to save unlimited dogs and keep your client list growing.",
  },
  appointment_limit: {
    title: "Unlock unlimited planning",
    body: "Free includes 1 appointment. Upgrade to schedule unlimited walks and recurring routes.",
  },
  onboarding: {
    title: "Unlock unlimited planning",
    body: "Upgrade when you need more than the first guided setup. Your initial dog and first appointment stay free.",
  },
  onboarding_complete: {
    title: "Keep the business side calm",
    body: "Your first dog and first appointment are live. Start Pro to keep adding clients, recurring walks, and reminders without hitting free-tier limits.",
  },
  settings: {
    title: "Unlock unlimited planning",
    body: "Go pro to unlock unlimited dogs and appointments with the same calm workflow.",
  },
};

function formatDuration(unit: string, count: number, short = false) {
  const normalizedUnit = unit.toLowerCase();
  const labels = {
    day: short ? "day" : count === 1 ? "day" : "days",
    week: short ? "week" : count === 1 ? "week" : "weeks",
    month: short ? "month" : count === 1 ? "month" : "months",
    year: short ? "year" : count === 1 ? "year" : "years",
  } as const;

  if (
    normalizedUnit !== "day" &&
    normalizedUnit !== "week" &&
    normalizedUnit !== "month" &&
    normalizedUnit !== "year"
  ) {
    return null;
  }

  return `${count}-${labels[normalizedUnit]}`;
}

export function isOnboardingTrialTrigger(trigger: PaywallTrigger) {
  return trigger === "onboarding_complete";
}

export function getPaywallCopy(trigger: PaywallTrigger) {
  return PAYWALL_COPY[trigger];
}

export function getIntroOfferLabel(introPrice: PurchasesIntroPrice | null) {
  if (!introPrice) {
    return null;
  }

  const duration = formatDuration(
    introPrice.periodUnit,
    introPrice.periodNumberOfUnits,
    true,
  );

  if (!duration) {
    return null;
  }

  return introPrice.price === 0
    ? `${duration} free trial`
    : `${duration} intro offer`;
}

export function getHeroTitle(
  trigger: PaywallTrigger,
  selectedIntroOfferLabel: string | null,
) {
  if (isOnboardingTrialTrigger(trigger) && selectedIntroOfferLabel) {
    return `Start your ${selectedIntroOfferLabel}`;
  }

  return getPaywallCopy(trigger).title;
}

function getPackageTitle(pkg: PurchasesPackage) {
  switch (pkg.packageType) {
    case "ANNUAL":
      return "Annual Pro";
    case "MONTHLY":
      return "Monthly Pro";
    case "WEEKLY":
      return "Weekly Pro";
    default:
      return pkg.product.title;
  }
}

function getPackageCadence(pkg: PurchasesPackage) {
  switch (pkg.packageType) {
    case "ANNUAL":
      return "per year";
    case "MONTHLY":
      return "per month";
    case "WEEKLY":
      return "per week";
    default:
      return pkg.product.subscriptionPeriod
        ? `every ${pkg.product.subscriptionPeriod}`
        : "subscription";
  }
}

export function getPackageDetails(
  pkg: PurchasesPackage,
  trigger: PaywallTrigger,
): PaywallPackageDetails {
  const onboardingTrigger = isOnboardingTrialTrigger(trigger);
  const introOfferLabel = getIntroOfferLabel(pkg.product.introPrice);
  const cadence = getPackageCadence(pkg);
  const featured = pkg.packageType === "ANNUAL";

  return {
    title: getPackageTitle(pkg),
    cadence,
    description: onboardingTrigger
      ? featured
        ? "Lower admin stress for full-time walkers with the best yearly value."
        : "Keep your routes flexible while you test the full workflow."
      : featured
        ? "Best value for regular walkers."
        : "Try pro with the smallest commitment.",
    note: onboardingTrigger
      ? introOfferLabel
        ? `${introOfferLabel}, then ${pkg.product.priceString} ${cadence}.`
        : `Then ${pkg.product.priceString} ${cadence}.`
      : undefined,
    badgeLabel: onboardingTrigger ? introOfferLabel ?? undefined : undefined,
    featured,
  };
}
