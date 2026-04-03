import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import {
  buildDailySummaryBody,
  describeReminder,
  formatLongDate,
  formatTimeLabel,
  getNextNotificationTime,
  getUpcomingOccurrences,
} from '@/lib/date';
import type { AppointmentOccurrence, NotificationPermissionState, PersistedAppState } from '@/types/domain';

const NOTIFICATION_WINDOW_DAYS = 14;
const MAX_APPOINTMENT_NOTIFICATIONS = 50;
const APPOINTMENT_CATEGORY_ID = 'appointmentReminder';
const DAILY_SUMMARY_CATEGORY_ID = 'dailySummary';
export const OPEN_APPOINTMENT_ACTION_ID = 'openAppointment';
export const OPEN_AGENDA_ACTION_ID = 'openAgenda';

function buildAppointmentSubtitle(occurrence: AppointmentOccurrence) {
  return `Appointment at ${formatTimeLabel(occurrence.startAt)}`;
}

function buildAppointmentBody(occurrence: AppointmentOccurrence) {
  const detailParts = [
    occurrence.dog.address,
    `Reminder ${describeReminder(occurrence.appointment.reminderMinutesBefore)}`,
  ];

  if (occurrence.dog.notes) {
    detailParts.push(occurrence.dog.notes);
  }

  return detailParts.join(' • ');
}

function buildSummarySubtitle(targetDate: Date, occurrenceCount: number) {
  const appointmentLabel = occurrenceCount === 1 ? 'appointment' : 'appointments';
  return `${formatLongDate(targetDate)} • ${occurrenceCount} ${appointmentLabel}`;
}

export function configureNotificationHandling() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'ios') {
    void registerNotificationCategories();
  }
}

async function registerNotificationCategories() {
  await Notifications.setNotificationCategoryAsync(APPOINTMENT_CATEGORY_ID, [
    {
      buttonTitle: 'Open appointment',
      identifier: OPEN_APPOINTMENT_ACTION_ID,
      options: {
        opensAppToForeground: true,
      },
    },
  ]);

  await Notifications.setNotificationCategoryAsync(DAILY_SUMMARY_CATEGORY_ID, [
    {
      buttonTitle: 'Open agenda',
      identifier: OPEN_AGENDA_ACTION_ID,
      options: {
        opensAppToForeground: true,
      },
    },
  ]);
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
        title: occurrence.dog.name,
        subtitle: buildAppointmentSubtitle(occurrence),
        body: buildAppointmentBody(occurrence),
        sound: 'default',
        categoryIdentifier: Platform.OS === 'ios' ? APPOINTMENT_CATEGORY_ID : undefined,
        data: {
          type: 'appointment',
          appointmentId: occurrence.appointment.id,
          occurrenceDate: occurrence.occurrenceDate,
          url: `/appointment?appointmentId=${occurrence.appointment.id}`,
        },
        ...(Platform.OS === 'ios' ? { interruptionLevel: 'active' as const } : null),
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
        title: 'Today in Canilander',
        subtitle: buildSummarySubtitle(targetDate, occurrences.length),
        body: buildDailySummaryBody(occurrences),
        sound: 'default',
        categoryIdentifier: Platform.OS === 'ios' ? DAILY_SUMMARY_CATEGORY_ID : undefined,
        data: {
          type: 'daily-summary',
          date: targetDate.toISOString(),
          url: '/',
        },
        ...(Platform.OS === 'ios' ? { interruptionLevel: 'active' as const } : null),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: summaryTime,
      },
    });
  }
}
