import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  OnboardingIllustration,
  type OnboardingIllustrationVariant,
} from "@/components/onboarding/onboarding-illustration";
import { ThemedText } from "@/components/themed-text";
import { type IconSymbolName } from "@/components/ui/icon-symbol";
import { KeyboardAwareScrollView } from "@/components/ui/keyboard-aware-scroll-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { posthog } from "@/lib/posthog";
import { router } from "expo-router";
import { IconButton } from "../ui/icon-button";
import { IconSymbol } from "../ui/icon-symbol";

type OnboardingTone = "accent" | "support" | "info" | "success";

type OnboardingShellProps = {
  step: number;
  totalSteps: number;
  eyebrow: string;
  title: string;
  description: string;
  heroIcon: IconSymbolName;
  heroTone?: OnboardingTone;
  illustration: OnboardingIllustrationVariant;
  children?: ReactNode;
  footer?: ReactNode;
};

export function OnboardingShell({
  step,
  totalSteps,
  eyebrow,
  title,
  description,
  heroIcon,
  heroTone = "accent",
  illustration,
  children,
  footer,
}: OnboardingShellProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const reveal = Animated.timing(entrance, {
      toValue: 1,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    reveal.start();

    return () => {
      reveal.stop();
    };
  }, [entrance]);

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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
          <View style={styles.topBar}>
            {step > 1 ? (
              <IconButton onPress={goBack}>
                <IconSymbol
                  name="arrow.left.circle.fill"
                  size={32}
                  color={palette.accent}
                />
              </IconButton>
            ) : (
              <View style={styles.topBarSpacer} />
            )}
          </View>

          <Animated.View
            style={[
              styles.illustrationWrap,
              {
                opacity: entrance,
                transform: [
                  {
                    translateY: entrance.interpolate({
                      inputRange: [0, 1],
                      outputRange: [14, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <OnboardingIllustration variant={illustration} />
          </Animated.View>

          <View style={styles.copyBlock}>
            <ThemedText type="display" style={styles.title}>
              {title}
            </ThemedText>
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
              style={styles.description}
            >
              {description}
            </ThemedText>
          </View>
        </View>
        {children ? <View style={styles.body}>{children}</View> : null}
      </KeyboardAwareScrollView>
      {footer ? (
        <View
          style={[
            styles.footer,
            {
              backgroundColor: palette.background,
            },
          ]}
        >
          {footer}
        </View>
      ) : null}
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
    paddingBottom: 24,
  },
  mainContent: {
    gap: Spacing.lg,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  topBarSpacer: {
    width: 36,
  },
  illustrationWrap: {
    width: "100%",
  },
  copyBlock: {
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  description: {
    maxWidth: 320,
    textAlign: "center",
  },
  body: {
    backgroundColor: "transparent",
    borderRadius: Radius.card,
    gap: Spacing.md,
  },
  footer: {
    gap: Spacing.sm,
    paddingHorizontal: 20,
    paddingTop: Spacing.md,
    paddingBottom: 20,
  },
});
