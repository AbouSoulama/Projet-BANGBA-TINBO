import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { MailIcon, PhoneIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";
import { IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";
import { CONTACT, REQUEST_TYPE_PARAMS } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/contact", "contactTitle", "contactDescription");
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const locale = await resolveLocale(params);
  const { type } = await searchParams;
  const t = await getTranslations("contact");
  const nav = await getTranslations("nav");
  const ui = await getTranslations("ui");
  const defaultType = type ? REQUEST_TYPE_PARAMS[type] : undefined;

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("intro")}
        image={IMAGES.office}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("contact") }]} />}
      />
      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-8">
            <div className="relative hidden aspect-[4/5] overflow-hidden lg:block">
              <Image src={IMAGES.desk} alt="" fill className="object-cover" />
            </div>
            <div className="space-y-5 border-t border-line pt-8">
              <p className="text-sm leading-7 text-muted">{t("directText")}</p>
              <a href={`mailto:${CONTACT.email}`} className="flex items-start gap-4 text-navy hover:text-gold-deep">
                <MailIcon className="mt-1 h-5 w-5 text-gold-deep" />
                <span>
                  <span className="block text-xs tracking-[0.16em] text-muted uppercase">{ui("email")}</span>
                  {CONTACT.email}
                </span>
              </a>
              <a href={CONTACT.phoneHref} className="flex items-start gap-4 text-navy hover:text-gold-deep">
                <PhoneIcon className="mt-1 h-5 w-5 text-gold-deep" />
                <span>
                  <span className="block text-xs tracking-[0.16em] text-muted uppercase">{ui("phone")}</span>
                  {CONTACT.phone}
                </span>
              </a>
            </div>
            <div className="border border-gold/40 bg-white p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{t("meetingKicker")}</p>
              <h2 className="mt-3 font-display text-2xl text-navy">{t("meetingTitle")}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{t("meetingText")}</p>
              <Link
                href="/rendez-vous"
                className="mt-5 inline-flex text-sm font-semibold tracking-[0.12em] text-navy uppercase underline decoration-gold underline-offset-4"
              >
                {t("meetingCta")}
              </Link>
            </div>
          </aside>
          <div className="bg-white p-6 shadow-[0_30px_80px_-40px_rgba(11,35,71,0.35)] md:p-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{t("formTitle")}</p>
            <p className="mt-3 mb-8 text-sm leading-7 text-muted">{t("confidential")}</p>
            <ContactForm locale={locale} defaultType={defaultType} />
          </div>
        </div>
      </section>
    </>
  );
}
