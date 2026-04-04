import { DarkTheme, DefaultTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Manrope_700Bold } from '@expo-google-fonts/manrope';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider } from 'tamagui';

import { CanilendarProvider } from '@/context/canilendar-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { configureNotificationHandling } from '@/lib/notifications';
import tamaguiConfig from '@/tamagui.config';

export const unstable_settings = {
  anchor: '(tabs)',
};

configureNotificationHandling();
void SplashScreen.preventAutoHideAsync();

function RootNavigation() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Manrope_700Bold,
  });
  const palette = Colors[colorScheme ?? 'light'];
  const navigationTheme: Theme = {
    ...(colorScheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(colorScheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      primary: palette.accent,
      background: palette.background,
      card: palette.card,
      border: palette.border,
      text: palette.text,
      notification: palette.accent,
    },
  };

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontError, fontsLoaded]);

  useEffect(() => {
    function redirectFromNotification(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;

      if (typeof url === 'string' && url.length > 0) {
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme ?? 'light'}>
      <ThemeProvider value={navigationTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="appointment"
            options={{
              presentation: 'modal',
              headerLargeTitle: false,
              title: 'Appointment',
            }}
          />
        </Stack>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <CanilendarProvider>
      <RootNavigation />
    </CanilendarProvider>
  );
}
