import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { MotionProvider, ScrollProgress } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { getInsights, getOperations } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import "../globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display-family",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body-family",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: t("title"),
      template: `%s — ${t("siteName")}`,
    },
    description: t("description"),
    icons: { icon: "/brand/mark.jpeg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const nav = await getTranslations("nav");
  const insights = getInsights(locale).slice(0, 3).map((item) => ({
    href: `/insights/${item.slug}`,
    label: item.title,
  }));
  const operations = getOperations(locale).map((item) => ({
    href: `/operations/${item.slug}`,
    label: item.title,
  }));

  return (
    <html lang={locale} data-scroll-behavior="smooth" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <a
              href="#contenu"
              className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:px-3 focus:py-2"
            >
              {nav("skip")}
            </a>
            <ScrollProgress />
            <SiteHeader insights={insights} operations={operations} />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <SiteFooter />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
