"use client";

import type { PointerEvent } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

import { ChatUI } from "@/components/hero/chat-ui";

function MacbookFrame({
  children,
  reduceMotion,
}: {
  children: React.ReactNode;
  reduceMotion: boolean | null;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const smoothRotateX = useSpring(rotateX, {
    stiffness: 130,
    damping: 20,
    mass: 0.75,
  });
  const smoothRotateY = useSpring(rotateY, {
    stiffness: 130,
    damping: 20,
    mass: 0.75,
  });

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateY.set(horizontal * 9);
    rotateX.set(vertical * -7);
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <>
      <motion.div
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
        animate={reduceMotion ? undefined : { y: [0, -8, 0] }}
        transition={{
          duration: 6.8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
        whileHover={reduceMotion ? undefined : { scale: 1.01 }}
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#1b2026_0%,#0b0d10_100%)] p-3 shadow-[0_40px_120px_rgba(0,0,0,0.42)]"
      >
        <div className="absolute inset-x-[22%] top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute left-1/2 top-3 h-1.5 w-24 -translate-x-1/2 rounded-full bg-black/55" />

        <div className="overflow-hidden rounded-[1.55rem] border border-white/8 bg-[#0b0d10] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-2 border-b border-white/6 bg-[#161a1f] px-4 py-3">
            {["#FF5F57", "#FEBC2E", "#28C840"].map((color) => (
              <span
                key={color}
                className="h-2.5 w-2.5 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="aspect-[16/10]">{children}</div>
        </div>
      </motion.div>

      <div className="mx-auto h-4 w-[93%] rounded-b-[999px] bg-[linear-gradient(180deg,#454c55_0%,#1c2025_36%,#08090c_100%)] shadow-[0_12px_60px_rgba(0,0,0,0.3)]" />
      <div className="mx-auto h-8 w-[68%] rounded-full bg-[#d8c7ae]/12 blur-3xl" />
    </>
  );
}

function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,#1b2026_0%,#0b0d10_100%)] p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-[18%] top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#0b0d10] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        {children}
      </div>
      <div className="mx-auto mt-1 h-6 w-[50%] rounded-full bg-[#d8c7ae]/8 blur-2xl" />
    </div>
  );
}

export function MacbookShowcase({
  id,
  mode = "static",
}: {
  id?: string;
  mode?: "static" | "simulator";
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div id={id} className="relative mx-auto w-full max-w-[1080px] px-2 sm:px-4">
      {/* Desktop: Full MacBook frame */}
      <div className="hidden lg:block">
        <MacbookFrame reduceMotion={reduceMotion}>
          <ChatUI mode={mode} />
        </MacbookFrame>
      </div>

      {/* Mobile/Tablet: Standalone app frame */}
      <div className="block lg:hidden">
        <MobileFrame>
          <ChatUI mode={mode} />
        </MobileFrame>
      </div>
    </div>
  );
}
