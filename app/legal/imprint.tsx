import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import { ThemedText } from "@/components/themed-text";
import { getCurrentLanguage } from "@/i18n/helpers";
import { getImprintUrl, getLegalMailToUrl, legalProfile } from "@/lib/legal";

export default function ImprintScreen() {
  const { t } = useTranslation();
  const language = getCurrentLanguage();
  const imprintUrl = getImprintUrl();

  const sections = useMemo(() => {
    switch (language) {
      case "de":
        return [
          {
            title: "Anbieterkennzeichnung",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}`,
              `${legalProfile.postalCode} ${legalProfile.city}`,
              legalProfile.country,
            ],
          },
          {
            title: "Kontakt",
            paragraphs: [`E-Mail: ${legalProfile.email}`],
          },
          {
            title: "Hinweis zur Verbraucherstreitbeilegung",
            paragraphs: [
              "Die frühere EU-Plattform zur Online-Streitbeilegung (ODR-Plattform) wurde zum 20. Juli 2025 eingestellt.",
              "Informationen zu außergerichtlichen Streitbeilegungsstellen findest du jetzt unter: https://consumer-redress.ec.europa.eu.",
            ],
          },
          {
            title: "Haftung für Inhalte",
            paragraphs: [
              "Als Diensteanbieter sind wir nach den allgemeinen gesetzlichen Vorschriften für eigene Inhalte in dieser App verantwortlich.",
            ],
          },
        ];
      case "fr":
        return [
          {
            title: "Identification de l’éditeur",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}`,
              `${legalProfile.postalCode} ${legalProfile.city}`,
              legalProfile.country,
            ],
          },
          {
            title: "Contact",
            paragraphs: [`E-mail : ${legalProfile.email}`],
          },
          {
            title: "Information sur le règlement extrajudiciaire des litiges",
            paragraphs: [
              "L’ancienne plateforme européenne de règlement en ligne des litiges (plateforme ODR) a été arrêtée le 20 juillet 2025.",
              "Tu trouveras désormais des informations sur les organismes de règlement extrajudiciaire des litiges ici : https://consumer-redress.ec.europa.eu.",
            ],
          },
          {
            title: "Responsabilité pour les contenus",
            paragraphs: [
              "En tant que prestataire de services, nous sommes responsables de nos propres contenus dans cette application conformément aux dispositions légales générales.",
            ],
          },
        ];
      case "es":
        return [
          {
            title: "Identificación del prestador",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}`,
              `${legalProfile.postalCode} ${legalProfile.city}`,
              legalProfile.country,
            ],
          },
          {
            title: "Contacto",
            paragraphs: [`Correo electrónico: ${legalProfile.email}`],
          },
          {
            title: "Información sobre resolución extrajudicial de litigios",
            paragraphs: [
              "La antigua plataforma europea de resolución de litigios en línea (plataforma ODR) se cerró el 20 de julio de 2025.",
              "Ahora puedes encontrar información sobre organismos de resolución extrajudicial de litigios en: https://consumer-redress.ec.europa.eu.",
            ],
          },
          {
            title: "Responsabilidad por los contenidos",
            paragraphs: [
              "Como prestadores de servicios, somos responsables de nuestros propios contenidos en esta app conforme a la legislación general aplicable.",
            ],
          },
        ];
      default:
        return [
          {
            title: "Provider Identification",
            paragraphs: [
              `${legalProfile.controllerName}`,
              `${legalProfile.streetAddress}`,
              `${legalProfile.postalCode} ${legalProfile.city}`,
              legalProfile.country,
            ],
          },
          {
            title: "Contact",
            paragraphs: [`Email: ${legalProfile.email}`],
          },
          {
            title: "Notice on Consumer Dispute Resolution",
            paragraphs: [
              "The former EU Online Dispute Resolution platform (ODR platform) was discontinued on July 20, 2025.",
              "Information about out-of-court consumer dispute resolution bodies is now available at: https://consumer-redress.ec.europa.eu.",
            ],
          },
          {
            title: "Liability for Content",
            paragraphs: [
              "As a service provider, we are responsible for our own content in this app under the general legal provisions.",
            ],
          },
        ];
    }
  }, [language]);

  async function handleEmailPress() {
    const url = getLegalMailToUrl("Canilendar Impressum");

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
      eyebrow={t("legal.imprintEyebrow")}
      title={t("legal.imprintTitle")}
      description={t("legal.imprintDescription")}
      sections={sections}
      actions={[
        {
          label: t("legal.emailAction"),
          onPress: () => {
            handleEmailPress();
          },
          icon: "envelope.fill" as const,
        },
        ...(imprintUrl
          ? [
              {
                label: t("legal.openHostedAction"),
                onPress: () => {
                  Linking.openURL(imprintUrl);
                },
                icon: "arrow.right.circle.fill" as const,
              },
            ]
          : []),
      ]}
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
