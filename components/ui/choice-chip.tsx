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
      pressStyle={{
        background: selected ? palette.accent : palette.surfaceAccent,
        opacity: 0.92,
      }}
      unstyled
      style={[
        styles.chip,
        {
          backgroundColor: selected ? palette.accentMuted : palette.surfaceRaised,
          borderColor: selected ? palette.accent : palette.border,
          borderRadius: Radius.pill,
          borderWidth: 1,
        },
      ]}>
      <ThemedText
        lightColor={selected ? palette.accentPressed : palette.text}
        darkColor={selected ? palette.onAccent : palette.text}
        style={styles.label}>
        {label}
      </ThemedText>
    </Button>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 18,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 14,
    lineHeight: 18,
  },
});
