import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

export type IconSymbolName =
  | "calendar.circle.fill"
  | "pawprint.circle.fill"
  | "gearshape.fill"
  | "chevron.right"
  | "plus.circle.fill"
  | "square.and.pencil"
  | "trash.fill"
  | "envelope.fill"
  | "apple.logo"
  | "arrow.right.circle.fill"
  | "person.crop.circle.badge.plus"
  | "paperplane.fill"
  | "calendar.badge.plus"
  | "pawprint.fill"
  | "bell.badge.fill"
  | "creditcard.fill"
  | "lock.fill"
  | "crown.fill";

type IconMapping = Record<
  IconSymbolName,
  ComponentProps<typeof MaterialCommunityIcons>["name"]
>;
const MAPPING = {
  "calendar.circle.fill": "calendar-month",
  "pawprint.circle.fill": "paw",
  "gearshape.fill": "cog",
  "chevron.right": "chevron-right",
  "plus.circle.fill": "plus-circle",
  "square.and.pencil": "square-edit-outline",
  "trash.fill": "trash-can",
  "envelope.fill": "email",
  "apple.logo": "apple",
  "arrow.right.circle.fill": "arrow-right-circle",
  "person.crop.circle.badge.plus": "account-plus",
  "paperplane.fill": "send",
  "calendar.badge.plus": "calendar-plus",
  "pawprint.fill": "paw",
  "bell.badge.fill": "bell-badge",
  "creditcard.fill": "credit-card",
  "lock.fill": "lock",
  "crown.fill": "crown",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: "regular" | "medium" | "semibold" | "bold";
}) {
  return (
    <MaterialCommunityIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style}
    />
  );
}
