import { useMemo } from "react";
import { Alert, Linking } from "react-native";
import { useTranslation } from "react-i18next";

import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import { ThemedText } from "@/components/themed-text";
import {
  getLegalMailToUrl,
  getPrivacyChoicesUrl,
  getPrivacyPolicyUrl,
  legalProfile,
  legalProfileNeedsAttention,
} from "@/lib/legal";

export default function PrivacyScreen() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.resolvedLanguage?.startsWith("de") ?? false;
  const privacyPolicyUrl = getPrivacyPolicyUrl();
  const privacyChoicesUrl = getPrivacyChoicesUrl();
  const warning = legalProfileNeedsAttention()
    ? isGerman
      ? "Prufe alle Kontaktdaten, die zustandige Aufsichtsbehorde und deine tatsachlichen Verarbeitungen in `lib/legal.ts`, bevor du diese Datenschutzerklarung produktiv nutzt."
      : "Review all controller details, the competent authority, and your real processing activities in `lib/legal.ts` before using this privacy policy in production."
    : null;

  const sections = useMemo(
    () =>
      isGerman
        ? [
            {
              title: "Verantwortliche Stelle",
              paragraphs: [
                `${legalProfile.controllerName}, ${legalProfile.businessName}`,
                `${legalProfile.streetAddress}, ${legalProfile.postalCode} ${legalProfile.city}, ${legalProfile.country}`,
                `Kontakt: ${legalProfile.email} und ${legalProfile.phone}`,
              ],
            },
            {
              title: "Welche Daten Canilendar verarbeitet",
              bullets: [
                "Lokal gespeicherte Planerdaten wie Hundeprofile, Adressen, Telefonnummern, Terminnotizen, wiederkehrende Termine und Erinnerungseinstellungen.",
                "Apple-Anmeldedaten: Apple User ID sowie gegebenenfalls E-Mail-Adresse und Name, soweit Apple diese bei der ersten Anmeldung ubermittelt.",
                "RevenueCat-Abodaten: pseudonyme App User ID, Kaufstatus, Entitlements und Wiederherstellungsinformationen fur In-App-Kaufe.",
                "Benachrichtigungsstatus und Metadaten fur lokale Erinnerungen auf dem Gerat.",
              ],
            },
            {
              title: "Zwecke und Rechtsgrundlagen",
              bullets: [
                "Bereitstellung der App und Speicherung deiner Planerdaten auf dem Gerat auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.",
                "Durchfuhrung und Wiederherstellung von In-App-Kaufen uber Apple und RevenueCat auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.",
                "Lokale Erinnerungen nur, wenn du Benachrichtigungen auf dem Gerat erlaubst; insoweit stutzt sich die Verarbeitung auf deine Einwilligung bzw. Geratefreigabe.",
                "Aufbewahrung von abrechnungs- und steuerrechtlich erforderlichen Nachweisen auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.",
              ],
            },
            {
              title: "Empfanger und Dienstleister",
              bullets: [
                "Apple fur Sign in with Apple, App Store Abwicklung und Aboverwaltung.",
                "RevenueCat als Auftragsverarbeiter fur Abo-Status, Kaufwiederherstellung und Customer Center.",
                "Keine Werbe-, Marketing- oder Analyse-SDKs im aktuellen nativen iOS-Build.",
              ],
            },
            {
              title: "Drittlandtransfers",
              paragraphs: [
                "Soweit Apple oder RevenueCat Daten in Staaten ausserhalb der EU bzw. des EWR verarbeiten, erfolgt dies nur auf Grundlage eines zulassigen Transfermechanismus wie Angemessenheitsbeschluss, Standardvertragsklauseln oder einer anderen gesetzlichen Grundlage.",
              ],
            },
            {
              title: "Speicherdauer",
              paragraphs: [
                "Planerdaten bleiben lokal auf deinem Gerat, bis du sie loschst oder die Account-Loschung in der App ausfuhrst.",
                "Apple- und RevenueCat-Kaufnachweise konnen langer gespeichert werden, soweit dies fur Abrechnung, Missbrauchspravention oder gesetzliche Aufbewahrungspflichten erforderlich ist.",
              ],
            },
            {
              title: "Pflicht zur Bereitstellung und automatisierte Entscheidungen",
              paragraphs: [
                "Die Bereitstellung der Account- und Kaufdaten ist erforderlich, wenn du Sign in with Apple oder Pro-Abos nutzen mochtest. Ohne diese Daten konnen diese Funktionen nicht bereitgestellt werden.",
                "Es findet keine automatisierte Entscheidungsfindung einschliesslich Profiling im Sinne von Art. 22 DSGVO statt.",
              ],
            },
            {
              title: "Deine Rechte",
              bullets: [
                "Auskunft, Berichtigung, Loschung, Einschrankung der Verarbeitung und Datenubertragbarkeit nach Massgabe der DSGVO.",
                "Widerruf erteilter Einwilligungen mit Wirkung fur die Zukunft, etwa uber die Gerateeinstellungen fur Benachrichtigungen.",
                "Beschwerde bei der zustandigen Datenschutzaufsichtsbehorde: " +
                  legalProfile.supervisoryAuthority,
              ],
            },
            {
              title: "Cookies und Tracking",
              paragraphs: [
                "Der aktuelle native iOS-Build verwendet keine nicht notwendigen Cookies oder vergleichbare Tracking-Technologien fur Werbung oder Analytics. Deshalb wird derzeit kein generisches Cookie-Banner angezeigt.",
                "Falls spatere Versionen optionale Analytics-, Marketing- oder Tracking-SDKs einfuhren, wird Canilendar dafur vor Aktivierung eine gesonderte Einwilligung einholen.",
              ],
            },
          ]
        : [
            {
              title: "Controller",
              paragraphs: [
                `${legalProfile.controllerName}, ${legalProfile.businessName}`,
                `${legalProfile.streetAddress}, ${legalProfile.postalCode} ${legalProfile.city}, ${legalProfile.country}`,
                `Contact: ${legalProfile.email} and ${legalProfile.phone}`,
              ],
            },
            {
              title: "What Canilendar Processes",
              bullets: [
                "Locally stored planner data such as dog profiles, addresses, phone numbers, appointment notes, recurring appointments, and reminder settings.",
                "Sign in with Apple data: Apple user ID plus email address and name when Apple provides them during the first authorization.",
                "RevenueCat subscription data: pseudonymous app user ID, purchase status, entitlements, and restore information for in-app purchases.",
                "Notification permission state and reminder metadata needed for local notifications on the device.",
              ],
            },
            {
              title: "Purposes and Legal Bases",
              bullets: [
                "Providing the app and keeping your planner data available on-device under Article 6(1)(b) GDPR.",
                "Processing and restoring in-app purchases through Apple and RevenueCat under Article 6(1)(b) GDPR.",
                "Sending local reminders only after you allow notifications on your device; that part relies on your consent or device-level permission.",
                "Retaining billing and tax records where legally required under Article 6(1)(c) GDPR.",
              ],
            },
            {
              title: "Recipients and Processors",
              bullets: [
                "Apple for Sign in with Apple, App Store billing, and subscription management.",
                "RevenueCat as processor for subscription status, restore flows, and Customer Center features.",
                "No advertising, marketing, or analytics SDKs are included in the current native iOS build.",
              ],
            },
            {
              title: "Third-Country Transfers",
              paragraphs: [
                "If Apple or RevenueCat process personal data outside the EU or EEA, this only happens under a lawful transfer mechanism such as an adequacy decision, standard contractual clauses, or another valid legal basis.",
              ],
            },
            {
              title: "Retention",
              paragraphs: [
                "Planner data remains on your device until you delete it or run the in-app account deletion flow.",
                "Apple and RevenueCat may retain transaction records for billing, fraud prevention, and statutory retention duties for longer.",
              ],
            },
            {
              title: "Whether Data Is Required and Automated Decisions",
              paragraphs: [
                "Account and purchase data is required if you want to use Sign in with Apple or Pro subscriptions. Without that data, those features cannot be provided.",
                "Canilendar does not use automated decision-making or profiling under Article 22 GDPR.",
              ],
            },
            {
              title: "Your Rights",
              bullets: [
                "Access, rectification, erasure, restriction, and data portability to the extent provided by the GDPR.",
                "Withdrawal of consent for future processing, for example through the device settings for notifications.",
                "Complaint to the competent supervisory authority: " +
                  legalProfile.supervisoryAuthority,
              ],
            },
            {
              title: "Cookies and Tracking",
              paragraphs: [
                "The current native iOS build does not use non-essential cookies or similar tracking technologies for analytics or advertising, so the app does not currently show a generic cookie banner.",
                "If a future version adds optional analytics, marketing, or tracking SDKs, Canilendar will ask for separate in-app consent before activating them.",
              ],
            },
          ],
    [isGerman],
  );

  const actions = [
    {
      label: t("legal.emailAction"),
      onPress: () => {
        void handleEmailPress();
      },
      icon: "envelope.fill" as const,
    },
    ...(privacyPolicyUrl
      ? [
          {
            label: t("legal.openHostedAction"),
            onPress: () => {
              void Linking.openURL(privacyPolicyUrl);
            },
            icon: "arrow.right.circle.fill" as const,
          },
        ]
      : []),
    ...(privacyChoicesUrl
      ? [
          {
            label: t("legal.privacyChoicesAction"),
            onPress: () => {
              void Linking.openURL(privacyChoicesUrl);
            },
            icon: "arrow.right.circle.fill" as const,
          },
        ]
      : []),
  ];

  async function handleEmailPress() {
    const url = getLegalMailToUrl("Canilendar privacy request");

    try {
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        Alert.alert(
          t("legal.emailUnavailableTitle"),
          t("legal.emailUnavailableBody", {
            email: legalProfile.email,
          }),
        );
        return;
      }

      await Linking.openURL(url);
    } catch {
      Alert.alert(
        t("legal.emailUnavailableTitle"),
        t("legal.emailUnavailableBody", {
          email: legalProfile.email,
        }),
      );
    }
  }

  return (
    <LegalDocumentScreen
      eyebrow={t("legal.privacyEyebrow")}
      title={t("legal.privacyTitle")}
      description={t("legal.privacyDescription")}
      sections={sections}
      warning={warning}
      warningTitle={isGerman ? "Vor dem Release prufen" : "Before release"}
      actions={actions}
      footer={
        <ThemedText type="caption">
          {isGerman
            ? `Stand: ${legalProfile.lastUpdated}`
            : `Last updated: ${legalProfile.lastUpdated}`}
        </ThemedText>
      }
    />
  );
}
