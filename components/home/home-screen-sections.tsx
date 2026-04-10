import type { ReactNode } from "react";
import { CalendarDays, CalendarRange } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { AgendaDogCard } from "@/components/agenda-dog-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { formatLongDate } from "@/lib/date";
import type { AppointmentOccurrence } from "@/types/domain";

export type HomeViewMode = "calendar" | "week";

type Palette = (typeof Colors)["light"];

type HomeHeroProps = {
  palette: Palette;
};

type HomeViewModeToggleProps = {
  onChange: (mode: HomeViewMode) => void;
  palette: Palette;
  viewMode: HomeViewMode;
};

type HomeAgendaSectionProps = {
  occurrences: AppointmentOccurrence[];
  onOpenOccurrence: (occurrence: AppointmentOccurrence) => void;
  palette: Palette;
  selectedDate: Date;
};

type HomeSectionProps = {
  children: ReactNode;
};

export function HomeSection({ children }: HomeSectionProps) {
  return <View style={styles.screenSection}>{children}</View>;
}

export function HomeHero({ palette }: HomeHeroProps) {
  const { t } = useTranslation();

  return (
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
  );
}

export function HomeViewModeToggle({
  onChange,
  palette,
  viewMode,
}: HomeViewModeToggleProps) {
  const { t } = useTranslation();
  const options = [
    { key: "calendar" as const, label: t("home.monthView") },
    { key: "week" as const, label: t("home.weekView") },
  ];

  return (
    <ThemedView
      style={[
        styles.viewToggle,
        {
          backgroundColor: palette.surface,
          borderColor: palette.border,
        },
      ]}
    >
      {options.map((option) => {
        const isActive = option.key === viewMode;

        return (
          <Pressable
            key={option.key}
            accessibilityRole="button"
            onPress={() => onChange(option.key)}
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
            <View style={styles.viewToggleInner}>
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
  );
}

export function HomeAgendaSection({
  occurrences,
  onOpenOccurrence,
  palette,
  selectedDate,
}: HomeAgendaSectionProps) {
  const { t } = useTranslation();

  return (
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
                onPress={() => onOpenOccurrence(occurrence)}
              />
            ))
          )}
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  viewToggleInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
