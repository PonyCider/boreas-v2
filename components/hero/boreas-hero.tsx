"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  heroCredibility,
  heroHeadline,
  heroProofPoints,
  heroSubcopy,
} from "@/content/boreas-home";

function HeroCardCluster() {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      {/* Chip "3 citas hoy" — top right, above main card */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          zIndex: 2,
          background: "rgba(79,179,154,.12)",
          border: "1px solid rgba(79,179,154,.25)",
          borderRadius: "999px",
          padding: "9px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "float 6s ease-in-out 1.4s infinite",
        }}
      >
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "var(--c-mint)",
            flexShrink: 0,
            animation: "pulse-dot 1.8s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: "13px", fontWeight: 600, color: "#2a8068" }}>
          3 citas hoy
        </span>
      </div>

      {/* Main card */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "0",
          right: "50px",
          zIndex: 1,
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "var(--shadow)",
          padding: "22px",
          animation: "float 5.2s ease-in-out infinite",
        }}
      >
        {/* Avatar + name */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--accent)",
              fontSize: "17px",
              flexShrink: 0,
            }}
          >
            SR
          </div>
          <div>
            <p style={{ fontSize: "15.5px", fontWeight: 600, color: "var(--ink)", margin: 0, lineHeight: 1.3 }}>
              Dra. Sofía Ramírez
            </p>
            <p style={{ fontSize: "13px", color: "var(--ink-muted)", margin: 0, marginTop: "2px" }}>
              Cardiología Clínica
            </p>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "14px" }}>
          <span style={{ color: "var(--rating-gold)", fontSize: "15px" }} aria-hidden="true">★★★★★</span>
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontSize: "22px",
              fontWeight: 500,
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            4.9
          </span>
          <span style={{ fontSize: "13px", color: "var(--ink-muted)" }}>127 reseñas</span>
        </div>

        {/* Quote */}
        <div
          style={{
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-md)",
            padding: "12px 14px",
            marginBottom: "14px",
          }}
        >
          <p style={{ fontSize: "13px", fontStyle: "italic", color: "var(--ink-muted)", margin: 0, lineHeight: 1.55 }}>
            &ldquo;Llegué con muchas dudas y salí con todo claro. Lo recomiendo ampliamente.&rdquo;
          </p>
        </div>

        {/* WhatsApp button */}
        <button
          tabIndex={-1}
          aria-hidden="true"
          style={{
            background: "var(--c-mint)",
            color: "#fff",
            width: "100%",
            height: "42px",
            borderRadius: "var(--radius-md)",
            fontSize: "14px",
            fontWeight: 600,
            fontFamily: "var(--font-figtree), sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Agendar por WhatsApp
        </button>
      </div>

      {/* Chip stat "84%" — bottom right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "0",
          zIndex: 2,
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "14px 18px",
          boxShadow: "var(--shadow-sm)",
          animation: "float 4.6s ease-in-out 0.7s infinite",
        }}
      >
        <p style={{ fontSize: "11px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--ink-muted)", margin: "0 0 4px" }}>
          Pacientes digitales
        </p>
        <p style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontSize: "34px", fontWeight: 500, color: "var(--c-amber)", lineHeight: 1, margin: 0 }}>
          84%
        </p>
        <p style={{ fontSize: "11px", color: "var(--ink-muted)", margin: "4px 0 0" }}>
          busca en línea antes de agendar
        </p>
      </div>

      {/* Chip tiempo — bottom left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "16px",
          left: "0",
          zIndex: 2,
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "999px",
          padding: "8px 14px",
          animation: "float 5s ease-in-out 0.3s infinite",
        }}
      >
        <span style={{ fontSize: "12px", color: "var(--ink-muted)" }}>
          11:47 PM · tu consultorio respondió
        </span>
      </div>
    </div>
  );
}

export function BoreasHero() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="min-h-[calc(100vh-64px)] py-20 bg-background">
      <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
        {/* Left column */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.12 }}
        >
          {/* Eyebrow */}
          <motion.p
            variants={reveal}
            transition={{ duration: 0.6, ease }}
            className="mb-5 text-sm font-semibold"
            style={{ color: "var(--c-mint)" }}
          >
            {heroCredibility}
          </motion.p>

          {/* Wordmark */}
          <motion.p
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "clamp(5rem, 13vw, 10.5rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
            }}
          >
            Boreas
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={reveal}
            transition={{ duration: 0.7, ease }}
            className="mt-[22px] text-balance"
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontWeight: 400,
              fontSize: "clamp(1.85rem, 4vw, 3.8rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.012em",
              color: "var(--ink)",
            }}
          >
            {heroHeadline}
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mt-6 max-w-[50ch]"
            style={{
              fontSize: "17px",
              lineHeight: 1.7,
              color: "var(--ink-muted)",
            }}
          >
            {heroSubcopy}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a href="#contacto" className="btn btn-p w-full sm:w-auto">
              Quiero mi consultorio digital
            </a>
            <a href="#proceso" className="btn btn-s w-full sm:w-auto">
              Ver cómo funciona
            </a>
          </motion.div>

          {/* Proof points */}
          <motion.ul
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {heroProofPoints.map((point, index) => (
              <li
                key={point}
                className="border-t pt-3 text-[13px]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--ink-muted)",
                  transitionDelay: `${index * 70}ms`,
                }}
              >
                {point}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Right column — card cluster (desktop only) */}
        <HeroCardCluster />
      </div>
    </section>
  );
}
