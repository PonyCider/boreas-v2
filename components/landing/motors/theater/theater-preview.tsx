"use client";

import { useReducer, useRef } from "react";
import { useInView } from "motion/react";
import {
  conversionTheaterCopy,
  theaterMotorItems,
} from "@/content/motor-theater";
import {
  createMotorSelectionState,
  transitionMotorSelection,
  type MotorSelectionEvent,
  type MotorSelectionState,
} from "@/lib/motors/runtime/selection";
import { MotorBand } from "./motor-band";
import { MotorStage, MotorStagePlaceholder } from "./motor-stage";

type TheaterPreviewProps = {
  mode?: "preview" | "production";
};

export function TheaterPreview({ mode = "preview" }: TheaterPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(previewRef, {
    once: true,
    margin: "600px 0px",
  });
  const [selection, dispatch] = useReducer(
    (state: MotorSelectionState, event: MotorSelectionEvent) =>
      transitionMotorSelection(state, event, theaterMotorItems.length),
    createMotorSelectionState(
      theaterMotorItems.length,
      theaterMotorItems.length - 1,
    ),
  );
  const activeItem = theaterMotorItems[selection.selectedIndex];

  return (
    <div ref={previewRef} className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#171713] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <header className="px-5 pb-8 pt-7 sm:px-8 sm:pt-9 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">
              {conversionTheaterCopy.controlEyebrow}
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] leading-[0.98] tracking-[-0.025em] text-foreground">
              {conversionTheaterCopy.controlTitle}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            {mode === "preview"
              ? conversionTheaterCopy.controlPreviewDescription
              : conversionTheaterCopy.controlDescription}
          </p>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-10">
        <MotorBand
          items={theaterMotorItems}
          selection={selection}
          dispatch={dispatch}
        />
        {nearViewport ? (
          <MotorStage item={activeItem} mode={mode} />
        ) : (
          <MotorStagePlaceholder item={activeItem} />
        )}
      </div>

      <footer className="mt-8 border-t border-white/10 px-5 py-5 text-xs leading-relaxed text-muted sm:px-8 lg:px-10">
        {mode === "preview"
          ? "Ruta interna de comparación. Dental usa la experiencia portable; los otros cinco motores conservan su flujo actual."
          : "Esta demostración no guarda ni envía respuestas. La agenda usa Cal.com y solo una confirmación dentro de su calendario crea una reserva real."}
      </footer>
    </div>
  );
}
