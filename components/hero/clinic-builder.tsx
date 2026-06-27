"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Decorative hero widget: colorful IDE-shaped bots assemble the doctor's
 * "consultorio digital" (agenda, reseñas, WhatsApp, pulse-line). Static scene +
 * an infinite gsap build loop (see the useGSAP block below). aria-hidden — no a11y content.
 */
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
          // isDesktop / isMobile are complementary so exactly one always matches —
          // gsap.matchMedia only runs the callback when a query matches, so without
          // the isMobile companion the widget never animates below 1024px.
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023.98px)",
        },
        (ctx) => {
          const { reduce, isDesktop } = ctx.conditions as {
            reduce: boolean;
            isDesktop: boolean;
            isMobile: boolean;
          };

          // Reduced motion → completed static frame, no timeline.
          if (reduce) {
            gsap.set(pieces, { autoAlpha: 1, scale: 1 });
            gsap.set(bots, { autoAlpha: 0.95 });
            return;
          }

          // Crew selection: full desktop vs light mobile.
          const fullCrew = ["bracket", "caret", "tag", "terminal", "semicolon", "hairline"];
          const lightCrew = ["bracket", "terminal", "caret"];
          const crew = isDesktop ? fullCrew : lightCrew;
          bots.forEach((b) => {
            const name = (b as unknown as SVGElement).dataset.bot ?? "";
            gsap.set(b, { autoAlpha: crew.includes(name) ? 1 : 0 });
          });

          // Idle bob keeps the scene alive during holds (inner groups only — no
          // conflict with the master timeline moving the outer bot groups).
          const idle = gsap.to(bobs, {
            y: "-=5",
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.25, from: "random" },
          });

          // Reset helper: the start state, also used to close the loop seamlessly.
          const resetScene = () => {
            gsap.set(pieces, { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
            gsap.set(q('[data-piece="pulse"]'), {
              scaleX: 0,
              scaleY: 1,
              transformOrigin: "0% 50%",
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
            // bracket-bot nudges in, agenda frame appears
            .to(bot("bracket"), { x: 36, y: -4, duration: 0.6 }, "build")
            .to(piece("agenda"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "build+=0.2")
            // caret-bot types the agenda lines
            .to(bot("caret"), { x: -8, y: 6, duration: 0.45 }, "build+=0.5")
            .to(
              q('[data-piece="agenda"] [data-line]'),
              { scaleX: 1, stagger: 0.1, duration: 0.35 },
              "<"
            )
            // tag-bot raises the reviews card
            .to(bot("tag"), { x: -70, y: -2, duration: 0.6 }, "build+=1.1")
            .to(piece("reviews"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.15")
            // terminal-bot drops the WhatsApp node, it pings
            .to(bot("terminal"), { x: -56, y: 4, duration: 0.6 }, "build+=1.7")
            .to(piece("whatsapp"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.15")
            .to(piece("whatsapp"), { scale: 1.1, duration: 0.22, yoyo: true, repeat: 1 }, ">")
            // hairline-bot draws the pulse-line; semicolon-bot sets the period
            .to(bot("hairline"), { x: 30, y: -2, duration: 0.45 }, "build+=2.3")
            .to(piece("pulse"), { autoAlpha: 1, scaleX: 1, duration: 0.6 }, "<")
            .to(bot("semicolon"), { x: 4, y: -34, duration: 0.4 }, "build+=2.7")
            .to(piece("period"), { autoAlpha: 1, scale: 1, duration: 0.3 }, "<0.1")
            // hold the finished consultorio
            .addLabel("hold")
            .to({}, { duration: 2 })
            // soft dissolve back to blueprint, then reset for a seamless loop
            .to(pieces, { autoAlpha: 0, duration: 0.8, ease: "power1.inOut" }, "hold+=2")
            .to(
              crew.flatMap((n) => bot(n)),
              { x: 0, y: 0, duration: 0.8, ease: "power1.inOut" },
              "<"
            )
            .add(resetScene);

          // Pause the loop when the hero is scrolled out of view.
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
            tl.kill();
          };
        }
      );
    },
    { scope: root }
  );

  // Pieces default to opacity-0 (via the svg className below) so the default/
  // failure state is the empty blueprint, never the built scene (which shows a
  // fabricated ★★★★★ card). gsap reveals them during the build; the
  // reduced-motion branch sets them visible.
  return (
    <svg
      ref={root}
      viewBox="0 0 600 460"
      role="presentation"
      aria-hidden="true"
      className="clinic-builder h-full w-full overflow-visible"
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
