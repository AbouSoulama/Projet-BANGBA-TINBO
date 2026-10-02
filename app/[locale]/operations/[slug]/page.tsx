import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { MdxContent } from "@/components/mdx-content";
import { Link } from "@/i18n/navigation";
import { getOperation, getOperations } from "@/lib/content";
import { resolveLocale } from "@/lib/locale";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getOperations(locale).map((project) => ({ locale, slug: project.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getOperation(locale, slug);
  if (!project) return {};
  const url = `${siteUrl()}/${locale}/operations/${slug}`;
  return {
    title: project.title,
    description: project.context || project.interventionType,
    alternates: { canonical: url },
    openGraph: { title: project.title, description: project.context, url, type: "article" },
  };
}

export default async function OperationPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const locale = await resolveLocale(params);
  const project = getOperation(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("operations");
  const nav = await getTranslations("nav");
  const blocks = [
    { label: t("context"), text: project.context },
    { label: t("intervention"), text: project.intervention },
    { label: t("result"), text: project.result },
  ].filter((block) => block.text);

  return (
    <article className="bg-white">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <Breadcrumbs
          items={[
            { href: "/", label: nav("home") },
            { href: "/operations", label: nav("operations") },
            { label: project.title },
          ]}
        />
        <div className="relative mt-8 aspect-[16/9] bg-navy">
          {project.image ? <Image src={project.image} alt={project.title} fill className="object-cover" priority /> : null}
        </div>
        <h1 className="mt-8 font-display text-5xl leading-tight text-navy">{project.title}</h1>
        <dl className="mt-6 space-y-2 text-sm">
          <div>
            <dt className="inline text-muted">{t("sector")}: </dt>
            <dd className="inline">{project.sector}</dd>
          </div>
          <div>
            <dt className="inline text-muted">{t("location")}: </dt>
            <dd className="inline">{project.location}</dd>
          </div>
          {project.interventionType ? (
            <div>
              <dt className="inline text-muted">{t("interventionType")}: </dt>
              <dd className="inline">{project.interventionType}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-10 space-y-8">
          {blocks.map((block) => (
            <section key={block.label}>
              <h2 className="font-display text-3xl text-navy">{block.label}</h2>
              <p className="mt-3 text-lg leading-8">{block.text}</p>
            </section>
          ))}
        </div>
        {project.content.trim() ? (
          <div className="mt-10">
            <MdxContent source={project.content} />
          </div>
        ) : null}
        <p className="mt-12">
          <Link href="/operations" className="text-sm font-semibold text-navy underline decoration-gold underline-offset-4">
            {t("back")}
          </Link>
        </p>
      </div>
    </article>
  );
}
