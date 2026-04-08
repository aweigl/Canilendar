import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { KeyboardAwareScrollView } from "@/components/ui/keyboard-aware-scroll-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { posthog } from "@/lib/posthog";
import { router } from "expo-router";
import { IconButton } from "../ui/icon-button";
import { IconSymbol } from "../ui/icon-symbol";

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

  const goBack = () => {
    posthog.capture("onboarding_back", {
      step,
    });
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { minHeight: "100%" }]}
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
          <View style={[styles.row, { marginBottom: Spacing.sm }]}>
            {step > 1 ? (
              <IconButton onPress={goBack}>
                <IconSymbol
                  name="arrow.left.circle.fill"
                  size={32}
                  color={palette.accent}
                />
              </IconButton>
            ) : (
              <View />
            )}
            <ThemedView
              style={[styles.badge, { backgroundColor: palette.supportSoft }]}
            >
              <ThemedText
                type="eyebrow"
                style={styles.marginTopBotton}
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
            style={{ marginTop: Spacing.sm }}
          >
            {description}
          </ThemedText>
        </ThemedView>

        <View style={styles.body}>{children}</View>
      </KeyboardAwareScrollView>
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
    minHeight: "100%",
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
  marginTopBotton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
});
