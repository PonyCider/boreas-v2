"use client";

import { useId } from "react";
import { InfoTooltip } from "./info-tooltip";

export function PlanToggle({
  id,
  label,
  help,
  delta,
  checked,
  onChange,
  dark = false,
  tooltip,
}: {
  id?: string;
  label: string;
  help: string;
  delta: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  dark?: boolean;
  tooltip?: {
    summary: string;
    paragraphs: string[];
  };
}) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const helpId = `${inputId}-help`;

  return (
    <div
      className={`group relative flex items-start gap-3 rounded-[var(--radius-md)] border p-3 transition-[background-color,border-color,box-shadow] duration-200 ${
        dark
          ? "border-white/15 bg-black/15 shadow-xs hover:border-white/25 hover:bg-black/20"
          : checked
            ? "border-accent/40 bg-accent-soft/30 shadow-xs"
            : "border-line bg-surface/60 hover:border-accent/20 hover:bg-surface"
      }`}
    >
      {/* UIverse Switch Control by Galahhad */}
      <label htmlFor={inputId} className="uiverse-switch relative mt-0.5 inline-block shrink-0 cursor-pointer">
        <input
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-describedby={helpId}
          className="peer sr-only"
        />
        {/*
          El input real está oculto (sr-only), así que su anillo de foco nativo mide 1px y
          nadie lo ve. Este lo dibuja sobre el switch visible. Sobre la card en modo Express
          (#181411) el acento granate no contrastaría, por eso ahí va el tono claro.
        */}
        <div
          className={`relative flex h-[24px] w-[46px] cursor-pointer items-center rounded-full transition-all duration-200 ease-[cubic-bezier(0.27,0.2,0.25,1.51)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${
            dark
              ? "peer-focus-visible:outline-[#f29a7e]"
              : "peer-focus-visible:outline-[var(--accent)]"
          } ${
            checked
              ? "bg-[var(--accent)] border-transparent shadow-xs"
              : "bg-[var(--bg-void)] border border-line/70 dark:border-border"
          }`}
        >
          {/* Slider effect line */}
          <span
            className={`absolute h-[3.5px] w-[9px] rounded-[1px] bg-white transition-all duration-200 ease-in-out ${
              checked ? "left-[calc(100%-9px-4.5px-3px)]" : "left-[7.5px]"
            }`}
          />
          {/* Circle knob */}
          <div
            className={`absolute z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-white transition-all duration-200 ease-[cubic-bezier(0.27,0.2,0.25,1.51)] ${
              checked
                ? "left-[calc(100%-18px-3px)] shadow-[-1px_1px_2px_rgba(0,0,0,0.25)]"
                : "left-[3px] shadow-[1px_1px_2px_rgba(0,0,0,0.15)]"
            }`}
          >
            {/* Cross icon */}
            <svg
              className={`h-[6px] w-[6px] transition-all duration-200 ease-[cubic-bezier(0.27,0.2,0.25,1.51)] ${
                checked ? "scale-0 opacity-0" : "scale-100 opacity-60 text-clinical"
              }`}
              viewBox="0 0 365.696 365.696"
            >
              <path
                fill="currentColor"
                d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
              />
            </svg>
            {/* Checkmark icon */}
            <svg
              className={`absolute h-[10px] w-[10px] transition-all duration-200 ease-[cubic-bezier(0.27,0.2,0.25,1.51)] ${
                checked ? "scale-100 opacity-100 text-[var(--accent)]" : "scale-0 opacity-0"
              }`}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
              />
            </svg>
          </div>
        </div>
      </label>

      {/* Label, tooltip and help text */}
      <div className="flex-1 text-xs leading-tight select-none">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex min-w-0 items-center gap-1">
            <label
              htmlFor={inputId}
              className={`cursor-pointer font-semibold ${
                dark ? "text-[#fff7ed]" : "text-foreground"
              }`}
            >
              {label}
            </label>
            {tooltip && (
              <InfoTooltip
                summary={tooltip.summary}
                paragraphs={tooltip.paragraphs}
                dark={dark}
              />
            )}
          </div>
          <span className="shrink-0 font-bold text-accent">{delta}</span>
        </div>
        <label
          htmlFor={inputId}
          id={helpId}
          className={`mt-1 block cursor-pointer leading-relaxed ${
            dark ? "text-[#c7bbb2]" : "text-clinical"
          }`}
        >
          {help}
        </label>
      </div>
    </div>
  );
}
