import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type SubscriptionOptionCardProps = {
  title: string;
  price: string;
  cadence: string;
  description: string;
  note?: string;
  selected: boolean;
  featured?: boolean;
  badgeLabel?: string;
  onPress: () => void;
};

export function SubscriptionOptionCard({
  title,
  price,
  cadence,
  description,
  note,
  selected,
  featured = false,
  badgeLabel,
  onPress,
}: SubscriptionOptionCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: selected ? palette.surfaceAccent : palette.surface,
          borderColor: selected ? palette.accent : palette.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.copy}>
          <ThemedText type="sectionTitle">{title}</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
            type="caption"
          >
            {description}
          </ThemedText>
        </View>
        {featured || badgeLabel ? (
          <View
            style={[styles.badge, { backgroundColor: palette.supportSoft }]}
          >
            <ThemedText
              type="eyebrow"
              lightColor={palette.support}
              darkColor={palette.support}
            >
              {badgeLabel ?? "Best value"}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.priceRow}>
        <ThemedText type="title">{price}</ThemedText>
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
        >
          {cadence}
        </ThemedText>
      </View>
      {note ? (
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
          type="caption"
        >
          {note}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  priceRow: {
    alignItems: "baseline",
    flexDirection: "row",
    gap: Spacing.sm,
  },
});
