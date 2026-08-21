"use client";

import { useRef, useState, type PointerEvent } from "react";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import { motion, useInView, useReducedMotion } from "motion/react";

import {
  socialProofCases,
  socialProofHeading,
  socialProofHeadingLines,
} from "@/content/social-proof";
import { Marquee } from "@/components/ui/marquee";
import { SocialProofCard } from "./social-proof-card";

const headingId = "social-proof-heading";
const primaryCases = socialProofCases.filter(({ lane }) => lane === "primary");
const secondaryCases = socialProofCases.filter(({ lane }) => lane === "secondary");
const entranceEase = [0.22, 1, 0.36, 1] as const;

export function SocialProofMarquee() {
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(false);
  const entranceRef = useRef<HTMLDivElement>(null);
  const suppressFocusPauseRef = useRef(false);
  const inView = useInView(entranceRef, { once: true, margin: "-80px" });
  const reducedMotion = !!useReducedMotion();
  const reveal = inView || reducedMotion;
  const paused = manuallyPaused || hoverPaused || (!entranceComplete && !reducedMotion);
  const entryTransition = (duration: number, delay: number) => ({
    duration: reducedMotion ? 0 : duration,
    delay: reducedMotion ? 0 : delay,
    ease: entranceEase,
  });

  function handleTrackPointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") setHoverPaused(true);
  }

  function handleTrackPointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") setHoverPaused(false);
  }

  function handleTrackPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") setManuallyPaused(true);
  }

  return (
    <div ref={entranceRef} role="region" aria-labelledby={headingId}>
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="max-w-4xl pr-16 sm:pr-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={entryTransition(0.45, 0.08)}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-accent"
          >
            {socialProofHeading.eyebrow}
          </motion.p>

          <h2
            id={headingId}
            aria-label={socialProofHeading.heading}
            className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,5vw,5rem)] font-normal leading-[1.02] tracking-[-0.016em] text-foreground"
          >
            <span aria-hidden="true">
              {socialProofHeadingLines.map((line, index) => (
                <span key={line} className="block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="block"
                    initial={{ opacity: 0, y: "108%" }}
                    animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: "108%" }}
                    transition={entryTransition(0.72, 0.16 + index * 0.1)}
                  >
                    {line}
                    {index === 0 ? " " : null}
                  </motion.span>
                </span>
              ))}
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={entryTransition(0.55, 0.4)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {socialProofHeading.body}
          </motion.p>
        </div>

        <motion.button
          type="button"
          aria-label={manuallyPaused ? "Reanudar casos" : "Pausar casos"}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={reveal ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.94 }}
          transition={entryTransition(0.45, 0.44)}
          className="absolute right-4 top-0 flex size-11 items-center justify-center rounded-[var(--radius-md)] border border-line bg-elevated text-foreground transition-colors hover:border-accent/45 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hidden sm:right-6 lg:right-10"
          onPointerDown={() => {
            suppressFocusPauseRef.current = true;
          }}
          onFocus={() => {
            if (!suppressFocusPauseRef.current) setManuallyPaused(true);
          }}
          onBlur={() => {
            suppressFocusPauseRef.current = false;
          }}
          onClick={() => {
            suppressFocusPauseRef.current = false;
            setManuallyPaused((current) => !current);
          }}
        >
          {manuallyPaused ? (
            <IconPlayerPlay aria-hidden="true" className="size-4" stroke={1.8} />
          ) : (
            <IconPlayerPause aria-hidden="true" className="size-4" stroke={1.8} />
          )}
        </motion.button>
      </div>

      <div
        className="mt-12 space-y-5 sm:mt-14 sm:space-y-6"
        onPointerEnter={handleTrackPointerEnter}
        onPointerLeave={handleTrackPointerLeave}
        onPointerDown={handleTrackPointerDown}
      >
        <motion.div
          initial={{ opacity: 0, x: 56 }}
          animate={reveal ? { opacity: 1, x: 0 } : { opacity: 0, x: 56 }}
          transition={entryTransition(0.72, 0.52)}
          data-entry-lane="primary"
          className="will-change-[transform,opacity]"
        >
          <Marquee
            paused={paused}
            repeat={4}
            className="p-0 [--duration:60s] [--gap:1.25rem] motion-reduce:overflow-x-auto motion-reduce:pb-3 sm:[--gap:1.5rem]"
          >
            {primaryCases.map((item) => (
              <SocialProofCard key={item.id} item={item} />
            ))}
          </Marquee>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -56 }}
          animate={reveal ? { opacity: 1, x: 0 } : { opacity: 0, x: -56 }}
          transition={entryTransition(0.72, 0.64)}
          onAnimationComplete={() => {
            if (reveal) setEntranceComplete(true);
          }}
          data-entry-lane="secondary"
          className="will-change-[transform,opacity]"
        >
          <Marquee
            paused={paused}
            repeat={4}
            reverse
            className="p-0 [--duration:70s] [--gap:1.25rem] motion-reduce:overflow-x-auto motion-reduce:pb-3 sm:[--gap:1.5rem]"
          >
            {secondaryCases.map((item) => (
              <SocialProofCard key={item.id} item={item} />
            ))}
          </Marquee>
        </motion.div>
      </div>

      <div className="mx-auto mt-8 max-w-[1460px] px-4 sm:mt-10 sm:px-6 lg:px-10">
        <motion.p
          initial={{ opacity: 0 }}
          animate={reveal ? { opacity: 1 } : { opacity: 0 }}
          transition={entryTransition(0.5, 0.72)}
          className="max-w-3xl text-xs leading-relaxed text-clinical"
        >
          {socialProofHeading.disclosure}
        </motion.p>
      </div>
    </div>
  );
}
