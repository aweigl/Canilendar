import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingView } from '@/components/loading-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AppButton } from '@/components/ui/app-button';
import { ChoiceChip } from '@/components/ui/choice-chip';
import { Colors, Fonts } from '@/constants/theme';
import { useCanilander } from '@/context/canilander-context';
import { formatTimeInputValue, parseTimeValue } from '@/lib/date';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { REMINDER_OPTIONS } from '@/types/domain';

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
  } = useCanilander();
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isLoaded) {
    return <LoadingView />;
  }

  async function handlePermissionAction() {
    const status = await requestNotificationPermission();

    if (status === 'denied') {
      Alert.alert(
        'Notifications are off',
        'Open iPhone Settings for Canilander if you want reminder banners and daily summaries.'
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

    return 'Canilander will ask when you save an appointment or tap enable.';
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Settings</ThemedText>
          <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
            Adjust how Canilander reminds you about the day ahead.
          </ThemedText>
        </View>

        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}>
          <ThemedText style={styles.cardTitle}>Notifications</ThemedText>
          <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
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
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}>
          <View style={styles.row}>
            <View style={styles.copy}>
              <ThemedText style={styles.cardTitle}>Daily summary</ThemedText>
              <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
                One reminder every morning with the day&apos;s appointments.
              </ThemedText>
            </View>
            <Switch
              onValueChange={(value) => updateSettings({ dailySummaryEnabled: value })}
              trackColor={{ false: palette.border, true: palette.accentSoft }}
              thumbColor={settings.dailySummaryEnabled ? palette.accent : '#F9F4EE'}
              value={settings.dailySummaryEnabled}
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
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}>
          <ThemedText style={styles.cardTitle}>Default event reminder</ThemedText>
          <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
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
              backgroundColor: palette.card,
              borderColor: palette.border,
            },
          ]}>
          <ThemedText style={styles.cardTitle}>Storage</ThemedText>
          <ThemedText lightColor={palette.muted} darkColor={palette.muted}>
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
    gap: 18,
    padding: 20,
    paddingBottom: 140,
  },
  header: {
    gap: 6,
  },
  title: {
    fontFamily: Fonts.rounded,
    fontSize: 34,
    fontWeight: '700',
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 22,
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  actions: {
    gap: 10,
  },
  timePickerWrap: {
    gap: 8,
  },
  inputLabel: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
