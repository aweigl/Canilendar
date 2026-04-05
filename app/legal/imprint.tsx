import { useMemo } from "react";
import { Linking } from "react-native";
import { useTranslation } from "react-i18next";

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
                `${legalProfile.businessName}`,
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
                `Telefon: ${legalProfile.phone}`,
                `Webseite: ${legalProfile.website}`,
              ],
            },
            {
              title: "Vertretungsberechtigte Person",
              paragraphs: [
                legalProfile.managingDirector ||
                  "Falls du als GmbH, UG oder andere juristische Person auftrittst, trage hier die vertretungsberechtigte Person ein.",
              ],
            },
            {
              title: "Register und Umsatzsteuer",
              paragraphs: [
                legalProfile.commercialRegister ||
                  "Handelsregister: nur eintragen, wenn dein Unternehmen registrierungspflichtig ist.",
                legalProfile.vatId ||
                  "Umsatzsteuer-ID: nur eintragen, wenn vorhanden.",
              ],
            },
            {
              title: "Berufsrechtliche Angaben",
              paragraphs: [
                legalProfile.profession ||
                  "Nur erforderlich, wenn fur deinen Beruf besondere Zulassungs-, Kammer- oder Aufsichtspflichten gelten.",
              ],
            },
          ]
        : [
            {
              title: "Provider Identification",
              paragraphs: [
                `${legalProfile.businessName}`,
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
                `Phone: ${legalProfile.phone}`,
                `Website: ${legalProfile.website}`,
              ],
            },
            {
              title: "Authorized Representative",
              paragraphs: [
                legalProfile.managingDirector ||
                  "If you publish this app through a company, add the managing director or other authorized representative here before release.",
              ],
            },
            {
              title: "Commercial Register and VAT",
              paragraphs: [
                legalProfile.commercialRegister ||
                  "Commercial register: only add this if your business is registered.",
                legalProfile.vatId ||
                  "VAT ID: only add this if you have one.",
              ],
            },
            {
              title: "Regulated Profession Details",
              paragraphs: [
                legalProfile.profession ||
                  "Only required if your profession is subject to chamber, licensing, or supervisory disclosure duties.",
              ],
            },
          ],
    [isGerman],
  );

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
            void Linking.openURL(getLegalMailToUrl("Canilendar Impressum"));
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
