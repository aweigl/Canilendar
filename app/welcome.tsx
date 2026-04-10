import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, Pressable, StyleSheet, View } from "react-native";

import { AuthShell } from "@/components/auth/auth-shell";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors, Radius, Spacing } from "@/constants/theme";
import { useAppSession } from "@/context/app-session-context";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? "light";
  const palette = Colors[colorScheme];
  const { isAuthenticating, signInWithApple } = useAppSession();
  const [isHandlingSignIn, setIsHandlingSignIn] = useState(false);
  const canUseAppleSignIn = Platform.OS === "ios" && appleAuth.isSupported;

  async function handleAppleSignIn() {
    if (isAuthenticating || isHandlingSignIn) {
      return;
    }

    setIsHandlingSignIn(true);
    const error = await signInWithApple();
    setIsHandlingSignIn(false);

    if (error) {
      Alert.alert(t("welcome.signInErrorTitle"), error);
    }
  }

  return (
    <AuthShell
      illustration={
        <Image
          contentFit="contain"
          source={require("../assets/images/login_screen.png")}
          style={styles.illustration}
        />
      }
      title={t("welcome.title")}
      description={t("welcome.description")}
      action={
        canUseAppleSignIn ? (
          <AppleButton
            buttonStyle={
              colorScheme === "dark"
                ? AppleButton.Style.WHITE
                : AppleButton.Style.BLACK
            }
            buttonType={AppleButton.Type.SIGN_IN}
            cornerRadius={Radius.controlLarge}
            onPress={() => {
              handleAppleSignIn();
            }}
            style={[
              styles.appleButton,
              (isAuthenticating || isHandlingSignIn) && styles.disabledButton,
            ]}
          />
        ) : (
          <ThemedView
            style={[
              styles.unsupportedCard,
              {
                backgroundColor: palette.surface,
                borderColor: palette.border,
              },
            ]}
          >
            <ThemedText
              lightColor={palette.textMuted}
              darkColor={palette.textMuted}
            >
              {t("welcome.appleUnavailable")}
            </ThemedText>
          </ThemedView>
        )
      }
      footer={
        <View style={styles.footer}>
          <View style={styles.legalLinks}>
            <Pressable onPress={() => router.push("/legal/imprint")}>
              <ThemedText
                lightColor={palette.textSubtle}
                darkColor={palette.textSubtle}
                type="caption"
              >
                {t("legal.imprintTitle")}
              </ThemedText>
            </Pressable>
            <Pressable onPress={() => router.push("/legal/privacy")}>
              <ThemedText
                lightColor={palette.textSubtle}
                darkColor={palette.textSubtle}
                type="caption"
              >
                {t("legal.privacyTitle")}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  illustration: {
    aspectRatio: 1.5,
    width: "100%",
  },
  appleButton: {
    height: 56,
    width: "100%",
  },
  disabledButton: {
    opacity: 0.6,
  },
  unsupportedCard: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    padding: Spacing.md,
    width: "100%",
  },
  footer: {
    alignItems: "center",
  },
  legalLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.lg,
    justifyContent: "center",
  },
});
