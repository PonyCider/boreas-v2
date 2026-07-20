"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { SectionFrame } from "./landing-sections";
import SplitText from "./split-text";
import { TextEffect } from "./text-effect";
import { GsapCounter } from "./gsap-counter";
import { ProblemCompareSlider } from "./problem-compare-slider";
import { sectionIds } from "@/content/site";
import {
  problemHeading,
  problemStats,
  problemStatsSource,
  painPoints,
} from "@/content/problem";

export function ProblemSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const inView = useInView(textRef, { once: true, margin: "-100px" });

  return (
    <SectionFrame id={sectionIds.problema} className="border-t border-line">
      <ProblemCompareSlider />

      <div ref={textRef} className="mx-auto max-w-[1460px] px-4 pt-16 sm:px-6 lg:px-10">
        <TextEffect
          as="p"
          per="word"
          preset="fade"
          trigger={inView}
          className="text-sm font-medium text-accent"
        >
          {problemHeading.eyebrow}
        </TextEffect>

        <SplitText
          text={problemHeading.heading}
          tag="h2"
          splitType="words"
          textAlign="left"
          className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {problemStats.map((stat, i) => {
            const suffix = stat.value.replace(/[\d.]/g, "");
            return (
              <div key={stat.value} className="border-t-2 border-accent pt-5">
                <span className="block font-display text-[clamp(2.6rem,5vw,4rem)] font-medium leading-none text-foreground">
                  {inView ? (
                    <GsapCounter
                      to={parseFloat(stat.value)}
                      suffix={suffix}
                      delay={i * 0.15}
                    />
                  ) : (
                    `0${suffix}`
                  )}
                </span>
                <TextEffect
                  as="p"
                  per="word"
                  preset="fade"
                  trigger={inView}
                  delay={0.3 + i * 0.15}
                  className="mt-4 text-base leading-relaxed text-muted"
                >
                  {stat.label}
                </TextEffect>
              </div>
            );
          })}
        </div>

        <TextEffect
          as="p"
          per="word"
          preset="fade"
          trigger={inView}
          delay={0.6}
          className="mt-6 text-xs text-clinical"
        >
          {problemStatsSource}
        </TextEffect>

        <div className="mt-16 border-t border-line pt-14">
          {painPoints.map((point, i) => {
            const [before, after] = point.text.split(point.emphasis);
            const base = 0.8 + i * 0.18;
            return (
              <p
                key={point.emphasis}
                className="border-b border-line py-5 text-[15px] leading-relaxed text-muted last:border-b-0"
              >
                <TextEffect as="span" per="word" preset="fade" trigger={inView} delay={base}>
                  {before}
                </TextEffect>
                <TextEffect
                  as="span"
                  per="word"
                  preset="fade"
                  trigger={inView}
                  delay={base + 0.1}
                  className="font-medium text-foreground"
                >
                  {point.emphasis}
                </TextEffect>
                <TextEffect as="span" per="word" preset="fade" trigger={inView} delay={base + 0.2}>
                  {after}
                </TextEffect>
              </p>
            );
          })}
        </div>
      </div>
    </SectionFrame>
  );
}
