import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal, RevealWords } from "./motion";

export function PageHero({
  eyebrow,
  title,
  text,
  image,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  image: string;
  crumbs?: ReactNode;
}) {
  return (
    <section className="grain relative flex min-h-[68vh] items-end overflow-hidden bg-navy-deep text-white">
      <Image src={image} alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/92 via-navy-deep/70 to-navy-deep/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-navy-deep/40" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-36 pb-20 md:pt-44 md:pb-24">
        {crumbs ? <div className="mb-8 text-white/70">{crumbs}</div> : null}
        <Reveal>
          <p className="eyebrow text-gold-light">{eyebrow}</p>
        </Reveal>
        <RevealWords
          text={title}
          as="h1"
          delay={0.1}
          className="mt-6 max-w-4xl font-display text-4xl leading-[1.05] font-medium sm:text-6xl lg:text-7xl"
        />
        {text ? (
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 md:text-xl">{text}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
