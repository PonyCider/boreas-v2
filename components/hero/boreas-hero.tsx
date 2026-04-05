"use client";

import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";

import { Header } from "@/components/hero/header";
import { MacbookShowcase } from "@/components/hero/macbook-showcase";
import { RotatingHeadline } from "@/components/hero/rotating-headline";

const rotatingWords = [
  "citas",
  "reservas",
  "clientas",
  "ingresos",
  "control",
  "tiempo",
];

const contourPaths = [
  "M-80 220C90 130 250 140 420 220C610 312 760 304 980 220C1150 154 1300 154 1505 256C1630 320 1740 320 1840 268",
  "M-120 332C72 260 258 258 432 322C622 392 790 400 968 336C1120 282 1268 270 1448 330C1600 380 1752 376 1880 316",
  "M-90 458C60 366 248 358 438 430C632 504 816 512 1002 448C1172 392 1310 388 1486 436C1638 478 1768 474 1880 424",
  "M-130 592C56 504 248 498 434 568C620 638 796 644 982 590C1148 540 1290 536 1488 584C1652 624 1766 618 1870 560",
  "M-110 728C62 636 256 636 436 706C634 780 828 780 1014 720C1188 664 1332 664 1508 708C1664 746 1780 740 1880 688",
  "M-96 872C82 786 256 780 444 852C630 924 810 934 1000 874C1168 822 1310 816 1498 866C1644 904 1778 900 1892 846",
  "M-140 1012C38 926 234 920 438 990C642 1058 830 1064 1030 1006C1200 956 1354 954 1542 996C1690 1028 1798 1020 1912 970",
  "M-60 1128C150 1058 326 1064 508 1130C698 1200 892 1206 1072 1144C1236 1090 1398 1082 1594 1128C1726 1160 1840 1164 1944 1126",
];

function AmbientLights() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-1/2 top-[-16rem] h-[32rem] w-[74rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(212,192,161,0.12),transparent_62%)] blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.32, 0.48, 0.32], scale: [1, 1.03, 1] }
        }
        transition={{
          duration: 11,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <motion.div
        className="absolute right-[-8rem] top-[14%] h-[34rem] w-[18rem] rotate-[24deg] bg-[linear-gradient(180deg,rgba(206,194,170,0.14),transparent_72%)] blur-[95px]"
        animate={
          reduceMotion ? undefined : { x: [0, -24, 0], y: [-10, 18, -10] }
        }
        transition={{
          duration: 14,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      <motion.div
        className="absolute left-[-6rem] top-[28%] h-[28rem] w-[18rem] -rotate-[18deg] bg-[linear-gradient(180deg,rgba(170,182,194,0.1),transparent_76%)] blur-[92px]"
        animate={
          reduceMotion ? undefined : { x: [0, 20, 0], y: [16, -16, 16] }
        }
        transition={{
          duration: 16,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />
    </div>
  );
}

function TopographicBackdrop() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 1800 1200"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
      style={{
        maskImage:
          "radial-gradient(circle at center, black 28%, black 60%, transparent 96%)",
      }}
      animate={
        reduceMotion
          ? undefined
          : { x: [0, -14, 0], y: [0, 10, 0], scale: [1, 1.015, 1] }
      }
      transition={{
        duration: 22,
        ease: "easeInOut",
        repeat: Number.POSITIVE_INFINITY,
      }}
    >
      <g fill="none" stroke="rgba(244, 237, 228, 0.075)" strokeWidth="1.1">
        {contourPaths.map((path) => (
          <path key={path} d={path} />
        ))}
      </g>
      <g
        fill="none"
        stroke="rgba(212, 192, 161, 0.045)"
        strokeWidth="0.8"
        transform="translate(0 38)"
      >
        {contourPaths.map((path) => (
          <path key={`${path}-shadow`} d={path} />
        ))}
      </g>
    </motion.svg>
  );
}

export function BoreasHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], [0, -54]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0.62]);
  const artifactY = useTransform(scrollYProgress, [0, 1], [0, -88]);
  const artifactOpacity = useTransform(
    scrollYProgress,
    [0, 0.78, 1],
    [1, 0.92, 0.34],
  );
  const artifactScale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const artifactBlur = useTransform(scrollYProgress, [0.7, 1], [0, 7]);
  const artifactFilter = useMotionTemplate`blur(${artifactBlur}px)`;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[180svh] overflow-clip bg-[#0e1114] text-[#f5f1ea]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_42%),linear-gradient(180deg,#0e1114_0%,#0f1318_46%,#0d1013_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_16%,transparent_84%,rgba(255,255,255,0.03)_100%)]" />
      <AmbientLights />
      <TopographicBackdrop />

      <div className="sticky top-0 flex min-h-[100svh] flex-col">
        <Header />

        <div className="relative flex flex-1 items-center">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pb-14">
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: copyY, opacity: copyOpacity }}
              className="relative z-10 flex max-w-[860px] flex-col items-center text-center"
            >
              <p className="text-[0.72rem] uppercase tracking-[0.42em] text-white/34">
                Boreas · IA para salones, spas y beauty studios
              </p>

              <h1 className="mt-6 flex max-w-[12ch] flex-col items-center text-center text-[clamp(4.1rem,11vw,8.3rem)] font-medium leading-[0.98] tracking-[-0.075em] text-[#f7f1ea]">
                <span className="block text-[#c5ccd2]">Más</span>
                <span className="mt-1 block min-h-[1.22em]">
                  <RotatingHeadline words={rotatingWords} />
                </span>
              </h1>

              <p className="mt-8 max-w-[42rem] text-base leading-8 text-white/58 sm:text-lg">
                Automatización inteligente para negocios que quieren llenar su
                agenda sin perseguir mensajes.
              </p>

              <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                <a
                  href="mailto:hola@boreas.ai"
                  className="inline-flex min-w-[13rem] items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(216,204,178,0.18)_0%,rgba(216,204,178,0.11)_100%)] px-6 py-3.5 text-sm font-medium text-[#fbfcfd] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.08),0_14px_34px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-500 hover:scale-[1.015] hover:border-white/22 hover:bg-[linear-gradient(180deg,rgba(216,204,178,0.24)_0%,rgba(216,204,178,0.16)_100%)] hover:brightness-105"
                >
                  Agendar llamada
                </a>

                <Link
                  href="#demo"
                  className="inline-flex min-w-[13rem] items-center justify-center rounded-full border border-white/12 bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-[#f5f1ea] transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                >
                  Ver cómo funciona
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.85,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                y: artifactY,
                opacity: artifactOpacity,
                scale: artifactScale,
                filter: artifactFilter,
              }}
              className="relative z-10 mt-14 w-full lg:mt-16"
            >
              <MacbookShowcase />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-52 bg-gradient-to-b from-transparent via-[#0e1114]/78 to-[#0e1114]" />
    </section>
  );
}
