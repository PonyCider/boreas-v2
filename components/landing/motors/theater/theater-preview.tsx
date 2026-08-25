"use client";

import { useReducer } from "react";
import {
  runtimeContractDemoDefinition,
  theaterMotorItems,
} from "@/content/motor-theater";
import {
  createMotorSelectionState,
  transitionMotorSelection,
  type MotorSelectionEvent,
  type MotorSelectionState,
} from "@/lib/motors/runtime/selection";
import { MotorBand } from "./motor-band";
import { MotorStage } from "./motor-stage";

export function TheaterPreview() {
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
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#171713] shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
      <header className="px-5 pb-8 pt-7 sm:px-8 sm:pt-9 lg:px-10">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-accent">
              Toma el control · Fase 4A
            </p>
            <h2 className="mt-3 max-w-3xl font-display text-[clamp(2rem,5vw,4rem)] leading-[0.98] tracking-[-0.025em] text-foreground">
              Ahora pruébalo.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Elige una especialidad y completa el recorrido. La escena narrativa
            termina aquí; la interacción es real.
          </p>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-10">
        <MotorBand
          items={theaterMotorItems}
          selection={selection}
          dispatch={dispatch}
        />
        <MotorStage item={activeItem} />
      </div>

      <footer className="mt-8 border-t border-white/10 px-5 py-5 text-xs leading-relaxed text-muted sm:px-8 lg:px-10">
        Preview interno. Dental usa el dominio y la experiencia V2; los otros
        cinco motores permanecen en V1. Ningún dato del demo se persiste o se
        envía. El contrato base sigue disponible como {runtimeContractDemoDefinition.motorId}.
      </footer>
    </div>
  );
}
