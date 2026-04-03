import { StyleSheet } from 'react-native';
import { Spinner, YStack } from 'tamagui';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function LoadingView() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  return (
    <YStack style={[styles.container, { backgroundColor: palette.background }]}>
      <Spinner color={palette.accent} size="large" />
      <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
        Loading your walks and reminders...
      </ThemedText>
    </YStack>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
});
