"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Logo({ className = "h-11 w-auto sm:h-12" }: { className?: string }) {
  const t = useTranslations("meta");

  return (
    <Link href="/" className="flex shrink-0 items-center">
      <Image
        src="/brand/logo-light.png"
        alt={`${t("siteName")} — ${t("legalName")}`}
        width={1219}
        height={501}
        priority
        className={className}
      />
    </Link>
  );
}
