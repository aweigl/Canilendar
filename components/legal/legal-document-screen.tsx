import { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { AppButton } from "@/components/ui/app-button";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalDocumentScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
  warning?: string | null;
  warningTitle?: string;
  actions?: Array<{
    label: string;
    onPress: () => void;
    icon?: "arrow.right.circle.fill" | "envelope.fill";
  }>;
  footer?: ReactNode;
};

export function LegalDocumentScreen({
  eyebrow,
  title,
  description,
  sections,
  warning,
  warningTitle = "Release Checklist",
  actions = [],
  footer,
}: LegalDocumentScreenProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

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
          <ThemedText
            type="eyebrow"
            lightColor={palette.support}
            darkColor={palette.support}
          >
            {eyebrow}
          </ThemedText>
          <ThemedText type="display">{title}</ThemedText>
          <ThemedText
            lightColor={palette.textMuted}
            darkColor={palette.textMuted}
          >
            {description}
          </ThemedText>
        </ThemedView>

        {warning ? (
          <ThemedView
            style={[
              styles.warningCard,
              {
                backgroundColor: palette.dangerSoft,
                borderColor: palette.danger,
              },
            ]}
          >
            <ThemedText
              type="sectionTitle"
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              {warningTitle}
            </ThemedText>
            <ThemedText
              lightColor={palette.onDanger}
              darkColor={palette.onDanger}
            >
              {warning}
            </ThemedText>
          </ThemedView>
        ) : null}

        {actions.length > 0 ? (
          <View style={styles.actions}>
            {actions.map((action) => (
              <AppButton
                key={action.label}
                label={action.label}
                onPress={action.onPress}
                variant="secondary"
                icon={action.icon}
              />
            ))}
          </View>
        ) : null}

        {sections.map((section) => (
          <ThemedView
            key={section.title}
            style={[
              styles.card,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <ThemedText type="sectionTitle">{section.title}</ThemedText>
            {section.paragraphs?.map((paragraph) => (
              <ThemedText
                key={paragraph}
                lightColor={palette.textMuted}
                darkColor={palette.textMuted}
              >
                {paragraph}
              </ThemedText>
            ))}
            {section.bullets?.map((bullet) => (
              <View key={bullet} style={styles.bulletRow}>
                <View
                  style={[
                    styles.bullet,
                    {
                      backgroundColor: palette.accent,
                    },
                  ]}
                />
                <ThemedText
                  lightColor={palette.textMuted}
                  darkColor={palette.textMuted}
                  style={styles.bulletCopy}
                >
                  {bullet}
                </ThemedText>
              </View>
            ))}
          </ThemedView>
        ))}

        {footer ? <View style={styles.footer}>{footer}</View> : null}
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
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  warningCard: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: Spacing.lg,
  },
  actions: {
    gap: Spacing.sm,
  },
  bulletRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  bullet: {
    borderRadius: Radius.pill,
    height: 10,
    marginTop: 8,
    width: 10,
  },
  bulletCopy: {
    flex: 1,
  },
  footer: {
    gap: Spacing.sm,
  },
});
