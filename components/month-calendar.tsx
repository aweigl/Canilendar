import { addMonths, subMonths } from 'date-fns';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import {
  formatDayNumber,
  formatMonthLabel,
  getWeekdayShortLabels,
  getMonthGrid,
  isCurrentMonthDay,
  toDateKey,
} from '@/lib/date';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';

type MonthCalendarProps = {
  selectedDate: Date;
  visibleMonth: Date;
  markedDates: Set<string>;
  onSelectDate: (date: Date) => void;
  onChangeMonth: (date: Date) => void;
};

const DAY_ACCENTS = [
  { strong: '#B86A46', soft: '#F0D7C8' },
  { strong: '#9A7A28', soft: '#ECDDAD' },
  { strong: '#5B7C62', soft: '#D9E6DB' },
  { strong: '#347E72', soft: '#D1E8E3' },
  { strong: '#5E7FB1', soft: '#D7E1F0' },
  { strong: '#8B6BA7', soft: '#E1D6EA' },
  { strong: '#B35F6D', soft: '#F0D4DA' },
] as const;

export function MonthCalendar({
  selectedDate,
  visibleMonth,
  markedDates,
  onSelectDate,
  onChangeMonth,
}: MonthCalendarProps) {
  useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const weeks = getMonthGrid(visibleMonth);
  const weekdayLabels = getWeekdayShortLabels();

  return (
    <ThemedView
      style={[
        styles.container,
        { borderColor: palette.border, backgroundColor: palette.surfaceRaised },
      ]}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeMonth(subMonths(visibleMonth, 1))}
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: pressed ? palette.surfaceAccent : palette.surface,
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
              backgroundColor: pressed ? palette.surfaceAccent : palette.surface,
              borderColor: pressed ? palette.borderStrong : palette.border,
            },
          ]}>
          <ThemedText style={styles.navLabel}>{'>'}</ThemedText>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {weekdayLabels.map((label) => (
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
            const accent = DAY_ACCENTS[date.getDay()];

            return (
              <Pressable
                key={date.toISOString()}
                accessibilityRole="button"
                onPress={() => onSelectDate(date)}
                style={({ pressed }) => [
                  styles.dayCell,
                  isSelected && {
                    backgroundColor: accent.soft,
                    borderColor: accent.strong,
                    borderWidth: 1.5,
                  },
                  !isSelected && pressed && { backgroundColor: palette.surfaceAccent },
                ]}>
                <ThemedText
                  lightColor={isSelected ? accent.strong : isInCurrentMonth ? palette.text : palette.textSubtle}
                  darkColor={isSelected ? accent.strong : isInCurrentMonth ? palette.text : palette.textSubtle}
                  style={styles.dayNumber}>
                  {formatDayNumber(date)}
                </ThemedText>
                <View
                  style={[
                    styles.dot,
                    {
                      opacity: isMarked ? 1 : 0,
                      backgroundColor: accent.strong,
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
    borderWidth: 1,
    padding: 20,
    gap: Spacing.md,
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
    marginTop: 2,
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
    borderColor: 'transparent',
    borderRadius: Radius.control,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    paddingVertical: 12,
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
