import { Platform } from 'react-native';

const interRegular = 'Inter_400Regular';
const interMedium = 'Inter_500Medium';
const interSemiBold = 'Inter_600SemiBold';
const interBold = 'Inter_700Bold';
const manropeBold = 'Manrope_700Bold';

const lightAccent = '#8A5215';
const darkAccent = '#B97B3A';
const success = '#5A9422';
const info = '#2B9A84';
const danger = '#C96030';
const support = '#4E7A58';

const lightPalette = {
  text: '#291608',
  textMuted: '#6B4422',
  textSubtle: '#8D6B4D',
  background: '#FBF3E8',
  surface: '#F2DFC0',
  surfaceMuted: '#E7CFAC',
  surfaceAccent: '#F8E8D0',
  border: '#D1B48A',
  borderStrong: '#B9874D',
  accent: lightAccent,
  accentMuted: '#DFC09E',
  accentPressed: '#6E3F0D',
  onAccent: '#FFF7EF',
  success,
  successSoft: '#EEF6E8',
  onSuccess: '#23420D',
  danger,
  dangerSoft: '#FBF0EA',
  onDanger: '#5A250F',
  info,
  infoSoft: '#E8F4F2',
  onInfo: '#123F38',
  support,
  supportSoft: '#EFF4F0',
  onSupport: '#1F3A26',
  icon: '#6B4422',
  shadow: 'rgba(54, 27, 2, 0.16)',
};

const darkPalette = {
  text: '#F7EBDD',
  textMuted: '#D7B99A',
  textSubtle: '#A98969',
  background: '#1D130B',
  surface: '#2A1C11',
  surfaceMuted: '#382618',
  surfaceAccent: '#49311E',
  border: '#6B4A2B',
  borderStrong: '#8A5215',
  accent: darkAccent,
  accentMuted: '#5A3A1C',
  accentPressed: '#D69A5C',
  onAccent: '#201206',
  success: '#7BB83F',
  successSoft: '#223718',
  onSuccess: '#EAF6DD',
  danger: '#E0865D',
  dangerSoft: '#462519',
  onDanger: '#FFF0E8',
  info: '#57C6B5',
  infoSoft: '#183837',
  onInfo: '#E7FBF7',
  support: '#7AA286',
  supportSoft: '#203227',
  onSupport: '#E8F4EC',
  icon: '#D7B99A',
  shadow: 'rgba(0, 0, 0, 0.28)',
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
