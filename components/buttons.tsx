import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "./icons";

const styles = {
  navy: "bg-navy text-white hover:bg-navy-deep",
  gold: "bg-gold text-navy-deep hover:bg-gold-light",
  ghost: "border border-navy/25 text-navy hover:border-navy hover:bg-navy hover:text-white",
  ghostLight: "border border-white/30 text-white hover:border-gold-light hover:text-gold-light",
} as const;

export function ButtonLink({
  href,
  children,
  variant = "navy",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof styles;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center justify-center gap-3 px-7 py-4 text-sm font-semibold tracking-[0.12em] uppercase transition-colors duration-500 ${styles[variant]}`}
    >
      {children}
      <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}
