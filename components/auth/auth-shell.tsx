import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { KeyboardAwareScrollView } from "@/components/ui/keyboard-aware-scroll-view";
import { Colors, Spacing } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AuthShellProps = {
  illustration: ReactNode;
  title: string;
  description: string;
  action: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({
  illustration,
  title,
  description,
  action,
  footer,
}: AuthShellProps) {
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
          <View style={styles.topContent}>
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
              {illustration}
            </Animated.View>
          </View>

          <View style={styles.body}>{action}</View>
        </View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: Spacing.lg,
    padding: 20,
    paddingBottom: 24,
  },
  mainContent: {
    flex: 1,
    gap: Spacing.lg,
    justifyContent: "space-between",
  },
  topContent: {
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
    gap: Spacing.md,
  },
  footer: {
    gap: Spacing.sm,
    paddingBottom: 20,
    paddingTop: Spacing.md,
  },
});
