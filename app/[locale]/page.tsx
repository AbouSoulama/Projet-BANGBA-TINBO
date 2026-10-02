import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/buttons";
import { CtaBand } from "@/components/cta-band";
import { HeroSlider, type Slide } from "@/components/hero-slider";
import { ArrowUpRight } from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { ImageReveal, Reveal, RevealWords, Stagger, StaggerItem } from "@/components/motion";
import { Link } from "@/i18n/navigation";
import { getInsights, getOperations } from "@/lib/content";
import { resolveLocale } from "@/lib/locale";
import { EXPERTISE_IMAGES, HERO_SLIDE_IMAGES, IMAGES, insightCover } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/site";

type Item = { title: string; text: string; href?: string };
type CopySlide = {
  eyebrow: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "", "homeTitle", "homeDescription");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("home");
  const ui = await getTranslations("ui");
  const expertise = t.raw("expertiseItems") as Item[];
  const axes = t.raw("focusAxes") as Item[];
  const proofs = t.raw("whyItems") as Item[];
  const copySlides = t.raw("slides") as CopySlide[];
  const marquee = t.raw("marquee") as string[];
  const operations = getOperations(locale).slice(0, 3);
  const insights = getInsights(locale).slice(0, 3);

  const slides: Slide[] = copySlides.map((slide, index) => ({
    ...slide,
    image: HERO_SLIDE_IMAGES[index] ?? IMAGES.ouaga,
  }));

  return (
    <>
      <HeroSlider
        slides={slides}
        labels={{
          previous: ui("previous"),
          next: ui("next"),
          slide: ui("slide"),
          scroll: ui("scroll"),
          carousel: ui("carousel"),
        }}
      />
      <Marquee items={marquee} />

      <section className="overflow-hidden bg-paper">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
          <div>
            <Reveal>
              <p className="eyebrow text-gold-deep">{t("positioningEyebrow")}</p>
            </Reveal>
            <RevealWords
              text={t("positioningTitle")}
              className="mt-6 font-display text-4xl leading-[1.08] text-navy md:text-6xl"
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-xl text-lg leading-8 text-muted">{t("positioningText")}</p>
            </Reveal>
          </div>
          <ImageReveal className="aspect-[4/5] lg:aspect-[5/6]">
            <Image src={IMAGES.desk} alt="" fill className="object-cover" sizes="(min-width: 1024px) 40vw, 100vw" />
          </ImageReveal>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="eyebrow text-gold-deep">{t("expertiseEyebrow")}</p>
              </Reveal>
              <RevealWords text={t("expertiseTitle")} className="mt-5 font-display text-4xl text-navy md:text-5xl" />
            </div>
            <Reveal>
              <ButtonLink href="/expertises" variant="ghost">
                {t("expertiseCta")}
              </ButtonLink>
            </Reveal>
          </div>
          <Stagger className="mt-14 grid gap-5 md:grid-cols-2">
            {expertise.map((item, index) => (
              <StaggerItem key={item.title}>
                <Link href={item.href ?? "/expertises"} className="group relative block min-h-[22rem] overflow-hidden">
                  <Image
                    src={EXPERTISE_IMAGES[index] ?? IMAGES.desk}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/55 to-navy-deep/10" />
                  <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-8 text-white">
                    <p className="text-xs tracking-[0.22em] text-gold-light">0{index + 1}</p>
                    <h3 className="mt-4 font-display text-3xl">{item.title}</h3>
                    <p className="mt-3 max-w-md leading-7 text-white/75">{item.text}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-gold-light uppercase">
                      {ui("discover")}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-deep text-paper">
        <Image src={IMAGES.classroom} alt="" fill sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/88 to-navy-deep/55" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <Reveal>
            <p className="eyebrow text-gold-light">{t("focusEyebrow")}</p>
          </Reveal>
          <RevealWords
            text={t("focusTitle")}
            className="mt-6 max-w-4xl font-display text-4xl leading-[1.08] text-white md:text-6xl"
          />
          <Reveal delay={0.12}>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-paper/80">{t("focusText")}</p>
          </Reveal>
          <Stagger className="mt-16 grid gap-8 md:grid-cols-3" gap={0.14}>
            {axes.map((axis) => (
              <StaggerItem key={axis.title}>
                <article className="border-t border-gold pt-6">
                  <h3 className="font-display text-3xl text-white">{axis.title}</h3>
                  <p className="mt-3 leading-7 text-paper/75">{axis.text}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2}>
            <div className="mt-14">
              <ButtonLink href="/investir#opportunites" variant="gold">
                {t("focusCta")}
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <Reveal>
            <p className="eyebrow text-gold-deep">{t("whyEyebrow")}</p>
          </Reveal>
          <RevealWords text={t("whyTitle")} className="mt-5 font-display text-4xl text-navy md:text-5xl" />
          <Stagger className="mt-14 grid gap-px bg-line sm:grid-cols-2">
            {proofs.map((item, index) => (
              <StaggerItem key={item.title}>
                <article className="h-full bg-paper p-8 md:p-10">
                  <p className="text-xs tracking-[0.2em] text-gold-deep">0{index + 1}</p>
                  <h3 className="mt-5 font-display text-3xl text-navy">{item.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{item.text}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <Reveal>
            <p className="eyebrow text-gold-deep">{t("operationsEyebrow")}</p>
          </Reveal>
          <RevealWords text={t("operationsTitle")} className="mt-5 font-display text-4xl text-navy md:text-5xl" />
          {operations.length === 0 ? (
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
              <ImageReveal className="aspect-[16/11]">
                <Image src={IMAGES.ouaga} alt="" fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
              </ImageReveal>
              <Reveal>
                <p className="font-display text-3xl leading-snug text-navy md:text-4xl">{t("operationsFallback")}</p>
                <div className="mt-8">
                  <ButtonLink href="/operations" variant="ghost">
                    {t("operationsAll")}
                  </ButtonLink>
                </div>
              </Reveal>
            </div>
          ) : (
            <>
              <Stagger className="mt-12 grid gap-8 md:grid-cols-3">
                {operations.map((project) => (
                  <StaggerItem key={project.slug}>
                    <article className="group flex h-full flex-col overflow-hidden bg-paper">
                      <div className="relative aspect-[16/10] overflow-hidden bg-navy">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="font-display text-2xl text-navy">{project.title}</h3>
                        <p className="mt-2 text-sm text-muted">
                          {project.sector} · {project.location}
                        </p>
                        <p className="mt-3 text-sm">{project.interventionType}</p>
                        <Link
                          href={`/operations/${project.slug}`}
                          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy"
                        >
                          {t("operationsCta")}
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </article>
                  </StaggerItem>
                ))}
              </Stagger>
              <div className="mt-10">
                <ButtonLink href="/operations" variant="ghost">
                  {t("operationsAll")}
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-line bg-paper">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <Reveal>
                <p className="eyebrow text-gold-deep">{t("insightsEyebrow")}</p>
              </Reveal>
              <RevealWords text={t("insightsTitle")} className="mt-5 font-display text-4xl text-navy md:text-5xl" />
            </div>
            <ButtonLink href="/insights" variant="ghost">
              {t("insightsCta")}
            </ButtonLink>
          </div>
          <Stagger className="mt-12 grid gap-8 md:grid-cols-3">
            {insights.map((article) => (
              <StaggerItem key={article.slug}>
                <article className="group flex h-full flex-col">
                  <Link href={`/insights/${article.slug}`} className="relative mb-5 block aspect-[16/10] overflow-hidden">
                    <Image
                      src={insightCover(article.category)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <p className="text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">{article.category}</p>
                  <h3 className="mt-3 font-display text-2xl leading-snug text-navy">
                    <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p className="mt-3 flex-1 leading-7 text-muted">{article.summary}</p>
                  <p className="mt-4 text-sm text-muted">
                    {formatDate(locale, article.date)} · {article.readingTime}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <CtaBand
        eyebrow={t("finalEyebrow")}
        title={t("finalTitle")}
        text={t("finalText")}
        cta={t("finalCta")}
        href="/contact#rendez-vous"
      />
    </>
  );
}
