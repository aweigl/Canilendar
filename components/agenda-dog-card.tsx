import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { describeRecurrence, formatTimeLabel } from '@/lib/date';
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
            borderColor: palette.support,
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
                backgroundColor: palette.supportSoft,
                borderColor: palette.support,
              },
            ]}>
            <ThemedText lightColor={palette.onSupport} darkColor={palette.onSupport} type="meta">
              {formatTimeLabel(occurrence.startAt)}
            </ThemedText>
          </View>
        </View>

        <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
          {occurrence.dog.address}
        </ThemedText>
        <ThemedText lightColor={palette.support} darkColor={palette.support} type="meta">
          {describeRecurrence(occurrence.appointment)}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: 6,
    padding: Spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
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
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
