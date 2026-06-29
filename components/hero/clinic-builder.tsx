"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// ─── Pixel art bots ────────────────────────────────────────────────────────
// Each row = 7 chars: P=body color, E=dark eye, .=transparent
type PixelMap = readonly string[];

const MAPS: Record<string, PixelMap> = {
  // amber — center antenna, two dot eyes
  bracket: [
    "...P...",
    ".PPPPP.",
    "PPPPPPP",
    "PPPPPPP",
    "P.E.E.P",
    "PPPPPPP",
    ".PPPPP.",
    ".PPPPP.",
    ".P.P.P.",
    ".P.P.P.",
  ],
  // violet — two side antennas, wide-apart eyes
  caret: [
    "..P.P..",
    "..P.P..",
    ".PPPPP.",
    "PPPPPPP",
    "PPPPPPP",
    "PE...EP",
    "PPPPPPP",
    ".PPPPP.",
    "..P.P..",
    "..P.P..",
  ],
  // coral — wing bits on top, full bar visor
  tag: [
    "P.....P",
    ".P...P.",
    ".PPPPP.",
    "PPPPPPP",
    "PPPPPPP",
    "PEEEEEP",
    "PPPPPPP",
    ".PPPPP.",
    ".PPPPP.",
    ".P.P.P.",
    ".P.P.P.",
  ],
  // cyan — flat notched top, grill eyes
  terminal: [
    "PPP.PPP",
    ".PPPPP.",
    "PPPPPPP",
    "PPPPPPP",
    "PE.P.EP",
    "PPPPPPP",
    ".PPPPP.",
    ".PPPPP.",
    "..P.P..",
    "..P.P..",
  ],
  // sage — wide crown, wink eye
  semicolon: [
    "..PPP..",
    ".PPPPP.",
    "PPPPPPP",
    "PPPPPPP",
    "PPE..PP",
    "PPPPPPP",
    ".PPPPP.",
    ".PPPPP.",
    ".P...P.",
    ".P...P.",
  ],
  // teal — tall single antenna, double-row visor
  hairline: [
    "...P...",
    "...P...",
    ".PPPPP.",
    "PPPPPPP",
    "PPPPPPP",
    "PEEEEEP",
    "PEEEEEP",
    "PPPPPPP",
    ".PPPPP.",
    "..P.P..",
    "..P.P..",
  ],
};

const EYE_FILL = "oklch(0.12 0.009 245)";
const PX = 5; // pixel size in SVG units → 7×PX=35 wide, ~10×PX=50 tall

function PixelBot({
  name,
  x,
  y,
  color,
}: {
  name: string;
  x: number;
  y: number;
  color: string; // full CSS value e.g. "var(--bot-amber)"
}) {
  const pixels = MAPS[name];
  const cols = pixels[0].length;
  const rows = pixels.length;
  const w = cols * PX;
  const h = rows * PX;

  return (
    // Static position wrapper — GSAP never targets this group.
    // [data-bot] starts at (0,0) relative to parent so resetScene's
    // gsap.set({x:0,y:0}) returns to the correct SVG position.
    <g transform={`translate(${x} ${y})`}>
      <g data-bot={name}>
        <g data-bob>
          {pixels.flatMap((row, r) =>
            [...row].flatMap((ch, c) => {
              const fill =
                ch === "P" ? color : ch === "E" ? EYE_FILL : null;
              if (!fill) return [];
              return [
                <rect
                  key={`${r}-${c}`}
                  x={c * PX - w / 2}
                  y={r * PX - h / 2}
                  width={PX}
                  height={PX}
                  style={{ fill }}
                />,
              ];
            })
          )}
        </g>
      </g>
    </g>
  );
}

// ─── EKG pulse path ────────────────────────────────────────────────────────
const EKG_D =
  "M96,303 L130,303 L138,291 L146,315 L154,303 L176,303 L182,297 L188,309 L192,303 L306,303";
const EKG_LEN = 252; // approximate total stroke length for dash animation

// ─── Widget ────────────────────────────────────────────────────────────────
export function ClinicBuilder() {
  const root = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const pieces = q("[data-piece]");
      const bots = q("[data-bot]");
      const bobs = q("[data-bob]");

      const piece = (n: string) => q(`[data-piece="${n}"]`);
      const bot = (n: string) => q(`[data-bot="${n}"]`);

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          // complementary pair — exactly one always matches so callback always fires
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023.98px)",
        },
        (ctx) => {
          const { reduce, isDesktop } = ctx.conditions as {
            reduce: boolean;
            isDesktop: boolean;
            isMobile: boolean;
          };

          if (reduce) {
            gsap.set(pieces, { autoAlpha: 1, scale: 1 });
            gsap.set(bots, { autoAlpha: 0.95 });
            return;
          }

          const fullCrew = ["bracket", "caret", "tag", "terminal", "semicolon", "hairline"];
          const lightCrew = ["bracket", "terminal", "caret"];
          const crew = isDesktop ? fullCrew : lightCrew;

          bots.forEach((b) => {
            const name = (b as unknown as SVGElement).dataset.bot ?? "";
            gsap.set(b, { autoAlpha: crew.includes(name) ? 1 : 0 });
          });

          // Bob keeps the scene alive during holds (targets inner groups only —
          // no conflict with the timeline moving the outer [data-bot] groups).
          const idle = gsap.to(bobs, {
            y: "-=5",
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.25, from: "random" },
          });

          // Badge dot pulses independently once the badge is visible
          const badgeDot = gsap.to(q("[data-badge-dot]"), {
            scale: 1.5,
            duration: 0.7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            transformOrigin: "50% 50%",
          });

          const resetScene = () => {
            gsap.set(pieces, { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
            // Pulse draws via stroke-dashoffset — override scale:0.8 set above
            gsap.set(q('[data-piece="pulse"]'), {
              autoAlpha: 0,
              scale: 1,
              attr: { "stroke-dashoffset": EKG_LEN },
            });
            gsap.set(q('[data-piece="agenda"] [data-line]'), {
              scaleX: 0,
              scaleY: 1,
              transformOrigin: "0% 50%",
            });
            crew.forEach((n) => gsap.set(bot(n), { x: 0, y: 0 }));
          };
          resetScene();

          const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });

          tl.addLabel("build")
            // bracket-bot nudges left → agenda frame pops in
            .to(bot("bracket"), { x: 36, y: -4, duration: 0.6 }, "build")
            .to(piece("agenda"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "build+=0.2")
            // caret-bot types agenda appointment lines
            .to(bot("caret"), { x: -8, y: 6, duration: 0.45 }, "build+=0.5")
            .to(
              q('[data-piece="agenda"] [data-line]'),
              { scaleX: 1, stagger: 0.1, duration: 0.35 },
              "<"
            )
            // tag-bot drops reviews card
            .to(bot("tag"), { x: -70, y: -2, duration: 0.6 }, "build+=1.1")
            .to(piece("reviews"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.15")
            // terminal-bot places WhatsApp node (ping) + booking badge
            .to(bot("terminal"), { x: -56, y: 4, duration: 0.6 }, "build+=1.7")
            .to(piece("whatsapp"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.15")
            .to(piece("whatsapp"), { scale: 1.1, duration: 0.22, yoyo: true, repeat: 1 }, ">")
            .to(piece("badge"), { autoAlpha: 1, scale: 1, duration: 0.35 }, ">0.1")
            // hairline-bot draws the EKG pulse line left-to-right
            .to(bot("hairline"), { x: 30, y: -2, duration: 0.45 }, "build+=2.4")
            .to(
              piece("pulse"),
              { autoAlpha: 1, attr: { "stroke-dashoffset": 0 }, duration: 0.75, ease: "linear" },
              "<"
            )
            // semicolon-bot moves to finishing position
            .to(bot("semicolon"), { x: 4, y: -34, duration: 0.4 }, "build+=2.9")
            // hold the finished consultorio
            .addLabel("hold")
            .to({}, { duration: 2 })
            // soft dissolve + bots return to start
            .to(pieces, { autoAlpha: 0, duration: 0.8, ease: "power1.inOut" }, "hold+=2")
            .to(
              crew.flatMap((n) => bot(n)),
              { x: 0, y: 0, duration: 0.8, ease: "power1.inOut" },
              "<"
            )
            .add(resetScene);

          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) tl.play();
              else tl.pause();
            },
            { threshold: 0.08 }
          );
          if (root.current) io.observe(root.current);

          return () => {
            io.disconnect();
            idle.kill();
            badgeDot.kill();
            tl.kill();
          };
        }
      );
    },
    { scope: root }
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 600 460"
      role="presentation"
      aria-hidden="true"
      className="clinic-builder h-full w-full overflow-visible"
    >
      <defs>
        <linearGradient id="gradAgenda" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--bot-amber)", stopOpacity: 0.14 }} />
          <stop offset="75%" style={{ stopColor: "var(--bot-amber)", stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id="gradReviews" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--bot-coral)", stopOpacity: 0.14 }} />
          <stop offset="75%" style={{ stopColor: "var(--bot-coral)", stopOpacity: 0 }} />
        </linearGradient>
        {/* clip card inner content to card shape so accent bar doesn't overflow corners */}
        <clipPath id="clipAgenda">
          <rect x="80" y="88" width="200" height="168" rx="14" />
        </clipPath>
        <clipPath id="clipReviews">
          <rect x="310" y="88" width="180" height="130" rx="14" />
        </clipPath>
        {/* WhatsApp circle — radial gradient for depth */}
        <radialGradient id="waGrad" cx="38%" cy="32%" r="65%">
          <stop offset="0%" style={{ stopColor: "oklch(0.78 0.13 154)", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "oklch(0.5 0.1 154)", stopOpacity: 1 }} />
        </radialGradient>
      </defs>

      {/* ── Blueprint slab ─────────────────────────────────────────── */}
      <g data-blueprint>
        <rect
          x="60" y="40" width="480" height="380" rx="24"
          style={{ fill: "var(--bg-surface)", stroke: "var(--line)" }}
          strokeWidth="1.5"
        />
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={60 + (i + 1) * 48} y1="40"
            x2={60 + (i + 1) * 48} y2="420"
            style={{ stroke: "var(--glow-clinic)" }} strokeOpacity="0.08"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="60" y1={40 + (i + 1) * 47.5}
            x2="540" y2={40 + (i + 1) * 47.5}
            style={{ stroke: "var(--glow-clinic)" }} strokeOpacity="0.08"
          />
        ))}
      </g>

      {/* ── Agenda card ────────────────────────────────────────────── */}
      <g data-piece="agenda">
        {/* border outside the clip so stroke isn't cut */}
        <rect
          x="80" y="88" width="200" height="168" rx="14"
          style={{ fill: "var(--bg-elevated)", stroke: "var(--bot-amber)" }}
          strokeWidth="1.5" strokeOpacity={0.4}
        />
        {/* everything inside is clipped to the card shape */}
        <g clipPath="url(#clipAgenda)">
        {/* amber color wash */}
        <rect x="80" y="88" width="200" height="168" fill="url(#gradAgenda)" />
        {/* amber top accent — now properly clipped to card corners */}
        <rect x="80" y="88" width="200" height="5"
          style={{ fill: "var(--bot-amber)" }} />
        {/* calendar icon */}
        <g
          transform="translate(96 112)"
          style={{ stroke: "var(--bot-amber)", strokeWidth: "1.5", fill: "none", strokeLinecap: "round" }}
        >
          <rect x="0" y="2" width="16" height="14" rx="2" />
          <line x1="4" y1="0" x2="4" y2="5" />
          <line x1="12" y1="0" x2="12" y2="5" />
          <line x1="0" y1="8" x2="16" y2="8" strokeOpacity={0.4} />
        </g>
        <text x="120" y="127"
          style={{ fill: "var(--bot-amber)", fontSize: "11px", fontWeight: 600, fontFamily: "ui-sans-serif,sans-serif" }}>
          Agenda hoy
        </text>
        {/* "4 hoy" count chip */}
        <rect x="228" y="114" width="38" height="16" rx="8"
          style={{ fill: "var(--bot-amber)" }} fillOpacity={0.2} />
        <text x="247" y="126" textAnchor="middle"
          style={{ fill: "var(--bot-amber)", fontSize: "9px", fontWeight: 700, fontFamily: "ui-monospace,monospace" }}>
          4 hoy
        </text>
        {/* header separator */}
        <line x1="88" y1="138" x2="272" y2="138"
          style={{ stroke: "var(--bot-amber)" }} strokeOpacity={0.2} />
        {/* appointment rows: time label + dot + bar (data-line) */}
        {[
          { time: "9:00",  accent: true,  w: 134 },
          { time: "11:30", accent: false, w: 108 },
          { time: "16:00", accent: false, w: 126 },
          { time: "18:00", accent: false, w: 94  },
        ].map(({ time, accent, w }, i) => {
          const cy = 154 + i * 26;
          return (
            <g key={i}>
              {accent && (
                <rect x="88" y={cy - 9} width="184" height="20" rx="4"
                  style={{ fill: "var(--accent)" }} fillOpacity={0.07} />
              )}
              <text x="92" y={cy + 4}
                style={{
                  fill: accent ? "var(--accent)" : "var(--ink-muted)",
                  fontSize: "9px",
                  fontFamily: "ui-monospace,monospace",
                  fontWeight: accent ? 600 : 400,
                }}>
                {time}
              </text>
              <circle cx="124" cy={cy} r="3"
                style={{ fill: accent ? "var(--accent)" : "var(--ink-muted)" }}
                fillOpacity={accent ? 1 : 0.4}
              />
              <rect
                data-line=""
                x="132" y={cy - 4}
                width={w}
                height="8" rx="4"
                style={{ fill: accent ? "var(--accent)" : "var(--ink-muted)" }}
                fillOpacity={accent ? 0.65 : 0.28}
              />
            </g>
          );
        })}
        </g>{/* end clipAgenda */}
      </g>{/* end data-piece="agenda" */}

      {/* ── Reviews card ───────────────────────────────────────────── */}
      <g data-piece="reviews">
        {/* border outside clip */}
        <rect
          x="310" y="88" width="180" height="130" rx="14"
          style={{ fill: "var(--bg-elevated)", stroke: "var(--bot-coral)" }}
          strokeWidth="1.5" strokeOpacity={0.4}
        />
        <g clipPath="url(#clipReviews)">
        {/* coral color wash */}
        <rect x="310" y="88" width="180" height="130" fill="url(#gradReviews)" />
        {/* coral top accent — clipped to card corners */}
        <rect x="310" y="88" width="180" height="5"
          style={{ fill: "var(--bot-coral)" }} />
        {/* star icon */}
        <g transform="translate(324 109)"
          style={{ stroke: "var(--bot-coral)", strokeWidth: "1.3", fill: "none" }}>
          <polygon points="8,0 10,5.5 16,5.5 11,8.5 13,14 8,11 3,14 5,8.5 0,5.5 6,5.5" />
        </g>
        <text x="346" y="127"
          style={{ fill: "var(--bot-coral)", fontSize: "11px", fontWeight: 600, fontFamily: "ui-sans-serif,sans-serif" }}>
          Reseñas
        </text>
        {/* ★★★★★ centered */}
        <text x="400" y="158" textAnchor="middle"
          style={{ fill: "var(--bot-amber)", fontSize: "18px", letterSpacing: "3px" }}>
          ★★★★★
        </text>
        {/* large score */}
        <text x="326" y="188"
          style={{ fill: "var(--ink)", fontSize: "30px", fontWeight: 700, fontFamily: "ui-sans-serif,sans-serif" }}>
          4.9
        </text>
        <text x="380" y="185"
          style={{ fill: "var(--ink-muted)", fontSize: "12px", fontFamily: "ui-sans-serif,sans-serif" }}>
          / 5
        </text>
        <text x="480" y="188" textAnchor="end"
          style={{ fill: "var(--ink-muted)", fontSize: "10px", fontFamily: "ui-sans-serif,sans-serif" }}>
          47 reseñas
        </text>
        {/* 4.9 / 5 rating bar */}
        <rect x="326" y="200" width="142" height="5" rx="2.5"
          style={{ fill: "var(--ink-muted)" }} fillOpacity={0.2} />
        <rect x="326" y="200" width="139" height="5" rx="2.5"
          style={{ fill: "var(--bot-amber)" }} fillOpacity={0.65} />
        </g>{/* end clipReviews */}
      </g>{/* end data-piece="reviews" */}

      {/* ── Booking badge ──────────────────────────────────────────── */}
      <g data-piece="badge">
        <rect x="310" y="229" width="152" height="32" rx="16"
          style={{ fill: "var(--bot-cyan)" }} fillOpacity={0.1} />
        <rect x="310" y="229" width="152" height="32" rx="16"
          fill="none"
          style={{ stroke: "var(--bot-cyan)" }}
          strokeWidth="1.5" strokeOpacity={0.5}
        />
        <circle data-badge-dot="" cx="328" cy="245" r="4.5"
          style={{ fill: "var(--bot-cyan)" }} />
        <text x="340" y="250"
          style={{ fill: "var(--bot-cyan)", fontSize: "15px", fontWeight: 700, fontFamily: "ui-monospace,monospace" }}>
          3
        </text>
        <text x="358" y="250"
          style={{ fill: "var(--ink)", fontSize: "11px", fontFamily: "ui-sans-serif,sans-serif" }}>
          citas hoy
        </text>
      </g>

      {/* ── WhatsApp node ──────────────────────────────────────────── */}
      <g data-piece="whatsapp">
        {/* outer ambient glow ring */}
        <circle cx="430" cy="338" r="43"
          style={{ fill: "var(--glow-clinic)" }} fillOpacity={0.12} />
        {/* middle ring — subtle border glow */}
        <circle cx="430" cy="338" r="38"
          style={{ fill: "var(--glow-clinic)" }} fillOpacity={0.08} />
        {/* main circle with radial gradient for depth */}
        <circle cx="430" cy="338" r="36" fill="url(#waGrad)" />
        {/* inner highlight rim */}
        <circle cx="430" cy="338" r="36" fill="none"
          style={{ stroke: "var(--ink)" }} strokeOpacity={0.18} strokeWidth="1" />
        {/* speech bubble icon — rounded rect with lower-left tail */}
        <path
          d="M418,321 h22 q8,0 8,8 v10 q0,8-8,8 h-5 l-8,8 0,-8 h-9 q-8,0-8,-8 v-10 q0,-8 8,-8 z"
          style={{ fill: "var(--bg-deep)" }}
          fillOpacity={0.82}
        />
        {/* phone receiver inside bubble — two arcs suggesting handset */}
        <path
          d="M422,332 c0,-3 2.5,-5 5,-4 l2,4.5 -2.5,1.5 c1,3 3.5,5.5 6.5,6.5 l1.5,-2.5 4.5,2 c0,3-2.5,5-5,4.5 -7.5,-1-13.5,-8.5-12,-12.5"
          fill="none"
          style={{ stroke: "var(--glow-clinic)" }}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* notification badge */}
        <circle cx="457" cy="314" r="10" style={{ fill: "var(--bg-deep)" }} />
        <circle cx="457" cy="314" r="8" style={{ fill: "var(--bot-coral)" }} />
        <text x="457" y="318" textAnchor="middle"
          style={{ fill: "var(--ink)", fontSize: "8px", fontWeight: 700, fontFamily: "ui-sans-serif,sans-serif" }}>
          2
        </text>
      </g>

      {/* ── EKG pulse line — draws left→right via stroke-dashoffset ── */}
      {/* glow layer — same data-piece so it animates together with main */}
      <path
        data-piece="pulse"
        d={EKG_D}
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="8"
        strokeOpacity={0.22}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={EKG_LEN}
        strokeDashoffset={EKG_LEN}
      />
      {/* main line */}
      <path
        data-piece="pulse"
        d={EKG_D}
        fill="none"
        style={{ stroke: "var(--accent)" }}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={EKG_LEN}
        strokeDashoffset={EKG_LEN}
      />

      {/* ── Pixel bots ─────────────────────────────────────────────── */}
      <PixelBot name="bracket"   x={70}  y={172} color="var(--bot-amber)"   />
      <PixelBot name="caret"     x={258} y={172} color="var(--bot-violet)"  />
      <PixelBot name="tag"       x={508} y={155} color="var(--bot-coral)"   />
      <PixelBot name="terminal"  x={508} y={318} color="var(--bot-cyan)"    />
      <PixelBot name="semicolon" x={310} y={412} color="var(--glow-clinic)" />
      <PixelBot name="hairline"  x={70}  y={318} color="var(--accent)"      />
    </svg>
  );
}
