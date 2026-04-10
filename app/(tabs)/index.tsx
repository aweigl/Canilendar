import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  HomeAgendaSection,
  HomeHero,
  HomeSection,
  HomeViewModeToggle,
  type HomeViewMode,
} from "@/components/home/home-screen-sections";
import { LoadingView } from "@/components/loading-view";
import { MonthCalendar } from "@/components/month-calendar";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { WeekTable } from "@/components/week-table";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useCanilendar } from "@/context/canilendar-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";

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
  const [viewMode, setViewMode] = useState<HomeViewMode>("calendar");

  function handleChangeViewMode(nextMode: HomeViewMode) {
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

  function openOccurrence(appointmentId: string, startAt?: Date) {
    if (startAt) {
      setSelectedDate(startAt);
      setVisibleMonth(startAt);
    }

    router.push({
      pathname: "/appointment",
      params: { appointmentId },
    } as never);
  }

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <HomeHero palette={palette} />
        <HomeViewModeToggle
          onChange={handleChangeViewMode}
          palette={palette}
          viewMode={viewMode}
        />
        <HomeSection>
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
              onEditOccurrence={(occurrence) => {
                openOccurrence(
                  occurrence.appointment.id,
                  occurrence.startAt,
                );
              }}
            />
          )}
        </HomeSection>

        {viewMode === "calendar" ? (
          <HomeAgendaSection
            occurrences={occurrences}
            onOpenOccurrence={(occurrence) => {
              openOccurrence(occurrence.appointment.id);
            }}
            palette={palette}
            selectedDate={selectedDate}
          />
        ) : null}
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
});
