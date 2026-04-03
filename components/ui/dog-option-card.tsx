import { Button, XStack, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { DogProfile } from '@/types/domain';

type DogOptionCardProps = {
  dog: DogProfile;
  selected: boolean;
  onPress: () => void;
};

export function DogOptionCard({ dog, selected, onPress }: DogOptionCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Button
      onPress={onPress}
      pressStyle={{ opacity: 0.96 }}
      style={{
        backgroundColor: selected ? palette.supportSoft : palette.surface,
        borderColor: selected ? palette.support : palette.border,
        borderRadius: Radius.card,
        borderWidth: 1.5,
        minHeight: 0,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
      }}>
      <YStack gap={Spacing.xs} width="100%">
        <XStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <ThemedText type="sectionTitle">{dog.name}</ThemedText>
          <ThemedText
            lightColor={selected ? palette.support : palette.textSubtle}
            darkColor={selected ? palette.support : palette.textSubtle}
            type="eyebrow">
            {selected ? 'Selected' : 'Saved dog'}
          </ThemedText>
        </XStack>

        <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
          Pickup: {dog.address}
        </ThemedText>
        <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
          Owner: {dog.ownerPhone}
        </ThemedText>
        {dog.notes ? (
          <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} type="meta">
            Notes: {dog.notes}
          </ThemedText>
        ) : (
          <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} type="meta">
            No extra notes saved for this dog.
          </ThemedText>
        )}
      </YStack>
    </Button>
  );
}
