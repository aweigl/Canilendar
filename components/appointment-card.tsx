import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { describeRecurrence, describeReminder, formatTimeLabel } from '@/lib/date';
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
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}>
        <View style={styles.row}>
          <View style={styles.timeBadge}>
            <ThemedText style={styles.timeLabel}>{formatTimeLabel(occurrence.startAt)}</ThemedText>
          </View>
          <View style={styles.content}>
            <ThemedText style={styles.name}>{occurrence.dog.name}</ThemedText>
            <ThemedText lightColor={palette.muted} darkColor={palette.muted} style={styles.meta}>
              {occurrence.appointment.kind.toUpperCase()} - {occurrence.dog.address}
            </ThemedText>
            <ThemedText lightColor={palette.muted} darkColor={palette.muted} style={styles.meta}>
              {describeRecurrence(occurrence.appointment)} -{' '}
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
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  timeBadge: {
    alignItems: 'center',
    backgroundColor: '#F6D28F',
    borderRadius: 18,
    justifyContent: 'center',
    minHeight: 58,
    minWidth: 74,
    paddingHorizontal: 10,
  },
  timeLabel: {
    color: '#3F2D12',
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
    lineHeight: 18,
  },
});
