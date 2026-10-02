"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { CONTACT } from "@/lib/site";
import { ArrowRight, MailIcon, PhoneIcon } from "./icons";
import { LocaleSwitcher } from "./locale-switcher";
import { Logo } from "./logo";

type NavLink = { href: string; label: string };
type NavGroup = { id: string; href: string; label: string; children: NavLink[] };

type Props = {
  insights: NavLink[];
  operations: NavLink[];
};

const ease = [0.22, 1, 0.36, 1] as const;

export function SiteHeader({ insights, operations }: Props) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const groups = useNavGroups(insights, operations);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-700 ${
        open
          ? "py-2"
          : scrolled
            ? "bg-navy-deep/90 py-2 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
            : "bg-gradient-to-b from-navy-deep/70 to-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6">
        <Logo />

        <nav aria-label={t("primary")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {groups.map((group) => (
              <li key={group.id} className="group relative">
                <Link
                  href={group.href}
                  className={`relative block px-3 py-3 text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition-colors duration-300 xl:px-4 ${
                    isActive(group.href) ? "text-gold-light" : "text-white/85 hover:text-white"
                  }`}
                >
                  {group.label}
                  <span
                    className={`absolute inset-x-3 bottom-1.5 h-px origin-left bg-gold-light transition-transform duration-500 xl:inset-x-4 ${
                      isActive(group.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
                {group.children.length > 0 ? (
                  <div className="invisible absolute top-full left-1/2 z-20 w-72 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-500 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="border border-white/10 bg-navy-deep/95 p-2 shadow-2xl backdrop-blur-xl">
                      {group.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="group/item flex items-center justify-between gap-3 px-4 py-3 text-sm text-white/80 transition-colors duration-300 hover:bg-white/5 hover:text-gold-light"
                          >
                            <span>{child.label}</span>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 -translate-x-2 opacity-0 transition-all duration-300 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <LocaleSwitcher tone="dark" />
          <Link
            href="/contact#rendez-vous"
            className="group inline-flex items-center gap-2 border border-gold/60 px-5 py-3 text-[0.68rem] font-semibold tracking-[0.16em] text-gold-light uppercase transition-colors duration-500 hover:bg-gold hover:text-navy-deep"
          >
            {t("meeting")}
          </Link>
        </div>

        <button
          type="button"
          className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? t("close") : t("open")}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`absolute h-px w-6 bg-white transition-transform duration-500 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-px w-6 bg-white transition-transform duration-500 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="site-menu"
            className="fixed inset-0 top-0 -z-10 overflow-y-auto bg-navy-deep lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
          >
            <nav aria-label={t("primary")} className="mx-auto flex min-h-full max-w-7xl flex-col px-6 pt-28 pb-10">
              <motion.ul
                className="space-y-1"
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } } }}
              >
                {groups.map((group, index) => (
                  <motion.li
                    key={group.id}
                    className="border-b border-white/10"
                    variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}
                  >
                    <Link href={group.href} className="flex items-baseline gap-4 py-4">
                      <span className="text-xs text-gold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                      <span className="font-display text-3xl text-white">{group.label}</span>
                    </Link>
                    {group.children.length > 0 ? (
                      <ul className="flex flex-wrap gap-x-5 gap-y-2 pb-4 pl-9">
                        {group.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} className="text-sm text-white/60 hover:text-gold-light">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </motion.li>
                ))}
              </motion.ul>
              <div className="mt-auto space-y-4 pt-10">
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 text-white/80">
                  <MailIcon className="h-5 w-5 text-gold" />
                  {CONTACT.email}
                </a>
                <a href={CONTACT.phoneHref} className="flex items-center gap-3 text-white/80">
                  <PhoneIcon className="h-5 w-5 text-gold" />
                  {CONTACT.phone}
                </a>
                <div className="flex items-center justify-between pt-4">
                  <LocaleSwitcher tone="dark" />
                  <Link
                    href="/contact#rendez-vous"
                    className="bg-gold px-5 py-3 text-xs font-semibold tracking-[0.14em] text-navy-deep uppercase"
                  >
                    {t("meeting")}
                  </Link>
                </div>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function useNavGroups(insights: NavLink[], operations: NavLink[]): NavGroup[] {
  const t = useTranslations("nav");
  const expertises = useTranslations("expertises");
  const expertiseItems = expertises.raw("items") as { id: string; title: string }[];

  return [
    { id: "home", href: "/", label: t("home"), children: [] },
    {
      id: "btis",
      href: "/btis",
      label: t("btis"),
      children: [
        { href: "/btis#a-propos", label: t("about") },
        { href: "/btis#approche", label: t("approach") },
      ],
    },
    {
      id: "expertises",
      href: "/expertises",
      label: t("expertise"),
      children: expertiseItems.map((item) => ({ href: `/expertises#${item.id}`, label: item.title })),
    },
    {
      id: "invest",
      href: "/investir",
      label: t("investShort"),
      children: [
        { href: "/investir#education", label: t("investEducation") },
        { href: "/investir#opportunites", label: t("investOpportunities") },
        { href: "/investir#marche", label: t("investMarket") },
      ],
    },
    { id: "operations", href: "/operations", label: t("operationsShort"), children: operations },
    { id: "insights", href: "/insights", label: t("insights"), children: insights },
    {
      id: "contact",
      href: "/contact",
      label: t("contact"),
      children: [{ href: "/contact#rendez-vous", label: t("meeting") }],
    },
  ];
}
