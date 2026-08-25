"use client";

import dynamic from "next/dynamic";
import { sectionIds } from "@/content/site";
import type { MotorsSectionVariant } from "@/lib/motors/section-variant";
import { SectionFrame } from "./section-frame";

function MotorsSectionLoading() {
  return (
    <SectionFrame
      id={sectionIds.motores}
      theme="dark"
      className="border-t border-line bg-background"
    >
      <div className="mx-auto min-h-[34rem] max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm text-muted" role="status">
          Preparando los motores de conversión…
        </p>
      </div>
    </SectionFrame>
  );
}

const MotorsSectionLegacy = dynamic(
  () =>
    import("./motors-section-legacy").then(
      (module) => module.MotorsSectionLegacy,
    ),
  { loading: MotorsSectionLoading },
);

const MotorsSectionTheater = dynamic(
  () =>
    import("./motors-section-theater").then(
      (module) => module.MotorsSectionTheater,
    ),
  { loading: MotorsSectionLoading },
);

export function MotorsSectionSwitcher({
  variant,
}: {
  variant: MotorsSectionVariant;
}) {
  return variant === "theater" ? (
    <MotorsSectionTheater />
  ) : (
    <MotorsSectionLegacy />
  );
}
