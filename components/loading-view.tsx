import { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function LoadingView() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    pulseAnimation.start();

    return () => {
      pulseAnimation.stop();
    };
  }, [pulse]);

  const imageStyle = {
    opacity: pulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.992, 1],
    }),
    transform: [
      {
        scale: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.01],
        }),
      },
      {
        translateY: pulse.interpolate({
          inputRange: [0, 1],
          outputRange: [3, 0],
        }),
      },
    ],
  } as const;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.backgroundWrap, imageStyle]}>
        <Image
          resizeMode="cover"
          source={require("../assets/images/splash_screen.png")}
          style={styles.backgroundImage}
        />
      </Animated.View>
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
});
