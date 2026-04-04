import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { describePickupTime, describeRecurrence, describeReminder } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { AppointmentOccurrence } from '@/types/domain';

type AppointmentCardProps = {
  occurrence: AppointmentOccurrence;
  onPress?: () => void;
};

export function AppointmentCard({ occurrence, onPress }: AppointmentCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
      <ThemedView
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}>
        <View style={styles.row}>
          <View
            style={[
              styles.timeBadge,
              {
                backgroundColor: palette.accentMuted,
                borderColor: palette.accent,
              },
            ]}>
            <ThemedText lightColor={palette.accentPressed} darkColor={palette.onAccent} style={styles.timeLabel}>
              {describePickupTime(occurrence.appointment, occurrence.startAt)}
            </ThemedText>
          </View>
          <View style={styles.content}>
            <ThemedText type="sectionTitle" style={styles.name}>
              {occurrence.dog.name}
            </ThemedText>
            <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted} style={styles.meta}>
              {occurrence.dog.address}
            </ThemedText>
            <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} style={styles.meta}>
              {describeRecurrence(occurrence.appointment)} ·{' '}
              {describeReminder(occurrence.appointment.reminderMinutesBefore)}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: Spacing.md,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  timeBadge: {
    alignItems: 'center',
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 72,
    minWidth: 84,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  timeLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 17,
    lineHeight: 22,
  },
  content: {
    flex: 1,
    gap: 4,
    paddingTop: 2,
  },
  name: {
    fontSize: 21,
  },
  meta: {
    fontSize: 14,
    lineHeight: 18,
  },
});
