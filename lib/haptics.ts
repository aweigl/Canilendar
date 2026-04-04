import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

function canUseHaptics() {
  return Platform.OS !== "web";
}

export async function triggerImpact(
  style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
) {
  if (!canUseHaptics()) {
    return;
  }

  try {
    await Haptics.impactAsync(style);
  } catch {
    // Ignore unsupported haptics environments.
  }
}

export async function triggerNotification(
  type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success,
) {
  if (!canUseHaptics()) {
    return;
  }

  try {
    await Haptics.notificationAsync(type);
  } catch {
    // Ignore unsupported haptics environments.
  }
}
