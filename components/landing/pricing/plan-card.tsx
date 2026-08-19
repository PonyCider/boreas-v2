"use client";

import { useState } from "react";
import { Check, Clock, RotateCcw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import type { Tier } from "@/content/pricing";
import {
  expressToggle,
  garantiaTooltip,
  iaTooltip,
  iaToggle,
  IA_SETUP,
  mensualidadTooltip,
} from "@/content/pricing";
import { computePrice, formatMxn, type PlanConfig } from "@/lib/pricing";
import { InfoTooltip } from "./info-tooltip";
import { GlitterWrap } from "./glitter-wrap";
import { PlanToggle } from "./plan-toggle";

import { AnimatePresence, motion } from "motion/react";
import { DiaTextReveal } from "@/components/magicui/dia-text-reveal";
import { AnimatedPrice } from "./animated-price";

type SelectPlan = (tier: Tier, config: PlanConfig, trigger: HTMLButtonElement) => void;

function PricePanel({ tier, config }: { tier: Tier; config: PlanConfig }) {
  const price = computePrice(tier, config);

  return (
    <div
      className={`mt-5 rounded-[var(--radius-md)] border p-5 transition-[background-color,border-color,box-shadow] duration-300 ${
        config.express
          ? "border-[#e7d7cc] bg-[#fffaf6] shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
          : tier.recommended
          ? "border-accent/35 bg-accent-soft/25"
          : "border-line/80 bg-elevated/75"
      }`}
      aria-live="polite"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clinical">
        Inversión inicial
      </p>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <AnimatedPrice
          value={price.setup}
          className="font-display text-[clamp(2rem,3vw,2.75rem)] font-semibold leading-none tracking-tight text-foreground"
        />
        {price.setup !== null && (
          <span className="text-xs font-medium text-clinical">pago único</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line/70 pt-3 text-sm text-foreground">
        <span className="font-semibold">
          {tier.monthlyIsFrom ? "desde " : ""}
          <AnimatedPrice value={price.monthly} />
        </span>
        <span className="text-xs text-clinical">al mes</span>
        <InfoTooltip
          summary={mensualidadTooltip.summary}
          paragraphs={mensualidadTooltip.paragraphs}
        />
      </div>
    </div>
  );
}

function PlanDetails({
  tier,
  delivery,
  express,
  dark = false,
}: {
  tier: Tier;
  delivery: string;
  express: boolean;
  dark?: boolean;
}) {
  return (
    <dl
      className={`mt-5 divide-y border-y text-xs transition-colors duration-300 ${
        dark ? "divide-white/12 border-white/12 text-[#c7bbb2]" : "divide-line/70 border-line/70 text-clinical"
      }`}
    >
      <div className="flex items-center justify-between gap-3 py-2.5">
        <dt className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          <span>Entrega</span>
        </dt>
        <dd
          className={`flex items-center gap-1 font-medium ${
            express ? "text-[#f29a7e]" : dark ? "text-[#fff7ed]" : "text-foreground"
          }`}
        >
          {express && <Zap className="h-3.5 w-3.5" />}
          {delivery}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 py-2.5">
        <dt className="flex items-center gap-1.5">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Revisiones</span>
        </dt>
        <dd className={`font-medium ${dark ? "text-[#fff7ed]" : "text-foreground"}`}>
          {tier.revisions}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-3 py-2.5">
        <dt className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Garantía</span>
          <InfoTooltip
            summary={garantiaTooltip.summary}
            paragraphs={garantiaTooltip.paragraphs}
          />
        </dt>
        <dd className={`font-medium ${dark ? "text-[#fff7ed]" : "text-foreground"}`}>
          {tier.warranty}
        </dd>
      </div>
    </dl>
  );
}

function UnavailableIa({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 text-xs">
      <span className={`font-medium ${dark ? "text-[#fff7ed]" : "text-foreground"}`}>
        {iaToggle.label}
      </span>
      <span className={`text-right ${dark ? "text-[#c7bbb2]" : "text-clinical"}`}>
        {iaToggle.unavailable}
      </span>
    </div>
  );
}

export function PlanCard({ tier, onSelect }: { tier: Tier; onSelect: SelectPlan }) {
  const [config, setConfig] = useState<PlanConfig>({ express: false, ia: false });
  const delivery =
    config.express && tier.delivery.express ? tier.delivery.express : tier.delivery.base;

  return (
    <article
      className={`group relative flex h-full flex-col rounded-[var(--radius-xl)] p-6 transition-[background-color,border-color,box-shadow,transform] duration-500 ${
        config.express
          ? `${tier.recommended ? "border-2" : "border"} border-[#e27f62]/55 bg-[#181411] shadow-[0_20px_48px_rgba(34,20,14,0.28)]`
          : tier.recommended
          ? "border-2 border-accent bg-surface shadow-xl shadow-accent/5 ring-1 ring-accent/15"
          : "border border-line bg-surface hover:border-accent/35 hover:shadow-lg"
      } ${tier.recommended ? "xl:-translate-y-2" : ""}`}
    >
      <GlitterWrap active={config.express} />

      {tier.recommended && (
        <div className="relative z-10 mb-4 inline-flex self-start items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>El que recomendamos</span>
        </div>
      )}

      <h3
        className={`relative z-10 inline-flex items-baseline gap-0.5 font-display text-2xl font-bold transition-colors duration-300 ${
          config.express ? "text-[#fff7ed]" : "text-foreground"
        }`}
      >
        <DiaTextReveal
          text={tier.name}
          colors={
            config.express
              ? ["#fff7ed", "#ffd5c7", "#f29a7e", "#ffd5a3", "#fff7ed"]
              : ["#A94932", "#D2674A", "#E2A33C", "#276C5B", "#E0617E"]
          }
          textColor={config.express ? "#fff7ed" : "var(--color-foreground, var(--ink, #1E1B18))"}
          duration={2.2}
          repeat={true}
          repeatDelay={4}
          startOnView={true}
          className="font-bold tracking-tight"
        />
        {tier.id === "deluxe" && (
          <span className="relative inline-block w-4 h-7 overflow-hidden align-baseline">
            <AnimatePresence>
              {config.ia && (
                <motion.span
                  key="deluxe-plus-badge"
                  initial={{ opacity: 0, y: 14, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.5 }}
                  transition={{
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`absolute bottom-0 left-0 font-display text-2xl font-bold leading-none ${
                    config.express
                      ? "drop-shadow-[0_1px_7px_rgba(242,154,126,0.4)]"
                      : ""
                  }`}
                  style={{
                    color: config.express ? "#f29a7e" : "#A94932",
                  }}
                >
                  +
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        )}
      </h3>
      <p
        className={`relative z-10 mt-2 min-h-10 text-sm leading-relaxed transition-colors duration-300 ${
          config.express ? "text-[#cfc3ba]" : "text-muted"
        }`}
      >
        {tier.tagline}
      </p>

      <div className="relative z-20">
        <PricePanel tier={tier} config={config} />
      </div>

      <ul
        className={`relative z-10 mt-6 flex-1 space-y-2.5 text-sm transition-colors duration-300 ${
          config.express ? "text-[#d6cbc3]" : "text-muted"
        }`}
      >
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 leading-snug">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="relative z-10">
        <PlanDetails
          tier={tier}
          delivery={delivery}
          express={config.express}
          dark={config.express}
        />
      </div>

      <div
        className={`relative z-10 mt-3 divide-y border-b transition-colors duration-300 ${
          config.express ? "divide-white/12 border-white/12" : "divide-line/70 border-line/70"
        }`}
      >
        {tier.expressFee !== null && (
          <PlanToggle
            id={`${tier.id}-express`}
            label={expressToggle.label}
            help={`${expressToggle.help} ${tier.delivery.express ?? ""}`.trim()}
            delta={`+${formatMxn(tier.expressFee)}`}
            checked={config.express}
            onChange={(previous) => setConfig((previousState) => ({ ...previousState, express: previous }))}
            dark={config.express}
          />
        )}

        {tier.allowsIa ? (
          <PlanToggle
            id={`${tier.id}-ia`}
            label={iaToggle.label}
            help={iaToggle.help}
            delta={`+${formatMxn(IA_SETUP)}`}
            checked={config.ia}
            onChange={(ia) => setConfig((previousState) => ({ ...previousState, ia }))}
            dark={config.express}
            tooltip={iaTooltip}
          />
        ) : (
          <UnavailableIa dark={config.express} />
        )}
      </div>

      <button
        type="button"
        onClick={(event) => onSelect(tier, config, event.currentTarget)}
        className={`relative z-10 mt-6 w-full rounded-[var(--radius-pill)] px-5 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] ${
          config.express
            ? "bg-[#a94932] text-white shadow-lg shadow-black/20 ring-1 ring-inset ring-[#f29a7e]/55 hover:bg-[#c45f44]"
            : tier.recommended
            ? "bg-accent text-white shadow-md hover:bg-accent-h hover:shadow-lg"
            : "border border-line text-foreground hover:border-accent hover:bg-accent-soft/30"
        }`}
      >
        {tier.ctaLabel}
      </button>
    </article>
  );
}

export function OrganizationPlanCard({
  tier,
  onSelect,
}: {
  tier: Tier;
  onSelect: SelectPlan;
}) {
  const [config, setConfig] = useState<PlanConfig>({ express: false, ia: false });

  return (
    <article className="rounded-[var(--radius-xl)] border border-line bg-surface p-6 shadow-sm sm:p-7">
      <div className="grid gap-7 xl:grid-cols-[1.3fr_0.85fr_0.72fr] xl:items-stretch">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            Para clínicas y grupos
          </p>
          <h3 className="mt-2 font-display text-3xl font-bold text-foreground">
            <DiaTextReveal
              text={tier.name}
              colors={["#A94932", "#D2674A", "#E2A33C", "#276C5B", "#E0617E"]}
              textColor="var(--color-foreground, var(--ink, #1E1B18))"
              duration={2.2}
              repeat={true}
              repeatDelay={4}
              startOnView={true}
              className="font-bold tracking-tight"
            />
          </h3>

          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{tier.tagline}</p>

          <ul className="mt-5 grid gap-x-6 gap-y-2.5 text-sm text-muted sm:grid-cols-2">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 leading-snug">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:border-l xl:border-line/70 xl:pl-7 [&>div:first-child]:mt-0">
          <PricePanel tier={tier} config={config} />
          <PlanDetails tier={tier} delivery={tier.delivery.base} express={false} />
        </div>

        <div className="flex flex-col xl:border-l xl:border-line/70 xl:pl-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-clinical">
            Configura tu propuesta
          </p>
          <div className="mt-3 border-y border-line/70">
            <PlanToggle
              id={`${tier.id}-ia`}
              label={iaToggle.label}
              help={iaToggle.help}
              delta={`+${formatMxn(IA_SETUP)}`}
              checked={config.ia}
              onChange={(ia) => setConfig((previous) => ({ ...previous, ia }))}
              tooltip={iaTooltip}
            />
          </div>

          <p className="mt-4 text-xs leading-relaxed text-clinical">
            Ajustamos sedes, especialistas e integraciones a tu operación real.
          </p>

          <button
            type="button"
            onClick={(event) => onSelect(tier, config, event.currentTarget)}
            className="mt-6 w-full rounded-[var(--radius-pill)] border border-line px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-accent hover:bg-accent-soft/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.98] xl:mt-auto"
          >
            {tier.ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
