import { addMonths, subMonths } from 'date-fns';
import { Pressable, StyleSheet, View } from 'react-native';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
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
    <ThemedView style={[styles.container, { borderColor: palette.border, backgroundColor: palette.surface }]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeMonth(subMonths(visibleMonth, 1))}
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: pressed ? palette.surfaceAccent : palette.surfaceMuted,
              borderColor: pressed ? palette.borderStrong : palette.border,
            },
          ]}>
          <ThemedText style={styles.navLabel}>{'<'}</ThemedText>
        </Pressable>
        <ThemedText type="sectionTitle" style={styles.monthLabel}>
          {formatMonthLabel(visibleMonth)}
        </ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeMonth(addMonths(visibleMonth, 1))}
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: pressed ? palette.surfaceAccent : palette.surfaceMuted,
              borderColor: pressed ? palette.borderStrong : palette.border,
            },
          ]}>
          <ThemedText style={styles.navLabel}>{'>'}</ThemedText>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAY_LABELS.map((label) => (
          <View key={label} style={styles.weekdayCell}>
            <ThemedText lightColor={palette.textSubtle} darkColor={palette.textSubtle} style={styles.weekdayLabel}>
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
                  !isSelected && pressed && { backgroundColor: palette.surfaceMuted },
                ]}>
                <ThemedText
                  lightColor={isSelected ? palette.onAccent : isInCurrentMonth ? palette.text : palette.textSubtle}
                  darkColor={isSelected ? palette.onAccent : isInCurrentMonth ? palette.text : palette.textSubtle}
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
    borderRadius: Radius.card,
    borderWidth: 1.5,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    alignItems: 'center',
    borderRadius: Radius.control,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  navLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 18,
  },
  monthLabel: {
    fontSize: 21,
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
    borderRadius: Radius.control,
    flex: 1,
    gap: 4,
    paddingVertical: 10,
  },
  dayNumber: {
    fontFamily: Fonts.rounded,
    fontSize: 16,
  },
  dot: {
    borderRadius: 99,
    height: 6,
    width: 6,
  },
});
