import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type AppButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
};

export function AppButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
}: AppButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const variants = {
    primary: {
      backgroundColor: palette.accent,
      textColor: palette.onAccent,
      borderColor: palette.accent,
    },
    secondary: {
      backgroundColor: palette.card,
      textColor: palette.text,
      borderColor: palette.border,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: palette.text,
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: palette.danger,
      textColor: '#FFF8F6',
      borderColor: palette.danger,
    },
  } as const;

  const currentVariant = variants[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: currentVariant.backgroundColor,
          borderColor: currentVariant.borderColor,
          opacity: disabled ? 0.5 : pressed ? 0.88 : 1,
        },
        style,
      ]}>
      <View style={styles.content}>
        <ThemedText
          lightColor={currentVariant.textColor}
          darkColor={currentVariant.textColor}
          style={styles.label}>
          {label}
        </ThemedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 18,
    borderWidth: 1,
    minHeight: 52,
    paddingHorizontal: 18,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
});
