"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher({ tone = "light" }: { tone?: "light" | "dark" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const idle = tone === "dark" ? "text-paper/70 hover:text-paper" : "text-muted hover:text-navy";
  const active = tone === "dark" ? "text-gold" : "text-navy";

  return (
    <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em]">
      {routing.locales.map((item, index) => (
        <span key={item} className="flex items-center gap-2">
          {index > 0 ? <span className={tone === "dark" ? "text-paper/30" : "text-line"}>|</span> : null}
          <button
            type="button"
            onClick={() => router.replace(pathname, { locale: item })}
            className={item === locale ? active : idle}
            aria-current={item === locale ? "true" : undefined}
            lang={item}
          >
            {item.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
