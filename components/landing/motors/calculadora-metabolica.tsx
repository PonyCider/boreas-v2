"use client";

import { useRef, useState } from "react";
import { MotorShell } from "./motor-shell";
import { nutricionMotor } from "@/content/motors";
import {
  CAMPOS,
  METABOLICA_POBLACION,
  METABOLICA_SOURCE,
  NIVELES_ACTIVIDAD,
  calcularMetabolica,
  metabolicaLead,
  validarCampo,
  type CampoId,
  type ResultadoMetabolico,
  type Sexo,
} from "@/lib/motors/metabolica";

const CAMPO_IDS: CampoId[] = ["edad", "peso", "estatura"];

export function CalculadoraMetabolicaMotor() {
  const [sexo, setSexo] = useState<Sexo>("mujer");
  const [actividad, setActividad] = useState(NIVELES_ACTIVIDAD[0].id);
  const [valores, setValores] = useState<Record<CampoId, string>>({
    edad: "",
    peso: "",
    estatura: "",
  });
  const [errores, setErrores] = useState<Partial<Record<CampoId, string>>>({});
  const [resultado, setResultado] = useState<ResultadoMetabolico | null>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    const nuevosErrores: Partial<Record<CampoId, string>> = {};
    for (const campo of CAMPO_IDS) {
      const error = validarCampo(campo, Number(valores[campo]));
      if (error) nuevosErrores[campo] = error;
    }
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setResultado(null);
      return;
    }

    setResultado(
      calcularMetabolica({
        sexo,
        edad: Number(valores.edad),
        peso: Number(valores.peso),
        estatura: Number(valores.estatura),
        actividad,
      })
    );
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <MotorShell
      {...nutricionMotor}
      lead={resultado ? metabolicaLead(resultado, actividad) : null}
      footnote={`${METABOLICA_SOURCE}. ${METABOLICA_POBLACION}`}
    >
      <form
        onSubmit={onSubmit}
        className="rounded-[10px] border border-line bg-elevated p-6 sm:p-8"
        noValidate
      >
        <fieldset>
          <legend className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
            Sexo biológico
          </legend>
          <div className="mt-3 flex gap-2">
            {(["mujer", "hombre"] as Sexo[]).map((opcion) => (
              <label
                key={opcion}
                className={`flex cursor-pointer items-center gap-2 rounded-[999px] border px-4 py-2 text-sm capitalize ${
                  sexo === opcion
                    ? "border-accent bg-accent-soft text-foreground"
                    : "border-border text-muted"
                }`}
              >
                <input
                  type="radio"
                  name="sexo"
                  value={opcion}
                  checked={sexo === opcion}
                  onChange={() => setSexo(opcion)}
                  className="sr-only"
                />
                {opcion}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {CAMPO_IDS.map((campo) => (
            <div key={campo}>
              <label
                htmlFor={`metabolica-${campo}`}
                className="block text-sm font-medium text-foreground"
              >
                {CAMPOS[campo].label}{" "}
                <span className="font-normal text-clinical">({CAMPOS[campo].unidad})</span>
              </label>
              <input
                id={`metabolica-${campo}`}
                type="number"
                inputMode="numeric"
                min={CAMPOS[campo].min}
                max={CAMPOS[campo].max}
                value={valores[campo]}
                aria-invalid={!!errores[campo]}
                aria-describedby={errores[campo] ? `metabolica-${campo}-error` : undefined}
                onChange={(event) =>
                  setValores((prev) => ({ ...prev, [campo]: event.target.value }))
                }
                className={`mt-2 w-full rounded-[10px] border bg-surface px-4 py-2.5 text-[15px] text-foreground outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                  errores[campo] ? "border-danger" : "border-border"
                }`}
              />
              {errores[campo] ? (
                <p id={`metabolica-${campo}-error`} className="mt-2 text-xs text-danger">
                  {errores[campo]}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <label
            htmlFor="metabolica-actividad"
            className="block text-sm font-medium text-foreground"
          >
            Nivel de actividad
          </label>
          <select
            id="metabolica-actividad"
            value={actividad}
            onChange={(event) => setActividad(event.target.value)}
            className="mt-2 w-full rounded-[10px] border border-border bg-surface px-4 py-2.5 text-[15px] text-foreground outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {NIVELES_ACTIVIDAD.map((nivel) => (
              <option key={nivel.id} value={nivel.id}>
                {nivel.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-6 rounded-[999px] bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Calcular
        </button>

        <div aria-live="polite">
          {resultado ? (
            <div className="mt-10">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
                Tu gasto estimado
              </p>
              <p
                ref={resultRef}
                tabIndex={-1}
                className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal leading-tight text-foreground outline-none"
              >
                {resultado.mantenimiento} kcal al día
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                En reposo tu cuerpo gasta {resultado.basal} kcal; el resto lo explica tu nivel de
                actividad. Es un punto de partida para armar un plan, no el plan.
              </p>
            </div>
          ) : null}
        </div>
      </form>
    </MotorShell>
  );
}
