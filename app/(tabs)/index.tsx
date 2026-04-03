import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/appointment-card';
import { LoadingView } from '@/components/loading-view';
import { MonthCalendar } from '@/components/month-calendar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { Colors, Fonts } from '@/constants/theme';
import { useCanilander } from '@/context/canilander-context';
import { formatLongDate } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const { isLoaded, getOccurrencesForDate, getMarkedDatesForMonth } = useCanilander();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleMonth, setVisibleMonth] = useState(new Date());

  if (!isLoaded) {
    return <LoadingView />;
  }

  const occurrences = getOccurrencesForDate(selectedDate);
  const markedDates = getMarkedDatesForMonth(visibleMonth);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={[styles.hero, { backgroundColor: palette.accent }]}>
          <View style={styles.heroCopy}>
            <ThemedText lightColor={palette.onAccent} darkColor={palette.onAccent} type="caption">
              DAILY DOG-WALK PLANNER
            </ThemedText>
            <ThemedText lightColor={palette.onAccent} darkColor={palette.onAccent} type="title">
              Canilander
            </ThemedText>
            <ThemedText lightColor={palette.onAccent} darkColor={palette.onAccent}>
              Stay on top of pickups, repeat walks, and today&apos;s route without leaving your phone
              calendar half-finished.
            </ThemedText>
          </View>
          <AppButton
            label="New appointment"
            onPress={() =>
              router.push({
                pathname: '/appointment',
                params: { date: selectedDate.toISOString() },
              } as never)
            }
            style={styles.heroButton}
          />
        </ThemedView>

        <MonthCalendar
          selectedDate={selectedDate}
          visibleMonth={visibleMonth}
          markedDates={markedDates}
          onChangeMonth={setVisibleMonth}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setVisibleMonth(date);
          }}
        />

        <View style={styles.sectionHeader}>
          <View>
            <ThemedText style={styles.sectionTitle}>Agenda</ThemedText>
            <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
              {formatLongDate(selectedDate)}
            </ThemedText>
          </View>
          <ThemedView style={[styles.countBadge, { backgroundColor: palette.backgroundMuted }]}>
            <ThemedText style={styles.countLabel}>{occurrences.length}</ThemedText>
          </ThemedView>
        </View>

        <View style={styles.list}>
          {occurrences.length === 0 ? (
            <ThemedView
              style={[
                styles.emptyState,
                {
                  backgroundColor: palette.card,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText style={styles.emptyTitle}>No walks on this day yet</ThemedText>
              <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
                Add a pickup, vet visit, or repeating walk and it will appear here with its reminder.
              </ThemedText>
              <AppButton
                label="Plan this day"
                onPress={() =>
                  router.push({
                    pathname: '/appointment',
                    params: { date: selectedDate.toISOString() },
                  } as never)
                }
              />
            </ThemedView>
          ) : (
            occurrences.map((occurrence) => (
              <AppointmentCard
                key={occurrence.occurrenceId}
                occurrence={occurrence}
                onPress={() =>
                  router.push({
                    pathname: '/appointment',
                    params: { appointmentId: occurrence.appointment.id },
                  } as never)
                }
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: 8,
    padding: 20,
    paddingBottom: 140,
  },
  hero: {
    borderRadius: 32,
    gap: 18,
    padding: 22,
  },
  heroCopy: {
    gap: 8,
  },
  heroButton: {
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 24,
    fontWeight: '700',
  },
  countBadge: {
    borderRadius: 999,
    minWidth: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  list: {
    gap: 12,
  },
  emptyState: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 20,
  },
  emptyTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 20,
    fontWeight: '700',
  },
});
