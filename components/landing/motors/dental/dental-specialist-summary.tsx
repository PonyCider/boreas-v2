import { Building2, Check } from "lucide-react";
import type { SpecialistSummary } from "@/lib/motors/runtime/types";

type DentalSpecialistSummaryProps = {
  summary: SpecialistSummary;
  faceLabel: string;
  description: string;
  contactChannel?: string;
  demoCompleted: boolean;
};

export function DentalSpecialistSummary({
  summary,
  faceLabel,
  description,
  contactChannel,
  demoCompleted,
}: DentalSpecialistSummaryProps) {
  return (
    <article className="relative overflow-hidden rounded-[22px] border border-accent/30 bg-accent-soft p-5 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {faceLabel}
          </p>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted">{description}</p>
        </div>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-background/60 text-accent">
          <Building2 aria-hidden className="size-5" />
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-background/70 p-5 shadow-[0_16px_40px_-28px_rgb(0_0_0/0.8)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-clinical">
            Resumen estructurado
          </p>
          {demoCompleted ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-mint/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-mint">
              <Check aria-hidden className="size-3" /> Demo
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 font-display text-2xl leading-tight text-foreground">
          {summary.title}
        </h3>
        <dl className="mt-5 space-y-3">
          {summary.signals.map((signal) => {
            const [label, ...valueParts] = signal.split(": ");
            const value = valueParts.join(": ");
            return (
              <div key={signal} className="grid gap-1 border-b border-line pb-3 last:border-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
                <dt className="text-xs font-medium text-clinical">{value ? label : "Señal"}</dt>
                <dd className="text-sm leading-5 text-foreground">{value || label}</dd>
              </div>
            );
          })}
          {contactChannel ? (
            <div className="grid gap-1 border-b border-line pb-3 last:border-0 last:pb-0 sm:grid-cols-[8rem_1fr]">
              <dt className="text-xs font-medium text-clinical">Canal preferido</dt>
              <dd className="text-sm leading-5 text-foreground">{contactChannel}</dd>
            </div>
          ) : null}
        </dl>
        <p className="mt-5 border-t border-line pt-4 text-sm font-medium leading-6 text-foreground">
          {summary.nextStep}
        </p>
      </div>
    </article>
  );
}
