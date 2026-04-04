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
        pickupTimeEnabled: "Adds a specific pickup time and enables reminder notifications.",
        pickupTimeDisabled:
          "Disabled by default. This walk stays on the day plan without a time-based reminder.",
        repeatWeekly: "Repeat weekly",
        recurringOn: "Shows on every selected weekday.",
        oneTime: "Keeps this as a one-time appointment.",
        reminderLeadTime: "Reminder lead time",
        reminderDisabled: "Enable pickup time if you want a reminder before the walk.",
        noPickupTime: "No pickup time",
        appointmentNotes: "Appointment notes",
        reminderPreview:
          "Reminder time: {{time}} with a {{count}}-minute heads-up.",
        saveChanges: "Save changes",
        createAppointment: "Create appointment",
        deleteAppointment: "Delete appointment",
        placeholders: {
          dogName: "Milo",
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
        addDog: "Add dog",
        editorAddTitle: "Add a dog profile",
        editorEditTitle: "Edit dog profile",
        notes: "Notes",
        createDog: "Create dog",
        saveChanges: "Save changes",
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
        },
        placeholders: {
          dogName: "Milo",
          pickupAddress: "12 Bark Street",
          ownerPhone: "+49 123 456 789",
          notes: "Gate code, feeding note, leash routine...",
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
          body:
            "This DEV action removes all dogs, appointments, settings, and onboarding progress saved on this simulator.",
          button: "Reset local data",
          confirm: "Reset",
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
      onboarding: {
        appointment: {
          eyebrow: "First appointment",
          title: "Put the first walk on the calendar",
          descriptionWithDog:
            "{{name}} will be reused from the profile you just saved.",
          descriptionWithoutDog:
            "We'll attach this appointment to the dog you just added.",
          missingDogTitle: "Missing dog",
          missingDogBody: "Create the dog profile first.",
          pickupTimeEnabled: "A specific pickup time is enabled for this walk.",
          pickupTimeDisabled:
            "Leave this off if pickup happens sometime in the morning.",
          oneTime: "Keeps the first appointment as a one-time walk.",
          reminderDisabled:
            "No pickup-time reminder will be scheduled until you enable a time.",
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
      },
      notifications: {
        openAppointment: "Open appointment",
        openAgenda: "Open agenda",
        channelName: "Appointments",
        appointmentSubtitle: "Appointment at {{time}}",
        reminderPrefix: "Reminder {{offset}}",
        todayTitle: "Today in Canilendar",
        noAppointmentsToday: "You have no dog appointments scheduled today.",
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
        fr: "Francais",
        es: "Espanol",
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
        delete: "Loschen",
        edit: "Bearbeiten",
        enabled: "Aktiv",
        system: "System",
        useDevice: "Gerät verwenden",
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
        badge: "Planer fur tagliche Gassi-Runden",
        description:
          "Behalte Abholungen, wiederkehrende Spaziergange und die heutige Route im Blick, ohne deinen Handykalender halbfertig zu lassen.",
        monthView: "Monat",
        weekView: "Wochenplan",
        weekTable: "Wochenplan",
        weekCount_one: "{{count}} Hund",
        weekCount_other: "{{count}} Hunde",
        weekEmpty: "Keine Spaziergange geplant",
        weekMore_one: "+{{count}} weiterer Spaziergang",
        weekMore_other: "+{{count}} weitere Spaziergange",
        newAppointment: "Neuer Termin",
        agenda: "Tagesplan",
        emptyTitle: "Keine Eintrage fur diesen Tag",
        emptyDescription:
          "Fuge fur dieses Datum einen Termin hinzu, dann erscheint er hier als Hundekarte.",
      },
      appointment: {
        screenTitleNew: "Neuer Termin",
        screenTitleEdit: "Termin bearbeiten",
        eyebrow: "Planungsdetails",
        titleNew: "Neuen Termin anlegen",
        titleEdit: "Termin bearbeiten",
        description:
          "Erfasse Hund, Abholdetails, Uhrzeit, Wiederholung und Erinnerung an einem Ort.",
        dogDetails: "Hundedetails",
        savedDog: "Gespeicherter Hund",
        newDog: "Neuer Hund",
        noSavedDogs:
          'Noch keine Hunde gespeichert. Wechsle zu "Neuer Hund", um das erste Profil anzulegen.',
        savedDogsHelp:
          "Wahle einen gespeicherten Hund. Adresse, Telefonnummer und Notizen in jeder Karte gehoren zu diesem Profil.",
        dogName: "Hundename",
        pickupAddress: "Abholadresse",
        ownerPhone: "Telefon Besitzer",
        dogNotes: "Notizen zum Hund",
        pickupTimeEnabled:
          "Fugt eine konkrete Abholzeit hinzu und aktiviert Erinnerungen fur diesen Termin.",
        pickupTimeDisabled:
          "StandardmaBig deaktiviert. Dieser Termin bleibt ohne zeitbasierte Erinnerung im Tagesplan.",
        repeatWeekly: "Wochentlich wiederholen",
        recurringOn: "Erscheint an jedem ausgewahlten Wochentag.",
        oneTime: "Bleibt ein einmaliger Termin.",
        reminderLeadTime: "Erinnerung vorher",
        reminderDisabled:
          "Aktiviere eine Abholzeit, wenn du vor dem Spaziergang erinnert werden mochtest.",
        noPickupTime: "Keine Abholzeit",
        appointmentNotes: "Notizen zum Termin",
        reminderPreview:
          "Erinnerungszeit: {{time}} mit {{count}} Minuten Vorlauf.",
        saveChanges: "Anderungen speichern",
        createAppointment: "Termin erstellen",
        deleteAppointment: "Termin loschen",
        placeholders: {
          dogName: "Milo",
          pickupAddress: "Bellenweg 12",
          ownerPhone: "+49 123 456 789",
          dogNotes: "Torcode, Halsband-Hinweis, Futtererinnerung...",
          appointmentNotes:
            "Besitzer am Seiteneingang treffen, extra Handtuch mitbringen...",
        },
        alerts: {
          missingDogDetailsTitle: "Hundedetails fehlen",
          missingDogDetailsBody:
            "Fuge zuerst Hundename, Adresse und Telefonnummer des Besitzers hinzu.",
          chooseDogTitle: "Hund auswahlen",
          chooseDogBody:
            "Wahle einen gespeicherten Hund oder wechsle zu einem neuen Hundprofil.",
          dayLimitTitle: "Tageslimit erreicht",
          dayLimitBody:
            "Damit wurde dein Tageslimit von {{limit}} Hunden am {{dates}} uberschritten.",
          repeatDaysTitle: "Wiederholungstage auswahlen",
          repeatDaysBody:
            "Wahle mindestens einen Wochentag fur den wiederkehrenden Spaziergang.",
          pastAppointmentTitle: "Termin in der Vergangenheit",
          pastAppointmentBody: "Neue Termine mussen in der Zukunft liegen.",
          deleteTitle: "Termin loschen?",
          deleteBody:
            "Dadurch werden der Termin und seine Erinnerungen entfernt.",
        },
      },
      dogs: {
        eyebrow: "Gespeicherte Hundeprofile",
        title: "Hunde",
        description:
          "Halte Kundendetails wiederverwendbar, damit Termine in Sekunden angelegt werden konnen.",
        addDog: "Hund hinzufugen",
        editorAddTitle: "Hundeprofil anlegen",
        editorEditTitle: "Hundeprofil bearbeiten",
        notes: "Notizen",
        createDog: "Hund erstellen",
        saveChanges: "Anderungen speichern",
        emptyTitle: "Noch keine Hunde gespeichert",
        emptyDescription:
          "Fuge deinen ersten Hund hinzu, damit zukunftige Termine aus einem gespeicherten Profil geplant werden konnen.",
        upcomingAppointments_one: "{{count}} kommender Termin",
        upcomingAppointments_other: "{{count}} kommende Termine",
        alerts: {
          missingDogDetailsTitle: "Hundedetails fehlen",
          missingDogDetailsBody:
            "Bitte Name, Adresse und Telefonnummer des Besitzers eintragen.",
          deleteTitle: "{{name}} loschen?",
          deleteBody:
            "Das funktioniert nur, wenn fur den Hund keine Termine geplant sind.",
          stillScheduledTitle: "Hund ist noch eingeplant",
          stillScheduledBody:
            "Entferne oder ubertrage zuerst die Termine dieses Hundes, bevor du das Profil loschst.",
        },
        placeholders: {
          dogName: "Milo",
          pickupAddress: "Bellenweg 12",
          ownerPhone: "+49 123 456 789",
          notes: "Torcode, Futterhinweis, Leinenroutine...",
        },
      },
      settings: {
        eyebrow: "Planer-Einstellungen",
        title: "Einstellungen",
        description:
          "Lege fest, wie Canilendar dich an den kommenden Tag erinnert.",
        notifications: "Benachrichtigungen",
        notificationsEnabled: "Lokale Erinnerungen sind aktiviert.",
        notificationsDenied:
          "Benachrichtigungen sind in den Systemeinstellungen blockiert.",
        notificationsUnknown:
          "Canilendar fragt nach, wenn du einen Termin speicherst oder Aktivieren tippst.",
        enableReminders: "Erinnerungen aktivieren",
        refreshStatus: "Status aktualisieren",
        refreshingStatus: "Aktualisiere...",
        openSystemSettings: "Systemeinstellungen offnen",
        dailySummary: "Tageszusammenfassung",
        dailySummaryDescription:
          "Jeden Morgen eine Erinnerung mit den Terminen des Tages.",
        summaryTime: "Zeit der Zusammenfassung",
        language: "Sprache",
        languageDescription:
          "Wahle eine feste Sprache oder nutze die Sprache deines Telefons. Nicht unterstutzte Gerätesprachen fallen auf Englisch zuruck.",
        languageCurrent:
          "Gerätesprache: {{language}}. Aktuelle App-Sprache: {{currentLanguage}}.",
        appearance: "Erscheinungsbild",
        appearanceSystem:
          "Canilendar folgt der Darstellungseinstellung deines Geräts.",
        appearanceLight: "Canilendar bleibt immer im hellen Modus.",
        appearanceDark: "Canilendar bleibt immer im dunklen Modus.",
        defaultReminder: "Standard-Erinnerung",
        defaultReminderDescription:
          "Neue Termine starten mit dieser Vorlaufzeit. Du kannst sie pro Termin uberschreiben.",
        dailyAppointmentLimit: "Termine pro Tag",
        dailyAppointmentLimitDescription:
          "Begrenze jeden Tag auf {{count}} Hundetermine. Maximal 15 sind moglich.",
        pro: {
          title: "Canilendar Pro",
          description:
            "Upgrade nur, wenn du mehr als den ersten kostenlosen Hund und Termin brauchst.",
          active: "Canilendar Pro ist aktiv.",
          unavailable: "Kaufe sind in diesem Build noch nicht eingerichtet.",
          freeTier:
            "Du nutzt den kostenlosen Tarif mit 1 Hund und 1 Termin.",
          upgrade: "Auf Pro upgraden",
          restore: "Kaufe wiederherstellen",
          restoring: "Stelle wieder her...",
          restoreFailedTitle: "Wiederherstellung fehlgeschlagen",
          restoreSuccessTitle: "Wiederherstellung abgeschlossen",
          restoreSuccessBody: "Dein Abo-Status wurde aktualisiert.",
          customerCenter: "Customer Center offnen",
          customerCenterTitle: "Customer Center",
          currentOffering:
            "Aktuelles Angebot: {{identifier}} mit {{count}} Paketoptionen.",
          expoGo:
            "Dieser Build lauft im Expo-Go-Vorschaumodus. Verwende `npx expo run:ios`, um echte RevenueCat-Kaufe, Wiederherstellungen und das Customer Center zu testen.",
          hostedUi:
            "Die gehostete RevenueCat-Paywall und das Customer Center brauchen einen iOS-Development-Build oder Produktions-Build. In Expo Go sind sie nicht verfugbar.",
        },
        devReset: {
          title: "Lokale Daten zurucksetzen?",
          body:
            "Diese DEV-Aktion entfernt alle Hunde, Termine, Einstellungen und den Onboarding-Fortschritt von diesem Simulator.",
          button: "Lokale Daten zurucksetzen",
          confirm: "Zurucksetzen",
        },
        storage: "Speicher",
        storageDescription:
          "Termine, Hunde und Erinnerungs-Einstellungen werden in v1 nur auf diesem Gerät gespeichert.",
        alerts: {
          notificationsOffTitle: "Benachrichtigungen sind aus",
          notificationsOffBody:
            "Offne die Systemeinstellungen fur Canilendar, wenn du Banner und Tageszusammenfassungen erhalten mochtest.",
        },
      },
      onboarding: {
        appointment: {
          eyebrow: "Erster Termin",
          title: "Trage den ersten Spaziergang in den Kalender ein",
          descriptionWithDog:
            "{{name}} wird aus dem eben gespeicherten Profil ubernommen.",
          descriptionWithoutDog:
            "Wir verknupfen diesen Termin mit dem Hund, den du gerade angelegt hast.",
          missingDogTitle: "Hund fehlt",
          missingDogBody: "Lege zuerst das Hundeprofil an.",
          pickupTimeEnabled:
            "Fur diesen Spaziergang ist eine konkrete Abholzeit aktiviert.",
          pickupTimeDisabled:
            "Lass das aus, wenn die Abholung irgendwann am Morgen passiert.",
          oneTime: "Der erste Termin bleibt ein einmaliger Spaziergang.",
          reminderDisabled:
            "Es wird keine Abholzeit-Erinnerung geplant, bis du eine Uhrzeit aktivierst.",
          save: "Termin speichern",
          pastAppointmentBody:
            "Der erste Termin muss in der Zukunft liegen.",
        },
        reminders: {
          eyebrow: "Erinnerungen",
          title: "Aktiviere Benachrichtigungen, wenn du bereit bist",
          description:
            "Dein erster Hund und dein erster Termin sind schon gespeichert, deshalb lohnt sich das Aktivieren jetzt sofort.",
          deniedTitle: "Benachrichtigungen sind aus",
          deniedBody:
            "Du kannst das Setup jetzt trotzdem abschliessen und Erinnerungen spater in den Einstellungen aktivieren.",
          appointmentAlertsTitle: "Termin-Erinnerungen",
          appointmentAlertsBody: "Erhalte vor der Abholzeit einen Hinweis.",
          dailySummaryTitle: "Tageszusammenfassung",
          dailySummaryBody:
            "Sieh den Tag mit einer morgendlichen Erinnerung im Voraus.",
          maybeLater: "Vielleicht spater",
        },
      },
      notifications: {
        openAppointment: "Termin offnen",
        openAgenda: "Tagesplan offnen",
        channelName: "Termine",
        appointmentSubtitle: "Termin um {{time}}",
        reminderPrefix: "Erinnerung {{offset}}",
        todayTitle: "Heute in Canilendar",
        noAppointmentsToday: "Heute sind keine Hundetermine geplant.",
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
      dogCard: {
        selected: "Ausgewahlt",
        savedDog: "Gespeicherter Hund",
        pickup: "Abholung: {{value}}",
        owner: "Besitzer: {{value}}",
        notes: "Notizen: {{value}}",
        noNotes: "Fur diesen Hund sind keine weiteren Notizen gespeichert.",
      },
      languages: {
        en: "English",
        de: "Deutsch",
        fr: "Francais",
        es: "Espanol",
      },
    },
  },
  fr: {
    translation: {
      tabs: {
        calendar: "Calendrier",
        dogs: "Chiens",
        settings: "Reglages",
      },
      common: {
        cancel: "Annuler",
        delete: "Supprimer",
        edit: "Modifier",
        enabled: "Active",
        system: "Systeme",
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
          "Gardez le controle des prises en charge, des promenades recurrentes et de l'itineraire du jour sans laisser le calendrier de votre telephone inacheve.",
        monthView: "Mois",
        weekView: "Tableau semaine",
        weekTable: "Tableau semaine",
        weekCount_one: "{{count}} chien",
        weekCount_other: "{{count}} chiens",
        weekEmpty: "Aucune promenade prevue",
        weekMore_one: "+{{count}} promenade de plus",
        weekMore_other: "+{{count}} promenades de plus",
        newAppointment: "Nouveau rendez-vous",
        agenda: "Agenda",
        emptyTitle: "Aucune entree pour ce jour",
        emptyDescription:
          "Ajoutez un rendez-vous a cette date et il apparaitra ici sous forme de fiche chien.",
      },
      appointment: {
        screenTitleNew: "Nouveau rendez-vous",
        screenTitleEdit: "Modifier le rendez-vous",
        eyebrow: "Details de planification",
        titleNew: "Nouveau rendez-vous",
        titleEdit: "Modifier le rendez-vous",
        description:
          "Rassemblez le chien, les details de prise en charge, l heure, la recurrence et le rappel au meme endroit.",
        dogDetails: "Details du chien",
        savedDog: "Chien enregistre",
        newDog: "Nouveau chien",
        noSavedDogs:
          'Aucun chien enregistre pour le moment. Passez a "Nouveau chien" pour creer le premier profil.',
        savedDogsHelp:
          "Choisissez un chien enregistre. L'adresse, le telephone du proprietaire et les notes affiches sur chaque fiche appartiennent a ce profil.",
        dogName: "Nom du chien",
        pickupAddress: "Adresse de prise en charge",
        ownerPhone: "Telephone du proprietaire",
        dogNotes: "Notes sur le chien",
        pickupTimeEnabled:
          "Ajoute une heure de prise en charge precise et active les rappels.",
        pickupTimeDisabled:
          "Desactive par defaut. Cette promenade reste dans le plan du jour sans rappel horaire.",
        repeatWeekly: "Repeter chaque semaine",
        recurringOn: "S affiche a chaque jour selectionne.",
        oneTime: "Reste un rendez-vous unique.",
        reminderLeadTime: "Delai du rappel",
        reminderDisabled:
          "Activez l heure de prise en charge pour envoyer un rappel avant la promenade.",
        noPickupTime: "Pas d heure de prise en charge",
        appointmentNotes: "Notes du rendez-vous",
        reminderPreview:
          "Heure du rappel : {{time}} avec {{count}} minutes d avance.",
        saveChanges: "Enregistrer les modifications",
        createAppointment: "Creer le rendez-vous",
        deleteAppointment: "Supprimer le rendez-vous",
        placeholders: {
          dogName: "Milo",
          pickupAddress: "12 rue des Abois",
          ownerPhone: "+33 1 23 45 67 89",
          dogNotes: "Code du portail, collier, rappel alimentation...",
          appointmentNotes:
            "Retrouver le proprietaire a l'entree laterale, apporter une serviette supplementaire...",
        },
        alerts: {
          missingDogDetailsTitle: "Informations du chien manquantes",
          missingDogDetailsBody:
            "Ajoutez d'abord le nom du chien, l'adresse et le numero du proprietaire.",
          chooseDogTitle: "Choisissez un chien",
          chooseDogBody:
            "Selectionnez un chien existant ou passez a un nouveau profil.",
          dayLimitTitle: "Limite journaliere atteinte",
          dayLimitBody:
            "Cela depasserait votre limite quotidienne de {{limit}} chiens le {{dates}}.",
          repeatDaysTitle: "Choisissez les jours de repetition",
          repeatDaysBody:
            "Selectionnez au moins un jour pour la promenade recurrente.",
          pastAppointmentTitle: "Rendez-vous passe",
          pastAppointmentBody:
            "Les nouveaux rendez-vous doivent etre planifies dans le futur.",
          deleteTitle: "Supprimer le rendez-vous ?",
          deleteBody: "Cela supprime le rendez-vous et ses rappels planifies.",
        },
      },
      dogs: {
        eyebrow: "Profils de chiens enregistres",
        title: "Chiens",
        description:
          "Gardez les details des clients reutilisables pour ajouter des rendez-vous en quelques secondes.",
        addDog: "Ajouter un chien",
        editorAddTitle: "Ajouter un profil de chien",
        editorEditTitle: "Modifier le profil du chien",
        notes: "Notes",
        createDog: "Creer le chien",
        saveChanges: "Enregistrer les modifications",
        emptyTitle: "Aucun chien enregistre",
        emptyDescription:
          "Ajoutez votre premier chien pour planifier les prochains rendez-vous depuis un profil enregistre.",
        upcomingAppointments_one: "{{count}} rendez-vous a venir",
        upcomingAppointments_other: "{{count}} rendez-vous a venir",
        alerts: {
          missingDogDetailsTitle: "Informations du chien manquantes",
          missingDogDetailsBody:
            "Veuillez ajouter un nom, une adresse et un numero de telephone.",
          deleteTitle: "Supprimer {{name}} ?",
          deleteBody:
            "Cela fonctionne seulement si le chien n a aucun rendez-vous planifie.",
          stillScheduledTitle: "Chien encore programme",
          stillScheduledBody:
            "Retirez ou reattribuez les rendez-vous de ce chien avant de supprimer le profil.",
        },
        placeholders: {
          dogName: "Milo",
          pickupAddress: "12 rue des Abois",
          ownerPhone: "+33 1 23 45 67 89",
          notes: "Code du portail, note d alimentation, routine de laisse...",
        },
      },
      settings: {
        eyebrow: "Preferences du planificateur",
        title: "Reglages",
        description:
          "Ajustez la facon dont Canilendar vous rappelle la journee a venir.",
        notifications: "Notifications",
        notificationsEnabled: "Les rappels locaux sont actives.",
        notificationsDenied:
          "Les notifications sont bloquees dans les reglages du systeme.",
        notificationsUnknown:
          "Canilendar demandera votre autorisation lors de la sauvegarde d un rendez-vous ou si vous activez les rappels.",
        enableReminders: "Activer les rappels",
        refreshStatus: "Actualiser le statut",
        refreshingStatus: "Actualisation...",
        openSystemSettings: "Ouvrir les reglages systeme",
        dailySummary: "Resume quotidien",
        dailySummaryDescription:
          "Un rappel chaque matin avec les rendez-vous du jour.",
        summaryTime: "Heure du resume",
        language: "Langue",
        languageDescription:
          "Choisissez une langue fixe ou utilisez la langue de votre telephone. Les langues non prises en charge reviennent a l'anglais.",
        languageCurrent:
          "Langue de l'appareil : {{language}}. Langue actuelle de l'application : {{currentLanguage}}.",
        appearance: "Apparence",
        appearanceSystem:
          "Canilendar suit l'apparence definie sur votre appareil.",
        appearanceLight: "Canilendar reste toujours en mode clair.",
        appearanceDark: "Canilendar reste toujours en mode sombre.",
        defaultReminder: "Rappel par defaut de l'evenement",
        defaultReminderDescription:
          "Les nouveaux rendez-vous commencent avec ce delai de rappel. Vous pouvez le remplacer pour chaque rendez-vous.",
        dailyAppointmentLimit: "Rendez-vous par jour",
        dailyAppointmentLimitDescription:
          "Limitez chaque jour a {{count}} rendez-vous chien. Vous pouvez aller jusqu'a 15.",
        pro: {
          title: "Canilendar Pro",
          description:
            "Passez a la version Pro seulement quand vous avez besoin de plus que le premier chien et rendez-vous gratuits.",
          active: "Canilendar Pro est actif.",
          unavailable:
            "Les achats ne sont pas encore configures dans cette version.",
          freeTier:
            "Vous utilisez l'offre gratuite avec 1 chien et 1 rendez-vous inclus.",
          upgrade: "Passer a Pro",
          restore: "Restaurer les achats",
          restoring: "Restauration...",
          restoreFailedTitle: "Echec de la restauration",
          restoreSuccessTitle: "Restauration terminee",
          restoreSuccessBody: "Le statut de votre abonnement a ete actualise.",
          customerCenter: "Ouvrir le Customer Center",
          customerCenterTitle: "Customer Center",
          currentOffering:
            "Offre actuelle : {{identifier}} avec {{count}} options de forfait.",
          expoGo:
            "Cette version fonctionne en mode apercu Expo Go. Utilisez `npx expo run:ios` pour tester les vrais achats RevenueCat, les restaurations et le Customer Center.",
          hostedUi:
            "L'interface Paywall hebergee de RevenueCat et le Customer Center necessitent une build iOS de developpement ou de production. Ils ne sont pas disponibles dans Expo Go.",
        },
        devReset: {
          title: "Reinitialiser les donnees locales ?",
          body:
            "Cette action DEV supprime tous les chiens, rendez-vous, reglages et la progression d'onboarding enregistres sur ce simulateur.",
          button: "Reinitialiser les donnees locales",
          confirm: "Reinitialiser",
        },
        storage: "Stockage",
        storageDescription:
          "Les rendez-vous, chiens et preferences de rappel sont stockes uniquement sur cet appareil dans v1.",
        alerts: {
          notificationsOffTitle: "Les notifications sont desactivees",
          notificationsOffBody:
            "Ouvrez les reglages systeme de Canilendar si vous voulez des bannieres de rappel et des resumes quotidiens.",
        },
      },
      onboarding: {
        appointment: {
          eyebrow: "Premier rendez-vous",
          title: "Ajoutez la premiere promenade au calendrier",
          descriptionWithDog:
            "{{name}} sera repris depuis le profil que vous venez d'enregistrer.",
          descriptionWithoutDog:
            "Nous associerons ce rendez-vous au chien que vous venez d'ajouter.",
          missingDogTitle: "Chien manquant",
          missingDogBody: "Creez d'abord le profil du chien.",
          pickupTimeEnabled:
            "Une heure de prise en charge precise est activee pour cette promenade.",
          pickupTimeDisabled:
            "Laissez cette option desactivee si la prise en charge se fait dans la matinee.",
          oneTime: "Le premier rendez-vous reste une promenade unique.",
          reminderDisabled:
            "Aucun rappel lie a l'heure ne sera planifie tant que vous n'aurez pas active une heure.",
          save: "Enregistrer le rendez-vous",
          pastAppointmentBody:
            "Le premier rendez-vous doit etre prevu dans le futur.",
        },
        reminders: {
          eyebrow: "Rappels",
          title: "Activez les notifications quand vous etes pret",
          description:
            "Votre premier chien et votre premier rendez-vous sont deja enregistres, donc activer les rappels maintenant est deja utile.",
          deniedTitle: "Les notifications sont desactivees",
          deniedBody:
            "Vous pouvez quand meme terminer la configuration maintenant et activer les rappels plus tard dans les reglages.",
          appointmentAlertsTitle: "Alertes de rendez-vous",
          appointmentAlertsBody:
            "Recevez un rappel avant l'heure de prise en charge.",
          dailySummaryTitle: "Resume quotidien",
          dailySummaryBody:
            "Voyez la journee a venir avec un seul rappel matinal.",
          maybeLater: "Peut-etre plus tard",
        },
      },
      notifications: {
        openAppointment: "Ouvrir le rendez-vous",
        openAgenda: "Ouvrir l'agenda",
        channelName: "Rendez-vous",
        appointmentSubtitle: "Rendez-vous a {{time}}",
        reminderPrefix: "Rappel {{offset}}",
        todayTitle: "Aujourd'hui dans Canilendar",
        noAppointmentsToday:
          "Vous n'avez aucun rendez-vous canin prevu aujourd'hui.",
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
      dogCard: {
        selected: "Selectionne",
        savedDog: "Chien enregistre",
        pickup: "Prise en charge : {{value}}",
        owner: "Proprietaire : {{value}}",
        notes: "Notes : {{value}}",
        noNotes: "Aucune note supplementaire enregistree pour ce chien.",
      },
      languages: {
        en: "English",
        de: "Deutsch",
        fr: "Francais",
        es: "Espanol",
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
          dogName: "Milo",
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
          deleteTitle: "Eliminar cita?",
          deleteBody: "Esto elimina la cita y sus recordatorios programados.",
        },
      },
      dogs: {
        eyebrow: "Perfiles de perros guardados",
        title: "Perros",
        description:
          "Mantén los datos del cliente reutilizables para que las citas se agreguen en segundos.",
        addDog: "Agregar perro",
        editorAddTitle: "Agregar perfil de perro",
        editorEditTitle: "Editar perfil del perro",
        notes: "Notas",
        createDog: "Crear perro",
        saveChanges: "Guardar cambios",
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
        },
        placeholders: {
          dogName: "Milo",
          pickupAddress: "Calle Ladrido 12",
          ownerPhone: "+34 612 345 678",
          notes: "Codigo de puerta, nota de comida, rutina de correa...",
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
        pro: {
          title: "Canilendar Pro",
          description:
            "Mejora solo cuando necesites mas que el primer perro y la primera cita gratuitos.",
          active: "Canilendar Pro esta activo.",
          unavailable: "Las compras aun no estan configuradas en esta build.",
          freeTier:
            "Estas en el plan gratuito con 1 perro y 1 cita incluidos.",
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
          body:
            "Esta accion DEV elimina todos los perros, citas, ajustes y el progreso del onboarding guardados en este simulador.",
          button: "Reiniciar datos locales",
          confirm: "Reiniciar",
        },
        storage: "Almacenamiento",
        storageDescription:
          "Las citas, los perros y las preferencias de recordatorio se guardan solo en este dispositivo en v1.",
        alerts: {
          notificationsOffTitle: "Las notificaciones estan desactivadas",
          notificationsOffBody:
            "Abre los ajustes del sistema de Canilendar si quieres banners y resúmenes diarios.",
        },
      },
      onboarding: {
        appointment: {
          eyebrow: "Primera cita",
          title: "Pon el primer paseo en el calendario",
          descriptionWithDog:
            "{{name}} se reutilizara del perfil que acabas de guardar.",
          descriptionWithoutDog:
            "Asociaremos esta cita al perro que acabas de agregar.",
          missingDogTitle: "Falta el perro",
          missingDogBody: "Crea primero el perfil del perro.",
          pickupTimeEnabled:
            "Hay una hora concreta de recogida activada para este paseo.",
          pickupTimeDisabled:
            "Dejalo desactivado si la recogida ocurre en algun momento de la manana.",
          oneTime: "La primera cita se mantiene como un paseo unico.",
          reminderDisabled:
            "No se programara ningun recordatorio por hora hasta que actives una hora.",
          save: "Guardar cita",
          pastAppointmentBody:
            "La primera cita tiene que estar en el futuro.",
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
      },
      notifications: {
        openAppointment: "Abrir cita",
        openAgenda: "Abrir agenda",
        channelName: "Citas",
        appointmentSubtitle: "Cita a las {{time}}",
        reminderPrefix: "Recordatorio {{offset}}",
        todayTitle: "Hoy en Canilendar",
        noAppointmentsToday: "No tienes citas de perros programadas para hoy.",
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
  void i18n.use(initReactI18next).init({
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
