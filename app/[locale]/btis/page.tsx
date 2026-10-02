import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/buttons";
import { ImageReveal, Reveal, RevealWords, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { resolveLocale } from "@/lib/locale";
import { IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

type Named = { title: string; text: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/btis", "btisTitle", "btisDescription");
}

export default async function BtisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocale(params);
  const t = await getTranslations("about");
  const nav = await getTranslations("nav");
  const principles = t.raw("principles") as Named[];
  const steps = t.raw("steps") as Named[];

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("intro")}
        image={IMAGES.boardroom}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("btis") }]} />}
      />

      <section id="a-propos" className="scroll-mt-28 bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-2">
          <ImageReveal className="aspect-[4/5]">
            <Image src={IMAGES.desk} alt="" fill className="object-cover" sizes="(min-width: 1024px) 45vw, 100vw" />
          </ImageReveal>
          <div className="space-y-12">
            <Reveal>
              <h2 className="font-display text-4xl text-navy">{t("missionTitle")}</h2>
              <p className="mt-4 text-lg leading-8">{t("mission")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl text-navy">{t("visionTitle")}</h2>
              <p className="mt-4 text-lg leading-8">{t("vision")}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <RevealWords text={t("principlesTitle")} className="font-display text-4xl text-navy md:text-5xl" />
          <Stagger className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((item, index) => (
              <StaggerItem key={item.title}>
                <article className="border-t border-gold pt-6">
                  <p className="text-xs tracking-[0.2em] text-gold-deep">0{index + 1}</p>
                  <h3 className="mt-4 font-display text-3xl text-navy">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{item.text}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="approche" className="scroll-mt-28 bg-navy-deep text-paper">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <RevealWords text={t("approachTitle")} className="font-display text-4xl text-white md:text-5xl" />
          <ol className="mt-16 grid gap-8 md:grid-cols-5">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t border-gold/50 pt-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-gold">0{index + 1}</p>
                <h3 className="mt-4 font-display text-2xl text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-paper/75">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-14">
            <ButtonLink href="/contact" variant="gold">
              {t("cta")}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
