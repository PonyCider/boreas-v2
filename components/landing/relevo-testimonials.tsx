"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";
import { relevoTestimonials } from "@/content/relevo";
import { cn } from "@/lib/utils";

export function RelevoTestimonials() {
  const reduceMotion = Boolean(useReducedMotion());
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const activeTestimonial = relevoTestimonials[activeIndex];

  useEffect(() => {
    if (reduceMotion || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % relevoTestimonials.length);
    }, 6200);

    return () => window.clearInterval(interval);
  }, [isPaused, reduceMotion]);

  return (
    <aside
      className="min-w-0 border-t border-line/80 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
      aria-label="Testimonios provisionales de Relevo"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.08em] text-clinical">
          <Quote className="h-3.5 w-3.5 text-accent" strokeWidth={1.8} aria-hidden="true" />
          <span>TESTIMONIALS</span>
          <span className="font-normal tracking-normal text-muted">· provisional</span>
        </div>
        <span className="text-[11px] tabular-nums text-muted" aria-hidden="true">
          {String(activeIndex + 1).padStart(2, "0")} / {String(relevoTestimonials.length).padStart(2, "0")}
        </span>
      </div>

      <div className="relative mt-3 min-h-28 overflow-hidden sm:min-h-[5.75rem]" aria-live="polite">
        <AnimatePresence initial={false}>
          <motion.figure
            key={activeTestimonial.author}
            className="absolute inset-0 flex flex-col justify-between"
            initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8, filter: "blur(5px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.16, 1, 0.3, 1] }}
          >
            <blockquote className="max-w-[42rem] font-display text-[clamp(1.05rem,1.8vw,1.35rem)] leading-snug tracking-[-0.015em] text-foreground">
              “{activeTestimonial.quote}”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface text-[9px] font-semibold text-foreground">
                {activeTestimonial.initials}
              </span>
              <span className="min-w-0 text-[11px] leading-tight">
                <span className="block font-semibold text-foreground">{activeTestimonial.author}</span>
                <span className="mt-0.5 block text-muted">{activeTestimonial.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="-ml-3 mt-1 flex" aria-label="Seleccionar testimonio">
        {relevoTestimonials.map((testimonial, index) => (
          <button
            key={testimonial.author}
            type="button"
            className="group flex h-8 w-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Mostrar testimonio ${index + 1}`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => setActiveIndex(index)}
          >
            <span
              className={cn(
                "h-1.5 rounded-full transition-[width,background-color] duration-300",
                index === activeIndex ? "w-6 bg-accent" : "w-1.5 bg-line group-hover:bg-muted"
              )}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
    </aside>
  );
}
