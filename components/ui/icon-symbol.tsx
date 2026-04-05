import {
  Apple,
  ArrowRightCircle,
  BellRing,
  CalendarDays,
  CalendarPlus,
  ChevronRight,
  CirclePlus,
  CreditCard,
  Crown,
  Lock,
  Mail,
  PawPrint,
  Send,
  Settings,
  SquarePen,
  Trash2,
  UserRoundPlus,
  type LucideIcon,
} from "lucide-react-native";
import { type OpaqueColorValue, type StyleProp, type ViewStyle } from "react-native";

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

type IconWeight = "regular" | "medium" | "semibold" | "bold";

type IconMapping = Record<IconSymbolName, LucideIcon>;

const MAPPING = {
  "calendar.circle.fill": CalendarDays,
  "pawprint.circle.fill": PawPrint,
  "gearshape.fill": Settings,
  "chevron.right": ChevronRight,
  "plus.circle.fill": CirclePlus,
  "square.and.pencil": SquarePen,
  "trash.fill": Trash2,
  "envelope.fill": Mail,
  "apple.logo": Apple,
  "arrow.right.circle.fill": ArrowRightCircle,
  "person.crop.circle.badge.plus": UserRoundPlus,
  "paperplane.fill": Send,
  "calendar.badge.plus": CalendarPlus,
  "pawprint.fill": PawPrint,
  "bell.badge.fill": BellRing,
  "creditcard.fill": CreditCard,
  "lock.fill": Lock,
  "crown.fill": Crown,
} as IconMapping;

const STROKE_WIDTH_BY_WEIGHT: Record<IconWeight, number> = {
  regular: 1.9,
  medium: 2.1,
  semibold: 2.35,
  bold: 2.6,
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = "medium",
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: IconWeight;
}) {
  const Icon = MAPPING[name];

  return (
    <Icon
      absoluteStrokeWidth
      color={String(color)}
      size={size}
      style={style}
      strokeWidth={STROKE_WIDTH_BY_WEIGHT[weight]}
    />
  );
}
