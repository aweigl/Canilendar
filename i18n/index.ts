import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import type { AppLanguage, LanguagePreference } from "@/types/domain";

const resources = {
  en: {
    translation: {
      tabs: {
        calendar: "Calendar",
        dogs: "Dogs",
        settings: "Settings",
      },
      common: {
        cancel: "Cancel",
        closeKeyboard: "Close keyboard",
        delete: "Delete",
        edit: "Edit",
        enabled: "Enabled",
        system: "System",
        useDevice: "Use device",
        light: "Light",
        dark: "Dark",
        pickerDate: "Date",
        pickupTime: "Pickup time",
        weekdayShort: {
          mon: "Mon",
          tue: "Tue",
          wed: "Wed",
          thu: "Thu",
          fri: "Fri",
          sat: "Sat",
          sun: "Sun",
        },
      },
      home: {
        badge: "Daily dog-walk planner",
        description:
          "Stay on top of pickups, repeat walks, and today's route without leaving your phone calendar half-finished.",
        monthView: "Month",
        weekView: "Week table",
        weekTable: "Week table",
        weekCount_one: "{{count}} dog",
        weekCount_other: "{{count}} dogs",
        weekEmpty: "No walks scheduled",
        weekMore_one: "+{{count}} more walk",
        weekMore_other: "+{{count}} more walks",
        newAppointment: "New appointment",
        agenda: "Agenda",
        emptyTitle: "No agenda entries for this day",
        emptyDescription:
          "Add an appointment for this date and it will show up here as a dog card.",
      },
      welcome: {
        eyebrow: "Canilendar",
        title: "Welcome to Canilendar",
        description: "Your professional dog-walking planner",
        valuePointOne:
          "Save each client dog once, then book repeat walks in seconds.",
        valuePointTwo:
          "See pickups, recurring appointments, and free capacity in one working agenda.",
        valuePointThree:
          "Keep admin light while your route grows with unlimited dogs and bookings in Pro.",
        appleUnavailable:
          "Sign in with Apple needs an iPhone or iPad development build.",
        signInErrorTitle: "Apple sign-in failed",
        footer:
          "Your appointments stay on this device in v1, and purchases stay linked to your Apple sign-in.",
      },
      appointment: {
        screenTitleNew: "New Appointment",
        screenTitleEdit: "Edit Appointment",
        eyebrow: "Scheduler details",
        titleNew: "New appointment",
        titleEdit: "Edit appointment",
        description:
          "Capture the dog, pickup details, time, repeat pattern, and reminder in one place.",
        dogDetails: "Dog details",
        savedDog: "Saved dog",
        newDog: "New dog",
        noSavedDogs:
          'No dogs saved yet. Switch to "New dog" to create the first profile.',
        savedDogsHelp:
          "Choose a saved dog. The address, owner phone, and notes shown in each card belong to that dog profile.",
        dogName: "Dog name",
        pickupAddress: "Pickup address",
        ownerPhone: "Owner phone",
        dogNotes: "Dog notes",
        pickupTimeEnabled:
          "Adds a specific pickup time and enables reminder notifications.",
        pickupTimeDisabled:
          "Disabled by default. This walk stays on the day plan without a time-based reminder.",
        repeatWeekly: "Repeat weekly",
        recurringOn: "Shows on every selected weekday.",
        oneTime: "Keeps this as a one-time appointment.",
        reminderLeadTime: "Reminder lead time",
        reminderDisabled:
          "Enable pickup time if you want a reminder before the walk.",
        noPickupTime: "No pickup time",
        appointmentNotes: "Appointment notes",
        reminderPreview:
          "Reminder time: {{time}} with a {{count}}-minute heads-up.",
        saveChanges: "Save changes",
        createAppointment: "Create appointment",
        deleteAppointment: "Delete appointment",
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "12 Bark Street",
          ownerPhone: "+49 123 456 789",
          dogNotes: "Gate code, collar note, feeding reminder...",
          appointmentNotes: "Meet owner at side entrance, bring extra towel...",
        },
        alerts: {
          missingDogDetailsTitle: "Missing dog details",
          missingDogDetailsBody:
            "Add the dog name, address, and owner phone number first.",
          chooseDogTitle: "Choose a dog",
          chooseDogBody:
            "Select an existing dog or switch to a new dog profile.",
          dayLimitTitle: "Daily limit reached",
          dayLimitBody:
            "This would exceed your {{limit}}-dog daily limit on {{dates}}.",
          repeatDaysTitle: "Pick repeat days",
          repeatDaysBody: "Choose at least one weekday for the recurring walk.",
          pastAppointmentTitle: "Past appointment",
          pastAppointmentBody:
            "New appointments need to be scheduled in the future.",
          saveFailedTitle: "Could not save appointment",
          saveFailedBody:
            "Try again in a moment. If the problem continues, review the dog details and selected time.",
          deleteTitle: "Delete appointment?",
          deleteBody:
            "This removes the appointment and its scheduled reminders.",
        },
      },
      dogs: {
        eyebrow: "Saved dog profiles",
        title: "Dogs",
        description:
          "Keep client details reusable so appointments can be added in seconds.",
        photoLabel: "Photo",
        photoHint:
          "Add an optional photo from the camera or your photo library.",
        addPhotoTitle: "Add dog photo",
        changePhoto: "Change photo",
        changePhotoHint: "Tap to change photo",
        addFromCamera: "Take photo",
        chooseFromLibrary: "Choose from library",
        removePhoto: "Remove photo",
        addDog: "Add dog",
        editorAddTitle: "Add a dog profile",
        editorEditTitle: "Edit dog profile",
        notes: "Notes",
        createDog: "Create dog",
        saveChanges: "Save changes",
        cancel: "Cancel",
        emptyTitle: "No dogs saved yet",
        emptyDescription:
          "Add your first dog so future appointments can be scheduled from a saved profile.",
        upcomingAppointments_one: "{{count}} upcoming appointment",
        upcomingAppointments_other: "{{count}} upcoming appointments",
        alerts: {
          missingDogDetailsTitle: "Missing dog details",
          missingDogDetailsBody:
            "Please add a name, address, and owner phone number.",
          deleteTitle: "Delete {{name}}?",
          deleteBody:
            "This only works when the dog has no scheduled appointments.",
          stillScheduledTitle: "Dog still scheduled",
          stillScheduledBody:
            "Remove or reassign this dog's appointments before deleting the profile.",
          cameraPermissionTitle: "Camera access needed",
          cameraPermissionBody:
            "Allow camera access if you want to take a photo for this dog profile.",
          libraryPermissionTitle: "Photo library access needed",
          libraryPermissionBody:
            "Allow photo-library access if you want to choose an existing dog photo.",
          photoProcessingTitle: "Could not use photo",
          photoProcessingBody: "Try another photo or try again in a moment.",
        },
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "12 Bark Street",
          ownerPhone: "+49 123 456 789",
          notes: "Gate code, feeding note, leash routine...",
        },
        search: {
          label: "Search dogs",
          placeholder: "Search by dog name",
        },
      },
      settings: {
        eyebrow: "Planner preferences",
        title: "Settings",
        description: "Adjust how Canilendar reminds you about the day ahead.",
        notifications: "Notifications",
        notificationsEnabled: "Local reminders are enabled.",
        notificationsDenied: "Notifications are blocked in system settings.",
        notificationsUnknown:
          "Canilendar will ask when you save an appointment or tap enable.",
        enableReminders: "Enable reminders",
        refreshStatus: "Refresh status",
        refreshingStatus: "Refreshing...",
        openSystemSettings: "Open system settings",
        dailySummary: "Daily summary",
        dailySummaryDescription:
          "One reminder every morning with the day's appointments.",
        summaryTime: "Summary time",
        language: "Language",
        languageDescription:
          "Choose a fixed language or use your phone's language. Unsupported device languages fall back to English.",
        languageCurrent:
          "Device language: {{language}}. Current app language: {{currentLanguage}}.",
        appearance: "Appearance",
        appearanceSystem: "Canilendar follows your device appearance setting.",
        appearanceLight: "Canilendar always stays in light mode.",
        appearanceDark: "Canilendar always stays in dark mode.",
        defaultReminder: "Default event reminder",
        defaultReminderDescription:
          "New appointments start with this reminder lead time. You can override it per appointment.",
        dailyAppointmentLimit: "Appointments per day",
        dailyAppointmentLimitDescription:
          "Limit each day to {{count}} dog appointments. You can choose up to 15.",
        account: {
          title: "Account",
          description:
            "Apple sign-in unlocks your planner and links purchases to the same identity in RevenueCat.",
          signedInAs: "Signed in as {{value}}",
          revenueCatReference: "RevenueCat reference: {{value}}",
          signOut: "Sign out",
          signOutTitle: "Sign out?",
          signOutBody:
            "You can sign back in with Apple anytime. Your local planner data stays attached to this Apple account on this device.",
          deleteAction: "Delete account",
          deleteTitle: "Delete account?",
          deleteBody:
            "This removes your local planner data, clears the Apple sign-in session on this device, and cancels scheduled reminders. Apple and RevenueCat may still keep purchase records where required for billing, fraud prevention, or legal retention duties.",
          deletingAccount: "Deleting account...",
          deleteFailedTitle: "Account deletion failed",
          deleteSuccessTitle: "Account deleted",
          deleteSuccessBody:
            "Canilendar removed the local account data from this device. If you still have an active subscription, manage or cancel it in Apple's subscription settings.",
          manageSubscription: "Manage subscription",
        },
        pro: {
          title: "Canilendar Pro",
          description:
            "Upgrade only when you need more than the first free dog and appointment.",
          active: "Canilendar Pro is active.",
          unavailable: "Purchases are not configured on this build yet.",
          freeTier:
            "You are on the free tier with 1 dog and 1 appointment included.",
          upgrade: "Upgrade to Pro",
          restore: "Restore purchases",
          restoring: "Restoring...",
          restoreFailedTitle: "Restore failed",
          restoreSuccessTitle: "Restore complete",
          restoreSuccessBody: "Your subscription status has been refreshed.",
          customerCenter: "Open Customer Center",
          customerCenterTitle: "Customer Center",
          currentOffering:
            "Current offering: {{identifier}} with {{count}} package options.",
          expoGo:
            "This build is running in Expo Go preview mode. Use `npx expo run:ios` to test real RevenueCat purchases, restores, and Customer Center.",
          hostedUi:
            "Hosted RevenueCat Paywall UI and Customer Center need an iOS development build or production build. They are unavailable in Expo Go.",
        },
        devReset: {
          title: "Reset local data?",
          body: "This DEV action removes all dogs, appointments, settings, and onboarding progress saved on this simulator.",
          button: "Reset local data",
          confirm: "Reset",
        },
        devSeed: {
          title: "Load sample data?",
          body: "This DEV action replaces the current local dogs, appointments, settings, and onboarding progress with sample data for layout testing.",
          button: "Load sample data",
          confirm: "Load",
        },
        devRestartOnboarding: {
          title: "Restart onboarding?",
          body: "This DEV action marks onboarding as incomplete and sends you back to the onboarding flow without clearing your signed-in session or saved dogs and appointments.",
          button: "Restart onboarding",
          confirm: "Restart",
        },
        devTools: {
          title: "DEV Tools",
          description:
            "Trigger a local test notification, load sample data, or clear locally saved app data on this simulator or device.",
          showNotification: "Show notification",
          showNotificationLoading: "Showing notification...",
          showSplash: "Show splash screen",
          previewAppleSignIn: "Preview Apple sign-in",
        },
        storage: "Storage",
        storageDescription:
          "Appointments, dogs, and reminder preferences are stored only on this device in v1.",
        alerts: {
          notificationsOffTitle: "Notifications are off",
          notificationsOffBody:
            "Open system settings for Canilendar if you want reminder banners and daily summaries.",
        },
      },
      legal: {
        sectionTitle: "Legal",
        sectionDescription:
          "Keep the imprint, privacy policy, and account deletion flow reachable at any time.",
        imprintEyebrow: "Legal notice",
        imprintTitle: "Imprint",
        imprintDescription: "Publisher and contact information for Canilendar.",
        privacyEyebrow: "Privacy",
        privacyTitle: "Privacy Policy",
        privacyDescription:
          "How Canilendar processes account, subscription, reminder, and planner data.",
        openHostedAction: "Open hosted version",
        privacyChoicesAction: "Privacy choices",
        emailAction: "Email legal contact",
        emailUnavailableTitle: "Could not open email",
        emailUnavailableBody:
          "No mail app is configured on this device. Please email us at {{email}}.",
        cookieBannerNote:
          "The current native iOS build does not use a generic cookie banner because no optional analytics or marketing trackers are active.",
      },
      onboarding: {
        welcome: {
          title: "Build your first calm day.",
          description: "Many dogs, many walks. One reminder flow.",
          cta: "Start setup",
        },
        dog: {
          title: "Add your first dog.",
          description: "A reusable profile for every future walk.",
          createCta: "Create dog",
          saveAndContinue: "Save and continue",
        },
        appointment: {
          eyebrow: "First appointment",
          title: "Put the first walk on the calendar",
          descriptionWithDog:
            "{{name}} is ready. Pick the day, time, and repeat pattern.",
          descriptionWithoutDog: "Pick the day, time, and repeat pattern.",
          missingDogTitle: "Missing dog",
          missingDogBody: "Create the dog profile first.",
          pickupTimeEnabled: "A specific pickup time is enabled for this walk.",
          pickupTimeDisabled:
            "Leave this off if pickup happens sometime in the morning.",
          oneTime: "Keeps the first appointment as a one-time walk.",
          reminderDisabled:
            "No pickup-time reminder will be scheduled until you enable a time.",
          createCta: "Create appointment",
          save: "Save appointment",
          pastAppointmentBody:
            "The first appointment needs to be in the future.",
        },
        reminders: {
          eyebrow: "Reminders",
          title: "Turn on notifications when you're ready",
          description:
            "Your first dog and first appointment are saved already, so enabling reminders now immediately has value.",
          deniedTitle: "Notifications are off",
          deniedBody:
            "You can still finish setup now and enable reminders later in Settings.",
          appointmentAlertsTitle: "Appointment alerts",
          appointmentAlertsBody: "Get a heads-up before pickup time.",
          dailySummaryTitle: "Daily summary",
          dailySummaryBody: "See the day ahead from one morning reminder.",
          maybeLater: "Maybe later",
        },
        success: {
          title: "Your first day is live.",
          description: "Calendar unlocked. Dog saved. Ready to book more.",
          cta: "Open my calendar",
        },
      },
      notifications: {
        openAppointment: "Open appointment",
        openAgenda: "Open agenda",
        channelName: "Appointments",
        appointmentSubtitle: "Appointment at {{time}}",
        reminderPrefix: "Reminder {{offset}}",
        todayTitle: "Today in Canilendar",
        noAppointmentsToday: "You have no dog appointments scheduled today.",
        devTestTitle: "Eddi",
        devTestSubtitle: "Appointment at 9:00 AM",
        devTestBody:
          "12 Bark Street • Reminder 30 minutes before • Meet owner at side entrance.",
        summarySubtitle_one: "{{date}} • {{count}} appointment",
        summarySubtitle_other: "{{date}} • {{count}} appointments",
        summaryMore_one: "{{headline}} • +{{count}} more",
        summaryMore_other: "{{headline}} • +{{count}} more",
      },
      recurrence: {
        oneTime: "One-time",
        every: "Every {{days}}",
      },
      reminder: {
        beforeMinutes_one: "{{count}} minute before",
        beforeMinutes_other: "{{count}} minutes before",
        beforeHours_one: "{{count}} hour before",
        beforeHours_other: "{{count}} hours before",
        beforeHoursMinutes: "{{hours}}h {{minutes}}m before",
      },
      dog: {
        selected: "Selected",
      },
      dogCard: {
        selected: "Selected",
        savedDog: "Saved dog",
        pickup: "Pickup: {{value}}",
        owner: "Owner: {{value}}",
        notes: "Notes: {{value}}",
        noNotes: "No extra notes saved for this dog.",
      },
      languages: {
        en: "English",
        de: "Deutsch",
        fr: "Français",
        es: "Español",
      },
    },
  },
  de: {
    translation: {
      tabs: {
        calendar: "Kalender",
        dogs: "Hunde",
        settings: "Einstellungen",
      },
      common: {
        cancel: "Abbrechen",
        closeKeyboard: "Tastatur schließen",
        delete: "Löschen",
        edit: "Bearbeiten",
        enabled: "Aktiviert",
        system: "System",
        useDevice: "Gerätesprache verwenden",
        light: "Hell",
        dark: "Dunkel",
        pickerDate: "Datum",
        pickupTime: "Abholzeit",
        weekdayShort: {
          mon: "Mo",
          tue: "Di",
          wed: "Mi",
          thu: "Do",
          fri: "Fr",
          sat: "Sa",
          sun: "So",
        },
      },
      home: {
        badge: "Planer für tägliche Gassi-Runden",
        description:
          "Behalte Abholungen, wiederkehrende Spaziergänge und die Route des Tages im Blick, ohne deinen Handykalender halb gepflegt zu hinterlassen.",
        monthView: "Monat",
        weekView: "Wochenübersicht",
        weekTable: "Wochenübersicht",
        weekCount_one: "{{count}} Hund",
        weekCount_other: "{{count}} Hunde",
        weekEmpty: "Keine Spaziergänge geplant",
        weekMore_one: "+{{count}} weiterer Spaziergang",
        weekMore_other: "+{{count}} weitere Spaziergänge",
        newAppointment: "Neuer Termin",
        agenda: "Tagesplan",
        emptyTitle: "Keine Einträge für diesen Tag",
        emptyDescription:
          "Füge für dieses Datum einen Termin hinzu. Er erscheint dann hier als Hundekarte.",
      },
      welcome: {
        eyebrow: "Canilendar",
        title: "Willkommen bei Canilendar",
        description: "Deinem professionellen Dogwalking-Planner",
        valuePointOne:
          "Speichere jeden Kundenhund einmal und plane wiederkehrende Spaziergänge danach in wenigen Sekunden.",
        valuePointTwo:
          "Sieh Abholungen, wiederkehrende Termine und freie Kapazitäten in einer Arbeitsagenda.",
        valuePointThree:
          "Halte den Verwaltungsaufwand klein, auch wenn deine Route mit Pro unbegrenzt wächst.",
        appleUnavailable:
          "„Mit Apple anmelden“ erfordert einen iPhone- oder iPad-Development-Build.",
        signInErrorTitle: "Apple-Anmeldung fehlgeschlagen",
        footer:
          "Deine Termine bleiben in v1 auf diesem Gerät und Käufe bleiben mit deiner Apple-Anmeldung verknüpft.",
      },
      appointment: {
        screenTitleNew: "Neuer Termin",
        screenTitleEdit: "Termin bearbeiten",
        eyebrow: "Termindetails",
        titleNew: "Neuen Termin erstellen",
        titleEdit: "Termin bearbeiten",
        description:
          "Erfasse Hund, Abholdetails, Uhrzeit, Wiederholung und Erinnerung an einem Ort.",
        dogDetails: "Hundedaten",
        savedDog: "Gespeicherter Hund",
        newDog: "Neuer Hund",
        noSavedDogs:
          'Es sind noch keine Hunde gespeichert. Wechsle zu "Neuer Hund", um das erste Profil anzulegen.',
        savedDogsHelp:
          "Wähle einen gespeicherten Hund. Adresse, Telefonnummer und Notizen in jeder Karte gehören zu diesem Profil.",
        dogName: "Hundename",
        pickupAddress: "Abholadresse",
        ownerPhone: "Telefonnummer des Besitzers",
        dogNotes: "Hinweise zum Hund",
        pickupTimeEnabled:
          "Fügt eine konkrete Abholzeit hinzu und aktiviert Erinnerungen für diesen Termin.",
        pickupTimeDisabled:
          "Standardmäßig deaktiviert. Dieser Termin bleibt ohne zeitbasierte Erinnerung im Tagesplan.",
        repeatWeekly: "Wöchentlich wiederholen",
        recurringOn: "Erscheint an jedem ausgewählten Wochentag.",
        oneTime: "Bleibt ein einmaliger Termin.",
        reminderLeadTime: "Erinnerungsvorlauf",
        reminderDisabled:
          "Aktiviere eine Abholzeit, wenn du vor dem Spaziergang erinnert werden möchtest.",
        noPickupTime: "Keine Abholzeit",
        appointmentNotes: "Notizen zum Termin",
        reminderPreview:
          "Erinnerungszeit: {{time}} mit {{count}} Minuten Vorlauf.",
        saveChanges: "Anderungen speichern",
        createAppointment: "Termin anlegen",
        deleteAppointment: "Termin löschen",
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "Bellenweg 12",
          ownerPhone: "+49 123 456 789",
          dogNotes: "Torcode, Halsband-Hinweis, Futtererinnerung...",
          appointmentNotes:
            "Besitzer am Seiteneingang treffen, zusätzliches Handtuch mitbringen...",
        },
        alerts: {
          missingDogDetailsTitle: "Hundedaten fehlen",
          missingDogDetailsBody:
            "Füge zuerst Hundename, Adresse und Telefonnummer des Besitzers hinzu.",
          chooseDogTitle: "Hund auswählen",
          chooseDogBody:
            "Wähle einen gespeicherten Hund oder wechsle zu einem neuen Hundprofil.",
          dayLimitTitle: "Tageslimit erreicht",
          dayLimitBody:
            "Damit würde dein Tageslimit von {{limit}} Hunden am {{dates}} überschritten.",
          repeatDaysTitle: "Wiederholungstage auswählen",
          repeatDaysBody:
            "Wähle mindestens einen Wochentag für den wiederkehrenden Spaziergang.",
          pastAppointmentTitle: "Termin in der Vergangenheit",
          pastAppointmentBody: "Neue Termine müssen in der Zukunft liegen.",
          saveFailedTitle: "Termin konnte nicht gespeichert werden",
          saveFailedBody:
            "Bitte versuche es in einem Moment erneut. Wenn das Problem bestehen bleibt, prüfe die Hundedaten und die gewählte Zeit.",
          deleteTitle: "Termin löschen?",
          deleteBody:
            "Dadurch werden der Termin und seine Erinnerungen entfernt.",
        },
      },
      dogs: {
        eyebrow: "Gespeicherte Hundeprofile",
        title: "Hunde",
        description:
          "Halte Kundendetails wiederverwendbar, damit Termine in wenigen Sekunden angelegt werden können.",
        photoLabel: "Foto",
        photoHint:
          "Füge optional ein Foto aus der Kamera oder deiner Mediathek hinzu.",
        addPhotoTitle: "Hundefoto hinzufügen",
        changePhoto: "Foto ändern",
        changePhotoHint: "Tippe, um das Foto zu ändern",
        addFromCamera: "Foto aufnehmen",
        chooseFromLibrary: "Aus Mediathek wählen",
        removePhoto: "Foto entfernen",
        addDog: "Hund hinzufügen",
        editorAddTitle: "Hundeprofil anlegen",
        editorEditTitle: "Hundeprofil bearbeiten",
        notes: "Notizen",
        createDog: "Hund erstellen",
        saveChanges: "Anderungen speichern",
        cancel: "Abbrechen",
        emptyTitle: "Noch keine Hunde gespeichert",
        emptyDescription:
          "Füge deinen ersten Hund hinzu, damit zukünftige Termine aus einem gespeicherten Profil geplant werden können.",
        upcomingAppointments_one: "{{count}} kommender Termin",
        upcomingAppointments_other: "{{count}} kommende Termine",
        alerts: {
          missingDogDetailsTitle: "Hundedaten fehlen",
          missingDogDetailsBody:
            "Bitte trage Name, Adresse und Telefonnummer des Besitzers ein.",
          deleteTitle: "{{name}} löschen?",
          deleteBody:
            "Das funktioniert nur, wenn für diesen Hund keine Termine geplant sind.",
          stillScheduledTitle: "Hund ist noch eingeplant",
          stillScheduledBody:
            "Entferne oder übertrage zuerst die Termine dieses Hundes, bevor du das Profil löschst.",
          cameraPermissionTitle: "Kamerazugriff erforderlich",
          cameraPermissionBody:
            "Erlaube den Kamerazugriff, wenn du für dieses Hundeprofil ein Foto aufnehmen möchtest.",
          libraryPermissionTitle: "Zugriff auf die Mediathek erforderlich",
          libraryPermissionBody:
            "Erlaube den Zugriff auf die Mediathek, wenn du ein bestehendes Hundefoto auswählen möchtest.",
          photoProcessingTitle: "Foto konnte nicht verwendet werden",
          photoProcessingBody:
            "Versuche es mit einem anderen Foto oder probiere es gleich noch einmal.",
        },
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "Bellenweg 12",
          ownerPhone: "+49 123 456 789",
          notes: "Torcode, Futterhinweis, Leinenroutine...",
        },
        search: {
          label: "Hunde suchen",
          placeholder: "Nach Hundenamen suchen",
        },
      },
      settings: {
        eyebrow: "Einstellungen",
        title: "Einstellungen",
        description:
          "Lege fest, wie Canilendar dich an den kommenden Tag erinnert.",
        notifications: "Benachrichtigungen",
        notificationsEnabled: "Erinnerungen sind aktiviert.",
        notificationsDenied:
          "Benachrichtigungen sind in den Systemeinstellungen blockiert.",
        notificationsUnknown:
          "Canilendar fragt nach, wenn du einen Termin speicherst oder auf „Aktivieren“ tippst.",
        enableReminders: "Erinnerungen aktivieren",
        refreshStatus: "Status aktualisieren",
        refreshingStatus: "Aktualisiere...",
        openSystemSettings: "Systemeinstellungen öffnen",
        dailySummary: "Tageszusammenfassung",
        dailySummaryDescription:
          "Jeden Morgen eine Erinnerung mit den Terminen des Tages.",
        summaryTime: "Zeit der Zusammenfassung",
        language: "Sprache",
        languageDescription:
          "Wähle eine feste Sprache oder nutze die Sprache deines Telefons. Nicht unterstützte Gerätesprachen fallen auf Englisch zurück.",
        languageCurrent:
          "Gerätesprache: {{language}}. Aktuelle App-Sprache: {{currentLanguage}}.",
        appearance: "Darstellung",
        appearanceSystem:
          "Canilendar folgt der Darstellungseinstellung deines Geräts.",
        appearanceLight: "Canilendar bleibt immer im hellen Modus.",
        appearanceDark: "Canilendar bleibt immer im dunklen Modus.",
        defaultReminder: "Standard-Erinnerung",
        defaultReminderDescription:
          "Neue Termine starten mit dieser Vorlaufzeit. Du kannst sie für jeden Termin individuell anpassen.",
        dailyAppointmentLimit: "Termine pro Tag",
        dailyAppointmentLimitDescription:
          "Begrenze jeden Tag auf maximal {{count}} Hundetermine.",
        account: {
          title: "Konto",
          description:
            "Die Apple-Anmeldung schaltet deinen Planer frei und verknüpft Käufe in RevenueCat mit derselben Identität.",
          signedInAs: "Angemeldet als {{value}}",
          revenueCatReference: "RevenueCat-Referenz: {{value}}",
          signOut: "Abmelden",
          signOutTitle: "Abmelden?",
          signOutBody:
            "Du kannst dich jederzeit wieder mit Apple anmelden. Deine lokalen Planerdaten bleiben auf diesem Gerät mit diesem Apple-Konto verknüpft.",
          deleteAction: "Konto löschen",
          deleteTitle: "Konto löschen?",
          deleteBody:
            "Dadurch werden deine lokalen Planerdaten entfernt, die Apple-Anmeldung auf diesem Gerät gelöscht und geplante Erinnerungen aufgehoben. Apple und RevenueCat können Kaufnachweise weiter speichern, soweit dies für Abrechnung, Betrugsprävention oder gesetzliche Aufbewahrungspflichten erforderlich ist.",
          deletingAccount: "Konto wird gelöscht...",
          deleteFailedTitle: "Konto-Löschung fehlgeschlagen",
          deleteSuccessTitle: "Konto gelöscht",
          deleteSuccessBody:
            "Canilendar hat die lokalen Kontodaten auf diesem Gerät entfernt. Wenn noch ein aktives Abo besteht, verwalte oder kündige es in den Apple-Aboeinstellungen.",
          manageSubscription: "Abo verwalten",
        },
        pro: {
          title: "Canilendar Pro",
          description:
            "Upgrade nur, wenn du mehr als den ersten kostenlosen Hund und Termin brauchst.",
          active: "Canilendar Pro ist aktiv.",
          unavailable: "Käufe sind in diesem Build noch nicht eingerichtet.",
          freeTier: "Du nutzt den kostenlosen Tarif mit 1 Hund und 1 Termin.",
          upgrade: "Auf Pro upgraden",
          restore: "Käufe wiederherstellen",
          restoring: "Stelle wieder her...",
          restoreFailedTitle: "Wiederherstellung fehlgeschlagen",
          restoreSuccessTitle: "Wiederherstellung abgeschlossen",
          restoreSuccessBody: "Dein Abo-Status wurde aktualisiert.",
          customerCenter: "Customer Center öffnen",
          customerCenterTitle: "Customer Center",
          currentOffering:
            "Aktuelles Angebot: {{identifier}} mit {{count}} Paketoptionen.",
          expoGo:
            "Dieser Build läuft im Expo-Go-Vorschaumodus. Verwende `npx expo run:ios`, um echte RevenueCat-Käufe, Wiederherstellungen und das Customer Center zu testen.",
          hostedUi:
            "Die gehostete RevenueCat-Paywall und das Customer Center benötigen einen iOS-Development-Build oder einen Produktions-Build. In Expo Go sind sie nicht verfügbar.",
        },
        devReset: {
          title: "Lokale Daten zurücksetzen?",
          body: "Diese DEV-Aktion entfernt alle Hunde, Termine, Einstellungen und den Onboarding-Fortschritt von diesem Simulator.",
          button: "Lokale Daten zurücksetzen",
          confirm: "Zurücksetzen",
        },
        devSeed: {
          title: "Beispieldaten laden?",
          body: "Diese DEV-Aktion ersetzt die aktuell lokal gespeicherten Hunde, Termine, Einstellungen und den Onboarding-Fortschritt durch Beispieldaten für Layout-Tests.",
          button: "Beispieldaten laden",
          confirm: "Laden",
        },
        devRestartOnboarding: {
          title: "Onboarding neu starten?",
          body: "Diese DEV-Aktion markiert das Onboarding wieder als unvollständig und bringt dich zurück in den Onboarding-Flow, ohne deine Anmeldung oder gespeicherte Hunde und Termine zu löschen.",
          button: "Onboarding neu starten",
          confirm: "Neu starten",
        },
        devTools: {
          title: "DEV-Werkzeuge",
          description:
            "Löse eine lokale Test-Benachrichtigung aus, lade Beispieldaten oder lösche lokal gespeicherte App-Daten auf diesem Simulator oder Gerät.",
          showNotification: "Benachrichtigung zeigen",
          showNotificationLoading: "Benachrichtigung wird gezeigt...",
          showSplash: "Splash Screen zeigen",
          previewAppleSignIn: "Apple-Anmeldung ansehen",
        },
        storage: "Speicher",
        storageDescription:
          "Termine, Hunde und Erinnerungseinstellungen werden in v1 nur auf diesem Gerät gespeichert.",
        alerts: {
          notificationsOffTitle: "Benachrichtigungen sind aus",
          notificationsOffBody:
            "Öffne die Systemeinstellungen für Canilendar, wenn du Banner und Tageszusammenfassungen erhalten möchtest.",
        },
      },
      legal: {
        sectionTitle: "Rechtliches",
        sectionDescription:
          "Impressum, Datenschutzerklärung und Konto-Löschung jederzeit erreichbar.",
        imprintEyebrow: "Impressum",
        imprintTitle: "Impressum",
        imprintDescription:
          "Angaben zum Anbieter und zu den Kontaktwegen von Canilendar.",
        privacyEyebrow: "Datenschutzerklärung",
        privacyTitle: "Datenschutzerklärung",
        privacyDescription:
          "Wie Canilendar Konto-, Abo-, Erinnerungs- und Planerdaten verarbeitet.",
        openHostedAction: "Gehostete Version öffnen",
        privacyChoicesAction: "Datenschutzeinstellungen",
        emailAction: "Rechtskontakt anschreiben",
        emailUnavailableTitle: "E-Mail konnte nicht geöffnet werden",
        emailUnavailableBody:
          "Auf diesem Gerät ist keine Mail-App eingerichtet. Schreibe uns bitte an {{email}}.",
        cookieBannerNote:
          "Der aktuelle native iOS-Build zeigt kein generisches Cookie-Banner, weil keine optionalen Analyse- oder Marketing-Tracker aktiv sind.",
      },
      onboarding: {
        welcome: {
          title: "Plane deinen ersten ruhigen Tag.",
          description: "Viele Hunde, viele Spaziergänge. Eine Erinnerung.",
          cta: "Setup starten",
        },
        dog: {
          title: "Lege deinen ersten Hund an.",
          description:
            "Ein wiederverwendbares Profil für jeden weiteren Spaziergang.",
          createCta: "Hund anlegen",
          saveAndContinue: "Speichern und weiter",
        },
        appointment: {
          eyebrow: "Erster Termin",
          title: "Trage den ersten Spaziergang in den Kalender ein",
          descriptionWithDog:
            "{{name}} ist bereit. Wähle Tag, Uhrzeit und wöchentliche Wiederholungen.",
          descriptionWithoutDog:
            "Wähle Tag, Uhrzeit und wöchentliche Wiederholungen.",
          missingDogTitle: "Hund fehlt",
          missingDogBody: "Lege zuerst das Hundeprofil an.",
          pickupTimeEnabled:
            "Für diesen Spaziergang ist eine konkrete Abholzeit aktiviert.",
          pickupTimeDisabled:
            "Lass diese Einstellung aus, wenn die Abholung irgendwann am Morgen passiert.",
          oneTime: "Der erste Termin bleibt ein einmaliger Spaziergang.",
          reminderDisabled:
            "Es wird keine Abholzeit-Erinnerung geplant, bis du eine Uhrzeit aktivierst.",
          createCta: "Termin anlegen",
          save: "Termin speichern",
          pastAppointmentBody: "Der erste Termin muss in der Zukunft liegen.",
        },
        reminders: {
          eyebrow: "Erinnerungen",
          title: "Aktiviere Benachrichtigungen, wenn du bereit bist",
          description:
            "Dein erster Hund und dein erster Termin sind schon gespeichert, deshalb lohnt sich das Aktivieren jetzt sofort.",
          deniedTitle: "Benachrichtigungen sind aus",
          deniedBody:
            "Du kannst das Setup jetzt trotzdem abschließen und Erinnerungen später in den Einstellungen aktivieren.",
          appointmentAlertsTitle: "Termin-Erinnerungen",
          appointmentAlertsBody: "Erhalte vor der Abholzeit einen Hinweis.",
          dailySummaryTitle: "Tageszusammenfassung",
          dailySummaryBody:
            "Sieh den Tag mit einer morgendlichen Erinnerung im Voraus.",
          maybeLater: "Vielleicht später",
        },
        success: {
          title: "Dein erster Tag ist bereit.",
          description:
            "Kalender entsperrt. Hund gespeichert. Bereit für mehr Buchungen.",
          cta: "Meinen Kalender öffnen",
        },
      },
      notifications: {
        openAppointment: "Termin öffnen",
        openAgenda: "Tagesplan öffnen",
        channelName: "Termine",
        appointmentSubtitle: "Termin um {{time}}",
        reminderPrefix: "Erinnerung {{offset}}",
        todayTitle: "Heute in Canilendar",
        noAppointmentsToday: "Heute sind keine Hundetermine geplant.",
        devTestTitle: "Eddi",
        devTestSubtitle: "Termin um 09:00",
        devTestBody:
          "Bellenweg 12 • Erinnerung 30 Minuten vorher • Besitzer am Seiteneingang treffen.",
        summarySubtitle_one: "{{date}} • {{count}} Termin",
        summarySubtitle_other: "{{date}} • {{count}} Termine",
        summaryMore_one: "{{headline}} • +{{count}} weiterer",
        summaryMore_other: "{{headline}} • +{{count}} weitere",
      },
      recurrence: {
        oneTime: "Einmalig",
        every: "Jeden {{days}}",
      },
      reminder: {
        beforeMinutes_one: "{{count}} Minute vorher",
        beforeMinutes_other: "{{count}} Minuten vorher",
        beforeHours_one: "{{count}} Stunde vorher",
        beforeHours_other: "{{count}} Stunden vorher",
        beforeHoursMinutes: "{{hours}} Std. {{minutes}} Min. vorher",
      },
      dog: {
        selected: "Ausgewählt",
      },
      dogCard: {
        selected: "Ausgewählt",
        savedDog: "Gespeicherter Hund",
        pickup: "Abholung: {{value}}",
        owner: "Besitzer: {{value}}",
        notes: "Notizen: {{value}}",
        noNotes: "Für diesen Hund sind keine weiteren Notizen gespeichert.",
      },
      languages: {
        en: "English",
        de: "Deutsch",
        fr: "Français",
        es: "Español",
      },
    },
  },
  fr: {
    translation: {
      tabs: {
        calendar: "Calendrier",
        dogs: "Chiens",
        settings: "Réglages",
      },
      common: {
        cancel: "Annuler",
        closeKeyboard: "Fermer le clavier",
        delete: "Supprimer",
        edit: "Modifier",
        enabled: "Activé",
        system: "Système",
        useDevice: "Utiliser l'appareil",
        light: "Clair",
        dark: "Sombre",
        pickerDate: "Date",
        pickupTime: "Heure de prise en charge",
        weekdayShort: {
          mon: "Lun",
          tue: "Mar",
          wed: "Mer",
          thu: "Jeu",
          fri: "Ven",
          sat: "Sam",
          sun: "Dim",
        },
      },
      home: {
        badge: "Planificateur quotidien de promenades",
        description:
          "Gardez le contrôle des prises en charge, des promenades récurrentes et de l’itinéraire du jour sans laisser le calendrier de votre téléphone à moitié rempli.",
        monthView: "Mois",
        weekView: "Vue hebdomadaire",
        weekTable: "Vue hebdomadaire",
        weekCount_one: "{{count}} chien",
        weekCount_other: "{{count}} chiens",
        weekEmpty: "Aucune promenade prévue",
        weekMore_one: "+{{count}} promenade de plus",
        weekMore_other: "+{{count}} promenades de plus",
        newAppointment: "Nouveau rendez-vous",
        agenda: "Agenda",
        emptyTitle: "Aucune entrée pour ce jour",
        emptyDescription:
          "Ajoutez un rendez-vous à cette date et il apparaîtra ici sous forme de fiche chien.",
      },
      welcome: {
        eyebrow: "Canilendar",
        title: "Bienvenue sur Canilendar",
        description: "Votre planificateur professionnel de promenades canines",
        valuePointOne:
          "Enregistrez chaque chien client une seule fois, puis planifiez les promenades récurrentes en quelques secondes.",
        valuePointTwo:
          "Retrouvez les prises en charge, les rendez-vous récurrents et la capacité restante dans un seul agenda de travail.",
        valuePointThree:
          "Gardez l’administratif léger pendant que votre tournée se développe avec Pro et ses chiens et rendez-vous illimités.",
        appleUnavailable:
          "La connexion Apple nécessite une build iPhone ou iPad de développement.",
        signInErrorTitle: "Echec de la connexion Apple",
        footer:
          "Vos rendez-vous restent sur cet appareil en v1 et vos achats restent liés à votre connexion Apple.",
      },
      appointment: {
        screenTitleNew: "Nouveau rendez-vous",
        screenTitleEdit: "Modifier le rendez-vous",
        eyebrow: "Détails de planification",
        titleNew: "Nouveau rendez-vous",
        titleEdit: "Modifier le rendez-vous",
        description:
          "Rassemblez le chien, les détails de prise en charge, l’heure, la récurrence et le rappel au même endroit.",
        dogDetails: "Details du chien",
        savedDog: "Chien enregistré",
        newDog: "Nouveau chien",
        noSavedDogs:
          'Aucun chien enregistré pour le moment. Passez à "Nouveau chien" pour créer le premier profil.',
        savedDogsHelp:
          "Choisissez un chien enregistré. L’adresse, le téléphone du propriétaire et les notes affichés sur chaque fiche appartiennent à ce profil.",
        dogName: "Nom du chien",
        pickupAddress: "Adresse de prise en charge",
        ownerPhone: "Téléphone du propriétaire",
        dogNotes: "Notes sur le chien",
        pickupTimeEnabled:
          "Ajoute une heure de prise en charge précise et active les rappels.",
        pickupTimeDisabled:
          "Désactivé par défaut. Cette promenade reste dans le planning du jour sans rappel horaire.",
        repeatWeekly: "Répéter chaque semaine",
        recurringOn: "S’affiche à chaque jour sélectionné.",
        oneTime: "Reste un rendez-vous unique.",
        reminderLeadTime: "Délai du rappel",
        reminderDisabled:
          "Activez l’heure de prise en charge si vous voulez un rappel avant la promenade.",
        noPickupTime: "Pas d’heure de prise en charge",
        appointmentNotes: "Notes du rendez-vous",
        reminderPreview:
          "Heure du rappel : {{time}} avec {{count}} minutes d’avance.",
        saveChanges: "Enregistrer les modifications",
        createAppointment: "Créer le rendez-vous",
        deleteAppointment: "Supprimer le rendez-vous",
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "12 rue des Abois",
          ownerPhone: "+33 1 23 45 67 89",
          dogNotes:
            "Code du portail, consigne pour le collier, rappel de repas...",
          appointmentNotes:
            "Retrouver le propriétaire à l’entrée latérale, apporter une serviette supplémentaire...",
        },
        alerts: {
          missingDogDetailsTitle: "Informations du chien manquantes",
          missingDogDetailsBody:
            "Ajoutez d’abord le nom du chien, l’adresse et le numéro du propriétaire.",
          chooseDogTitle: "Choisissez un chien",
          chooseDogBody:
            "Sélectionnez un chien existant ou passez à un nouveau profil.",
          dayLimitTitle: "Limite journalière atteinte",
          dayLimitBody:
            "Cela dépasserait votre limite quotidienne de {{limit}} chiens le {{dates}}.",
          repeatDaysTitle: "Choisissez les jours de répétition",
          repeatDaysBody:
            "Sélectionnez au moins un jour pour la promenade récurrente.",
          pastAppointmentTitle: "Rendez-vous passé",
          pastAppointmentBody:
            "Les nouveaux rendez-vous doivent être planifiés dans le futur.",
          saveFailedTitle: "Impossible d'enregistrer le rendez-vous",
          saveFailedBody:
            "Réessayez dans un instant. Si le problème persiste, vérifiez les informations du chien et l'heure choisie.",
          deleteTitle: "Supprimer le rendez-vous ?",
          deleteBody: "Cela supprime le rendez-vous et ses rappels planifiés.",
        },
      },
      dogs: {
        eyebrow: "Profils de chiens enregistrés",
        title: "Chiens",
        description:
          "Gardez les informations client réutilisables pour ajouter des rendez-vous en quelques secondes.",
        photoLabel: "Photo",
        photoHint:
          "Ajoutez une photo facultative depuis l’appareil photo ou la photothèque.",
        addPhotoTitle: "Ajouter une photo du chien",
        changePhoto: "Modifier la photo",
        changePhotoHint: "Touchez pour modifier la photo",
        addFromCamera: "Prendre une photo",
        chooseFromLibrary: "Choisir dans la photothèque",
        removePhoto: "Supprimer la photo",
        addDog: "Ajouter un chien",
        editorAddTitle: "Ajouter un profil de chien",
        editorEditTitle: "Modifier le profil du chien",
        notes: "Notes",
        createDog: "Créer le chien",
        saveChanges: "Enregistrer les modifications",
        cancel: "Annuler",
        emptyTitle: "Aucun chien enregistré",
        emptyDescription:
          "Ajoutez votre premier chien pour planifier les prochains rendez-vous depuis un profil enregistré.",
        upcomingAppointments_one: "{{count}} rendez-vous a venir",
        upcomingAppointments_other: "{{count}} rendez-vous a venir",
        alerts: {
          missingDogDetailsTitle: "Informations du chien manquantes",
          missingDogDetailsBody:
            "Veuillez ajouter un nom, une adresse et un numéro de téléphone.",
          deleteTitle: "Supprimer {{name}} ?",
          deleteBody:
            "Cela fonctionne uniquement si ce chien n’a aucun rendez-vous planifié.",
          stillScheduledTitle: "Chien encore programme",
          stillScheduledBody:
            "Retirez ou réattribuez les rendez-vous de ce chien avant de supprimer le profil.",
          cameraPermissionTitle: "Accès à l’appareil photo requis",
          cameraPermissionBody:
            "Autorisez l’appareil photo si vous voulez prendre une photo pour ce profil de chien.",
          libraryPermissionTitle: "Accès à la photothèque requis",
          libraryPermissionBody:
            "Autorisez la photothèque si vous voulez choisir une photo existante du chien.",
          photoProcessingTitle: "Impossible d'utiliser la photo",
          photoProcessingBody:
            "Essayez une autre photo ou réessayez dans un instant.",
        },
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "12 rue des Abois",
          ownerPhone: "+33 1 23 45 67 89",
          notes: "Code du portail, consigne de repas, routine de laisse...",
        },
        search: {
          label: "Rechercher un chien",
          placeholder: "Rechercher par nom de chien",
        },
      },
      settings: {
        eyebrow: "Préférences du planificateur",
        title: "Réglages",
        description:
          "Ajustez la manière dont Canilendar vous rappelle la journée à venir.",
        notifications: "Notifications",
        notificationsEnabled: "Les rappels locaux sont activés.",
        notificationsDenied:
          "Les notifications sont bloquées dans les réglages du système.",
        notificationsUnknown:
          "Canilendar demandera votre autorisation lors de l’enregistrement d’un rendez-vous ou si vous activez les rappels.",
        enableReminders: "Activer les rappels",
        refreshStatus: "Actualiser le statut",
        refreshingStatus: "Actualisation...",
        openSystemSettings: "Ouvrir les réglages système",
        dailySummary: "Résumé quotidien",
        dailySummaryDescription:
          "Un rappel chaque matin avec les rendez-vous du jour.",
        summaryTime: "Heure du résumé",
        language: "Langue",
        languageDescription:
          "Choisissez une langue fixe ou utilisez la langue de votre téléphone. Les langues non prises en charge reviennent à l’anglais.",
        languageCurrent:
          "Langue de l’appareil : {{language}}. Langue actuelle de l’application : {{currentLanguage}}.",
        appearance: "Apparence",
        appearanceSystem:
          "Canilendar suit l’apparence définie sur votre appareil.",
        appearanceLight: "Canilendar reste toujours en mode clair.",
        appearanceDark: "Canilendar reste toujours en mode sombre.",
        defaultReminder: "Rappel par défaut de l’événement",
        defaultReminderDescription:
          "Les nouveaux rendez-vous commencent avec ce délai de rappel. Vous pouvez le modifier pour chaque rendez-vous.",
        dailyAppointmentLimit: "Rendez-vous par jour",
        dailyAppointmentLimitDescription:
          "Limitez chaque jour à {{count}} rendez-vous chien. Vous pouvez aller jusqu’à 15.",
        account: {
          title: "Compte",
          description:
            "La connexion Apple débloque votre agenda et relie les achats à la même identité dans RevenueCat.",
          signedInAs: "Connecté en tant que {{value}}",
          revenueCatReference: "Référence RevenueCat : {{value}}",
          signOut: "Se deconnecter",
          signOutTitle: "Se deconnecter ?",
          signOutBody:
            "Vous pourrez vous reconnecter avec Apple à tout moment. Vos données locales restent associées à ce compte Apple sur cet appareil.",
          deleteAction: "Supprimer le compte",
          deleteTitle: "Supprimer le compte ?",
          deleteBody:
            "Cela supprime vos données locales, efface la session Apple sur cet appareil et annule les rappels planifiés. Apple et RevenueCat peuvent toutefois conserver des justificatifs d’achat pour la facturation, la prévention de la fraude ou des obligations légales.",
          deletingAccount: "Suppression du compte...",
          deleteFailedTitle: "Échec de la suppression du compte",
          deleteSuccessTitle: "Compte supprimé",
          deleteSuccessBody:
            "Canilendar a supprimé les données locales du compte sur cet appareil. Si un abonnement est encore actif, gérez-le ou annulez-le dans les réglages d’abonnement Apple.",
          manageSubscription: "Gérer l’abonnement",
        },
        pro: {
          title: "Canilendar Pro",
          description:
            "Passez a la version Pro seulement quand vous avez besoin de plus que le premier chien et rendez-vous gratuits.",
          active: "Canilendar Pro est actif.",
          unavailable:
            "Les achats ne sont pas encore configurés dans cette version.",
          freeTier:
            "Vous utilisez l’offre gratuite avec 1 chien et 1 rendez-vous inclus.",
          upgrade: "Passer a Pro",
          restore: "Restaurer les achats",
          restoring: "Restauration...",
          restoreFailedTitle: "Échec de la restauration",
          restoreSuccessTitle: "Restauration terminée",
          restoreSuccessBody: "Le statut de votre abonnement a été actualisé.",
          customerCenter: "Ouvrir le Customer Center",
          customerCenterTitle: "Customer Center",
          currentOffering:
            "Offre actuelle : {{identifier}} avec {{count}} options de formule.",
          expoGo:
            "Cette version fonctionne en mode aperçu Expo Go. Utilisez `npx expo run:ios` pour tester les vrais achats RevenueCat, les restaurations et le Customer Center.",
          hostedUi:
            "L’interface Paywall hébergée de RevenueCat et le Customer Center nécessitent une build iOS de développement ou de production. Ils ne sont pas disponibles dans Expo Go.",
        },
        devReset: {
          title: "Réinitialiser les données locales ?",
          body: "Cette action DEV supprime tous les chiens, rendez-vous, réglages et la progression d’onboarding enregistrés sur ce simulateur.",
          button: "Réinitialiser les données locales",
          confirm: "Réinitialiser",
        },
        devSeed: {
          title: "Charger des données de démonstration ?",
          body: "Cette action DEV remplace les chiens, rendez-vous, réglages et la progression d’onboarding actuellement enregistrés localement par des données de démonstration pour tester les layouts.",
          button: "Charger les données de démonstration",
          confirm: "Charger",
        },
        devRestartOnboarding: {
          title: "Redémarrer l’onboarding ?",
          body: "Cette action DEV remet l’onboarding à l’état incomplet et te renvoie vers le parcours d’onboarding sans effacer ta session connectée ni tes chiens et rendez-vous enregistrés.",
          button: "Redémarrer l’onboarding",
          confirm: "Redémarrer",
        },
        devTools: {
          title: "Outils DEV",
          description:
            "Déclenchez une notification locale de test, chargez des données de démonstration ou effacez les données enregistrées localement sur ce simulateur ou appareil.",
          showNotification: "Afficher la notification",
          showNotificationLoading: "Affichage de la notification...",
          showSplash: "Afficher l’écran de lancement",
          previewAppleSignIn: "Prévisualiser la connexion Apple",
        },
        storage: "Stockage",
        storageDescription:
          "Les rendez-vous, les chiens et les préférences de rappel sont stockés uniquement sur cet appareil dans v1.",
        alerts: {
          notificationsOffTitle: "Les notifications sont désactivées",
          notificationsOffBody:
            "Ouvrez les réglages système de Canilendar si vous voulez des bannières de rappel et des résumés quotidiens.",
        },
      },
      legal: {
        sectionTitle: "Mentions légales",
        sectionDescription:
          "Gardez les mentions légales, la politique de confidentialité et la suppression du compte accessibles à tout moment.",
        imprintEyebrow: "Mentions légales",
        imprintTitle: "Mentions légales",
        imprintDescription:
          "Informations sur l’éditeur et les moyens de contact de Canilendar.",
        privacyEyebrow: "Confidentialité",
        privacyTitle: "Politique de confidentialité",
        privacyDescription:
          "Comment Canilendar traite les données de compte, d’abonnement, de rappel et d’agenda.",
        openHostedAction: "Ouvrir la version hébergée",
        privacyChoicesAction: "Choix de confidentialité",
        emailAction: "Contacter le service legal",
        emailUnavailableTitle: "Impossible d'ouvrir l'e-mail",
        emailUnavailableBody:
          "Aucune application e-mail n’est configurée sur cet appareil. Écrivez-nous à {{email}}.",
        cookieBannerNote:
          "La version native iOS actuelle n’affiche pas de bannière cookies générique car aucun tracker marketing ou analytique optionnel n’est actif.",
      },
      onboarding: {
        welcome: {
          title: "Construisez votre première journée sereine.",
          description:
            "Beaucoup de chiens, beaucoup de promenades. Un seul flux de rappels.",
          cta: "Commencer la configuration",
        },
        dog: {
          title: "Ajoutez votre premier chien.",
          description: "Un profil réutilisable pour chaque future promenade.",
          createCta: "Créer le chien",
          saveAndContinue: "Enregistrer et continuer",
        },
        appointment: {
          eyebrow: "Premier rendez-vous",
          title: "Ajoutez la première promenade au calendrier",
          descriptionWithDog:
            "{{name}} est prêt. Choisissez le jour, l’heure et la répétition.",
          descriptionWithoutDog:
            "Choisissez le jour, l’heure et la répétition.",
          missingDogTitle: "Chien manquant",
          missingDogBody: "Créez d’abord le profil du chien.",
          pickupTimeEnabled:
            "Une heure de prise en charge précise est activée pour cette promenade.",
          pickupTimeDisabled:
            "Laissez cette option désactivée si la prise en charge se fait dans la matinée.",
          oneTime: "Le premier rendez-vous reste une promenade unique.",
          reminderDisabled:
            "Aucun rappel lié à l’heure ne sera planifié tant que vous n’aurez pas activé une heure.",
          createCta: "Créer le rendez-vous",
          save: "Enregistrer le rendez-vous",
          pastAppointmentBody:
            "Le premier rendez-vous doit être prévu dans le futur.",
        },
        reminders: {
          eyebrow: "Rappels",
          title: "Activez les notifications quand vous êtes prêt",
          description:
            "Votre premier chien et votre premier rendez-vous sont déjà enregistrés. Activer les rappels maintenant apporte donc une valeur immédiate.",
          deniedTitle: "Les notifications sont désactivées",
          deniedBody:
            "Vous pouvez quand même terminer la configuration maintenant et activer les rappels plus tard dans les réglages.",
          appointmentAlertsTitle: "Alertes de rendez-vous",
          appointmentAlertsBody:
            "Recevez un rappel avant l’heure de prise en charge.",
          dailySummaryTitle: "Résumé quotidien",
          dailySummaryBody:
            "Préparez la journée à venir avec un seul rappel matinal.",
          maybeLater: "Peut-être plus tard",
        },
        success: {
          title: "Votre première journée est prête.",
          description:
            "Calendrier débloqué. Chien enregistré. Prêt à planifier davantage.",
          cta: "Ouvrir mon calendrier",
        },
      },
      notifications: {
        openAppointment: "Ouvrir le rendez-vous",
        openAgenda: "Ouvrir l'agenda",
        channelName: "Rendez-vous",
        appointmentSubtitle: "Rendez-vous à {{time}}",
        reminderPrefix: "Rappel {{offset}}",
        todayTitle: "Aujourd'hui dans Canilendar",
        noAppointmentsToday:
          "Vous n’avez aucun rendez-vous canin prévu aujourd’hui.",
        devTestTitle: "Eddi",
        devTestSubtitle: "Rendez-vous a 09:00",
        devTestBody:
          "12 rue des Abois • Rappel 30 minutes avant • Retrouver le propriétaire à l’entrée latérale.",
        summarySubtitle_one: "{{date}} • {{count}} rendez-vous",
        summarySubtitle_other: "{{date}} • {{count}} rendez-vous",
        summaryMore_one: "{{headline}} • +{{count}} autre",
        summaryMore_other: "{{headline}} • +{{count}} autres",
      },
      recurrence: {
        oneTime: "Unique",
        every: "Chaque {{days}}",
      },
      reminder: {
        beforeMinutes_one: "{{count}} minute avant",
        beforeMinutes_other: "{{count}} minutes avant",
        beforeHours_one: "{{count}} heure avant",
        beforeHours_other: "{{count}} heures avant",
        beforeHoursMinutes: "{{hours}} h {{minutes}} min avant",
      },
      dog: {
        selected: "Sélectionné",
      },
      dogCard: {
        selected: "Sélectionné",
        savedDog: "Chien enregistré",
        pickup: "Prise en charge : {{value}}",
        owner: "Propriétaire : {{value}}",
        notes: "Notes : {{value}}",
        noNotes: "Aucune note supplementaire enregistree pour ce chien.",
      },
      languages: {
        en: "English",
        de: "Deutsch",
        fr: "Français",
        es: "Español",
      },
    },
  },
  es: {
    translation: {
      tabs: {
        calendar: "Calendario",
        dogs: "Perros",
        settings: "Ajustes",
      },
      common: {
        cancel: "Cancelar",
        closeKeyboard: "Cerrar teclado",
        delete: "Eliminar",
        edit: "Editar",
        enabled: "Activo",
        system: "Sistema",
        useDevice: "Usar dispositivo",
        light: "Claro",
        dark: "Oscuro",
        pickerDate: "Fecha",
        pickupTime: "Hora de recogida",
        weekdayShort: {
          mon: "Lun",
          tue: "Mar",
          wed: "Mie",
          thu: "Jue",
          fri: "Vie",
          sat: "Sab",
          sun: "Dom",
        },
      },
      home: {
        badge: "Planificador diario de paseos",
        description:
          "Controla recogidas, paseos recurrentes y la ruta de hoy sin dejar a medias el calendario del telefono.",
        monthView: "Mes",
        weekView: "Tabla semanal",
        weekTable: "Tabla semanal",
        weekCount_one: "{{count}} perro",
        weekCount_other: "{{count}} perros",
        weekEmpty: "No hay paseos programados",
        weekMore_one: "+{{count}} paseo mas",
        weekMore_other: "+{{count}} paseos mas",
        newAppointment: "Nueva cita",
        agenda: "Agenda",
        emptyTitle: "No hay entradas para este dia",
        emptyDescription:
          "Agrega una cita para esta fecha y aparecera aqui como una tarjeta del perro.",
      },
      welcome: {
        eyebrow: "Canilendar",
        title: "Bienvenido a Canilendar",
        description: "Tu planificador profesional de paseos caninos",
        valuePointOne:
          "Guarda cada perro cliente una vez y programa paseos recurrentes en segundos.",
        valuePointTwo:
          "Ve recogidas, citas recurrentes y capacidad libre en una sola agenda de trabajo.",
        valuePointThree:
          "Manten la gestion ligera mientras tu ruta crece con perros y citas ilimitados en Pro.",
        appleUnavailable:
          "Iniciar sesion con Apple necesita una build de desarrollo para iPhone o iPad.",
        signInErrorTitle: "Fallo al iniciar sesion con Apple",
        footer:
          "Tus citas se quedan en este dispositivo en v1 y las compras siguen vinculadas a tu inicio de sesion con Apple.",
      },
      appointment: {
        screenTitleNew: "Nueva cita",
        screenTitleEdit: "Editar cita",
        eyebrow: "Detalles de planificacion",
        titleNew: "Nueva cita",
        titleEdit: "Editar cita",
        description:
          "Guarda el perro, los detalles de recogida, la hora, la repeticion y el recordatorio en un solo lugar.",
        dogDetails: "Detalles del perro",
        savedDog: "Perro guardado",
        newDog: "Perro nuevo",
        noSavedDogs:
          'Todavia no hay perros guardados. Cambia a "Perro nuevo" para crear el primer perfil.',
        savedDogsHelp:
          "Elige un perro guardado. La direccion, el telefono del propietario y las notas de cada tarjeta pertenecen a ese perfil.",
        dogName: "Nombre del perro",
        pickupAddress: "Direccion de recogida",
        ownerPhone: "Telefono del propietario",
        dogNotes: "Notas del perro",
        pickupTimeEnabled:
          "Agrega una hora concreta de recogida y activa los recordatorios.",
        pickupTimeDisabled:
          "Desactivado por defecto. Este paseo queda en el plan del dia sin recordatorio por hora.",
        repeatWeekly: "Repetir cada semana",
        recurringOn: "Se muestra en cada dia seleccionado.",
        oneTime: "Se mantiene como una cita unica.",
        reminderLeadTime: "Antelacion del recordatorio",
        reminderDisabled:
          "Activa la hora de recogida si quieres un recordatorio antes del paseo.",
        noPickupTime: "Sin hora de recogida",
        appointmentNotes: "Notas de la cita",
        reminderPreview:
          "Hora del recordatorio: {{time}} con {{count}} minutos de aviso.",
        saveChanges: "Guardar cambios",
        createAppointment: "Crear cita",
        deleteAppointment: "Eliminar cita",
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "Calle Ladrido 12",
          ownerPhone: "+34 612 345 678",
          dogNotes:
            "Codigo de puerta, nota del collar, recordatorio de comida...",
          appointmentNotes:
            "Encontrarse con el propietario en la entrada lateral, llevar una toalla extra...",
        },
        alerts: {
          missingDogDetailsTitle: "Faltan datos del perro",
          missingDogDetailsBody:
            "Agrega primero el nombre del perro, la direccion y el telefono del propietario.",
          chooseDogTitle: "Elige un perro",
          chooseDogBody:
            "Selecciona un perro existente o cambia a un perfil nuevo.",
          dayLimitTitle: "Limite diario alcanzado",
          dayLimitBody:
            "Esto superaria tu limite diario de {{limit}} perros el {{dates}}.",
          repeatDaysTitle: "Elige dias de repeticion",
          repeatDaysBody:
            "Selecciona al menos un dia de la semana para el paseo recurrente.",
          pastAppointmentTitle: "Cita pasada",
          pastAppointmentBody:
            "Las nuevas citas deben programarse en el futuro.",
          saveFailedTitle: "No se pudo guardar la cita",
          saveFailedBody:
            "Vuelve a intentarlo en un momento. Si el problema continúa, revisa los datos del perro y la hora seleccionada.",
          deleteTitle: "Eliminar cita?",
          deleteBody: "Esto elimina la cita y sus recordatorios programados.",
        },
      },
      dogs: {
        eyebrow: "Perfiles de perros guardados",
        title: "Perros",
        description:
          "Mantén los datos del cliente reutilizables para que las citas se agreguen en segundos.",
        photoLabel: "Foto",
        photoHint:
          "Añade una foto opcional desde la camara o desde tu fototeca.",
        addPhotoTitle: "Añadir foto del perro",
        changePhoto: "Cambiar foto",
        changePhotoHint: "Toca para cambiar la foto",
        addFromCamera: "Tomar foto",
        chooseFromLibrary: "Elegir de la fototeca",
        removePhoto: "Quitar foto",
        addDog: "Agregar perro",
        editorAddTitle: "Agregar perfil de perro",
        editorEditTitle: "Editar perfil del perro",
        notes: "Notas",
        createDog: "Crear perro",
        saveChanges: "Guardar cambios",
        cancel: "Cancelar",
        emptyTitle: "Todavia no hay perros guardados",
        emptyDescription:
          "Agrega tu primer perro para programar futuras citas desde un perfil guardado.",
        upcomingAppointments_one: "{{count}} proxima cita",
        upcomingAppointments_other: "{{count}} proximas citas",
        alerts: {
          missingDogDetailsTitle: "Faltan datos del perro",
          missingDogDetailsBody:
            "Agrega un nombre, una direccion y el telefono del propietario.",
          deleteTitle: "Eliminar {{name}}?",
          deleteBody:
            "Esto solo funciona cuando el perro no tiene citas programadas.",
          stillScheduledTitle: "El perro sigue programado",
          stillScheduledBody:
            "Quita o reasigna las citas de este perro antes de eliminar el perfil.",
          cameraPermissionTitle: "Se necesita acceso a la camara",
          cameraPermissionBody:
            "Permite el acceso a la camara si quieres tomar una foto para este perfil de perro.",
          libraryPermissionTitle: "Se necesita acceso a la fototeca",
          libraryPermissionBody:
            "Permite el acceso a la fototeca si quieres elegir una foto existente del perro.",
          photoProcessingTitle: "No se pudo usar la foto",
          photoProcessingBody:
            "Prueba con otra foto o vuelve a intentarlo en un momento.",
        },
        placeholders: {
          dogName: "Eddi",
          pickupAddress: "Calle Ladrido 12",
          ownerPhone: "+34 612 345 678",
          notes: "Codigo de puerta, nota de comida, rutina de correa...",
        },
        search: {
          label: "Buscar perros",
          placeholder: "Buscar por nombre del perro",
        },
      },
      settings: {
        eyebrow: "Preferencias del planificador",
        title: "Ajustes",
        description: "Ajusta como Canilendar te recuerda el dia que viene.",
        notifications: "Notificaciones",
        notificationsEnabled: "Los recordatorios locales estan activados.",
        notificationsDenied:
          "Las notificaciones estan bloqueadas en los ajustes del sistema.",
        notificationsUnknown:
          "Canilendar preguntara al guardar una cita o al tocar activar.",
        enableReminders: "Activar recordatorios",
        refreshStatus: "Actualizar estado",
        refreshingStatus: "Actualizando...",
        openSystemSettings: "Abrir ajustes del sistema",
        dailySummary: "Resumen diario",
        dailySummaryDescription:
          "Un recordatorio cada manana con las citas del dia.",
        summaryTime: "Hora del resumen",
        language: "Idioma",
        languageDescription:
          "Elige un idioma fijo o usa el idioma de tu telefono. Los idiomas no compatibles vuelven al ingles.",
        languageCurrent:
          "Idioma del dispositivo: {{language}}. Idioma actual de la app: {{currentLanguage}}.",
        appearance: "Apariencia",
        appearanceSystem:
          "Canilendar sigue el ajuste de apariencia de tu dispositivo.",
        appearanceLight: "Canilendar siempre se mantiene en modo claro.",
        appearanceDark: "Canilendar siempre se mantiene en modo oscuro.",
        defaultReminder: "Recordatorio predeterminado",
        defaultReminderDescription:
          "Las nuevas citas empiezan con este tiempo de aviso. Puedes cambiarlo en cada cita.",
        dailyAppointmentLimit: "Citas por dia",
        dailyAppointmentLimitDescription:
          "Limita cada dia a {{count}} citas de perros. Puedes subir hasta 15.",
        account: {
          title: "Cuenta",
          description:
            "El inicio de sesion con Apple desbloquea tu agenda y vincula las compras con la misma identidad en RevenueCat.",
          signedInAs: "Sesion iniciada como {{value}}",
          revenueCatReference: "Referencia de RevenueCat: {{value}}",
          signOut: "Cerrar sesion",
          signOutTitle: "Cerrar sesion?",
          signOutBody:
            "Puedes volver a iniciar sesion con Apple cuando quieras. Tus datos locales siguen asociados a esta cuenta de Apple en este dispositivo.",
          deleteAction: "Eliminar cuenta",
          deleteTitle: "Eliminar cuenta?",
          deleteBody:
            "Esto elimina tus datos locales, borra la sesion de Apple en este dispositivo y cancela los recordatorios programados. Apple y RevenueCat pueden conservar registros de compra cuando sea necesario para facturacion, prevencion del fraude u obligaciones legales.",
          deletingAccount: "Eliminando cuenta...",
          deleteFailedTitle: "No se pudo eliminar la cuenta",
          deleteSuccessTitle: "Cuenta eliminada",
          deleteSuccessBody:
            "Canilendar elimino los datos locales de la cuenta en este dispositivo. Si todavia tienes una suscripcion activa, gestionala o cancelala en los ajustes de suscripciones de Apple.",
          manageSubscription: "Gestionar suscripcion",
        },
        pro: {
          title: "Canilendar Pro",
          description:
            "Mejora solo cuando necesites mas que el primer perro y la primera cita gratuitos.",
          active: "Canilendar Pro esta activo.",
          unavailable: "Las compras aun no estan configuradas en esta build.",
          freeTier: "Estas en el plan gratuito con 1 perro y 1 cita incluidos.",
          upgrade: "Mejorar a Pro",
          restore: "Restaurar compras",
          restoring: "Restaurando...",
          restoreFailedTitle: "La restauracion fallo",
          restoreSuccessTitle: "Restauracion completada",
          restoreSuccessBody: "Se ha actualizado el estado de tu suscripcion.",
          customerCenter: "Abrir Customer Center",
          customerCenterTitle: "Customer Center",
          currentOffering:
            "Oferta actual: {{identifier}} con {{count}} opciones de paquete.",
          expoGo:
            "Esta build se esta ejecutando en modo de vista previa de Expo Go. Usa `npx expo run:ios` para probar compras reales de RevenueCat, restauraciones y Customer Center.",
          hostedUi:
            "La Paywall UI alojada de RevenueCat y Customer Center necesitan una build de iOS de desarrollo o produccion. No estan disponibles en Expo Go.",
        },
        devReset: {
          title: "Reiniciar datos locales?",
          body: "Esta accion DEV elimina todos los perros, citas, ajustes y el progreso del onboarding guardados en este simulador.",
          button: "Reiniciar datos locales",
          confirm: "Reiniciar",
        },
        devSeed: {
          title: "Cargar datos de ejemplo?",
          body: "Esta accion DEV sustituye los perros, citas, ajustes y el progreso del onboarding guardados localmente por datos de ejemplo para probar los layouts.",
          button: "Cargar datos de ejemplo",
          confirm: "Cargar",
        },
        devRestartOnboarding: {
          title: "Reiniciar onboarding?",
          body: "Esta accion DEV marca el onboarding como incompleto y te devuelve al flujo de onboarding sin borrar tu sesion iniciada ni los perros y citas guardados.",
          button: "Reiniciar onboarding",
          confirm: "Reiniciar",
        },
        devTools: {
          title: "Herramientas DEV",
          description:
            "Lanza una notificacion local de prueba, carga datos de ejemplo o borra los datos guardados localmente en este simulador o dispositivo.",
          showNotification: "Mostrar notificacion",
          showNotificationLoading: "Mostrando notificacion...",
          showSplash: "Mostrar pantalla de inicio",
          previewAppleSignIn: "Previsualizar inicio con Apple",
        },
        storage: "Almacenamiento",
        storageDescription:
          "Las citas, los perros y las preferencias de recordatorio se guardan solo en este dispositivo en v1.",
        alerts: {
          notificationsOffTitle: "Las notificaciones estan desactivadas",
          notificationsOffBody:
            "Abre los ajustes del sistema de Canilendar si quieres banners y resumenes diarios.",
        },
      },
      legal: {
        sectionTitle: "Legal",
        sectionDescription:
          "Mantén el aviso legal, la politica de privacidad y la eliminacion de cuenta accesibles en todo momento.",
        imprintEyebrow: "Aviso legal",
        imprintTitle: "Aviso legal",
        imprintDescription:
          "Informacion sobre el editor y las vias de contacto de Canilendar.",
        privacyEyebrow: "Privacidad",
        privacyTitle: "Politica de privacidad",
        privacyDescription:
          "Como procesa Canilendar los datos de cuenta, suscripcion, recordatorios y agenda.",
        openHostedAction: "Abrir version alojada",
        privacyChoicesAction: "Opciones de privacidad",
        emailAction: "Contactar al equipo legal",
        emailUnavailableTitle: "No se pudo abrir el correo",
        emailUnavailableBody:
          "No hay ninguna app de correo configurada en este dispositivo. Escribenos a {{email}}.",
        cookieBannerNote:
          "La build nativa actual de iOS no muestra un banner generico de cookies porque no hay rastreadores opcionales de analitica o marketing activos.",
      },
      onboarding: {
        welcome: {
          title: "Construye tu primer día tranquilo.",
          description:
            "Muchos perros, muchos paseos. Un solo flujo de recordatorios.",
          cta: "Empezar configuración",
        },
        dog: {
          title: "Añade tu primer perro.",
          description: "Un perfil reutilizable para cada paseo futuro.",
          createCta: "Crear perro",
          saveAndContinue: "Guardar y continuar",
        },
        appointment: {
          eyebrow: "Primera cita",
          title: "Pon el primer paseo en el calendario",
          descriptionWithDog:
            "{{name}} está listo. Elige el día, la hora y la repetición.",
          descriptionWithoutDog: "Elige el día, la hora y la repetición.",
          missingDogTitle: "Falta el perro",
          missingDogBody: "Crea primero el perfil del perro.",
          pickupTimeEnabled:
            "Hay una hora concreta de recogida activada para este paseo.",
          pickupTimeDisabled:
            "Dejalo desactivado si la recogida ocurre en algun momento de la manana.",
          oneTime: "La primera cita se mantiene como un paseo unico.",
          reminderDisabled:
            "No se programara ningun recordatorio por hora hasta que actives una hora.",
          createCta: "Crear cita",
          save: "Guardar cita",
          pastAppointmentBody: "La primera cita tiene que estar en el futuro.",
        },
        reminders: {
          eyebrow: "Recordatorios",
          title: "Activa las notificaciones cuando quieras",
          description:
            "Tu primer perro y tu primera cita ya estan guardados, asi que activar recordatorios ahora ya aporta valor.",
          deniedTitle: "Las notificaciones estan desactivadas",
          deniedBody:
            "Aun puedes terminar la configuracion ahora y activar los recordatorios mas tarde en Ajustes.",
          appointmentAlertsTitle: "Alertas de cita",
          appointmentAlertsBody:
            "Recibe un aviso antes de la hora de recogida.",
          dailySummaryTitle: "Resumen diario",
          dailySummaryBody:
            "Mira el dia por delante con un solo recordatorio matutino.",
          maybeLater: "Quizas mas tarde",
        },
        success: {
          title: "Tu primer día está listo.",
          description:
            "Calendario desbloqueado. Perro guardado. Listo para más reservas.",
          cta: "Abrir mi calendario",
        },
      },
      notifications: {
        openAppointment: "Abrir cita",
        openAgenda: "Abrir agenda",
        channelName: "Citas",
        appointmentSubtitle: "Cita a las {{time}}",
        reminderPrefix: "Recordatorio {{offset}}",
        todayTitle: "Hoy en Canilendar",
        noAppointmentsToday: "No tienes citas de perros programadas para hoy.",
        devTestTitle: "Eddi",
        devTestSubtitle: "Cita a las 09:00",
        devTestBody:
          "Calle Ladrido 12 • Recordatorio 30 minutos antes • Encontrarse con el propietario en la entrada lateral.",
        summarySubtitle_one: "{{date}} • {{count}} cita",
        summarySubtitle_other: "{{date}} • {{count}} citas",
        summaryMore_one: "{{headline}} • +{{count}} mas",
        summaryMore_other: "{{headline}} • +{{count}} mas",
      },
      recurrence: {
        oneTime: "Una vez",
        every: "Cada {{days}}",
      },
      reminder: {
        beforeMinutes_one: "{{count}} minuto antes",
        beforeMinutes_other: "{{count}} minutos antes",
        beforeHours_one: "{{count}} hora antes",
        beforeHours_other: "{{count}} horas antes",
        beforeHoursMinutes: "{{hours}} h {{minutes}} min antes",
      },
      dog: {
        selected: "Seleccionado",
      },
      dogCard: {
        selected: "Seleccionado",
        savedDog: "Perro guardado",
        pickup: "Recogida: {{value}}",
        owner: "Propietario: {{value}}",
        notes: "Notas: {{value}}",
        noNotes: "No hay notas adicionales guardadas para este perro.",
      },
      languages: {
        en: "English",
        de: "Deutsch",
        fr: "Francais",
        es: "Espanol",
      },
    },
  },
} as const;

export const SUPPORTED_LANGUAGES = ["en", "de", "fr", "es"] as const;

export function detectSystemLanguage(): AppLanguage {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase();

  if (locale.startsWith("de")) {
    return "de";
  }

  if (locale.startsWith("fr")) {
    return "fr";
  }

  if (locale.startsWith("es")) {
    return "es";
  }

  return "en";
}

export function resolveAppLanguage(
  preference: LanguagePreference,
): AppLanguage {
  return preference === "system" ? detectSystemLanguage() : preference;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
  });
}

export default i18n;
