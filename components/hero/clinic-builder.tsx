"use client";

import { useRef } from "react";

/**
 * Decorative hero widget: colorful IDE-shaped bots assemble the doctor's
 * "consultorio digital" (agenda, reseñas, WhatsApp, pulse-line). Static here;
 * the gsap timeline is wired in clinic-builder.tsx Task 3. aria-hidden — no a11y content.
 */
export function ClinicBuilder() {
  const root = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={root}
      viewBox="0 0 600 460"
      role="presentation"
      aria-hidden="true"
      className="h-full w-full overflow-visible"
    >
      {/* ---------- blueprint slab ---------- */}
      <g data-blueprint>
        <rect
          x="60"
          y="40"
          width="480"
          height="380"
          rx="24"
          style={{ fill: "var(--bg-surface)", stroke: "var(--line)" }}
          strokeWidth="1.5"
        />
        {/* faint blueprint grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={60 + (i + 1) * 48}
            y1="40"
            x2={60 + (i + 1) * 48}
            y2="420"
            style={{ stroke: "var(--glow-clinic)" }}
            strokeOpacity="0.1"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="60"
            y1={40 + (i + 1) * 47.5}
            x2="540"
            y2={40 + (i + 1) * 47.5}
            style={{ stroke: "var(--glow-clinic)" }}
            strokeOpacity="0.1"
          />
        ))}
      </g>

      {/* ---------- assembled pieces ---------- */}
      {/* agenda card */}
      <g data-piece="agenda">
        <rect
          x="96"
          y="104"
          width="180"
          height="150"
          rx="14"
          style={{ fill: "var(--bg-deep)", stroke: "var(--line)" }}
        />
        <rect x="116" y="126" width="70" height="10" rx="5" style={{ fill: "var(--accent)" }} />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            data-line
            x="116"
            y={154 + i * 22}
            width={i % 2 === 0 ? 140 : 110}
            height="8"
            rx="4"
            style={{ fill: "var(--ink-muted)" }}
          />
        ))}
      </g>

      {/* reviews card */}
      <g data-piece="reviews">
        <rect
          x="318"
          y="120"
          width="160"
          height="110"
          rx="14"
          style={{ fill: "var(--bg-deep)", stroke: "var(--line)" }}
        />
        <text
          x="338"
          y="160"
          style={{ fill: "var(--bot-amber)", fontSize: "22px", letterSpacing: "2px" }}
        >
          ★★★★★
        </text>
        <rect x="338" y="178" width="118" height="8" rx="4" style={{ fill: "var(--ink-muted)" }} />
        <rect x="338" y="196" width="86" height="8" rx="4" style={{ fill: "var(--ink-muted)" }} />
      </g>

      {/* whatsapp node */}
      <g data-piece="whatsapp">
        <circle cx="430" cy="320" r="34" style={{ fill: "var(--glow-clinic)" }} />
        <circle cx="430" cy="320" r="34" style={{ fill: "none", stroke: "var(--ink)" }} strokeOpacity="0.25" />
        <path
          d="M418 332c-3-4-4-9-2-13 2-5 7-8 12-7 5 0 9 4 10 9 1 6-3 12-9 13-2 1-5 0-7-1l-6 2 2-5z"
          style={{ fill: "var(--bg-deep)" }}
        />
      </g>

      {/* pulse-line (scaled in from the left by the hairline-bot) */}
      <rect
        data-piece="pulse"
        x="96"
        y="300"
        width="210"
        height="3"
        rx="1.5"
        style={{ fill: "var(--accent)" }}
      />

      {/* finishing period */}
      <circle data-piece="period" cx="300" cy="386" r="6" style={{ fill: "var(--accent)" }} />

      {/* ---------- bots ---------- */}
      <Bot name="bracket" x={70} y={150} color="--bot-amber" glyph="{ }" w={44} h={34} />
      <Bot name="caret" x={250} y={150} color="--bot-violet" glyph="▌" w={22} h={36} />
      <Bot name="tag" x={500} y={150} color="--bot-coral" glyph="</>" w={48} h={30} />
      <Bot name="terminal" x={500} y={300} color="--bot-cyan" glyph="›_" w={48} h={34} terminal />
      <Bot name="semicolon" x={300} y={420} color="--glow-clinic" glyph=";" w={22} h={30} />
      <Bot name="hairline" x={70} y={300} color="--accent" glyph="—" w={42} h={16} />
    </svg>
  );
}

type BotProps = {
  name: string;
  x: number;
  y: number;
  color: string;
  glyph: string;
  w: number;
  h: number;
  terminal?: boolean;
};

/** One IDE-element bot: colored rounded body + glyph face + two eyes, in an idle-bob group. */
function Bot({ name, x, y, color, glyph, w, h, terminal }: BotProps) {
  return (
    <g data-bot={name} transform={`translate(${x} ${y})`}>
      <g data-bob>
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={8}
          style={{ fill: `var(${color})` }}
        />
        {terminal && (
          <g>
            <circle cx={-w / 2 + 8} cy={-h / 2 + 7} r="2.5" style={{ fill: "var(--bg-deep)" }} />
            <circle cx={-w / 2 + 16} cy={-h / 2 + 7} r="2.5" style={{ fill: "var(--bg-deep)" }} />
            <circle cx={-w / 2 + 24} cy={-h / 2 + 7} r="2.5" style={{ fill: "var(--bg-deep)" }} />
          </g>
        )}
        <text
          x="0"
          y={terminal ? 6 : 5}
          textAnchor="middle"
          style={{
            fill: "var(--bg-deep)",
            fontSize: `${Math.min(h - 8, 18)}px`,
            fontWeight: 700,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {glyph}
        </text>
        {/* eyes / antenna nub */}
        <circle cx="0" cy={-h / 2 - 4} r="2.5" style={{ fill: `var(${color})` }} />
      </g>
    </g>
  );
}
