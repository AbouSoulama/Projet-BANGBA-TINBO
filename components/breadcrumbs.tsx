import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Crumb = { href?: string; label: string };

export async function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: Crumb[];
  tone?: "light" | "dark";
}) {
  const t = await getTranslations("nav");
  const muted = tone === "dark" ? "text-white/55" : "text-muted";
  const current = tone === "dark" ? "text-white" : "text-ink";
  const hover = tone === "dark" ? "hover:text-gold-light" : "hover:text-navy";

  return (
    <nav aria-label={t("breadcrumb")} className={`text-sm ${muted}`}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link href={item.href} className={hover}>
                {item.label}
              </Link>
            ) : (
              <span className={current}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
