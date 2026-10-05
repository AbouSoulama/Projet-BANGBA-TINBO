import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getInsights, getOperations } from "@/lib/content";
import { siteUrl } from "@/lib/site";

const paths = [
  "",
  "/btis",
  "/expertises",
  "/investir",
  "/devenir-investisseur",
  "/partenaires",
  "/devenir-partenaire",
  "/operations",
  "/insights",
  "/contact",
  "/rendez-vous",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const path of paths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((item) => [item, `${base}/${item}${path}`]),
          ),
        },
      });
    }

    for (const article of getInsights(locale)) {
      entries.push({
        url: `${base}/${locale}/insights/${article.slug}`,
        lastModified: article.date,
      });
    }

    for (const project of getOperations(locale)) {
      entries.push({
        url: `${base}/${locale}/operations/${project.slug}`,
      });
    }
  }

  return entries;
}
