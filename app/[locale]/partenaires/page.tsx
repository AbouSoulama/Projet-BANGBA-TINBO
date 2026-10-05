import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/buttons";
import { CtaBand } from "@/components/cta-band";
import { Reveal, RevealWords, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { resolveLocale } from "@/lib/locale";
import { IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

type Kind = { title: string; text: string };
type Point = { title: string; text: string };

const KIND_IMAGES = [IMAGES.desk, IMAGES.campus, IMAGES.boardroom, IMAGES.training] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/partenaires", "partnersTitle", "partnersDescription");
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocale(params);
  const t = await getTranslations("partners");
  const nav = await getTranslations("nav");
  const kinds = t.raw("kinds") as Kind[];
  const points = t.raw("points") as Point[];

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("intro")}
        image={IMAGES.training}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("partners") }]} />}
      />

      <section className="bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <div>
            <RevealWords text={t("whyTitle")} className="font-display text-4xl text-navy md:text-5xl" />
            <Reveal>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">{t("whyText")}</p>
            </Reveal>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={IMAGES.desk} alt="" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <RevealWords text={t("kindsTitle")} className="font-display text-4xl text-navy md:text-5xl" />
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{t("kindsIntro")}</p>
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2">
            {kinds.map((kind, index) => (
              <StaggerItem key={kind.title}>
                <article className="group relative min-h-[22rem] overflow-hidden">
                  <Image
                    src={KIND_IMAGES[index] ?? IMAGES.training}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/25 to-transparent" />
                  <div className="relative flex min-h-[22rem] flex-col justify-end p-7 text-white">
                    <p className="text-xs tracking-[0.2em] text-gold-light">{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="mt-3 font-display text-3xl">{kind.title}</h2>
                    <p className="mt-2 text-white/80">{kind.text}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-12 max-w-3xl text-sm leading-7 text-muted">{t("confidential")}</p>
        </div>
      </section>

      <section className="bg-navy-deep text-paper">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="font-display text-4xl text-white md:text-5xl">{t("pointsTitle")}</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {points.map((point, index) => (
              <article key={point.title} className="border-t border-gold/50 pt-6">
                <p className="text-xs font-semibold tracking-[0.18em] text-gold">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-display text-3xl text-white">{point.title}</h3>
                <p className="mt-3 text-sm leading-7 text-paper/70">{point.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-24 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-gold-deep">{t("applyEyebrow")}</p>
            <h2 className="mt-5 font-display text-4xl text-navy md:text-5xl">{t("applyTitle")}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{t("applyText")}</p>
          </div>
          <ButtonLink href="/devenir-partenaire" variant="gold">
            {t("applyCta")}
          </ButtonLink>
        </div>
      </section>

      <CtaBand title={t("ctaTitle")} cta={t("cta")} href="/rendez-vous" />
    </>
  );
}
