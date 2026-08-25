"use client";

import { sectionIds } from "@/content/site";
import { ConversionTheater } from "./motors/theater/conversion-theater";
import { SectionFrame } from "./section-frame";

export function MotorsSectionTheater() {
  return (
    <SectionFrame
      id={sectionIds.motores}
      theme="dark"
      className="border-t border-line bg-background"
    >
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <ConversionTheater mode="production" />
      </div>
    </SectionFrame>
  );
}
