import { StyleSheet, type ViewStyle } from 'react-native';
import { Button } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
  icon?: IconSymbolName;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  icon,
}: AppButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const variants = {
    primary: {
      backgroundColor: palette.accent,
      backgroundPressed: palette.accentPressed,
      textColor: palette.onAccent,
      borderColor: palette.accent,
    },
    secondary: {
      backgroundColor: palette.surface,
      backgroundPressed: palette.surfaceMuted,
      textColor: palette.text,
      borderColor: palette.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      backgroundPressed: palette.surfaceMuted,
      textColor: palette.text,
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: palette.danger,
      backgroundPressed: palette.danger,
      textColor: palette.onDanger,
      borderColor: palette.danger,
    },
  } as const;

  const currentVariant = variants[variant];
  const iconColor = disabled ? palette.textSubtle : currentVariant.textColor;

  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      pressStyle={{
        background: disabled ? palette.surfaceMuted : currentVariant.backgroundPressed,
      }}
      unstyled
      style={[
        styles.button,
        {
          backgroundColor: disabled ? palette.surfaceMuted : currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          borderRadius: Radius.controlLarge,
          borderWidth: 1,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}>
      {icon ? <IconSymbol name={icon} size={18} color={iconColor} style={styles.icon} /> : null}
      <ThemedText
        lightColor={iconColor}
        darkColor={iconColor}
        style={styles.label}>
        {label}
      </ThemedText>
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: Spacing.lg,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 20,
  },
  icon: {
    marginRight: 6,
  },
});
