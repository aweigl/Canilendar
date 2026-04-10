import { Platform } from "react-native";

function encodeValue(value: string) {
  return encodeURIComponent(value.trim());
}

export function getSystemMapsUrl(address: string) {
  const encodedAddress = encodeValue(address);

  if (Platform.OS === "ios") {
    return `http://maps.apple.com/?q=${encodedAddress}`;
  }

  if (Platform.OS === "android") {
    return `geo:0,0?q=${encodedAddress}`;
  }

  return getMapsFallbackUrl(address);
}

export function getGoogleMapsUrl(address: string) {
  const encodedAddress = encodeValue(address);

  if (Platform.OS === "ios") {
    return `comgooglemaps://?q=${encodedAddress}`;
  }

  return getMapsFallbackUrl(address);
}

export function getMapsFallbackUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeValue(address)}`;
}

export function sanitizePhoneNumber(phoneNumber: string) {
  const trimmedValue = phoneNumber.trim();

  if (!trimmedValue) {
    return "";
  }

  const hasLeadingPlus = trimmedValue.startsWith("+");
  const digitsOnly = trimmedValue.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  return hasLeadingPlus ? `+${digitsOnly}` : digitsOnly;
}

export function getPhoneUrl(phoneNumber: string) {
  const sanitizedValue = sanitizePhoneNumber(phoneNumber);

  if (!sanitizedValue) {
    return null;
  }

  return `tel:${sanitizedValue}`;
}
