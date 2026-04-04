import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts, Radius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  describePickupTime,
  formatDayNumber,
  formatWeekRange,
  getNextWeek,
  getPreviousWeek,
  getWeekDays,
  getWeekdayShortLabel,
  toDateKey,
} from '@/lib/date';
import type { AppointmentOccurrence } from '@/types/domain';

type WeekTableProps = {
  visibleWeekStart: Date;
  selectedDate: Date;
  getOccurrencesForDate: (date: Date) => AppointmentOccurrence[];
  onSelectDate: (date: Date) => void;
  onChangeWeek: (date: Date) => void;
};

const MAX_VISIBLE_ROWS = 3;
const DAY_ACCENTS = [
  { strong: '#B86A46', soft: '#F0D7C8' },
  { strong: '#9A7A28', soft: '#ECDDAD' },
  { strong: '#5B7C62', soft: '#D9E6DB' },
  { strong: '#347E72', soft: '#D1E8E3' },
  { strong: '#5E7FB1', soft: '#D7E1F0' },
  { strong: '#8B6BA7', soft: '#E1D6EA' },
  { strong: '#B35F6D', soft: '#F0D4DA' },
] as const;

function chunkOccurrences(occurrences: AppointmentOccurrence[]) {
  const rows: AppointmentOccurrence[][] = [];

  for (let index = 0; index < occurrences.length; index += 2) {
    rows.push(occurrences.slice(index, index + 2));
  }

  return rows;
}

export function WeekTable({
  visibleWeekStart,
  selectedDate,
  getOccurrencesForDate,
  onSelectDate,
  onChangeWeek,
}: WeekTableProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const weekDays = getWeekDays(visibleWeekStart);

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: palette.surfaceRaised, borderColor: palette.border },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeWeek(getPreviousWeek(visibleWeekStart))}
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: pressed ? palette.surfaceAccent : palette.surface,
              borderColor: pressed ? palette.borderStrong : palette.border,
            },
          ]}
        >
          <ThemedText style={styles.navLabel}>{'<'}</ThemedText>
        </Pressable>

        <View style={styles.headerCopy}>
          <ThemedText type="sectionTitle" style={styles.headerTitle}>
            {t('home.weekTable')}
          </ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            style={styles.headerRange}
          >
            {formatWeekRange(visibleWeekStart)}
          </ThemedText>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => onChangeWeek(getNextWeek(visibleWeekStart))}
          style={({ pressed }) => [
            styles.navButton,
            {
              backgroundColor: pressed ? palette.surfaceAccent : palette.surface,
              borderColor: pressed ? palette.borderStrong : palette.border,
            },
          ]}
        >
          <ThemedText style={styles.navLabel}>{'>'}</ThemedText>
        </Pressable>
      </View>

      <View style={styles.days}>
        {weekDays.map((date, index) => {
          const isSelected = toDateKey(date) === toDateKey(selectedDate);
          const occurrences = getOccurrencesForDate(date);
          const rows = chunkOccurrences(occurrences);
          const visibleRows = rows.slice(0, MAX_VISIBLE_ROWS);
          const hiddenCount = Math.max(occurrences.length - visibleRows.length * 2, 0);
          const accent = DAY_ACCENTS[index];

          return (
            <Pressable
              key={date.toISOString()}
              accessibilityRole="button"
              onPress={() => onSelectDate(date)}
              style={({ pressed }) => [
                styles.dayCard,
                {
                  backgroundColor: isSelected ? palette.surface : palette.surfaceRaised,
                  borderColor: isSelected ? accent.strong : palette.border,
                  borderWidth: isSelected ? 1.5 : 1,
                },
                pressed && !isSelected && { backgroundColor: palette.surfaceAccent },
              ]}
            >
              <View style={styles.dayHeader}>
                <View style={styles.dayHeaderMain}>
                  <View
                    style={[
                      styles.dayBadge,
                      {
                        backgroundColor: isSelected ? accent.strong : accent.soft,
                        borderColor: isSelected ? accent.strong : accent.soft,
                      },
                    ]}
                  >
                    <ThemedText
                      lightColor={isSelected ? palette.onAccent : accent.strong}
                      darkColor={isSelected ? palette.onAccent : accent.strong}
                      style={styles.dayBadgeText}
                    >
                      {getWeekdayShortLabel(date.getDay())}
                    </ThemedText>
                  </View>

                  <ThemedText type="defaultSemiBold" style={styles.dayNumber}>
                    {formatDayNumber(date)}
                  </ThemedText>
                </View>

                <ThemedText
                  lightColor={palette.textMuted}
                  darkColor={palette.textMuted}
                  style={styles.dayCount}
                >
                  {t('home.weekCount', { count: occurrences.length })}
                </ThemedText>
              </View>

              <View style={[styles.table, { borderColor: palette.border }]}>
                {rows.length === 0 ? (
                  <View style={[styles.emptyRow, { borderColor: palette.border }]}>
                    <ThemedText
                      lightColor={palette.textSubtle}
                      darkColor={palette.textSubtle}
                      style={styles.emptyLabel}
                    >
                      {t('home.weekEmpty')}
                    </ThemedText>
                  </View>
                ) : (
                  <>
                    {visibleRows.map((row, rowIndex) => (
                      <View
                        key={`${date.toISOString()}-${rowIndex}`}
                        style={[
                          styles.tableRow,
                          rowIndex > 0 && { borderTopColor: palette.border, borderTopWidth: 1 },
                        ]}
                      >
                        {[0, 1].map((columnIndex) => {
                          const occurrence = row[columnIndex];

                          return (
                            <View
                              key={`${date.toISOString()}-${rowIndex}-${columnIndex}`}
                              style={[
                                styles.tableCell,
                                columnIndex === 0 && {
                                  borderRightColor: palette.border,
                                  borderRightWidth: 1,
                                },
                              ]}
                            >
                              {occurrence ? (
                                <View style={styles.cellContent}>
                                  <ThemedText
                                    numberOfLines={1}
                                    type="defaultSemiBold"
                                    style={styles.cellTitle}
                                  >
                                    {occurrence.dog.name}
                                  </ThemedText>
                                  <ThemedText
                                    lightColor={palette.textSubtle}
                                    darkColor={palette.textSubtle}
                                    numberOfLines={1}
                                    style={styles.cellMeta}
                                  >
                                    {describePickupTime(
                                      occurrence.appointment,
                                      occurrence.startAt,
                                    )}
                                  </ThemedText>
                                </View>
                              ) : null}
                            </View>
                          );
                        })}
                      </View>
                    ))}

                    {hiddenCount > 0 ? (
                      <View
                        style={[
                          styles.moreRow,
                          {
                            backgroundColor: palette.surfaceAccent,
                            borderTopColor: palette.border,
                          },
                        ]}
                      >
                        <ThemedText
                          lightColor={palette.textMuted}
                          darkColor={palette.textMuted}
                          style={styles.moreLabel}
                        >
                          {t('home.weekMore', { count: hiddenCount })}
                        </ThemedText>
                      </View>
                    ) : null}
                  </>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.card,
    borderWidth: 1,
    gap: Spacing.md,
    padding: 18,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  headerCopy: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  headerTitle: {
    fontSize: 21,
    textAlign: 'center',
  },
  headerRange: {
    textAlign: 'center',
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
  days: {
    gap: Spacing.md,
  },
  dayCard: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dayHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  dayHeaderMain: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dayBadge: {
    borderWidth: 1,
    borderRadius: Radius.pill,
    minWidth: 44,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dayBadgeText: {
    fontFamily: Fonts.rounded,
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  dayNumber: {
    fontSize: 16,
  },
  dayCount: {
    fontFamily: Fonts.rounded,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'right',
  },
  table: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  cellContent: {
    gap: 1,
  },
  cellTitle: {
    fontSize: 13,
    lineHeight: 16,
  },
  cellMeta: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    lineHeight: 14,
  },
  emptyRow: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  emptyLabel: {
    fontSize: 12,
    lineHeight: 14,
  },
  moreRow: {
    alignItems: 'center',
    borderTopWidth: 1,
    justifyContent: 'center',
    minHeight: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  moreLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 11,
    lineHeight: 14,
  },
});
