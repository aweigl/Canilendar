import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AuthShell } from "@/components/auth/auth-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const VALUE_POINTS = [
  "Save each dog once, then schedule walks in seconds.",
  "See your day in one agenda with recurring appointments.",
  "Keep premium simple: one pro plan unlocks unlimited dogs and bookings.",
];

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  return (
    <AuthShell
      eyebrow="Canilendar"
      title="Dog walks, calm days, zero chaos."
      description="No account needed. Set up your first dog and first appointment on this device, then decide later whether you need pro."
      footer={
        <ThemedText
          lightColor={palette.textSubtle}
          darkColor={palette.textSubtle}
          type="caption"
        >
          Your data stays local on this device in v1. Store purchases can still be restored from Settings.
        </ThemedText>
      }
    >
      <ThemedView
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        {VALUE_POINTS.map((point) => (
          <View key={point} style={styles.pointRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: palette.accent,
                },
              ]}
            />
            <ThemedText>{point}</ThemedText>
          </View>
        ))}
      </ThemedView>

      <AppButton
        label="Start setup"
        onPress={() => router.push("/onboarding" as never)}
        icon="arrow.right.circle.fill"
      />
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  pointRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dot: {
    borderRadius: Radius.pill,
    height: 10,
    width: 10,
  },
});
