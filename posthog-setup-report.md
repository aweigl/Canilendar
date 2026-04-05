<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Canilendar, a React Native Expo dog-walking appointment scheduler. The integration covers the full user lifecycle — from Apple Sign In and onboarding through appointment management, subscription conversion, and account deletion. This session extended the existing foundation with additional event coverage across the onboarding flow, paywall, and settings screens, and rebuilt the PostHog dashboard with five new insights.

**Files modified in this session:**

- `.env` — `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` confirmed and updated
- `app/onboarding/dog.tsx` — `onboarding_dog_step_completed` when the user saves their first dog profile during setup
- `app/onboarding/appointment.tsx` — `onboarding_appointment_step_completed` when the user saves their first appointment during setup
- `app/onboarding/reminders.tsx` — `notification_permission_requested` with `result` and `source` properties when permission is requested during onboarding
- `app/paywall.tsx` — `paywall_dismissed` with `trigger` property when user taps "Not now"
- `app/(tabs)/settings.tsx` — `subscription_restored` on successful purchase restore

## Events

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with Apple; includes `provider` | `context/app-session-context.tsx` |
| `user_signed_out` | User signed out of their account | `context/app-session-context.tsx` |
| `account_deleted` | User deleted their account and all local data | `context/app-session-context.tsx` |
| `onboarding_started` | User tapped "Start setup" on the onboarding welcome screen | `app/onboarding/index.tsx` |
| `onboarding_dog_step_completed` | User saved their first dog profile during onboarding; includes `is_edit` | `app/onboarding/dog.tsx` |
| `onboarding_appointment_step_completed` | User saved their first appointment during onboarding; includes `is_recurring`, `has_pickup_time` | `app/onboarding/appointment.tsx` |
| `notification_permission_requested` | Notification permission requested; includes `result` and `source` | `app/onboarding/reminders.tsx` |
| `onboarding_completed` | User finished all 5 onboarding steps | `app/onboarding/success.tsx` |
| `appointment_created` | New appointment saved; includes `is_recurring`, `has_pickup_time`, `reminder_minutes_before`, `dog_mode` | `app/appointment.tsx` |
| `appointment_updated` | Existing appointment edited and saved | `app/appointment.tsx` |
| `appointment_deleted` | Appointment deleted | `app/appointment.tsx` |
| `dog_saved` | Dog profile created or updated; includes `is_edit` | `app/(tabs)/dogs.tsx` |
| `dog_deleted` | Dog profile deleted | `app/(tabs)/dogs.tsx` |
| `paywall_viewed` | Paywall screen opened; includes `trigger` | `app/paywall.tsx` |
| `paywall_dismissed` | User tapped "Not now" on the paywall; includes `trigger` | `app/paywall.tsx` |
| `subscription_purchased` | Purchase completed; includes package, price, currency, trigger | `app/paywall.tsx` |
| `subscription_restore_attempted` | User tapped Restore Purchases | `app/(tabs)/settings.tsx` |
| `subscription_restored` | Purchase restore completed successfully | `app/(tabs)/settings.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/153561/dashboard/604570
- **Onboarding funnel** (started → dog → appointment → completed): https://eu.posthog.com/project/153561/insights/9K1Yvg8h
- **Paywall conversion funnel** (paywall viewed → subscription purchased): https://eu.posthog.com/project/153561/insights/dFm5ydNX
- **New sign-ins and completed onboardings** (daily trends): https://eu.posthog.com/project/153561/insights/kOGsuBP0
- **Appointment activity** (created, updated, deleted per day): https://eu.posthog.com/project/153561/insights/1xw7pixs
- **Paywall views, purchases, and dismissals** (daily trends): https://eu.posthog.com/project/153561/insights/0SqLVe5P

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
