import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/buttons";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { resolveLocale } from "@/lib/locale";
import { IMAGES, OPPORTUNITY_IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

type Card = { title: string; text: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/investir", "investTitle", "investDescription");
}

export default async function InvestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocale(params);
  const t = await getTranslations("invest");
  const nav = await getTranslations("nav");
  const themes = t.raw("themes") as string[];
  const opportunities = t.raw("opportunities") as Card[];
  const marketPoints = t.raw("marketPoints") as string[];
  const steps = t.raw("steps") as string[];

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("subtitle")}
        image={IMAGES.campus}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("invest") }]} />}
      />

      <section id="education" className="scroll-mt-28 bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <RevealWords text={t("whyTitle")} className="font-display text-4xl text-navy md:text-5xl" />
            <Reveal>
              <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t("whyText")}</p>
            </Reveal>
            <ol className="mt-10 space-y-4">
              {themes.map((theme, index) => (
                <li key={theme} className="flex items-baseline gap-4">
                  {index > 0 ? <span className="font-display text-2xl text-gold">+</span> : <span className="w-4" />}
                  <span className="font-display text-3xl text-navy">{theme}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={IMAGES.classroom} alt="" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <section id="opportunites" className="scroll-mt-28 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <RevealWords text={t("opportunitiesTitle")} className="font-display text-4xl text-navy md:text-5xl" />
          <Stagger className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((item, index) => (
              <StaggerItem key={item.title} className={index === 0 ? "md:col-span-2 lg:col-span-1" : undefined}>
                <article className="group relative min-h-[22rem] overflow-hidden">
                  <Image
                    src={OPPORTUNITY_IMAGES[index] ?? IMAGES.campus}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/50 to-transparent" />
                  <div className="relative flex min-h-[22rem] flex-col justify-end p-7 text-white">
                    <h3 className="font-display text-3xl">{item.title}</h3>
                    <p className="mt-2 text-white/80">{item.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="marche" className="scroll-mt-28 bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <RevealWords text={t("marketTitle")} className="font-display text-4xl text-navy md:text-5xl" />
          <p className="mt-6 max-w-3xl text-lg leading-8">{t("marketText")}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {marketPoints.map((point) => (
              <li key={point} className="border-t border-gold bg-white px-6 py-6 font-display text-2xl text-navy">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-deep text-paper">
        <Image src={IMAGES.infrastructure} alt="" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-navy-deep/80" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <h2 className="font-display text-4xl text-white md:text-5xl">{t("roleTitle")}</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-paper/80">{t("roleText")}</p>
          <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step} className="border-t border-gold pt-5">
                <p className="text-xs font-semibold tracking-[0.16em] text-gold">0{index + 1}</p>
                <p className="mt-3 font-display text-3xl text-white">{step}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <ButtonLink href="/contact?type=investment" variant="gold">
              {t("cta")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
