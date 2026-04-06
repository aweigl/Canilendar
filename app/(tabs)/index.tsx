import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AgendaDogCard } from "@/components/agenda-dog-card";
import { LoadingView } from "@/components/loading-view";
import { MonthCalendar } from "@/components/month-calendar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WeekTable } from "@/components/week-table";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { formatLongDate } from "@/lib/date";
import { CalendarDays, CalendarRange } from "lucide-react-native";

export default function HomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const today = new Date();
  const { getMarkedDatesForMonth, getOccurrencesForDate, isLoaded } =
    useCanilendar();
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
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 32 }]}
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
                {t("tabs.calendar")}
              </ThemedText>
              <ThemedText
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {t("home.description")}
              </ThemedText>
            </View>
          </ThemedView>
        </View>

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
                      ? palette.accentMuted
                      : pressed
                        ? palette.surfaceAccent
                        : "transparent",
                    borderColor: isActive ? palette.accent : "transparent",
                  },
                ]}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <ThemedText
                    lightColor={isActive ? palette.accentPressed : palette.text}
                    darkColor={isActive ? palette.onAccent : palette.text}
                    type="defaultSemiBold"
                    style={styles.viewToggleLabel}
                  >
                    {option.label}
                  </ThemedText>
                  {option.key === "calendar" ? (
                    <CalendarDays
                      style={{ marginRight: 16 }}
                      size={16}
                      color={isActive ? palette.accentPressed : palette.text}
                    />
                  ) : (
                    <CalendarRange
                      style={{ marginRight: 8 }}
                      size={16}
                      color={isActive ? palette.accentPressed : palette.text}
                    />
                  )}
                </View>
              </Pressable>
            );
          })}
        </ThemedView>

        <View style={styles.screenSection}>
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

          <ThemedView
            style={[
              styles.sectionCard,
              {
                backgroundColor: palette.surfaceRaised,
                borderColor: palette.border,
              },
            ]}
          >
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
          </ThemedView>
        </View>
      </ScrollView>

      <Pressable
        accessibilityLabel={t("home.newAppointment")}
        accessibilityRole="button"
        onPress={() =>
          router.push({
            pathname: "/appointment",
            params: { date: selectedDate.toISOString() },
          } as never)
        }
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: pressed ? palette.accentPressed : palette.accent,
            bottom: Spacing.md,
            borderColor: palette.accentPressed,
            shadowColor: palette.shadow,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
        ]}
      >
        <IconSymbol
          name="calendar.badge.plus"
          size={24}
          color={palette.onAccent}
        />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.xl,
    padding: 24,
  },
  screenSection: {
    gap: Spacing.lg,
  },
  hero: {
    borderRadius: Radius.hero,
    borderWidth: 1,
    gap: Spacing.lg,
    padding: 24,
  },
  heroCopy: {
    gap: Spacing.sm,
  },
  heroBadge: {
    alignSelf: "flex-start",
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  fab: {
    alignItems: "center",
    borderRadius: Radius.pill,
    borderWidth: 1,
    height: 62,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    width: 62,
    elevation: 5,
  },
  viewToggle: {
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    flexDirection: "row",
    padding: 4,
  },
  viewToggleButton: {
    alignItems: "center",
    borderWidth: 1,
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
    gap: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 24,
  },
  sectionCard: {
    borderRadius: Radius.card,
    borderWidth: 1,
    padding: 20,
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
    borderWidth: 1,
    gap: Spacing.md,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 22,
  },
});
