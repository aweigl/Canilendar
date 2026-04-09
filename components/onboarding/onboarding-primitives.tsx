import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  type ViewStyle,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
  IconSymbol,
  type IconSymbolName,
} from "@/components/ui/icon-symbol";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type OnboardingTone = "accent" | "support" | "info" | "success";

type ToneColors = {
  background: string;
  border: string;
  text: string;
  iconBackground: string;
  iconColor: string;
};

function useToneColors(tone: OnboardingTone): ToneColors {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];

  return useMemo(() => {
    switch (tone) {
      case "support":
        return {
          background: palette.supportSoft,
          border: palette.support,
          text: palette.onSupport,
          iconBackground: palette.surfaceRaised,
          iconColor: palette.support,
        };
      case "info":
        return {
          background: palette.infoSoft,
          border: palette.info,
          text: palette.onInfo,
          iconBackground: palette.surfaceRaised,
          iconColor: palette.info,
        };
      case "success":
        return {
          background: palette.successSoft,
          border: palette.success,
          text: palette.onSuccess,
          iconBackground: palette.surfaceRaised,
          iconColor: palette.success,
        };
      default:
        return {
          background: palette.accentSoft,
          border: palette.accent,
          text: palette.text,
          iconBackground: palette.surfaceRaised,
          iconColor: palette.accent,
        };
    }
  }, [palette, tone]);
}

export function OnboardingStepBadge({
  step,
  totalSteps,
  label,
  icon,
  tone = "accent",
}: {
  step: number;
  totalSteps: number;
  label: string;
  icon: IconSymbolName;
  tone?: OnboardingTone;
}) {
  const colors = useToneColors(tone);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.timing(pulse, {
        toValue: 1.06,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(pulse, {
        toValue: 1,
        duration: 180,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [pulse, step]);

  return (
    <View style={styles.stepBadgeRow}>
      <ThemedView
        style={[
          styles.stepBadge,
          {
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.stepBadgeIcon,
            {
              backgroundColor: colors.iconBackground,
              transform: [{ scale: pulse }],
            },
          ]}
        >
          <IconSymbol name={icon} size={14} color={colors.iconColor} />
        </Animated.View>
        <View style={styles.stepBadgeCopy}>
          <ThemedText
            type="eyebrow"
            lightColor={colors.text}
            darkColor={colors.text}
          >
            {label}
          </ThemedText>
          <ThemedText
            type="caption"
            lightColor={colors.text}
            darkColor={colors.text}
          >
            Step {step} of {totalSteps}
          </ThemedText>
        </View>
      </ThemedView>

      <View style={styles.progressDots}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const dotStep = index + 1;
          const isActive = dotStep === step;
          const isComplete = dotStep < step;

          return (
            <View
              key={dotStep}
              style={[
                styles.progressDot,
                {
                  backgroundColor:
                    isActive || isComplete ? colors.border : "transparent",
                  borderColor: isActive ? colors.border : colors.background,
                },
              ]}
            >
              {isActive ? (
                <IconSymbol
                  name="pawprint.fill"
                  size={10}
                  color={colors.iconBackground}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function OnboardingInfoCard({
  icon,
  title,
  body,
  tone = "accent",
  style,
}: {
  icon: IconSymbolName;
  title: string;
  body: string;
  tone?: OnboardingTone;
  style?: ViewStyle;
}) {
  const colors = useToneColors(tone);

  return (
    <ThemedView
      style={[
        styles.infoCard,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor: colors.iconBackground,
            borderColor: colors.border,
          },
        ]}
      >
        <IconSymbol name={icon} size={18} color={colors.iconColor} />
      </View>
      <View style={styles.infoCopy}>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
        <ThemedText type="caption">{body}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  stepBadgeRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
    justifyContent: "space-between",
  },
  stepBadge: {
    alignItems: "center",
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    minHeight: 48,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
  },
  stepBadgeIcon: {
    alignItems: "center",
    borderRadius: Radius.pill,
    height: 28,
    justifyContent: "center",
    width: 28,
  },
  stepBadgeCopy: {
    gap: 2,
  },
  progressDots: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  progressDot: {
    alignItems: "center",
    borderRadius: Radius.pill,
    borderWidth: 1,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  infoCard: {
    alignItems: "flex-start",
    borderRadius: Radius.controlLarge,
    borderWidth: 1,
    flexDirection: "row",
    gap: Spacing.sm,
    padding: Spacing.md,
  },
  infoIcon: {
    alignItems: "center",
    borderRadius: Radius.pill,
    borderWidth: 1,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  infoCopy: {
    flex: 1,
    gap: 4,
  },
});
