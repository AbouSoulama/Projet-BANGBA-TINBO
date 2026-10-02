import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { INSIGHT_CATEGORIES, type InsightCategory } from "./site";

export type Insight = {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: InsightCategory;
  readingTime: string;
  summary: string;
  sources: string[];
  content: string;
};

export type Operation = {
  slug: string;
  title: string;
  sector: string;
  location: string;
  interventionType: string;
  context: string;
  intervention: string;
  result: string;
  image: string | null;
  locale: string;
  content: string;
};

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function publicAsset(url: string) {
  if (!url.startsWith("/")) return null;
  const file = path.join(process.cwd(), "public", decodeURIComponent(url));
  return fs.existsSync(file) ? url : null;
}

function readMdx(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

export function getInsights(locale: string): Insight[] {
  const dir = path.join(process.cwd(), "content", "insights", locale);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = readMdx(path.join(dir, file));
      const category = asString(data.category);
      const safeCategory = INSIGHT_CATEGORIES.includes(category as InsightCategory)
        ? (category as InsightCategory)
        : "Strategy";

      return {
        slug,
        title: asString(data.title),
        date: asString(data.date),
        author: asString(data.author, "BTIS"),
        category: safeCategory,
        readingTime: asString(data.readingTime),
        summary: asString(data.summary),
        sources: asStringArray(data.sources),
        content,
      } satisfies Insight;
    })
    .filter((item) => item.title.length > 0)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsight(locale: string, slug: string) {
  return getInsights(locale).find((item) => item.slug === slug) ?? null;
}

export function getOperations(locale: string): Operation[] {
  const dir = path.join(process.cwd(), "content", "operations");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = readMdx(path.join(dir, file));
      const image = asString(data.image);

      return {
        slug,
        title: asString(data.title),
        sector: asString(data.sector),
        location: asString(data.location),
        interventionType: asString(data.interventionType),
        context: asString(data.context),
        intervention: asString(data.intervention),
        result: asString(data.result),
        image: image ? publicAsset(image) : null,
        locale: asString(data.locale, "fr"),
        content,
      } satisfies Operation;
    })
    .filter((item) => item.title.length > 0 && item.locale === locale);
}

export function getOperation(locale: string, slug: string) {
  return getOperations(locale).find((item) => item.slug === slug) ?? null;
}
