import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ButtonLink } from "@/components/buttons";
import { MdxContent } from "@/components/mdx-content";
import { Link } from "@/i18n/navigation";
import { getInsight, getInsights } from "@/lib/content";
import { resolveLocale } from "@/lib/locale";
import { routing } from "@/i18n/routing";
import { insightCover } from "@/lib/media";
import { formatDate, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getInsights(locale).map((article) => ({ locale, slug: article.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getInsight(locale, slug);
  if (!article) return {};
  const url = `${siteUrl()}/${locale}/insights/${slug}`;
  const languages = Object.fromEntries(
    routing.locales.map((item) => [item, `${siteUrl()}/${item}/insights/${slug}`]),
  );
  return {
    title: article.title,
    description: article.summary,
    alternates: { canonical: url, languages },
    openGraph: {
      title: article.title,
      description: article.summary,
      url,
      type: "article",
    },
  };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const article = getInsight(locale, slug);
  if (!article) notFound();

  const t = await getTranslations("insights");
  const nav = await getTranslations("nav");

  return (
    <article className="bg-white">
      <div className="relative min-h-[52vh] overflow-hidden bg-navy-deep">
        <Image src={insightCover(article.category)} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/80 via-navy-deep/35 to-navy-deep/15" />
        <div className="relative mx-auto flex min-h-[52vh] max-w-3xl flex-col justify-end px-6 pt-36 pb-16 text-white">
          <Breadcrumbs
            tone="dark"
            items={[
              { href: "/", label: nav("home") },
              { href: "/insights", label: nav("insights") },
              { label: article.title },
            ]}
          />
          <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-gold-light uppercase">{article.category}</p>
          <h1 className="mt-4 font-display text-4xl leading-tight md:text-6xl">{article.title}</h1>
          <p className="mt-4 text-sm text-white/70">
            <time dateTime={article.date}>{formatDate(locale, article.date)}</time>
            {" · "}
            {article.author}
            {" · "}
            {article.readingTime}
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
        <p className="text-xl leading-8 text-ink">{article.summary}</p>
        <div className="mt-10">
          <MdxContent source={article.content} />
        </div>
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-display text-3xl text-navy">{t("sources")}</h2>
          {article.sources.length === 0 ? (
            <p className="mt-3 leading-7 text-muted">{t("sourcesEmpty")}</p>
          ) : (
            <ul className="mt-4 list-disc space-y-2 pl-5">
              {article.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          )}
        </section>
        <section className="mt-12 bg-navy px-6 py-8 text-paper">
          <h2 className="font-display text-3xl text-white">{t("ctaTitle")}</h2>
          <div className="mt-6">
            <ButtonLink href="/rendez-vous" variant="gold">
              {t("cta")}
            </ButtonLink>
          </div>
        </section>
        <p className="mt-10">
          <Link href="/insights" className="text-sm font-semibold text-navy underline decoration-gold underline-offset-4">
            {t("back")}
          </Link>
        </p>
      </div>
    </article>
  );
}
