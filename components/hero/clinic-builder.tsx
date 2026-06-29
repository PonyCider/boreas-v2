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
        <rect
          x="80" y="88" width="200" height="168" rx="14"
          style={{ fill: "var(--bg-elevated)", stroke: "var(--bot-amber)" }}
          strokeWidth="1.5" strokeOpacity={0.4}
        />
        {/* amber top accent */}
        <rect x="80" y="88" width="200" height="4" rx="2"
          style={{ fill: "var(--bot-amber)" }} />
        {/* calendar icon */}
        <g
          transform="translate(98 112)"
          style={{ stroke: "var(--bot-amber)", strokeWidth: "1.5", fill: "none", strokeLinecap: "round" }}
        >
          <rect x="0" y="2" width="16" height="14" rx="2" />
          <line x1="4" y1="0" x2="4" y2="5" />
          <line x1="12" y1="0" x2="12" y2="5" />
          <line x1="0" y1="8" x2="16" y2="8" strokeOpacity={0.4} />
        </g>
        <text x="122" y="127"
          style={{ fill: "var(--bot-amber)", fontSize: "11px", fontWeight: 600, fontFamily: "ui-sans-serif,sans-serif" }}>
          Agenda hoy
        </text>
        {/* appointment rows — data-line for scaleX animation */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle cx="96" cy={154 + i * 26} r="3"
              style={{ fill: i === 0 ? "var(--accent)" : "var(--ink-muted)" }}
              fillOpacity={i === 0 ? 0.9 : 0.4}
            />
            <rect
              data-line=""
              x="108" y={148 + i * 26}
              width={i % 2 === 0 ? 152 : 116}
              height="8" rx="4"
              style={{ fill: i === 0 ? "var(--accent)" : "var(--ink-muted)" }}
              fillOpacity={i === 0 ? 0.65 : 0.3}
            />
          </g>
        ))}
      </g>

      {/* ── Reviews card ───────────────────────────────────────────── */}
      <g data-piece="reviews">
        <rect
          x="310" y="88" width="180" height="130" rx="14"
          style={{ fill: "var(--bg-elevated)", stroke: "var(--bot-coral)" }}
          strokeWidth="1.5" strokeOpacity={0.4}
        />
        {/* coral top accent */}
        <rect x="310" y="88" width="180" height="4" rx="2"
          style={{ fill: "var(--bot-coral)" }} />
        {/* star icon */}
        <g transform="translate(326 109)"
          style={{ stroke: "var(--bot-coral)", strokeWidth: "1.3", fill: "none" }}>
          <polygon points="8,0 10,5.5 16,5.5 11,8.5 13,14 8,11 3,14 5,8.5 0,5.5 6,5.5" />
        </g>
        <text x="348" y="127"
          style={{ fill: "var(--bot-coral)", fontSize: "11px", fontWeight: 600, fontFamily: "ui-sans-serif,sans-serif" }}>
          Reseñas
        </text>
        {/* large stars */}
        <text x="326" y="166"
          style={{ fill: "var(--bot-amber)", fontSize: "24px", letterSpacing: "4px" }}>
          ★★★★★
        </text>
        {/* rating + count */}
        <text x="326" y="188"
          style={{ fill: "var(--ink)", fontSize: "14px", fontWeight: 700, fontFamily: "ui-sans-serif,sans-serif" }}>
          4.9
        </text>
        <text x="347" y="188"
          style={{ fill: "var(--ink-muted)", fontSize: "11px", fontFamily: "ui-sans-serif,sans-serif" }}>
          · 47 reseñas
        </text>
        <rect x="326" y="199" width="140" height="7" rx="3.5"
          style={{ fill: "var(--ink-muted)" }} fillOpacity={0.25} />
      </g>

      {/* ── Booking badge ──────────────────────────────────────────── */}
      <g data-piece="badge">
        <rect x="310" y="232" width="148" height="28" rx="14"
          style={{ fill: "var(--bot-cyan)" }} fillOpacity={0.1} />
        <rect x="310" y="232" width="148" height="28" rx="14"
          fill="none"
          style={{ stroke: "var(--bot-cyan)" }}
          strokeWidth="1.5" strokeOpacity={0.5}
        />
        <circle data-badge-dot="" cx="328" cy="246" r="4"
          style={{ fill: "var(--bot-cyan)" }} />
        <text x="340" y="251"
          style={{ fill: "var(--bot-cyan)", fontSize: "11px", fontWeight: 600, fontFamily: "ui-monospace,monospace" }}>
          3 citas hoy
        </text>
      </g>

      {/* ── WhatsApp node ──────────────────────────────────────────── */}
      <g data-piece="whatsapp">
        <circle cx="430" cy="338" r="36" style={{ fill: "var(--glow-clinic)" }} />
        <circle cx="430" cy="338" r="36" fill="none"
          style={{ stroke: "var(--ink)" }} strokeOpacity={0.15} />
        <path
          d="M418 350c-3-4-4-9-2-13 2-5 7-8 12-7 5 0 9 4 10 9 1 6-3 12-9 13-2 1-5 0-7-1l-6 2 2-5z"
          style={{ fill: "var(--bg-deep)" }}
        />
      </g>

      {/* ── EKG pulse line — draws left→right via stroke-dashoffset ── */}
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
