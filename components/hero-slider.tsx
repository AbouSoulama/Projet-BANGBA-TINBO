"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, ArrowRight } from "./icons";

export type Slide = {
  image: string;
  eyebrow: string;
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

const DURATION = 7500;
const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSlider({
  slides,
  labels,
}: {
  slides: Slide[];
  labels: { previous: string; next: string; slide: string; scroll: string; carousel: string };
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer);
  }, [index, paused, go]);

  const words = slide.title.split(" ");

  return (
    <section
      className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-navy-deep text-white"
      aria-roledescription="carousel"
      aria-label={labels.carousel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut" }}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            className="animate-kenburns object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/45 via-navy-deep/12 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/60 via-transparent to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-40 pb-36 md:pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
              exit: { opacity: 0, y: -16, transition: { duration: 0.45, ease } },
            }}
            className="max-w-4xl"
            aria-live="polite"
          >
            <motion.p
              className="eyebrow text-gold-light"
              variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0, transition: { duration: 0.8, ease } } }}
            >
              {slide.eyebrow}
            </motion.p>
            <h1 className="mt-7 font-display text-[2.6rem] leading-[1.02] font-medium tracking-[-0.01em] sm:text-6xl lg:text-7xl xl:text-[5.4rem]" aria-label={slide.title}>
              {words.map((word, i) => (
                <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                  <motion.span
                    className="inline-block"
                    variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 1, ease } } }}
                  >
                    {word}
                    {i < words.length - 1 ? "\u00a0" : ""}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="mt-8 max-w-2xl text-lg leading-8 text-white/80 md:text-xl md:leading-9"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
            >
              {slide.text}
            </motion.p>
            <motion.div
              className="mt-11 flex flex-col gap-4 sm:flex-row"
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
            >
              <Link
                href={slide.primary.href}
                className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 text-sm font-semibold tracking-[0.12em] text-navy-deep uppercase transition-colors duration-500 hover:bg-gold-light"
              >
                {slide.primary.label}
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
              {slide.secondary ? (
                <Link
                  href={slide.secondary.href}
                  className="inline-flex items-center justify-center gap-3 border border-white/30 px-7 py-4 text-sm font-semibold tracking-[0.12em] text-white uppercase backdrop-blur-sm transition-colors duration-500 hover:border-gold-light hover:text-gold-light"
                >
                  {slide.secondary.label}
                </Link>
              ) : null}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 pb-8">
          <div className="flex flex-1 items-center gap-3 sm:max-w-md">
            {slides.map((item, i) => (
              <button
                key={item.image}
                type="button"
                onClick={() => go(i)}
                className="group relative h-8 flex-1"
                aria-label={`${labels.slide} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-white/25 transition-colors group-hover:bg-white/50" />
                {i === index ? (
                  <span
                    key={`${index}-${paused}`}
                    className="animate-progress absolute inset-x-0 top-1/2 h-px bg-gold-light"
                    style={{ animationDuration: `${DURATION}ms`, animationPlayState: paused ? "paused" : "running" }}
                  />
                ) : i < index ? (
                  <span className="absolute inset-x-0 top-1/2 h-px bg-white/60" />
                ) : null}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-5">
            <p className="hidden font-display text-lg text-white/70 tabular-nums sm:block">
              <span className="text-gold-light">{String(index + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-white/30">/</span>
              {String(slides.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="flex h-12 w-12 items-center justify-center border border-white/25 text-white transition-colors duration-500 hover:border-gold-light hover:text-gold-light"
              aria-label={labels.previous}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="flex h-12 w-12 items-center justify-center border border-white/25 text-white transition-colors duration-500 hover:border-gold-light hover:text-gold-light"
              aria-label={labels.next}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-6 bottom-28 z-10 hidden flex-col items-center gap-4 lg:flex xl:right-10">
        <span className="text-[0.62rem] tracking-[0.3em] text-white/60 uppercase [writing-mode:vertical-rl]">{labels.scroll}</span>
        <span className="relative h-16 w-px overflow-hidden bg-white/20">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 h-1/2 bg-gold-light" />
        </span>
      </div>
    </section>
  );
}
