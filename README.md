# Canilendar

Canilendar is an Expo / React Native planner for dog-walking appointments with
Sign in with Apple, local reminders, and RevenueCat subscriptions.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Legal setup

Before shipping a public iOS build in Germany, replace the placeholder legal
data in [`lib/legal.ts`](./lib/legal.ts).

Optional public URLs can be configured with Expo public env vars:

```bash
EXPO_PUBLIC_IMPRINT_URL=https://example.com/imprint
EXPO_PUBLIC_PRIVACY_POLICY_URL=https://example.com/privacy
EXPO_PUBLIC_PRIVACY_CHOICES_URL=https://example.com/privacy-choices
```

If the hosted URLs are not configured yet, the app still shows the in-app legal
screens. For App Store release, you should still provide a public privacy-policy
URL in App Store Connect.

## EAS build environments

Do not put production keys into [`eas.json`](./eas.json) or commit them to this
public repo. This project uses EAS-managed environments instead:

- `development` builds read the EAS `development` environment
- `preview` builds read the EAS `preview` environment
- `production` builds read the EAS `production` environment

[`eas.json`](./eas.json) only selects the environment name for each profile. The
actual values must be stored in EAS.

### Required production vars

Create these in the EAS `production` environment before running a production
build:

```bash
eas env:create --environment production --name EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY --value YOUR_PRODUCTION_REVENUECAT_KEY
eas env:create --environment production --name EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN --value YOUR_POSTHOG_PROJECT_TOKEN
eas env:create --environment production --name EXPO_PUBLIC_POSTHOG_HOST --value https://eu.i.posthog.com
eas env:create --environment production --name EXPO_PUBLIC_IMPRINT_URL --value https://your-domain.example/imprint
eas env:create --environment production --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value https://your-domain.example/privacy
eas env:create --environment production --name EXPO_PUBLIC_PRIVACY_CHOICES_URL --value https://your-domain.example/privacy-choices
```

### Required preview vars

Create the same variables in the EAS `preview` environment with preview-safe
values:

```bash
eas env:create --environment preview --name EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY --value YOUR_PREVIEW_REVENUECAT_KEY
eas env:create --environment preview --name EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN --value YOUR_POSTHOG_PROJECT_TOKEN
eas env:create --environment preview --name EXPO_PUBLIC_POSTHOG_HOST --value https://eu.i.posthog.com
eas env:create --environment preview --name EXPO_PUBLIC_IMPRINT_URL --value https://your-domain.example/imprint
eas env:create --environment preview --name EXPO_PUBLIC_PRIVACY_POLICY_URL --value https://your-domain.example/privacy
eas env:create --environment preview --name EXPO_PUBLIC_PRIVACY_CHOICES_URL --value https://your-domain.example/privacy-choices
```

If you keep a local `.env.production`, treat it as a local reference only and
sync changes into EAS manually. Cloud builds do not read `.env.production`
directly.

### Build steps

1. Store the required variables in EAS for the target environment.
2. Optionally pull them locally before testing that profile:

   ```bash
   eas env:pull --environment production
   ```

3. Run the build:

   ```bash
   eas build --platform ios --profile production
   eas build --platform ios --profile preview
   ```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
