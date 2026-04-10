import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";

import { ThemedText } from "@/components/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export function LoadingView() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const pulse = useRef(new Animated.Value(0)).current;
  const dots = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    const dotsAnimation = Animated.loop(
      Animated.timing(dots, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    pulseAnimation.start();
    dotsAnimation.start();

    return () => {
      pulseAnimation.stop();
      dotsAnimation.stop();
    };
  }, [dots, pulse]);

  const imageStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.015],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.015],
        }),
      },
      {
        translateY: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [4, 0],
        }),
      },
    ],
  } as const;

  const dotStyles = [0, 1, 2].map((index) => ({
    opacity: dots.interpolate({
      inputRange: [0, 0.33, 0.66, 1],
      outputRange:
        index === 0
          ? [0.3, 1, 0.3, 0.3]
          : index === 1
            ? [0.3, 0.3, 1, 0.3]
            : [0.3, 0.3, 0.3, 1],
    }),
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.backgroundWrap, imageStyle]}>
        <Image
          resizeMode="cover"
          source={require("../assets/images/splash_screen.png")}
          style={styles.backgroundImage}
        />
      </Animated.View>
      <YStack style={styles.container}>
        <YStack style={styles.caption}>
          <ThemedText
            darkColor={palette.accentMuted}
            lightColor={palette.accentMuted}
            style={styles.label}
          >
            {t("common.loadingCalendar")}
          </ThemedText>
          <View style={styles.dotsRow}>
            {dotStyles.map((style, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: palette.accentMuted },
                  style,
                ]}
              />
            ))}
          </View>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F8F1E6",
    flex: 1,
  },
  backgroundWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 56,
    paddingHorizontal: 24,
    width: "100%",
  },
  caption: {
    alignItems: "center",
    borderRadius: 999,
    gap: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  label: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  dotsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  dot: {
    borderRadius: 999,
    height: 7,
    width: 7,
  },
});
