import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppointmentCard } from "@/components/appointment-card";
import { LoadingView } from "@/components/loading-view";
import { MonthCalendar } from "@/components/month-calendar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Fonts, Radius, Spacing } from "@/constants/theme";
import { useCanilander } from "@/context/canilander-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatLongDate } from "@/lib/date";

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { isLoaded, getOccurrencesForDate, getMarkedDatesForMonth } =
    useCanilander();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleMonth, setVisibleMonth] = useState(new Date());

  if (!isLoaded) {
    return <LoadingView />;
  }

  const occurrences = getOccurrencesForDate(selectedDate);
  const markedDates = getMarkedDatesForMonth(visibleMonth);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.screenSection}>
          <ThemedView
            style={[
              styles.hero,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <View style={styles.heroCopy}>
              <ThemedText
                lightColor={palette.text}
                darkColor={palette.text}
                type="title"
              >
                Canilander
              </ThemedText>
              <ThemedView
                style={[
                  styles.heroBadge,
                  { backgroundColor: palette.surfaceAccent },
                ]}
              >
                <ThemedText
                  lightColor={palette.accent}
                  darkColor={palette.accent}
                  type="eyebrow"
                >
                  Daily dog-walk planner
                </ThemedText>
              </ThemedView>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                Stay on top of pickups, repeat walks, and today&apos;s route
                without leaving your phone calendar half-finished.
              </ThemedText>
            </View>
          </ThemedView>
        </View>

        <View style={styles.screenSection}>
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
        </View>

        <View style={styles.screenSection}>
          <View style={{ width: "100%" }}>
            <AppButton
              icon="plus.circle.fill"
              label="New appointment"
              onPress={() =>
                router.push({
                  pathname: "/appointment",
                  params: { date: selectedDate.toISOString() },
                } as never)
              }
              style={styles.heroButton}
            />
          </View>
        </View>

        <View style={styles.screenSection}>
          <View style={styles.sectionHeader}>
            <View>
              <ThemedText type="sectionTitle" style={styles.sectionTitle}>
                Agenda
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {formatLongDate(selectedDate)}
              </ThemedText>
            </View>
            <ThemedView
              style={[
                styles.countBadge,
                {
                  backgroundColor: palette.surfaceMuted,
                  borderColor: palette.border,
                },
              ]}>
              <ThemedText style={styles.countLabel}>
                {occurrences.length}
              </ThemedText>
            </ThemedView>
          </View>

          <View style={styles.list}>
            {occurrences.length === 0 ? (
              <ThemedView
                style={[
                  styles.emptyState,
                  {
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                  },
                ]}>
                <ThemedText type="sectionTitle" style={styles.emptyTitle}>
                  No walks on this day yet
                </ThemedText>
                <ThemedText
                  lightColor={palette.textMuted}
                  darkColor={palette.textMuted}
                >
                  Add a pickup, vet visit, or repeating walk and it will appear
                  here with its reminder.
                </ThemedText>
                <AppButton
                  icon="plus.circle.fill"
                  label="Plan this day"
                  onPress={() =>
                    router.push({
                      pathname: "/appointment",
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
                      pathname: "/appointment",
                      params: { appointmentId: occurrence.appointment.id },
                    } as never)
                  }
                />
              ))
            )}
          </View>
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
    gap: Spacing.lg,
    padding: 20,
    paddingBottom: 140,
  },
  screenSection: {
    gap: Spacing.md,
  },
  hero: {
    borderRadius: Radius.hero,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  heroCopy: {
    gap: Spacing.xs,
  },
  heroBadge: {
    alignSelf: "flex-start",
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  heroButton: {
    alignSelf: "flex-start",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
  },
  countBadge: {
    borderRadius: Radius.pill,
    borderWidth: 1,
    minWidth: 42,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  list: {
    gap: Spacing.md,
  },
  emptyState: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
  },
});
