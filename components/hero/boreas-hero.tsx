"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  heroCredibility,
  heroHeadline,
  heroProofPoints,
  heroSubcopy,
} from "@/content/boreas-home";

export function BoreasHero() {
  return (
    <section className="relative -mt-[76px] flex min-h-[90dvh] items-end bg-background pb-14 pt-32 text-foreground sm:min-h-[88dvh] sm:pb-18 lg:pb-20">
      <div className="absolute inset-y-0 right-0 hidden w-[54%] lg:block">
        <Image
          src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=85&w=2200&auto=format&fit=crop"
          alt="Médico especialista atendiendo en un consultorio privado"
          fill
          priority
          sizes="54vw"
          className="object-cover object-[62%_center]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg-deep)_0%,rgba(12,18,24,0.62)_36%,rgba(12,18,24,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,18,24,0.8)_0%,rgba(12,18,24,0)_35%,rgba(12,18,24,0.84)_100%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-[1460px] px-4 sm:px-6 lg:px-10"
      >
        <div className="max-w-3xl">
          <p className="mb-5 max-w-xl text-base font-semibold text-accent">
            {heroCredibility}
          </p>

          <h1 className="text-balance text-[clamp(3rem,9vw,6.5rem)] font-semibold leading-[0.98] text-foreground">
            {heroHeadline}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-clinical sm:text-xl">
            {heroSubcopy}
          </p>

          <div className="mt-9">
            <a
              href="#contacto"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-background shadow-[0_18px_42px_rgba(24,210,176,0.22)] transition-all duration-300 hover:brightness-110 active:translate-y-px sm:w-auto"
            >
              Quiero mi consultorio digital
            </a>
          </div>

          <ul className="mt-9 grid gap-3 text-sm text-clinical sm:grid-cols-2 lg:grid-cols-4">
            {heroProofPoints.map((point) => (
              <li key={point} className="border-t border-line pt-3">
                {point}
              </li>
            ))}
          </ul>

          <div className="relative mt-10 aspect-[4/3] rounded-lg border border-line lg:hidden">
            <Image
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=85&w=900&auto=format&fit=crop"
              alt="Médico especialista atendiendo en un consultorio privado"
              width={900}
              height={675}
              priority
              sizes="100vw"
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
