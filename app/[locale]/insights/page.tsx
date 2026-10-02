import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowUpRight } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { Link } from "@/i18n/navigation";
import { getInsights } from "@/lib/content";
import { resolveLocale } from "@/lib/locale";
import { IMAGES, insightCover } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";
import { formatDate, INSIGHT_CATEGORIES, type InsightCategory } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return buildMetadata(locale, "/insights", "insightsTitle", "insightsDescription");
}

export default async function InsightsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const locale = await resolveLocale(params);
  const { category } = await searchParams;
  const selected = INSIGHT_CATEGORIES.includes(category as InsightCategory)
    ? (category as InsightCategory)
    : null;
  const t = await getTranslations("insights");
  const nav = await getTranslations("nav");
  const articles = getInsights(locale).filter((article) => (selected ? article.category === selected : true));

  return (
    <>
      <PageHero
        eyebrow={t("kicker")}
        title={t("title")}
        text={t("intro")}
        image={IMAGES.edtech}
        crumbs={<Breadcrumbs tone="dark" items={[{ href: "/", label: nav("home") }, { label: nav("insights") }]} />}
      />
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/insights"
              className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase ${selected ? "border border-line text-muted" : "bg-navy text-white"}`}
              aria-current={selected ? undefined : "true"}
            >
              {t("all")}
            </Link>
            {INSIGHT_CATEGORIES.map((item) => (
              <Link
                key={item}
                href={`/insights?category=${encodeURIComponent(item)}`}
                className={`px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase ${selected === item ? "bg-navy text-white" : "border border-line text-navy"}`}
                aria-current={selected === item ? "true" : undefined}
              >
                {item}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <p className="mt-12 text-lg text-muted">{t("empty")}</p>
          ) : (
            <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="group flex flex-col">
                  <Link href={`/insights/${article.slug}`} className="relative mb-5 block aspect-[16/10] overflow-hidden">
                    <Image
                      src={insightCover(article.category)}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <p className="text-xs font-semibold tracking-[0.16em] text-gold-deep uppercase">{article.category}</p>
                  <h2 className="mt-3 font-display text-3xl leading-snug text-navy">
                    <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                  </h2>
                  <p className="mt-3 flex-1 leading-7 text-muted">{article.summary}</p>
                  <p className="mt-4 text-sm text-muted">
                    {formatDate(locale, article.date)} · {article.author} · {article.readingTime}
                  </p>
                  <Link href={`/insights/${article.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-navy">
                    {t("read")}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
