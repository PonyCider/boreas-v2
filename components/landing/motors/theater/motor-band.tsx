"use client";

import {
  useRef,
  type Dispatch,
  type KeyboardEvent,
} from "react";
import { useReducedMotion } from "motion/react";
import type { TheaterMotorItem } from "@/content/motor-theater";
import {
  nextMotorFocusIndex,
  type MotorFocusCommand,
  type MotorSelectionEvent,
  type MotorSelectionState,
} from "@/lib/motors/runtime/selection";

type MotorBandProps = {
  items: readonly TheaterMotorItem[];
  selection: MotorSelectionState;
  dispatch: Dispatch<MotorSelectionEvent>;
};

const keyCommands: Partial<Record<string, MotorFocusCommand>> = {
  ArrowLeft: "previous",
  ArrowRight: "next",
  Home: "first",
  End: "last",
};

export function motorTabId(id: TheaterMotorItem["id"]) {
  return `motor-tab-${id}`;
}

export function motorPanelId(id: TheaterMotorItem["id"]) {
  return `motor-panel-${id}`;
}

export function MotorBand({
  items,
  selection,
  dispatch,
}: MotorBandProps) {
  const reduceMotion = !!useReducedMotion();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate(index);
      return;
    }

    const command = keyCommands[event.key];
    if (!command) return;

    event.preventDefault();
    const nextIndex = nextMotorFocusIndex(
      selection.focusIndex,
      command,
      items.length,
    );
    dispatch({ type: "FOCUS", index: nextIndex });
    tabRefs.current[nextIndex]?.focus();
  }

  function activate(index: number) {
    dispatch({ type: "ACTIVATE", index });
    tabRefs.current[index]?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  return (
    <nav aria-label="Explorar motores de conversión">
      <div className="-mx-4 overflow-x-auto px-4 pb-3 [scrollbar-width:thin] sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0">
        <div
          role="tablist"
          aria-label="Motores por especialidad"
          aria-orientation="horizontal"
          className="flex min-w-max snap-x snap-mandatory gap-px border-y border-white/12 bg-white/10 lg:min-w-0"
        >
          {items.map((item, index) => {
            const selected = selection.selectedIndex === index;
            const previewed = selection.previewIndex === index;

            return (
              <button
                key={item.id}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                id={motorTabId(item.id)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={motorPanelId(item.id)}
                aria-label={`${item.position}. ${item.specialty}. ${item.motor}. Resultado: ${item.result}.`}
                tabIndex={selection.focusIndex === index ? 0 : -1}
                onClick={() => activate(index)}
                onFocus={() => dispatch({ type: "FOCUS", index })}
                onKeyDown={(event) => handleKeyDown(event, index)}
                onPointerEnter={() =>
                  dispatch({ type: "PREVIEW", index })
                }
                onPointerLeave={() =>
                  dispatch({ type: "PREVIEW", index: null })
                }
                className={`group relative flex min-h-44 w-[82vw] max-w-[20rem] shrink-0 snap-center flex-col justify-between overflow-hidden px-5 py-5 text-left outline-none transition-[flex-grow,background-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent motion-reduce:transition-none sm:w-[18rem] lg:w-auto lg:min-w-0 lg:max-w-none lg:basis-0 ${
                  selected
                    ? "bg-[#352922] text-foreground"
                    : previewed
                      ? "bg-white/[0.07] text-foreground"
                      : "bg-background text-muted hover:bg-white/[0.05] hover:text-foreground"
                }`}
                style={{ flexGrow: selected ? 2.2 : previewed ? 1.25 : 1 }}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-px origin-left bg-accent transition-transform duration-500 motion-reduce:transition-none ${
                    selected ? "scale-x-100" : "scale-x-0"
                  }`}
                />

                <span className="flex items-start justify-between gap-4">
                  <span className="text-xs font-medium tracking-[0.22em] text-accent">
                    {item.position}
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-[0.16em] text-muted">
                    {selected ? "En escena" : "Explorar"}
                  </span>
                </span>

                <span className="mt-8 grid grid-rows-[2.25rem_3.5rem_auto]">
                  <span className="block self-start text-xs uppercase leading-[1.35] tracking-[0.16em] text-muted">
                    {item.specialty}
                  </span>
                  <span className="block self-start font-display text-xl leading-tight text-foreground lg:text-[clamp(1rem,1.45vw,1.35rem)]">
                    {item.motor}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`block self-start overflow-hidden text-sm leading-snug text-clinical transition-[max-height,opacity,transform] duration-300 motion-reduce:transition-none group-hover:max-h-12 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:max-h-12 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 ${
                      selected || previewed
                        ? "max-h-12 translate-y-0 opacity-100"
                        : "max-h-0 translate-y-2 opacity-0"
                    }`}
                  >
                    {item.result}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
