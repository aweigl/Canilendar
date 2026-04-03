import { Platform } from 'react-native';

const accentLight = '#D88742';
const accentDark = '#F2B56D';

export const Colors = {
  light: {
    text: '#1F1A16',
    background: '#FFF8EF',
    backgroundMuted: '#F5EBDD',
    card: '#FFFDF8',
    border: '#E3D2BD',
    tint: accentLight,
    accent: accentLight,
    accentSoft: '#F4D7B4',
    onAccent: '#2F1D0D',
    muted: '#7C6A5E',
    icon: '#7C6A5E',
    success: '#2A7B5F',
    danger: '#B44B3C',
    tabIconDefault: '#7C6A5E',
    tabIconSelected: accentLight,
  },
  dark: {
    text: '#F7F0E7',
    background: '#191513',
    backgroundMuted: '#241F1C',
    card: '#221C19',
    border: '#4D4035',
    tint: accentDark,
    accent: accentDark,
    accentSoft: '#5C4831',
    onAccent: '#241608',
    muted: '#CBB8A4',
    icon: '#CBB8A4',
    success: '#7ED0A4',
    danger: '#F09685',
    tabIconDefault: '#9F8B78',
    tabIconSelected: accentDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
