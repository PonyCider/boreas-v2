"use client";

import { useRef, useState } from "react";
import { MOTOR_PANEL, MotorShell } from "./motor-shell";
import { dentalMotor } from "@/content/motors";
import {
  COTIZADOR_FUENTE,
  TRATAMIENTOS,
  cotizadorLead,
  formatearPeso,
  tratamientoPorId,
} from "@/lib/motors/cotizador-dental";

/**
 * Cotizador dental. Un tratamiento a la vez a propósito: un total sumado espanta al
 * paciente antes de que hable con nadie, que es justo lo contrario de lo que hace el motor.
 *
 * Los tratamientos van como radios nativos escondidos dentro de labels para heredar gratis
 * la navegación con flechas y el estado de grupo que un `<button aria-pressed>` no da.
 */
export function CotizadorDentalMotor() {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);

  const tratamiento = seleccion ? tratamientoPorId(seleccion) : null;

  function elegir(id: string) {
    setSeleccion(id);
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <MotorShell
      {...dentalMotor}
      lead={tratamiento ? cotizadorLead(tratamiento) : null}
      footnote={COTIZADOR_FUENTE}
    >
      <div className={MOTOR_PANEL}>
        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
            ¿Qué necesitas?
          </legend>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {TRATAMIENTOS.map((item) => {
              const activo = seleccion === item.id;
              return (
                <label
                  key={item.id}
                  className={`group flex cursor-pointer flex-col gap-0.5 rounded-[10px] px-4 py-3 transition-colors duration-150 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                    activo
                      ? "bg-accent-soft ring-1 ring-accent"
                      : "bg-surface ring-1 ring-transparent hover:bg-void"
                  }`}
                >
                  <input
                    type="radio"
                    name="tratamiento"
                    value={item.id}
                    checked={activo}
                    onChange={() => elegir(item.id)}
                    className="sr-only"
                  />
                  <span
                    className={`text-[15px] leading-snug ${
                      activo ? "font-medium text-foreground" : "text-foreground"
                    }`}
                  >
                    {item.nombre}
                  </span>
                  <span className="text-xs leading-snug text-clinical">{item.motivo}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div aria-live="polite">
          {tratamiento ? (
            <div className="mt-8">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
                Rango estimado
              </p>
              <p
                ref={resultRef}
                tabIndex={-1}
                className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal leading-tight tracking-[-0.01em] text-foreground outline-none"
              >
                {formatearPeso(tratamiento.min)}
                <span className="text-clinical"> – </span>
                {formatearPeso(tratamiento.max)}
              </p>

              <p className="mt-3 text-[15px] text-muted">
                <span className="text-foreground">{tratamiento.visitas}</span> · precio de
                referencia, no cotización
              </p>

              <ul className="mt-5 space-y-2">
                {tratamiento.incluye.map((punto) => (
                  <li
                    key={punto}
                    className="relative pl-5 text-sm leading-relaxed text-muted before:absolute before:left-0 before:top-[0.55em] before:h-1 before:w-1 before:rounded-full before:bg-accent"
                  >
                    {punto}
                  </li>
                ))}
              </ul>

              {tratamiento.nota ? (
                <p className="mt-5 text-sm leading-relaxed text-clinical">{tratamiento.nota}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </MotorShell>
  );
}
