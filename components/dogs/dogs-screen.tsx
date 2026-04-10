import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Radius, Spacing } from "@/constants/theme";

type Palette = (typeof Colors)["light"];

type DogsScreenHeaderProps = {
  palette: Palette;
  title: string;
  description: string;
};

type AddDogFabProps = {
  accessibilityLabel: string;
  onPress: () => void;
  palette: Palette;
};

export function DogsScreenHeader({
  palette,
  title,
  description,
}: DogsScreenHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <ThemedText type="title" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText
          lightColor={palette.textMuted}
          darkColor={palette.textMuted}
        >
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

export function AddDogFab({
  accessibilityLabel,
  onPress,
  palette,
}: AddDogFabProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
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
      <IconSymbol name="user.plus" size={28} color={palette.onAccent} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: Spacing.md,
  },
  headerCopy: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 34,
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
