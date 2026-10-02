import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CtaBand } from "@/components/cta-band";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { resolveLocale } from "@/lib/locale";
import { EXPERTISE_IMAGES, IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

type Expertise = { id: string; index: string; title: string; points: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/expertises", "expertisesTitle", "expertisesDescription");
}

export default async function ExpertisesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await resolveLocale(params);
  const t = await getTranslations("expertises");
  const nav = await getTranslations("nav");
  const items = t.raw("items") as Expertise[];

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        image={IMAGES.desk}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("expertise") }]} />}
      />
      {items.map((item, index) => (
        <section
          key={item.id}
          id={item.id}
          className={`scroll-mt-28 ${index % 2 === 0 ? "bg-paper" : "bg-white"}`}
        >
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
            <Reveal className={index % 2 === 1 ? "lg:order-2" : undefined}>
              <p className="font-display text-6xl text-gold">{item.index}</p>
              <h2 className="mt-4 font-display text-4xl text-navy md:text-5xl">{item.title}</h2>
              <Stagger className="mt-8 grid gap-3 sm:grid-cols-2">
                {item.points.map((point) => (
                  <StaggerItem key={point}>
                    <p className="border-t border-line pt-3 text-lg">{point}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
            <div className={`relative aspect-[4/5] overflow-hidden ${index % 2 === 1 ? "lg:order-1" : ""}`}>
              <Image
                src={EXPERTISE_IMAGES[index] ?? IMAGES.desk}
                alt=""
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </div>
          </div>
        </section>
      ))}
      <CtaBand title={t("ctaTitle")} cta={t("cta")} href="/contact" />
    </>
  );
}
