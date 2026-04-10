import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Manrope_700Bold } from "@expo-google-fonts/manrope";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
  type Theme,
} from "@react-navigation/native";
import {
  Stack,
  useGlobalSearchParams,
  usePathname,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { PostHogProvider } from "posthog-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

import { LoadingView } from "@/components/loading-view";
import { Colors } from "@/constants/theme";
import {
  AppSessionProvider,
  useAppSession,
} from "@/context/app-session-context";
import {
  CanilendarProvider,
  useCanilendar,
} from "@/context/canilendar-context";
import { useAppRouteGuards } from "@/hooks/use-app-route-guards";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotificationNavigation } from "@/hooks/use-notification-navigation";
import { useReviewPrompt } from "@/hooks/use-review-prompt";
import { useScreenTracking } from "@/hooks/use-screen-tracking";
import "@/i18n";
import { configureNotificationHandling } from "@/lib/notifications";
import { posthog } from "@/lib/posthog";
import { LOCAL_DEVICE_STORAGE_SCOPE } from "@/lib/storage";
import tamaguiConfig from "@/tamagui.config";

configureNotificationHandling();
SplashScreen.preventAutoHideAsync().catch(() => {
  // Expo Go / reload paths do not always register a native splash screen.
});

function AppStack() {
  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="onboarding/dog"
        options={{
          title: "",
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="onboarding/appointment"
        options={{
          title: "",
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="onboarding/reminders"
        options={{
          title: "",
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="onboarding/success"
        options={{
          title: "",
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="debug/apple-signin-preview"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          title: t("settings.title"),
        }}
      />
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
      <Stack.Screen
        name="legal/imprint"
        options={{
          title: t("legal.imprintTitle"),
        }}
      />
      <Stack.Screen
        name="legal/privacy"
        options={{
          title: t("legal.privacyTitle"),
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
  const { isAuthenticated, isReady, pendingPaywallTrigger } = useAppSession();
  const { isLoaded, onboardingStatus, reviewPrompt, updateReviewPrompt } =
    useCanilendar();
  const pathname = usePathname();
  const params = useGlobalSearchParams();
  const segments = useSegments();
  const topSegment = (segments[0] ?? "") as string;
  useScreenTracking(pathname, params);
  useNotificationNavigation();
  useAppRouteGuards({
    isAuthenticated,
    isLoaded,
    isReady,
    onboardingStatus,
    pathname,
    pendingPaywallTrigger,
    topSegment,
  });
  useReviewPrompt({
    isAuthenticated,
    isLoaded,
    isReady,
    onboardingStatus,
    pathname,
    reviewPrompt,
    topSegment,
    updateReviewPrompt,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {
        // Ignore splash lifecycle mismatches during Expo Go reloads.
      });
    }
  }, [fontError, fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (!isReady || !isLoaded) {
    return (
      <TamaguiProvider
        config={tamaguiConfig}
        defaultTheme={colorScheme ?? "light"}
      >
        <ThemeProvider value={navigationTheme}>
          <LoadingView />
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </TamaguiProvider>
    );
  }

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={colorScheme ?? "light"}
    >
      <ThemeProvider value={navigationTheme}>
        <AppStack />
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </TamaguiProvider>
  );
}

function AppProviders() {
  const { authUser, isPro, presentPaywall } = useAppSession();

  return (
    <CanilendarProvider
      isPro={isPro}
      onRequireUpgrade={presentPaywall}
      storageScopeKey={authUser?.appleUserId ?? LOCAL_DEVICE_STORAGE_SCOPE}
    >
      <RootNavigation />
    </CanilendarProvider>
  );
}

export default function RootLayout() {
  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureScreens: false,
        captureTouches: true,
        propsToCapture: ["testID"],
        maxElementsCaptured: 20,
      }}
      debug={__DEV__}
      options={{
        customAppProperties: {
          $app_build: process.env.EXPO_PUBLIC_APP_BUILD_NUMBER,
          $app_name: process.env.EXPO_PUBLIC_APP_NAME,
          $app_namespace: process.env.EXPO_PUBLIC_APP_NAMESPACE,
          $app_version: process.env.EXPO_PUBLIC_APP_VERSION,
          $device_manufacturer: process.env.EXPO_PUBLIC_DEVICE_MANUFACTURER,
          $device_name: process.env.EXPO_PUBLIC_DEVICE_NAME,
          $device_model: process.env.EXPO_PUBLIC_DEVICE_MODEL,
          $device_type: process.env.EXPO_PUBLIC_DEVICE_TYPE,
          $os_name: process.env.EXPO_PUBLIC_OS_NAME,
          $os_version: process.env.EXPO_PUBLIC_OS_VERSION,
          $locale: process.env.EXPO_PUBLIC_LOCALE,
          $timezone: process.env.EXPO_PUBLIC_TIMEZONE,
          $is_emulator:
            process.env.EXPO_PUBLIC_IS_EMULATOR === "true" ? true : false,
        },
      }}
    >
      <SafeAreaProvider>
        <AppSessionProvider>
          <AppProviders />
        </AppSessionProvider>
      </SafeAreaProvider>
    </PostHogProvider>
  );
}
