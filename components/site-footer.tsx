import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";
import { ArrowRight, MailIcon, PhoneIcon } from "./icons";
import { LocaleSwitcher } from "./locale-switcher";

const links = [
  { href: "/", key: "home" },
  { href: "/btis", key: "btis" },
  { href: "/expertises", key: "expertise" },
  { href: "/investir", key: "invest" },
  { href: "/partenaires", key: "partners" },
  { href: "/operations", key: "operations" },
  { href: "/insights", key: "insights" },
] as const;

export async function SiteFooter() {
  const t = await getTranslations("nav");
  const meta = await getTranslations("meta");
  const footer = await getTranslations("footer");
  const ui = await getTranslations("ui");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/brand/logo-light.png" alt={meta("siteName")} width={1219} height={501} className="h-14 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-7 text-paper/70">{meta("legalName")}</p>
          <p className="mt-3 text-xs tracking-[0.2em] text-gold uppercase">{footer("location")}</p>
        </div>

        <nav aria-label={t("primary")}>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{footer("navigation")}</p>
          <ul className="mt-5 space-y-2 text-sm">
            {links.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/80 transition-colors hover:text-gold-light">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{footer("contact")}</p>
          <p className="mt-5 text-sm leading-6 text-paper/65">{footer("contactText")}</p>
          <ul className="mt-5 space-y-4 text-sm">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="group flex items-start gap-3 text-paper/85 hover:text-gold-light">
                <MailIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  <span className="block text-[0.65rem] tracking-[0.16em] text-white/40 uppercase">{ui("email")}</span>
                  {CONTACT.email}
                </span>
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="group flex items-start gap-3 text-paper/85 hover:text-gold-light">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span>
                  <span className="block text-[0.65rem] tracking-[0.16em] text-white/40 uppercase">{ui("phone")}</span>
                  {CONTACT.phone}
                </span>
              </a>
            </li>
          </ul>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm text-gold-light hover:text-gold">
            {footer("contactCta")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-gold uppercase">{footer("meeting")}</p>
          <p className="mt-5 text-sm leading-6 text-paper/65">{footer("meetingText")}</p>
          <Link
            href="/rendez-vous"
            className="mt-6 inline-flex items-center gap-2 border border-gold/60 px-5 py-3 text-[0.68rem] font-semibold tracking-[0.16em] text-gold-light uppercase transition-colors duration-500 hover:bg-gold hover:text-navy-deep"
          >
            {footer("meetingCta")}
          </Link>
          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-gold uppercase">{footer("language")}</p>
            <LocaleSwitcher tone="dark" />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-paper/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {meta("siteName")}. {footer("rights")}
          </p>
          <p className="tracking-[0.16em] text-gold/80 uppercase">{footer("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
