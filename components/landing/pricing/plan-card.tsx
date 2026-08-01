// components/landing/pricing/plan-card.tsx
"use client";

import { useState } from "react";
import type { Tier } from "@/content/pricing";
import {
  expressToggle,
  garantiaTooltip,
  iaToggle,
  IA_SETUP,
  mensualidadTooltip,
} from "@/content/pricing";
import { computePrice, formatMxn, type PlanConfig } from "@/lib/pricing";
import { InfoTooltip } from "./info-tooltip";
import { PlanToggle } from "./plan-toggle";

export function PlanCard({
  tier,
  onSelect,
}: {
  tier: Tier;
  onSelect: (tier: Tier, config: PlanConfig) => void;
}) {
  const [config, setConfig] = useState<PlanConfig>({ express: false, ia: false });
  const price = computePrice(tier, config);

  const delivery =
    config.express && tier.delivery.express ? tier.delivery.express : tier.delivery.base;

  return (
    <article
      className={`flex flex-col rounded-[var(--radius-xl)] border bg-surface p-6 ${
        tier.recommended ? "border-accent" : "border-line"
      }`}
    >
      {tier.recommended && (
        <p className="mb-4 inline-flex self-start rounded-[999px] bg-accent-soft px-3 py-1 text-xs font-medium text-foreground">
          El que recomendamos
        </p>
      )}

      <h3 className="font-display text-2xl font-normal text-foreground">{tier.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{tier.tagline}</p>

      {/* aria-live: al mover un toggle, el lector anuncia el precio nuevo. */}
      <div className="mt-6 border-t border-line pt-6" aria-live="polite">
        <p className="text-3xl font-display text-foreground">
          {price.setup === null ? "Cotización" : formatMxn(price.setup)}
        </p>
        <p className="text-xs text-clinical">Pago único</p>

        <p className="mt-3 flex items-center gap-2 text-lg text-foreground">
          {tier.monthlyIsFrom ? `desde ${formatMxn(price.monthly)}` : formatMxn(price.monthly)}
          <span className="text-sm text-clinical">al mes</span>
          <InfoTooltip
            summary={mensualidadTooltip.summary}
            paragraphs={mensualidadTooltip.paragraphs}
          />
        </p>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-muted">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span aria-hidden="true" className="text-accent">
              ·
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-1 border-t border-line pt-4 text-sm text-clinical">
        <div className="flex justify-between gap-4">
          <dt>Entrega</dt>
          <dd className="text-foreground">{delivery}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Revisiones</dt>
          <dd className="text-foreground">{tier.revisions}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2">
            Garantía
            <InfoTooltip
              summary={garantiaTooltip.summary}
              paragraphs={garantiaTooltip.paragraphs}
            />
          </dt>
          <dd className="text-foreground">{tier.warranty}</dd>
        </div>
      </dl>

      <div className="mt-6 space-y-4">
        {tier.expressFee !== null && (
          <PlanToggle
            id={`${tier.id}-express`}
            label={expressToggle.label}
            help={`${expressToggle.help} ${tier.delivery.express ?? ""}`.trim()}
            delta={`+${formatMxn(tier.expressFee)}`}
            checked={config.express}
            onChange={(express) => setConfig((prev) => ({ ...prev, express }))}
          />
        )}

        {tier.allowsIa ? (
          <PlanToggle
            id={`${tier.id}-ia`}
            label={iaToggle.label}
            help={iaToggle.help}
            delta={`+${formatMxn(IA_SETUP)}`}
            checked={config.ia}
            onChange={(ia) => setConfig((prev) => ({ ...prev, ia }))}
          />
        ) : (
          // Fila estática en vez de un input deshabilitado: un control sin foco
          // deja fuera a los lectores de pantalla. Ver nota de la Task 4.
          <div className="border-t border-line pt-4 text-sm text-clinical">
            <span className="font-medium">{iaToggle.label}</span>
            <span className="mt-1 block">{iaToggle.unavailable}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelect(tier, config)}
        className={`mt-8 w-full rounded-[var(--radius-pill)] px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          tier.recommended
            ? "bg-accent text-[var(--bg-surface)] hover:opacity-90"
            : "border border-line text-foreground hover:border-accent"
        }`}
      >
        {tier.ctaLabel}
      </button>
    </article>
  );
}
