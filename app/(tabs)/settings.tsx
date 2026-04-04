import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '@/components/loading-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { useCanilendar } from '@/context/canilendar-context';
import { formatTimeInputValue, parseTimeValue } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { REMINDER_OPTIONS, type AppearanceMode } from '@/types/domain';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];
  const {
    isLoaded,
    notificationPermission,
    requestNotificationPermission,
    refreshNotificationPermission,
    settings,
    updateSettings,
    updateAppearanceMode,
  } = useCanilendar();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isLoaded) {
    return <LoadingView />;
  }

  async function handlePermissionAction() {
    const status = await requestNotificationPermission();

    if (status === 'denied') {
      Alert.alert(
        'Notifications are off',
        'Open iPhone Settings for Canilendar if you want reminder banners and daily summaries.'
      );
    }
  }

  async function handleRefreshPermission() {
    setIsRefreshing(true);
    await refreshNotificationPermission();
    setIsRefreshing(false);
  }

  function permissionCopy() {
    if (notificationPermission === 'granted') {
      return 'Local reminders are enabled.';
    }

    if (notificationPermission === 'denied') {
      return 'Notifications are blocked in system settings.';
    }

    return 'Canilendar will ask when you save an appointment or tap enable.';
  }

  function appearanceCopy() {
    if (settings.appearanceMode === 'light') {
      return 'Canilendar always stays in light mode.';
    }

    if (settings.appearanceMode === 'dark') {
      return 'Canilendar always stays in dark mode.';
    }

    return 'Canilendar follows your device appearance setting.';
  }

  const appearanceOptions: AppearanceMode[] = ['system', 'light', 'dark'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText type="eyebrow" lightColor={palette.support} darkColor={palette.support}>
            Planner preferences
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
          <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
            Adjust how Canilendar reminds you about the day ahead.
          </ThemedText>
        </View>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.support,
            },
          ]}>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            Notifications
          </ThemedText>
          <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
            {permissionCopy()}
          </ThemedText>
          <View style={styles.actions}>
            <AppButton
              label={notificationPermission === 'granted' ? 'Enabled' : 'Enable reminders'}
              onPress={handlePermissionAction}
              variant={notificationPermission === 'granted' ? 'secondary' : 'primary'}
            />
            <AppButton
              label={isRefreshing ? 'Refreshing...' : 'Refresh status'}
              onPress={handleRefreshPermission}
              variant="ghost"
            />
            {notificationPermission === 'denied' ? (
              <AppButton
                label="Open system settings"
                onPress={() => Linking.openSettings()}
                variant="secondary"
              />
            ) : null}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText type="sectionTitle" style={styles.cardTitle}>
                Daily summary
              </ThemedText>
              <ThemedText lightColor={palette.support} darkColor={palette.support}>
                One reminder every morning with the day&apos;s appointments.
              </ThemedText>
            </View>
            <ToggleSwitch
              checked={settings.dailySummaryEnabled}
              onCheckedChange={(value) => updateSettings({ dailySummaryEnabled: value })}
            />
          </View>

          {settings.dailySummaryEnabled ? (
            <View style={styles.timePickerWrap}>
              <ThemedText style={styles.inputLabel}>Summary time</ThemedText>
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'compact' : 'default'}
                mode="time"
                onChange={(_, value) => {
                  if (!value) {
                    return;
                  }

                  updateSettings({ dailySummaryTime: formatTimeInputValue(value) });
                }}
                value={parseTimeValue(settings.dailySummaryTime)}
              />
            </View>
          ) : null}
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            Appearance
          </ThemedText>
          <ThemedText lightColor={palette.support} darkColor={palette.support}>
            {appearanceCopy()}
          </ThemedText>
          <View style={styles.chips}>
            {appearanceOptions.map((mode) => (
              <ChoiceChip
                key={mode}
                label={mode === 'system' ? 'System' : mode === 'light' ? 'Light' : 'Dark'}
                onPress={() => updateAppearanceMode(mode)}
                selected={settings.appearanceMode === mode}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            Default event reminder
          </ThemedText>
          <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
            New appointments start with this reminder lead time. You can override it per appointment.
          </ThemedText>
          <View style={styles.chips}>
            {REMINDER_OPTIONS.map((minutes) => (
              <ChoiceChip
                key={minutes}
                label={`${minutes} min`}
                onPress={() => updateSettings({ defaultReminderMinutes: minutes })}
                selected={settings.defaultReminderMinutes === minutes}
              />
            ))}
          </View>
        </ThemedView>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.surface,
              borderColor: palette.border,
            },
          ]}>
          <ThemedText type="sectionTitle" style={styles.cardTitle}>
            Storage
          </ThemedText>
          <ThemedText lightColor={palette.textMuted} darkColor={palette.textMuted}>
            Appointments, dogs, and reminder preferences are stored only on this device in v1.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    gap: Spacing.md,
    padding: 20,
    paddingBottom: 140,
  },
  header: {
    gap: Spacing.xs,
  },
  title: {
    fontSize: 34,
  },
  card: {
    borderRadius: Radius.card,
    borderWidth: 1.5,
    gap: Spacing.sm,
    padding: 18,
  },
  cardTitle: {
    fontSize: 22,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  actions: {
    gap: Spacing.xs,
  },
  timePickerWrap: {
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
});
