import { getTranslations } from "next-intl/server";
import { ButtonLink } from "@/components/buttons";
import { PageHero } from "@/components/page-hero";
import { IMAGES } from "@/lib/media";

export default async function NotFound() {
  const t = await getTranslations("nav");

  return (
    <>
      <PageHero eyebrow="404" title={t("notFoundTitle")} text={t("notFoundText")} image={IMAGES.ouaga} />
      <div className="bg-paper px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <ButtonLink href="/">{t("home")}</ButtonLink>
        </div>
      </div>
    </>
  );
}
