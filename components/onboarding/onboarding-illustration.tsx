import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

export type OnboardingIllustrationVariant =
  | "welcome"
  | "dog"
  | "appointment"
  | "reminders"
  | "success";

export function OnboardingIllustration({
  variant,
}: {
  variant: OnboardingIllustrationVariant;
}) {
  return (
    <View style={[styles.container]}>
      {variant === "welcome" ? (
        <Image
          contentFit="contain"
          source={require("../../assets/images/oboarding_welcome.png")}
          style={styles.image}
        />
      ) : null}
      {variant === "dog" ? (
        <Image
          contentFit="contain"
          source={require("../../assets/images/onboarding_dog.png")}
          style={styles.image}
        />
      ) : null}
      {variant === "appointment" ? (
        <Image
          contentFit="contain"
          source={require("../../assets/images/onboarding_appointment.png")}
          style={styles.image}
        />
      ) : null}
      {variant === "reminders" ? (
        <Image
          contentFit="contain"
          source={require("../../assets/images/onboarding_reminder.png")}
          style={styles.image}
        />
      ) : null}
      {variant === "success" ? (
        <Image
          contentFit="contain"
          source={require("../../assets/images/onboarding_success.png")}
          style={styles.image}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1.5,
    overflow: "hidden",
    width: "100%",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
