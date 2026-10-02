import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { siteUrl } from "./site";

type MetaKey =
  | "homeTitle"
  | "homeDescription"
  | "btisTitle"
  | "btisDescription"
  | "expertisesTitle"
  | "expertisesDescription"
  | "investTitle"
  | "investDescription"
  | "operationsTitle"
  | "operationsDescription"
  | "insightsTitle"
  | "insightsDescription"
  | "contactTitle"
  | "contactDescription";

export async function buildMetadata(
  locale: string,
  path: string,
  titleKey: MetaKey,
  descriptionKey: MetaKey,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = `${siteUrl()}/${locale}${path}`;
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, `${siteUrl()}/${item}${path}`]),
  );

  return {
    title: t(titleKey),
    description: t(descriptionKey),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title: t(titleKey),
      description: t(descriptionKey),
      url,
      locale: locale === "fr" ? "fr_FR" : "en_US",
      type: "website",
      siteName: t("siteName"),
    },
  };
}
