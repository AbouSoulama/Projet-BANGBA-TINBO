import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ApplyForm } from "@/components/apply-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageHero } from "@/components/page-hero";
import { Link } from "@/i18n/navigation";
import { resolveLocale } from "@/lib/locale";
import { IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/devenir-investisseur", "becomeInvestorTitle", "becomeInvestorDescription");
}

export default async function BecomeInvestorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("joinInvestor");
  const nav = await getTranslations("nav");
  const steps = t.raw("steps") as { title: string; text: string }[];
  const points = t.raw("points") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("intro")}
        image={IMAGES.infrastructure}
        crumbs={
          <Breadcrumbs
            tone="dark"
            items={[
              { href: "/", label: nav("home") },
              { href: "/investir", label: nav("invest") },
              { label: nav("becomeInvestor") },
            ]}
          />
        }
      />

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="font-display text-4xl text-navy md:text-5xl">{t("forTitle")}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{t("forText")}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="border-t border-gold bg-white px-6 py-6 font-display text-2xl text-navy">
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link href="/investir" className="text-sm font-semibold text-navy underline decoration-gold underline-offset-4">
              {t("marketCta")}
            </Link>
          </p>
        </div>
      </section>

      <section className="bg-navy-deep text-paper">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="border-t border-gold/50 pt-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-4 font-display text-3xl text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-paper/70">{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-white p-6 shadow-[0_30px_80px_-40px_rgba(11,35,71,0.35)] md:p-10">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{t("formTitle")}</p>
            <p className="mt-3 mb-8 text-sm leading-7 text-muted">{t("formNote")}</p>
            <ApplyForm
              locale={locale}
              namespace="joinInvestor"
              requestType="Investment opportunity"
              extras={["investorProfile", "interest"]}
              honeypotId="investorWebsite"
            />
          </div>
          <aside className="space-y-8 lg:pt-6">
            <div>
              <h2 className="font-display text-3xl text-navy">{t("asideTitle")}</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{t("asideText")}</p>
            </div>
            <div className="border border-line bg-white p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{t("partnerKicker")}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{t("partnerText")}</p>
              <Link
                href="/devenir-partenaire"
                className="mt-5 inline-flex text-sm font-semibold tracking-[0.12em] text-navy uppercase underline decoration-gold underline-offset-4"
              >
                {t("partnerCta")}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
