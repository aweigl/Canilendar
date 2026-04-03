import { addMonths, subMonths } from 'date-fns';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import {
  formatDayNumber,
  formatMonthLabel,
  getMonthGrid,
  isCurrentMonthDay,
  toDateKey,
} from '@/lib/date';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type MonthCalendarProps = {
  selectedDate: Date;
  visibleMonth: Date;
  markedDates: Set<string>;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
};

export function MonthCalendar({
  selectedDate,
  visibleMonth,
  markedDates,
  onSelectDate,
  onChangeMonth,
}: MonthCalendarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const weeks = getMonthGrid(visibleMonth);

  return (
    <ThemedView style={[styles.container, { borderColor: palette.border, backgroundColor: palette.card }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeMonth(subMonths(visibleMonth, 1))}
          style={({ pressed }) => [
            styles.navButton,
            { backgroundColor: pressed ? palette.accentSoft : palette.backgroundMuted },
          ]}>
          <ThemedText style={styles.navLabel}>{'<'}</ThemedText>
        </Pressable>
        <ThemedText style={styles.monthLabel}>{formatMonthLabel(visibleMonth)}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeMonth(addMonths(visibleMonth, 1))}
          style={({ pressed }) => [
            styles.navButton,
            { backgroundColor: pressed ? palette.accentSoft : palette.backgroundMuted },
          ]}>
          <ThemedText style={styles.navLabel}>{'>'}</ThemedText>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.weekdayCell}>
            <ThemedText lightColor={palette.muted} darkColor={palette.muted} style={styles.weekdayLabel}>
              {label}
            </ThemedText>
          </View>
        ))}
      </View>

      {weeks.map((week) => (
        <View key={week[0].toISOString()} style={styles.weekRow}>
          {week.map((date) => {
            const isSelected = toDateKey(date) === toDateKey(selectedDate);
            const isInCurrentMonth = isCurrentMonthDay(date, visibleMonth);
            const isMarked = markedDates.has(toDateKey(date));

            return (
              <Pressable
                key={date.toISOString()}
                accessibilityRole="button"
                onPress={() => onSelectDate(date)}
                style={({ pressed }) => [
                  styles.dayCell,
                  isSelected && { backgroundColor: palette.accent },
                  !isSelected && pressed && { backgroundColor: palette.backgroundMuted },
                ]}>
                <ThemedText
                  lightColor={isSelected ? palette.onAccent : isInCurrentMonth ? palette.text : palette.muted}
                  darkColor={isSelected ? palette.onAccent : isInCurrentMonth ? palette.text : palette.muted}
                  style={styles.dayNumber}>
                  {formatDayNumber(date)}
                </ThemedText>
                <View
                  style={[
                    styles.dot,
                    {
                      opacity: isMarked ? 1 : 0,
                      backgroundColor: isSelected ? palette.onAccent : palette.accent,
                    },
                  ]}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 18,
    gap: 12,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: 14,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  navLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  monthLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayCell: {
    flex: 1,
  },
  weekdayLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    alignItems: 'center',
    borderRadius: 18,
    flex: 1,
    gap: 4,
    paddingVertical: 10,
  },
  dayNumber: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
    fontWeight: '700',
  },
  dot: {
    borderRadius: 99,
    height: 6,
    width: 6,
  },
});
