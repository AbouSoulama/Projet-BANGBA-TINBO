import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowUpRight } from "@/components/icons";
import { ImageReveal, Reveal } from "@/components/motion";
import { PageHero } from "@/components/page-hero";
import { Link } from "@/i18n/navigation";
import { getOperations } from "@/lib/content";
import { resolveLocale } from "@/lib/locale";
import { IMAGES } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/operations", "operationsTitle", "operationsDescription");
}

export default async function OperationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("operations");
  const nav = await getTranslations("nav");
  const projects = getOperations(locale);

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("intro")}
        image={IMAGES.ouaga}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("operations") }]} />}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          {projects.length === 0 ? (
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <ImageReveal className="aspect-[16/11]">
                <Image src={IMAGES.infrastructure} alt="" fill className="object-cover" />
              </ImageReveal>
              <Reveal>
                <p className="font-display text-3xl leading-snug text-navy md:text-4xl">{t("empty")}</p>
                <p className="mt-8 text-lg leading-8 text-muted">{t("confidential")}</p>
              </Reveal>
            </div>
          ) : (
            <>
              <div className="grid gap-8 md:grid-cols-2">
                {projects.map((project) => (
                  <article key={project.slug} className="group overflow-hidden bg-paper">
                    <div className="relative aspect-[16/10] bg-navy">
                      {project.image ? (
                        <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : null}
                    </div>
                    <div className="p-7">
                      <h2 className="font-display text-3xl text-navy">{project.title}</h2>
                      <p className="mt-3 text-sm text-muted">
                        {project.sector} · {project.location}
                      </p>
                      <Link
                        href={`/operations/${project.slug}`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy"
                      >
                        {t("view")}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              <p className="mt-16 max-w-3xl border-t border-line pt-8 text-lg leading-8">{t("confidential")}</p>
            </>
          )}
        </div>
      </section>
    </>
  );
}
