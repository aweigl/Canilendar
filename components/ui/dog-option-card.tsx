import { Button, XStack, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Button
      onPress={onPress}
      pressStyle={{ opacity: 0.96 }}
      unstyled
      style={{
        alignItems: 'stretch',
        backgroundColor: selected ? palette.accentSoft : palette.surfaceRaised,
        borderColor: selected ? palette.accent : palette.border,
        borderRadius: Radius.card,
        borderWidth: 1,
        justifyContent: 'flex-start',
        minHeight: 0,
        paddingHorizontal: 18,
        paddingVertical: 18,
      }}>
      <YStack gap={Spacing.sm} width="100%">
        <XStack style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <ThemedText type="sectionTitle">{dog.name}</ThemedText>
          <ThemedText
            lightColor={selected ? palette.accentPressed : palette.textSubtle}
            darkColor={selected ? palette.onAccent : palette.textSubtle}
            type="eyebrow">
            {selected ? t('dogCard.selected') : t('dogCard.savedDog')}
          </ThemedText>
        </XStack>

        <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
          {t('dogCard.pickup', { value: dog.address })}
        </ThemedText>
        <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
          {t('dogCard.owner', { value: dog.ownerPhone })}
        </ThemedText>
        {dog.notes ? (
          <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} type="meta">
            {t('dogCard.notes', { value: dog.notes })}
          </ThemedText>
        ) : (
          <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} type="meta">
            {t('dogCard.noNotes')}
          </ThemedText>
        )}
      </YStack>
    </Button>
  );
}
