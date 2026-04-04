import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from "@react-navigation/native";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Manrope_700Bold } from "@expo-google-fonts/manrope";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { router, Stack, usePathname, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "react-native-reanimated";
import { TamaguiProvider } from "tamagui";

import { LoadingView } from "@/components/loading-view";
import { AppSessionProvider, useAppSession } from "@/context/app-session-context";
import { CanilendarProvider, useCanilendar } from "@/context/canilendar-context";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import "@/i18n";
import { configureNotificationHandling } from "@/lib/notifications";
import tamaguiConfig from "@/tamagui.config";

export const unstable_settings = {
  anchor: "(tabs)",
};

configureNotificationHandling();
void SplashScreen.preventAutoHideAsync().catch(() => {
  // Expo Go / reload paths do not always register a native splash screen.
});

function AppStack() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/dog" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/appointment" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/reminders" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/success" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="appointment"
        options={{
          presentation: "modal",
          headerLargeTitle: false,
          title: t("appointment.screenTitleNew"),
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}

function RootNavigation() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Manrope_700Bold,
  });
  const palette = Colors[colorScheme ?? "light"];
  const navigationTheme: Theme = {
    ...(colorScheme === "dark" ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === "dark" ? DarkTheme.colors : DefaultTheme.colors),
      primary: palette.accent,
      background: palette.background,
      card: palette.card,
      border: palette.border,
      text: palette.text,
      notification: palette.accent,
    },
  };
  const { isReady, pendingPaywallTrigger } = useAppSession();
  const { isLoaded, onboardingStatus } = useCanilendar();
  const pathname = usePathname();
  const segments = useSegments();
  const topSegment = (segments[0] ?? "") as string;

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync().catch(() => {
        // Ignore splash lifecycle mismatches during Expo Go reloads.
      });
    }
  }, [fontError, fontsLoaded]);

  useEffect(() => {
    function redirectFromNotification(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;

      if (typeof url === "string" && url.length > 0) {
        router.push(url as never);
      }
    }

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse?.notification) {
      redirectFromNotification(lastResponse.notification);
      void Notifications.clearLastNotificationResponseAsync();
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      redirectFromNotification(response.notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !isLoaded) {
      return;
    }

    const isWelcomeRoute = topSegment === "welcome";
    const isOnboardingRoute = topSegment === "onboarding";
    const isPaywallRoute = topSegment === "paywall";

    if (onboardingStatus !== "complete") {
      if (!isWelcomeRoute && !isOnboardingRoute) {
        router.replace("/welcome" as never);
      }
      return;
    }

    if (isWelcomeRoute || isOnboardingRoute) {
      router.replace("/(tabs)" as never);
      return;
    }

    if (!pendingPaywallTrigger && isPaywallRoute) {
      router.replace("/(tabs)" as never);
    }
  }, [isLoaded, isReady, onboardingStatus, pendingPaywallTrigger, topSegment]);

  useEffect(() => {
    if (
      !isReady ||
      !isLoaded ||
      onboardingStatus !== "complete" ||
      !pendingPaywallTrigger ||
      pathname === "/paywall"
    ) {
      return;
    }

    router.push({
      pathname: "/paywall",
      params: { trigger: pendingPaywallTrigger },
    } as never);
  }, [isLoaded, isReady, onboardingStatus, pathname, pendingPaywallTrigger]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!isReady || !isLoaded) {
    return (
      <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? "light"}>
        <ThemeProvider value={navigationTheme}>
          <LoadingView />
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </TamaguiProvider>
    );
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? "light"}>
      <ThemeProvider value={navigationTheme}>
        <AppStack />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </TamaguiProvider>
  );
}

function AppProviders() {
  const { isPro, presentPaywall } = useAppSession();

  return (
    <CanilendarProvider isPro={isPro} onRequireUpgrade={presentPaywall}>
      <RootNavigation />
    </CanilendarProvider>
  );
}

export default function RootLayout() {
  return (
    <AppSessionProvider>
      <AppProviders />
    </AppSessionProvider>
  );
}
