import { useTranslation } from "react-i18next";
import { Alert, Linking, Platform } from "react-native";

import {
  getMapsFallbackUrl,
  getGoogleMapsUrl,
  getSystemMapsUrl,
  getPhoneUrl,
} from "@/lib/contact-actions";

export function useDogContactActions() {
  const { t } = useTranslation();

  async function openUrlWithFallback(primaryUrl: string, fallbackUrl?: string) {
    try {
      if (await Linking.canOpenURL(primaryUrl)) {
        await Linking.openURL(primaryUrl);
        return true;
      }

      if (fallbackUrl && (await Linking.canOpenURL(fallbackUrl))) {
        await Linking.openURL(fallbackUrl);
        return true;
      }
    } catch {
      // Fall through to the caller-specific alert below.
    }

    return false;
  }

  async function openDogAddress(address: string) {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      return;
    }

    const systemMapsUrl = getSystemMapsUrl(trimmedAddress);
    const googleMapsUrl = getGoogleMapsUrl(trimmedAddress);
    const googleMapsFallbackUrl = getMapsFallbackUrl(trimmedAddress);

    const showMapsUnavailable = () => {
      Alert.alert(
        t("dogs.alerts.mapsUnavailableTitle"),
        t("dogs.alerts.mapsUnavailableBody"),
      );
    };

    Alert.alert(
      t("dogs.actions.chooseMapAppTitle"),
      t("dogs.actions.chooseMapAppBody"),
      [
        {
          text: Platform.OS === "ios" ? t("dogs.actions.appleMaps") : t("dogs.actions.maps"),
          onPress: async () => {
            const didOpen = await openUrlWithFallback(
              systemMapsUrl,
              googleMapsFallbackUrl,
            );

            if (!didOpen) {
              showMapsUnavailable();
            }
          },
        },
        {
          text: t("dogs.actions.googleMaps"),
          onPress: async () => {
            const didOpen = await openUrlWithFallback(
              googleMapsUrl,
              googleMapsFallbackUrl,
            );

            if (!didOpen) {
              showMapsUnavailable();
            }
          },
        },
        {
          text: t("common.cancel"),
          style: "cancel",
        },
      ],
      { cancelable: true },
    );
  }

  async function openDogOwnerPhone(ownerPhone: string) {
    const phoneUrl = getPhoneUrl(ownerPhone);

    if (!phoneUrl) {
      return;
    }

    const didOpen = await openUrlWithFallback(phoneUrl);

    if (!didOpen) {
      Alert.alert(
        t("dogs.alerts.phoneUnavailableTitle"),
        t("dogs.alerts.phoneUnavailableBody"),
      );
    }
  }

  return {
    openDogAddress,
    openDogOwnerPhone,
  };
}
