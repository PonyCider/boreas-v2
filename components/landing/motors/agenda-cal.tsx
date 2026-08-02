"use client";

import { useEffect, useState } from "react";
import { MotorShell } from "./motor-shell";
import { agendaMotor } from "@/content/motors";

/**
 * Embed directo de Cal.com por iframe — sin @calcom/embed-react: una etiqueta contra
 * una dependencia. El tema va fijo a `dark` porque la sección lo está: V4 no tiene
 * toggle global, cada SectionFrame declara el suyo.
 */
const EMBED_SRC = `${agendaMotor.calUrl}?embed=true&theme=dark&layout=month_view`;
const LOAD_TIMEOUT_MS = 8000;

export function AgendaCalMotor() {
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    if (state !== "loading") return;
    const timer = setTimeout(() => setState("failed"), LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <MotorShell
      badge={agendaMotor.badge}
      title={agendaMotor.title}
      description={agendaMotor.description}
      bullets={agendaMotor.bullets}
      lead={agendaMotor.lead}
      leadNote={agendaMotor.leadNote}
      footnote={agendaMotor.liveNote}
    >
      <div className="relative h-[680px] w-full sm:h-[720px]">
        {state === "failed" ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-[10px] border border-border bg-elevated p-8 text-center">
            <p className="max-w-sm text-[15px] leading-relaxed text-muted">
              El calendario no cargó. Puede ser tu conexión o una extensión que bloquea
              contenido de terceros.
            </p>
            <a
              href={agendaMotor.calUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-[999px] bg-accent px-5 py-2.5 text-sm font-medium text-white"
            >
              Abrir el calendario en una pestaña
            </a>
          </div>
        ) : (
          <>
            {state === "loading" ? (
              <p
                aria-live="polite"
                className="absolute inset-0 flex items-center justify-center rounded-[10px] border border-border bg-elevated text-sm text-clinical"
              >
                Cargando el calendario…
              </p>
            ) : null}
            <iframe
              src={EMBED_SRC}
              title="Calendario de Boreas — agenda una llamada"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setState("ready")}
              className="relative h-full w-full rounded-[10px] border border-line bg-surface"
            />
          </>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-clinical">
        Servicio operado por Cal.com —{" "}
        <a
          href={agendaMotor.calPrivacyUrl}
          target="_blank"
          rel="noreferrer"
          className="text-accent underline underline-offset-4"
        >
          su aviso de privacidad
        </a>
        .
      </p>
    </MotorShell>
  );
}
