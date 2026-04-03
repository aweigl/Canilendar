import { type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'tamagui';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = ComponentProps<typeof Text> & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | 'default'
    | 'title'
    | 'display'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'sectionTitle'
    | 'eyebrow'
    | 'meta'
    | 'link'
    | 'caption';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'display' ? styles.display : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'sectionTitle' ? styles.sectionTitle : undefined,
        type === 'eyebrow' ? styles.eyebrow : undefined,
        type === 'meta' ? styles.meta : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'caption' ? styles.caption : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontFamily: Fonts.title,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.6,
  },
  display: {
    fontFamily: Fonts.title,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontFamily: Fonts.title,
    fontSize: 20,
    lineHeight: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.title,
    fontSize: 22,
    lineHeight: 26,
  },
  eyebrow: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  meta: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  link: {
    fontFamily: Fonts.sans,
    lineHeight: 30,
    fontSize: 16,
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
});
