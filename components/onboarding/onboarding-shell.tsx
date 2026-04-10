import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import {
  OnboardingIllustration,
  type OnboardingIllustrationVariant,
} from "@/components/onboarding/onboarding-illustration";
import { ThemedText } from "@/components/themed-text";
import { KeyboardAwareScrollView } from "@/components/ui/keyboard-aware-scroll-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type OnboardingShellProps = {
  step: number;
  title: string;
  description: string;
  illustration: OnboardingIllustrationVariant;
  children?: ReactNode;
  footer?: ReactNode;
};

export function OnboardingShell({
  step,
  title,
  description,
  illustration,
  children,
  footer,
}: OnboardingShellProps) {
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const entrance = useRef(new Animated.Value(0)).current;
  const contentTopPadding = insets.top + 42;

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

  return (
    <SafeAreaView
      edges={step > 1 ? ["left", "right", "bottom"] : undefined}
      style={[styles.safeArea, { backgroundColor: palette.background }]}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: contentTopPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainContent}>
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
