import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import {
  buildDailySummaryBody,
  formatLongDate,
  formatTimeLabel,
  getNextNotificationTime,
  getUpcomingOccurrences,
} from '@/lib/date';
import type { NotificationPermissionState, PersistedAppState } from '@/types/domain';

const NOTIFICATION_WINDOW_DAYS = 14;
const MAX_APPOINTMENT_NOTIFICATIONS = 50;

export function configureNotificationHandling() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function getNotificationPermissionState(): Promise<NotificationPermissionState> {
  const permissions = await Notifications.getPermissionsAsync();

  if (permissions.granted || permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return 'granted';
  }

  if (permissions.canAskAgain) {
    return 'undetermined';
  }

  return 'denied';
}

export async function requestNotificationAccess(): Promise<NotificationPermissionState> {
  const currentStatus = await getNotificationPermissionState();

  if (currentStatus === 'granted') {
    return currentStatus;
  }

  const requested = await Notifications.requestPermissionsAsync();

  if (requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return 'granted';
  }

  return requested.canAskAgain ? 'undetermined' : 'denied';
}

export async function syncScheduledNotifications(state: PersistedAppState) {
  const permissionState = await getNotificationPermissionState();

  if (permissionState !== 'granted') {
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('appointments', {
      name: 'Appointments',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'default',
    });
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();
  const upcomingOccurrences = getUpcomingOccurrences(
    state.appointments,
    state.dogs,
    now,
    NOTIFICATION_WINDOW_DAYS
  )
    .filter((occurrence) => occurrence.reminderAt && occurrence.reminderAt.getTime() > now.getTime())
    .sort((left, right) => left.startAt.getTime() - right.startAt.getTime())
    .slice(0, MAX_APPOINTMENT_NOTIFICATIONS);

  for (const occurrence of upcomingOccurrences) {
    if (!occurrence.reminderAt) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${occurrence.dog.name} at ${formatTimeLabel(occurrence.startAt)}`,
        body: `${occurrence.appointment.kind.toUpperCase()} reminder - ${occurrence.dog.address}`,
        sound: 'default',
        data: {
          type: 'appointment',
          appointmentId: occurrence.appointment.id,
          occurrenceDate: occurrence.occurrenceDate,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: occurrence.reminderAt,
      },
    });
  }

  if (!state.settings.dailySummaryEnabled) {
    return;
  }

  for (let offset = 0; offset < NOTIFICATION_WINDOW_DAYS; offset += 1) {
    const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const occurrences = getUpcomingOccurrences(state.appointments, state.dogs, targetDate, 1);
    const summaryTime = getNextNotificationTime(targetDate, state.settings.dailySummaryTime);

    if (occurrences.length === 0 || summaryTime.getTime() <= now.getTime()) {
      continue;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Today in Canilander - ${formatLongDate(targetDate)}`,
        body: buildDailySummaryBody(occurrences),
        sound: 'default',
        data: {
          type: 'daily-summary',
          date: targetDate.toISOString(),
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: summaryTime,
      },
    });
  }
}
