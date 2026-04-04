import { Platform } from 'react-native';

const interRegular = 'Inter_400Regular';
const interMedium = 'Inter_500Medium';
const interSemiBold = 'Inter_600SemiBold';
const interBold = 'Inter_700Bold';
const manropeBold = 'Manrope_700Bold';

const lightAccent = '#8F6437';
const darkAccent = '#C89259';
const success = '#668D3A';
const info = '#347E72';
const danger = '#B86A46';
const support = '#5B7C62';

const lightPalette = {
  text: '#291608',
  textMuted: '#6B4422',
  textSubtle: '#8D6B4D',
  background: '#F8F1E6',
  surface: '#F4E6D2',
  surfaceRaised: '#FBF4EA',
  surfaceMuted: '#E8D7BE',
  surfaceAccent: '#F0E0CD',
  border: '#D8C0A2',
  borderStrong: '#C39A6E',
  accent: lightAccent,
  accentMuted: '#E6D0B3',
  accentSoft: '#F2E6D7',
  accentPressed: '#7A542E',
  onAccent: '#FFF8F1',
  success,
  successSoft: '#EEF3E8',
  onSuccess: '#23420D',
  danger,
  dangerSoft: '#F8ECE6',
  onDanger: '#64311D',
  info,
  infoSoft: '#E7F1EF',
  onInfo: '#123F38',
  support,
  supportSoft: '#EDF2ED',
  onSupport: '#1F3A26',
  icon: '#6B4422',
  shadow: 'rgba(54, 27, 2, 0.1)',
};

const darkPalette = {
  text: '#F7EBDD',
  textMuted: '#D7B99A',
  textSubtle: '#A98969',
  background: '#1C130D',
  surface: '#2A1E14',
  surfaceRaised: '#332419',
  surfaceMuted: '#3A281B',
  surfaceAccent: '#46301F',
  border: '#6F543A',
  borderStrong: '#98704A',
  accent: darkAccent,
  accentMuted: '#5E4226',
  accentSoft: '#493421',
  accentPressed: '#DEAB73',
  onAccent: '#201206',
  success: '#7BB83F',
  successSoft: '#283921',
  onSuccess: '#EAF6DD',
  danger: '#E0865D',
  dangerSoft: '#48291E',
  onDanger: '#FFF0E8',
  info: '#57C6B5',
  infoSoft: '#1C3937',
  onInfo: '#E7FBF7',
  support: '#7AA286',
  supportSoft: '#24362A',
  onSupport: '#E8F4EC',
  icon: '#D7B99A',
  shadow: 'rgba(0, 0, 0, 0.2)',
};

export const Colors = {
  light: {
    ...lightPalette,
    backgroundMuted: lightPalette.surfaceMuted,
    card: lightPalette.surface,
    tint: lightPalette.accent,
    accentSoft: lightPalette.accentSoft,
    muted: lightPalette.textMuted,
    tabIconDefault: lightPalette.textSubtle,
    tabIconSelected: lightPalette.accent,
  },
  dark: {
    ...darkPalette,
    backgroundMuted: darkPalette.surfaceMuted,
    card: darkPalette.surface,
    tint: darkPalette.accent,
    accentSoft: darkPalette.accentSoft,
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
  xxl: 40,
} as const;

export const Radius = {
  control: 18,
  controlLarge: 22,
  card: 28,
  hero: 32,
  pill: 999,
} as const;
