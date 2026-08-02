import type { ReactNode } from "react";
import type { SpecialistLead } from "@/content/motors";

/**
 * Marco compartido por todos los motores: contexto a la izquierda, demo viva a la
 * derecha, y debajo la segunda cara — lo que le llega al especialista. Esa segunda
 * cara es la venta: el motor no es un juguete, es una máquina de citas.
 */
export function MotorShell({
  badge,
  title,
  description,
  bullets,
  lead,
  leadNote,
  footnote,
  upsell,
  children,
}: {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  /** `null` mientras el motor no haya producido resultado: la banda no se muestra. */
  lead: SpecialistLead | null;
  leadNote: string;
  footnote?: string;
  /** Los otros motores de la categoría: se mencionan, no se renderizan (spec §3). */
  upsell?: { intro: string; items: { nombre: string; que: string }[] };
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-surface">
      <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:p-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">{badge}</p>
          <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-normal leading-[1.15] tracking-[-0.01em] text-foreground">
            {title}
          </h3>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{description}</p>

          <ul className="mt-6 space-y-2.5">
            {bullets.map((bullet) => (
              <li
                key={bullet}
                className="relative pl-5 text-[15px] leading-relaxed text-muted before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-accent"
              >
                {bullet}
              </li>
            ))}
          </ul>

          {footnote ? <p className="mt-6 text-xs leading-relaxed text-clinical">{footnote}</p> : null}
        </div>

        <div className="min-w-0">{children}</div>
      </div>

      {lead ? (
        <div className="bg-elevated p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
                Lo que te llega a ti
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">
                El paciente ve su resultado. Tú recibes el contexto para llegar preparado.
              </p>
            </div>

            <div className="min-w-0 rounded-[10px] border border-dashed border-border bg-surface p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
                {leadNote}
              </p>
              <p className="mt-4 font-display text-lg font-normal leading-snug text-foreground">
                {lead.titulo}
              </p>
              <ul className="mt-4 space-y-2">
                {lead.senales.map((senal) => (
                  <li key={senal} className="text-sm leading-relaxed text-muted">
                    {senal}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-foreground">{lead.siguientePaso}</p>
            </div>
          </div>
        </div>
      ) : null}

      {upsell ? (
        <div className="bg-void px-6 py-6 sm:px-8 lg:px-10">
          <p className="text-[15px] leading-relaxed text-muted">{upsell.intro}</p>
          <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {upsell.items.map((item) => (
              <li key={item.nombre} className="text-sm leading-relaxed text-clinical">
                <span className="font-medium text-foreground">{item.nombre}</span> — {item.que}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
