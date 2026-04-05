import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Linking } from "react-native";

import { LegalDocumentScreen } from "@/components/legal/legal-document-screen";
import { ThemedText } from "@/components/themed-text";
import {
  getImprintUrl,
  getLegalMailToUrl,
  legalProfile,
  legalProfileNeedsAttention,
} from "@/lib/legal";

export default function ImprintScreen() {
  const { t, i18n } = useTranslation();
  const isGerman = i18n.resolvedLanguage?.startsWith("de") ?? false;
  const imprintUrl = getImprintUrl();
  const warning = legalProfileNeedsAttention()
    ? isGerman
      ? "Ersetze alle YOUR_* Platzhalter in `lib/legal.ts` und hinterlege eine offentliche HTTPS-URL fur dein Impressum, bevor du die App veroffentlichst."
      : "Replace every YOUR_* placeholder in `lib/legal.ts` and configure a public HTTPS imprint URL before releasing the app."
    : null;

  const sections = useMemo(
    () =>
      isGerman
        ? [
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
              paragraphs: [
                `E-Mail: ${legalProfile.email}`,
                `Webseite: ${legalProfile.website}`,
              ],
            },
            {
              title: "Plattform der EU-Kommission zur Online-Streitbeilegung",
              paragraphs: [
                "Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://consumer-redress.ec.europa.eu.",
              ],
            },
            {
              title: "Haftung für Inhalte",
              paragraphs: [
                "Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen App nach den allgemeinen Gesetzen verantwortlich.",
              ],
            },
          ]
        : [
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
              paragraphs: [
                `Email: ${legalProfile.email}`,
                `Website: ${legalProfile.website}`,
              ],
            },
          ],
    [isGerman],
  );

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
      warning={warning}
      warningTitle={isGerman ? "Vor dem Release prufen" : "Before release"}
      actions={[
        {
          label: t("legal.emailAction"),
          onPress: () => {
            void handleEmailPress();
          },
          icon: "envelope.fill" as const,
        },
        ...(imprintUrl
          ? [
              {
                label: t("legal.openHostedAction"),
                onPress: () => {
                  void Linking.openURL(imprintUrl);
                },
                icon: "arrow.right.circle.fill" as const,
              },
            ]
          : []),
      ]}
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
