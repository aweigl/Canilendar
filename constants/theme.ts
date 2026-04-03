import { Platform } from 'react-native';

const interRegular = 'Inter_400Regular';
const interMedium = 'Inter_500Medium';
const interSemiBold = 'Inter_600SemiBold';
const interBold = 'Inter_700Bold';
const manropeBold = 'Manrope_700Bold';

const lightAccent = '#B96E2C';
const darkAccent = '#D89A59';

const lightPalette = {
  text: '#2B1E14',
  textMuted: '#715C49',
  textSubtle: '#9B8570',
  background: '#FCF5EC',
  surface: '#FFFDF9',
  surfaceMuted: '#F3E8D9',
  surfaceAccent: '#F7E0BF',
  border: '#E3D1BF',
  borderStrong: '#CFAE87',
  accent: lightAccent,
  accentMuted: '#F4D6B2',
  accentPressed: '#9C581F',
  onAccent: '#FFF8F0',
  success: '#547F3A',
  successSoft: '#ECF4E5',
  onSuccess: '#F6FBF0',
  danger: '#B35738',
  dangerSoft: '#FBE9E1',
  onDanger: '#FFF4EE',
  info: '#2F7B79',
  infoSoft: '#E8F3F2',
  onInfo: '#F3FBFB',
  icon: '#715C49',
  shadow: 'rgba(84, 55, 28, 0.12)',
};

const darkPalette = {
  text: '#F5ECE2',
  textMuted: '#CDB9A5',
  textSubtle: '#A99380',
  background: '#181310',
  surface: '#211A16',
  surfaceMuted: '#2B221D',
  surfaceAccent: '#453422',
  border: '#4D3F34',
  borderStrong: '#775F4A',
  accent: darkAccent,
  accentMuted: '#5F4830',
  accentPressed: '#E5AB6A',
  onAccent: '#2B1B0C',
  success: '#90BF6F',
  successSoft: '#243020',
  onSuccess: '#13240B',
  danger: '#EE9A7B',
  dangerSoft: '#3F241C',
  onDanger: '#34170D',
  info: '#7EC3C0',
  infoSoft: '#1F3234',
  onInfo: '#102426',
  icon: '#CDB9A5',
  shadow: 'rgba(0, 0, 0, 0.24)',
};

export const Colors = {
  light: {
    ...lightPalette,
    backgroundMuted: lightPalette.surfaceMuted,
    card: lightPalette.surface,
    tint: lightPalette.accent,
    accentSoft: lightPalette.accentMuted,
    muted: lightPalette.textMuted,
    tabIconDefault: lightPalette.textSubtle,
    tabIconSelected: lightPalette.accent,
  },
  dark: {
    ...darkPalette,
    backgroundMuted: darkPalette.surfaceMuted,
    card: darkPalette.surface,
    tint: darkPalette.accent,
    accentSoft: darkPalette.accentMuted,
    muted: darkPalette.textMuted,
    tabIconDefault: darkPalette.textSubtle,
    tabIconSelected: darkPalette.accent,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: interRegular,
    serif: interSemiBold,
    rounded: interSemiBold,
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    display: manropeBold,
    title: manropeBold,
  },
  default: {
    sans: interRegular,
    serif: interSemiBold,
    rounded: interSemiBold,
    mono: 'monospace',
    display: manropeBold,
    title: manropeBold,
  },
  web: {
    sans: interRegular,
    serif: interSemiBold,
    rounded: interSemiBold,
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    display: manropeBold,
    title: manropeBold,
  },
});

export const FontWeights = {
  regular: interRegular,
  medium: interMedium,
  semibold: interSemiBold,
  bold: interBold,
  titleBold: manropeBold,
} as const;

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const Radius = {
  control: 18,
  controlLarge: 22,
  card: 28,
  hero: 32,
  pill: 999,
} as const;
