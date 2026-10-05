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
  return buildMetadata(locale, "/devenir-partenaire", "becomePartnerTitle", "becomePartnerDescription");
}

export default async function BecomePartnerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("partners");
  const nav = await getTranslations("nav");
  const steps = t.raw("applySteps") as { title: string; text: string }[];

  return (
    <>
      <PageHero
        eyebrow={t("applyKicker")}
        title={t("applyPageTitle")}
        text={t("applyPageIntro")}
        image={IMAGES.desk}
        crumbs={
          <Breadcrumbs
            tone="dark"
            items={[
              { href: "/", label: nav("home") },
              { href: "/partenaires", label: nav("partners") },
              { label: nav("becomePartner") },
            ]}
          />
        }
      />

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
              namespace="partners"
              requestType="Partnership"
              extras={["partnerKind"]}
              honeypotId="partnerWebsite"
            />
          </div>
          <aside className="space-y-8 lg:pt-6">
            <div>
              <h2 className="font-display text-3xl text-navy">{t("asideTitle")}</h2>
              <p className="mt-4 text-lg leading-8 text-muted">{t("asideText")}</p>
            </div>
            <div className="border border-line bg-white p-6">
              <p className="text-xs font-semibold tracking-[0.18em] text-gold-deep uppercase">{t("investorKicker")}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{t("investorText")}</p>
              <Link
                href="/devenir-investisseur"
                className="mt-5 inline-flex text-sm font-semibold tracking-[0.12em] text-navy uppercase underline decoration-gold underline-offset-4"
              >
                {t("investorCta")}
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
