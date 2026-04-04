import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AgendaDogCard } from "@/components/agenda-dog-card";
import { LoadingView } from "@/components/loading-view";
import { MonthCalendar } from "@/components/month-calendar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { WeekTable } from "@/components/week-table";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatLongDate } from "@/lib/date";

export default function HomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const today = new Date();
  const {
    getMarkedDatesForMonth,
    getOccurrencesForDate,
    isLoaded,
  } = useCanilendar();
  const [selectedDate, setSelectedDate] = useState(today);
  const [visibleMonth, setVisibleMonth] = useState(today);
  const [visibleWeekStart, setVisibleWeekStart] = useState(today);
  const [viewMode, setViewMode] = useState<"calendar" | "week">("calendar");

  function handleChangeViewMode(nextMode: "calendar" | "week") {
    if (nextMode === "week") {
      const nextToday = new Date();
      setSelectedDate(nextToday);
      setVisibleMonth(nextToday);
      setVisibleWeekStart(nextToday);
    }

    setViewMode(nextMode);
  }

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
                Canilendar
              </ThemedText>
              <ThemedView
                style={[
                  styles.heroBadge,
                  { backgroundColor: palette.supportSoft },
                ]}
              >
                <ThemedText
                  lightColor={palette.support}
                  darkColor={palette.support}
                  type="eyebrow"
                >
                  {t("home.badge")}
                </ThemedText>
              </ThemedView>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {t("home.description")}
              </ThemedText>
            </View>
          </ThemedView>
        </View>

        <View style={styles.screenSection}>
          <ThemedView
            style={[
              styles.viewToggle,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            {[
              { key: "calendar" as const, label: t("home.monthView") },
              { key: "week" as const, label: t("home.weekView") },
            ].map((option) => {
              const isActive = option.key === viewMode;

              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="button"
                  onPress={() => handleChangeViewMode(option.key)}
                  style={({ pressed }) => [
                    styles.viewToggleButton,
                    {
                      backgroundColor: isActive
                        ? palette.accent
                        : pressed
                          ? palette.surfaceMuted
                          : "transparent",
                    },
                  ]}
                >
                  <ThemedText
                    lightColor={isActive ? palette.onAccent : palette.text}
                    darkColor={isActive ? palette.onAccent : palette.text}
                    type="defaultSemiBold"
                    style={styles.viewToggleLabel}
                  >
                    {option.label}
                  </ThemedText>
                </Pressable>
              );
            })}
          </ThemedView>

          {viewMode === "calendar" ? (
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
          ) : (
            <WeekTable
              visibleWeekStart={visibleWeekStart}
              selectedDate={selectedDate}
              getOccurrencesForDate={getOccurrencesForDate}
              onChangeWeek={(date) => {
                setVisibleWeekStart(date);
                setSelectedDate(date);
                setVisibleMonth(date);
              }}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setVisibleMonth(date);
              }}
            />
          )}
        </View>

        <View style={styles.screenSection}>
          <View style={{ width: "100%" }}>
            <AppButton
              icon="plus.circle.fill"
              label={t("home.newAppointment")}
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
                {t("home.agenda")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {formatLongDate(selectedDate)}
              </ThemedText>
            </View>
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
                ]}
              >
                <ThemedText type="sectionTitle" style={styles.emptyTitle}>
                  {t("home.emptyTitle")}
                </ThemedText>
                <ThemedText
                  lightColor={palette.textMuted}
                  darkColor={palette.textMuted}
                >
                  {t("home.emptyDescription")}
                </ThemedText>
              </ThemedView>
            ) : (
              occurrences.map((occurrence) => (
                <AgendaDogCard
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
  viewToggle: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1.5,
    flexDirection: "row",
    padding: 4,
  },
  viewToggleButton: {
    alignItems: "center",
    borderRadius: Radius.control,
    flex: 1,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: Spacing.md,
  },
  viewToggleLabel: {
    textAlign: "center",
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 24,
  },
  list: {
    gap: Spacing.md,
  },
  checklistCard: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: 20,
  },
  checklistRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
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
