import { StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";

import { ThemedText } from "@/components/themed-text";
import { Colors, Spacing } from "@/constants/theme";

type Palette = (typeof Colors)["light"];

type SettingsScreenHeaderProps = {
  palette: Palette;
};

export function SettingsScreenHeader({
  palette,
}: SettingsScreenHeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <ThemedText
        type="eyebrow"
        lightColor={palette.support}
        darkColor={palette.support}
      >
        {t("settings.eyebrow")}
      </ThemedText>
      <ThemedText type="title" style={styles.title}>
        {t("settings.title")}
      </ThemedText>
      <ThemedText
        lightColor={palette.textMuted}
        darkColor={palette.textMuted}
      >
        {t("settings.description")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.sm,
  },
  title: {
    fontSize: 34,
  },
});
