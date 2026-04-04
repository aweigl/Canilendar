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
      borderColor: palette.accentPressed,
    },
    secondary: {
      backgroundColor: palette.surfaceRaised,
      backgroundPressed: palette.surfaceAccent,
      textColor: palette.text,
      borderColor: palette.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      backgroundPressed: palette.surfaceAccent,
      textColor: palette.textMuted,
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: palette.danger,
      backgroundPressed: palette.onDanger,
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
          shadowColor: variant === 'ghost' ? 'transparent' : palette.shadow,
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
    minHeight: 54,
    paddingHorizontal: Spacing.lg,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.1,
  },
  icon: {
    marginRight: 6,
  },
});
