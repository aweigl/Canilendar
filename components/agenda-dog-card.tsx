import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { describePickupTime, describeRecurrence } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { AppointmentOccurrence } from '@/types/domain';

type AgendaDogCardProps = {
  occurrence: AppointmentOccurrence;
  onPress?: () => void;
};

export function AgendaDogCard({ occurrence, onPress }: AgendaDogCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }]}>
      <ThemedView
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}>
        <View style={styles.header}>
          <ThemedText type="sectionTitle" style={styles.name}>
            {occurrence.dog.name}
          </ThemedText>
          <View
            style={[
              styles.timePill,
              {
                backgroundColor: palette.accentMuted,
                borderColor: palette.accent,
              },
            ]}>
            <ThemedText lightColor={palette.accentPressed} darkColor={palette.onAccent} type="meta">
              {describePickupTime(occurrence.appointment, occurrence.startAt)}
            </ThemedText>
          </View>
        </View>

        <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
          {occurrence.dog.address}
        </ThemedText>
        <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} type="meta">
          {describeRecurrence(occurrence.appointment)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.sm,
    padding: 18,
  },
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  name: {
    flex: 1,
    fontSize: 22,
    lineHeight: 26,
    marginRight: Spacing.xs,
  },
  timePill: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
});
