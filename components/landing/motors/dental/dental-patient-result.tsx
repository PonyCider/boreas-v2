import { Check, Clock3 } from "lucide-react";
import type { RefObject } from "react";
import type {
  DentalPatientQuote,
  DentalTreatmentV2,
  DentalUnavailableResult,
} from "@/lib/motors/cotizador-dental-v2";

type DentalPatientResultProps = {
  result: DentalPatientQuote | DentalUnavailableResult;
  treatment?: DentalTreatmentV2;
  reviewedAt: string;
  faceLabel: string;
  onRequestContact: () => void;
  showContactCta: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}

export function DentalPatientResult({
  result,
  treatment,
  reviewedAt,
  faceLabel,
  onRequestContact,
  showContactCta,
  headingRef,
}: DentalPatientResultProps) {
  if (result.kind === "dental-quote-unavailable") {
    return (
      <article className="rounded-[22px] border border-border bg-background p-5 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {faceLabel}
        </p>
        <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-display text-3xl leading-tight text-foreground outline-none">
          {result.title}
        </h3>
        <p className="mt-4 text-sm leading-6 text-muted">{result.summary}</p>
        {result.disclaimer ? (
          <p className="mt-5 rounded-xl border border-amber/25 bg-amber/10 p-4 text-xs leading-5 text-foreground">
            {result.disclaimer}
          </p>
        ) : null}
        {showContactCta ? (
          <button type="button" className="btn btn-p mt-6 w-full" onClick={onRequestContact}>
            Solicitar valoración
          </button>
        ) : null}
      </article>
    );
  }

  return (
    <article className="relative overflow-hidden rounded-[22px] border border-border bg-background p-5 sm:p-7">
      <div aria-hidden className="absolute -right-16 -top-20 size-52 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {faceLabel}
        </p>
        <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-clinical">
          Inversión estimada
        </p>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="mt-2 font-display text-[clamp(2rem,5vw,3.5rem)] leading-none tracking-[-0.03em] text-foreground outline-none"
        >
          {result.quote.formattedRange}
        </h3>
        <div className="mt-4 flex items-center gap-2 text-sm text-muted">
          <Clock3 aria-hidden className="size-4 text-accent" />
          <span className="font-medium text-foreground">{result.quote.visits}</span>
          <span>estimadas</span>
        </div>

        <div className="mt-7 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clinical">
              Este rango incluye
            </p>
            <ul className="mt-3 space-y-2.5">
              {result.quote.inclusions.map((item) => (
                <li key={item} className="flex gap-2 text-sm leading-5 text-muted">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-mint" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clinical">
              El precio puede cambiar por
            </p>
            <ul className="mt-3 space-y-2.5">
              {result.quote.priceFactors.map((item) => (
                <li key={item} className="text-sm leading-5 text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {treatment?.note ? (
          <p className="mt-6 border-l-2 border-accent/50 pl-4 text-sm leading-6 text-muted">
            {treatment.note}
          </p>
        ) : null}

        <p className="mt-6 text-xs leading-5 text-clinical">
          Rango actualizado el {formatReviewDate(reviewedAt)}.
        </p>
        {result.disclaimer ? (
          <p className="mt-2 text-xs leading-5 text-clinical">{result.disclaimer}</p>
        ) : null}

        {showContactCta ? (
          <button type="button" className="btn btn-p mt-7 w-full" onClick={onRequestContact}>
            {result.ctaLabel}
          </button>
        ) : null}
      </div>
    </article>
  );
}
