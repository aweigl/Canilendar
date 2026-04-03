import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

export type IconSymbolName =
  | 'calendar.circle.fill'
  | 'pawprint.circle.fill'
  | 'gearshape.fill'
  | 'chevron.right'
  | 'plus.circle.fill'
  | 'square.and.pencil'
  | 'trash.fill';

type IconMapping = Record<IconSymbolName, ComponentProps<typeof MaterialCommunityIcons>['name']>;
const MAPPING = {
  'calendar.circle.fill': 'calendar-month',
  'pawprint.circle.fill': 'paw',
  'gearshape.fill': 'cog',
  'chevron.right': 'chevron-right',
  'plus.circle.fill': 'plus-circle',
  'square.and.pencil': 'square-edit-outline',
  'trash.fill': 'trash-can',
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
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
}) {
  return <MaterialCommunityIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
