import Image from "next/image";
import { IMAGES } from "@/lib/media";
import { ButtonLink } from "./buttons";

export function CtaBand({
  title,
  text,
  cta,
  href,
  eyebrow,
}: {
  title: string;
  text?: string;
  cta: string;
  href: string;
  eyebrow?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-deep text-paper">
      <Image src={IMAGES.office} alt="" fill sizes="100vw" className="object-cover opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/82 via-navy-deep/62 to-navy-deep/45" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="eyebrow text-gold-light">{eyebrow}</p> : <div className="mb-6 h-px w-12 bg-gold" />}
          <h2 className="mt-6 font-display text-4xl leading-tight text-white md:text-6xl">{title}</h2>
          {text ? <p className="mt-5 text-lg leading-8 text-paper/80">{text}</p> : null}
        </div>
        <ButtonLink href={href} variant="gold">
          {cta}
        </ButtonLink>
      </div>
    </section>
  );
}
