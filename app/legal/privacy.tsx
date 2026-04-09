import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import { ThemedText } from "@/components/themed-text";
import { getCurrentLanguage } from "@/i18n/helpers";
import {
  getLegalMailToUrl,
  getPrivacyChoicesUrl,
  getPrivacyPolicyUrl,
  legalProfile,
} from "@/lib/legal";

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const language = getCurrentLanguage();
  const privacyPolicyUrl = getPrivacyPolicyUrl();
  const privacyChoicesUrl = getPrivacyChoicesUrl();

  const sections = useMemo(() => {
    switch (language) {
      case "de":
        return [
          {
            title: "Verantwortliche Stelle",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}, ${legalProfile.postalCode} ${legalProfile.city}, ${legalProfile.country}`,
              `Kontakt: ${legalProfile.email}`,
            ],
          },
          {
            title: "Welche Daten Canilendar verarbeitet",
            bullets: [
              "Lokal gespeicherte Planerdaten wie Hundeprofile, Hundefotos, Adressen, Telefonnummern, Terminnotizen, wiederkehrende Termine und Erinnerungseinstellungen.",
              "Apple-Anmeldedaten: Apple User ID sowie gegebenenfalls E-Mail-Adresse und Name, soweit Apple diese bei der ersten Anmeldung übermittelt.",
              "RevenueCat-Abodaten: pseudonyme App User ID, Kaufstatus, Entitlements und Wiederherstellungsinformationen für In-App-Käufe.",
              "Benachrichtigungsstatus und Metadaten für lokale Erinnerungen auf dem Gerät.",
              "Kamera- oder Mediathekszugriff nur dann, wenn du freiwillig ein Foto zu einem Hundeprofil hinzufügst.",
            ],
          },
          {
            title: "Zwecke und Rechtsgrundlagen",
            bullets: [
              "Bereitstellung der App und Speicherung deiner Planerdaten auf dem Gerät auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.",
              "Durchführung und Wiederherstellung von In-App-Käufen über Apple und RevenueCat auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.",
              "Lokale Erinnerungen nur, wenn du Benachrichtigungen auf dem Gerät erlaubst; insoweit stützt sich die Verarbeitung auf deine Einwilligung bzw. Gerätefreigabe.",
              "Aufbewahrung von abrechnungs- und steuerrechtlich erforderlichen Nachweisen auf Grundlage von Art. 6 Abs. 1 lit. c DSGVO.",
            ],
          },
          {
            title: "Empfänger und Dienstleister",
            bullets: [
              "Apple für Sign in with Apple, App-Store-Abwicklung und Aboverwaltung.",
              "RevenueCat als Auftragsverarbeiter für Abo-Status, Kaufwiederherstellung und Customer Center.",
              "Keine Werbe-, Marketing- oder Analyse-SDKs im aktuellen nativen iOS-Build.",
            ],
          },
          {
            title: "Drittlandtransfers",
            paragraphs: [
              "Soweit Apple oder RevenueCat Daten in Staaten außerhalb der EU bzw. des EWR verarbeiten, erfolgt dies nur auf Grundlage eines zulässigen Transfermechanismus wie Angemessenheitsbeschluss, Standardvertragsklauseln oder einer anderen gesetzlichen Grundlage.",
            ],
          },
          {
            title: "Speicherdauer",
            paragraphs: [
              "Planerdaten bleiben lokal auf deinem Gerät, bis du sie löschst oder die Account-Löschung in der App ausführst.",
              "Apple- und RevenueCat-Kaufnachweise können länger gespeichert werden, soweit dies für Abrechnung, Missbrauchsprävention oder gesetzliche Aufbewahrungspflichten erforderlich ist.",
            ],
          },
          {
            title:
              "Pflicht zur Bereitstellung und automatisierte Entscheidungen",
            paragraphs: [
              "Die Bereitstellung der Account- und Kaufdaten ist erforderlich, wenn du Sign in with Apple oder Pro-Abos nutzen möchtest. Ohne diese Daten können diese Funktionen nicht bereitgestellt werden.",
              "Es findet keine automatisierte Entscheidungsfindung einschließlich Profiling im Sinne von Art. 22 DSGVO statt.",
            ],
          },
          {
            title: "Deine Rechte",
            bullets: [
              "Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit nach Maßgabe der DSGVO.",
              "Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft, etwa über die Geräteeinstellungen für Benachrichtigungen.",
              "Beschwerde bei der zuständigen Datenschutzaufsichtsbehörde: " +
                legalProfile.supervisoryAuthority,
            ],
          },
          {
            title: "Cookies und Tracking",
            paragraphs: [
              "Der aktuelle native iOS-Build verwendet keine nicht notwendigen Cookies oder vergleichbare Tracking-Technologien für Werbung oder Analytics. Deshalb wird derzeit kein generisches Cookie-Banner angezeigt.",
              "Falls spätere Versionen optionale Analytics-, Marketing- oder Tracking-SDKs einführen, wird Canilendar dafür vor der Aktivierung eine gesonderte Einwilligung einholen.",
            ],
          },
        ];
      case "fr":
        return [
          {
            title: "Responsable du traitement",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}, ${legalProfile.postalCode} ${legalProfile.city}, ${legalProfile.country}`,
              `Contact : ${legalProfile.email}`,
            ],
          },
          {
            title: "Quelles données Canilendar traite",
            bullets: [
              "Données de planning stockées localement, telles que profils de chiens, photos de chiens, adresses, numéros de téléphone, notes de rendez-vous, rendez-vous récurrents et réglages de rappel.",
              "Données de connexion Apple : identifiant utilisateur Apple ainsi que, le cas échéant, adresse e-mail et nom lorsque Apple les transmet lors de la première connexion.",
              "Données d’abonnement RevenueCat : identifiant applicatif pseudonyme, statut d’achat, entitlements et informations de restauration pour les achats intégrés.",
              "Statut d’autorisation des notifications et métadonnées nécessaires aux rappels locaux sur l’appareil.",
              "Accès à l’appareil photo ou à la photothèque uniquement si tu ajoutes volontairement une photo à un profil de chien.",
            ],
          },
          {
            title: "Finalités et bases juridiques",
            bullets: [
              "Fourniture de l’application et conservation de tes données de planning sur l’appareil sur la base de l’article 6, paragraphe 1, point b) du RGPD.",
              "Traitement et restauration des achats intégrés via Apple et RevenueCat sur la base de l’article 6, paragraphe 1, point b) du RGPD.",
              "Envoi de rappels locaux uniquement lorsque tu autorises les notifications sur ton appareil ; cette partie repose sur ton consentement ou sur l’autorisation accordée au niveau de l’appareil.",
              "Conservation des justificatifs requis en matière de facturation et de fiscalité sur la base de l’article 6, paragraphe 1, point c) du RGPD.",
            ],
          },
          {
            title: "Destinataires et sous-traitants",
            bullets: [
              "Apple pour Sign in with Apple, la facturation via l’App Store et la gestion des abonnements.",
              "RevenueCat en tant que sous-traitant pour le statut d’abonnement, la restauration des achats et le Customer Center.",
              "Aucun SDK publicitaire, marketing ou analytique n’est inclus dans la build iOS native actuelle.",
            ],
          },
          {
            title: "Transferts vers des pays tiers",
            paragraphs: [
              "Si Apple ou RevenueCat traitent des données personnelles en dehors de l’UE ou de l’EEE, cela se fait uniquement sur la base d’un mécanisme de transfert valable, par exemple une décision d’adéquation, des clauses contractuelles types ou une autre base légale applicable.",
            ],
          },
          {
            title: "Durée de conservation",
            paragraphs: [
              "Les données de planning restent sur ton appareil jusqu’à ce que tu les supprimes ou que tu exécutes la procédure de suppression du compte dans l’application.",
              "Apple et RevenueCat peuvent conserver les justificatifs de transaction plus longtemps lorsque cela est nécessaire pour la facturation, la prévention de la fraude ou des obligations légales de conservation.",
            ],
          },
          {
            title:
              "Caractère obligatoire des données et décisions automatisées",
            paragraphs: [
              "Les données de compte et d’achat sont nécessaires si tu souhaites utiliser Sign in with Apple ou les abonnements Pro. Sans ces données, ces fonctionnalités ne peuvent pas être fournies.",
              "Canilendar n’utilise pas de prise de décision automatisée ni de profilage au sens de l’article 22 du RGPD.",
            ],
          },
          {
            title: "Tes droits",
            bullets: [
              "Accès, rectification, effacement, limitation du traitement et portabilité des données dans la mesure prévue par le RGPD.",
              "Retrait d’un consentement accordé pour l’avenir, par exemple via les réglages de l’appareil pour les notifications.",
              "Réclamation auprès de l’autorité de contrôle compétente : " +
                legalProfile.supervisoryAuthority,
            ],
          },
          {
            title: "Cookies et suivi",
            paragraphs: [
              "La build iOS native actuelle n’utilise pas de cookies non essentiels ni de technologies de suivi comparables à des fins publicitaires ou analytiques. L’application n’affiche donc pas actuellement de bannière générique de consentement.",
              "Si une future version ajoute des SDK facultatifs d’analyse, de marketing ou de suivi, Canilendar demandera un consentement distinct dans l’application avant leur activation.",
            ],
          },
        ];
      case "es":
        return [
          {
            title: "Responsable del tratamiento",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}, ${legalProfile.postalCode} ${legalProfile.city}, ${legalProfile.country}`,
              `Contacto: ${legalProfile.email}`,
            ],
          },
          {
            title: "Qué datos trata Canilendar",
            bullets: [
              "Datos de planificación almacenados localmente, como perfiles de perros, fotos de perros, direcciones, números de teléfono, notas de citas, citas recurrentes y ajustes de recordatorio.",
              "Datos de inicio de sesión con Apple: identificador de usuario de Apple y, en su caso, dirección de correo electrónico y nombre cuando Apple los facilita en la primera autenticación.",
              "Datos de suscripción de RevenueCat: identificador de usuario seudónimo de la app, estado de compra, entitlements e información de restauración para compras dentro de la app.",
              "Estado del permiso de notificaciones y metadatos necesarios para recordatorios locales en el dispositivo.",
              "Acceso a la cámara o a la fototeca solo cuando decides añadir una foto a un perfil de perro.",
            ],
          },
          {
            title: "Finalidades y bases jurídicas",
            bullets: [
              "Prestación de la app y conservación de tus datos de planificación en el dispositivo con base en el artículo 6.1.b) del RGPD.",
              "Tramitación y restauración de compras dentro de la app a través de Apple y RevenueCat con base en el artículo 6.1.b) del RGPD.",
              "Envío de recordatorios locales solo después de que autorices las notificaciones en tu dispositivo; esta parte se basa en tu consentimiento o en el permiso concedido a nivel del dispositivo.",
              "Conservación de justificantes exigidos por obligaciones contables y fiscales con base en el artículo 6.1.c) del RGPD.",
            ],
          },
          {
            title: "Destinatarios y encargados del tratamiento",
            bullets: [
              "Apple para Sign in with Apple, la facturación del App Store y la gestión de suscripciones.",
              "RevenueCat como encargado del tratamiento para el estado de la suscripción, la restauración de compras y el Customer Center.",
              "La build nativa actual de iOS no incluye SDK de publicidad, marketing ni analítica.",
            ],
          },
          {
            title: "Transferencias internacionales",
            paragraphs: [
              "Si Apple o RevenueCat tratan datos personales fuera de la UE o del EEE, esto solo tendrá lugar sobre la base de un mecanismo de transferencia válido, como una decisión de adecuación, cláusulas contractuales tipo u otra base jurídica aplicable.",
            ],
          },
          {
            title: "Plazo de conservación",
            paragraphs: [
              "Los datos de planificación permanecen en tu dispositivo hasta que los elimines o ejecutes el proceso de eliminación de la cuenta dentro de la app.",
              "Apple y RevenueCat pueden conservar registros de transacciones durante más tiempo cuando sea necesario para facturación, prevención del fraude u obligaciones legales de conservación.",
            ],
          },
          {
            title:
              "Carácter obligatorio de los datos y decisiones automatizadas",
            paragraphs: [
              "Los datos de cuenta y de compra son necesarios si quieres usar Sign in with Apple o suscripciones Pro. Sin esos datos, esas funciones no pueden prestarse.",
              "Canilendar no utiliza decisiones automatizadas ni elaboración de perfiles en el sentido del artículo 22 del RGPD.",
            ],
          },
          {
            title: "Tus derechos",
            bullets: [
              "Acceso, rectificación, supresión, limitación del tratamiento y portabilidad de los datos en la medida prevista por el RGPD.",
              "Retirada del consentimiento para tratamientos futuros, por ejemplo mediante los ajustes del dispositivo para las notificaciones.",
              "Reclamación ante la autoridad de control competente: " +
                legalProfile.supervisoryAuthority,
            ],
          },
          {
            title: "Cookies y seguimiento",
            paragraphs: [
              "La build nativa actual de iOS no utiliza cookies no esenciales ni tecnologías de seguimiento similares con fines publicitarios o analíticos, por lo que la app no muestra actualmente un banner genérico de cookies.",
              "Si una versión futura añade SDK opcionales de analítica, marketing o seguimiento, Canilendar solicitará un consentimiento independiente dentro de la app antes de activarlos.",
            ],
          },
        ];
      default:
        return [
          {
            title: "Controller",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}, ${legalProfile.postalCode} ${legalProfile.city}, ${legalProfile.country}`,
              `Contact: ${legalProfile.email}`,
            ],
          },
          {
            title: "What Canilendar Processes",
            bullets: [
              "Locally stored planner data such as dog profiles, dog photos, addresses, phone numbers, appointment notes, recurring appointments, and reminder settings.",
              "Sign in with Apple data: Apple user ID plus email address and name when Apple provides them during the first authorization.",
              "RevenueCat subscription data: pseudonymous app user ID, purchase status, entitlements, and restore information for in-app purchases.",
              "Notification permission state and reminder metadata needed for local notifications on the device.",
              "Camera or photo-library access only when you choose to attach a photo to a dog profile.",
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
        ];
    }
  }, [language]);

  const actions = [
    {
      label: t("legal.emailAction"),
      onPress: () => {
        handleEmailPress();
      },
      icon: "envelope.fill" as const,
    },
    ...(privacyPolicyUrl
      ? [
          {
            label: t("legal.openHostedAction"),
            onPress: () => {
              Linking.openURL(privacyPolicyUrl);
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
              Linking.openURL(privacyChoicesUrl);
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
      actions={actions}
      footer={
        <ThemedText type="caption">
          {language === "de"
            ? `Stand: ${legalProfile.lastUpdated}`
            : language === "fr"
              ? `Dernière mise à jour : ${legalProfile.lastUpdated}`
              : language === "es"
                ? `Última actualización: ${legalProfile.lastUpdated}`
                : `Last updated: ${legalProfile.lastUpdated}`}
        </ThemedText>
      }
    />
  );
}
