import { StyleSheet } from 'react-native';
import { Button } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type ChoiceChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function ChoiceChip({ label, selected, onPress }: ChoiceChipProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Button
      onPress={onPress}
      pressStyle={{ background: palette.surfaceMuted, opacity: 0.92 }}
      unstyled
      style={[
        styles.chip,
        {
          backgroundColor: selected ? palette.accentMuted : palette.surface,
          borderColor: selected ? palette.accent : palette.border,
          borderRadius: Radius.pill,
          borderWidth: 1.5,
        },
      ]}>
      <ThemedText
        lightColor={selected ? palette.accent : palette.text}
        darkColor={selected ? palette.accent : palette.text}
        style={styles.label}>
        {selected ? `✓ ${label}` : label}
      </ThemedText>
    </Button>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.md,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    lineHeight: 18,
  },
});
