import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import {
  getMapsFallbackUrl,
  getMapsUrl,
  getPhoneUrl,
} from "@/lib/contact-actions";

export function useDogContactActions() {
  const { t } = useTranslation();

  async function openDogAddress(address: string) {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      return;
    }

    const primaryUrl = getMapsUrl(trimmedAddress);
    const fallbackUrl = getMapsFallbackUrl(trimmedAddress);

    try {
      if (await Linking.canOpenURL(primaryUrl)) {
        await Linking.openURL(primaryUrl);
        return;
      }

      if (await Linking.canOpenURL(fallbackUrl)) {
        await Linking.openURL(fallbackUrl);
        return;
      }
    } catch {
      // Fall through to the localized alert below.
    }

    Alert.alert(
      t("dogs.alerts.mapsUnavailableTitle"),
      t("dogs.alerts.mapsUnavailableBody"),
    );
  }

  async function openDogOwnerPhone(ownerPhone: string) {
    const phoneUrl = getPhoneUrl(ownerPhone);

    if (!phoneUrl) {
      return;
    }

    try {
      const canOpenPhone = await Linking.canOpenURL(phoneUrl);

      if (canOpenPhone) {
        await Linking.openURL(phoneUrl);
        return;
      }
    } catch {
      // Fall through to the localized alert below.
    }

    Alert.alert(
      t("dogs.alerts.phoneUnavailableTitle"),
      t("dogs.alerts.phoneUnavailableBody"),
    );
  }

  return {
    openDogAddress,
    openDogOwnerPhone,
  };
}
