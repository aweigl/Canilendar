import {
  AppleButton,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform, StyleSheet, View } from "react-native";

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
  const valuePoints = [
    t("welcome.valuePointOne"),
    t("welcome.valuePointTwo"),
    t("welcome.valuePointThree"),
  ];

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
      eyebrow={t("welcome.eyebrow")}
      title={t("welcome.title")}
      description={t("welcome.description")}
      footer={
        <ThemedText
          lightColor={palette.textSubtle}
          darkColor={palette.textSubtle}
          type="caption"
        >
          {t("welcome.footer")}
        </ThemedText>
      }
    >
      <ThemedView
        style={[
          styles.card,
          {
            backgroundColor: palette.surface,
            borderColor: palette.border,
          },
        ]}
      >
        {valuePoints.map((point) => (
          <View key={point} style={styles.pointRow}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: palette.accent,
                },
              ]}
            />
            <ThemedText>{point}</ThemedText>
          </View>
        ))}
      </ThemedView>

      {canUseAppleSignIn ? (
        <AppleButton
          buttonStyle={
            colorScheme === "dark"
              ? AppleButton.Style.WHITE
              : AppleButton.Style.BLACK
          }
          buttonType={AppleButton.Type.SIGN_IN}
          cornerRadius={Radius.controlLarge}
          onPress={() => {
            void handleAppleSignIn();
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
      )}
    </AuthShell>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.md,
    padding: Spacing.md,
  },
  pointRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing.sm,
  },
  dot: {
    borderRadius: Radius.pill,
    height: 10,
    width: 10,
  },
  appleButton: {
    height: 56,
  },
  disabledButton: {
    opacity: 0.6,
  },
  unsupportedCard: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    padding: Spacing.md,
  },
});
