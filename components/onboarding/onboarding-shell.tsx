import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type OnboardingShellProps = {
  step: number;
  totalSteps: number;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function OnboardingShell({
  step,
  totalSteps,
  eyebrow,
  title,
  description,
  children,
}: OnboardingShellProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const progress = `${step}/${totalSteps}`;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView
          style={[
            styles.hero,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}
        >
          <View style={styles.row}>
            <ThemedText
              type="eyebrow"
              lightColor={palette.accent}
              darkColor={palette.accent}
            >
              {eyebrow}
            </ThemedText>
            <ThemedView
              style={[
                styles.badge,
                { backgroundColor: palette.supportSoft },
              ]}
            >
              <ThemedText
                type="eyebrow"
                lightColor={palette.support}
                darkColor={palette.support}
              >
                {progress}
              </ThemedText>
            </ThemedView>
          </View>
          <ThemedText type="title">{title}</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {description}
          </ThemedText>
        </ThemedView>

        <View style={styles.body}>{children}</View>
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
    paddingBottom: 48,
  },
  hero: {
    borderRadius: Radius.hero,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  body: {
    gap: Spacing.md,
  },
});
