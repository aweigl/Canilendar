import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect } from "react";

export function useNotificationNavigation() {
  useEffect(() => {
    function redirectFromNotification(
      notification: Notifications.Notification,
    ) {
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

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirectFromNotification(response.notification);
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
