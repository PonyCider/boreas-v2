"use client";

import { useId, useState } from "react";
import { MOTOR_PANEL, MotorShell } from "./motor-shell";
import { Slider } from "@/components/ui/slider";
import { simuladorSonrisaMotor } from "@/content/motors";

/**
 * Simulador de sonrisa 100% procedural: SVG generado con dos controles, sin fotos de
 * pacientes. Evita derechos de imagen y datos sensibles de terceros (spec, "Fuera de
 * alcance"), y el aviso de que es una proyección vive junto a los controles — no al
 * final — porque el momento de la promesa implícita es mientras la persona lo mueve.
 */

/** Desalineación base de cada diente: rotación y desplazamiento vertical en el estado 0. */
const DIENTES = [
  { x: 12, ancho: 15, alto: 30, rot: -7, dy: 3 },
  { x: 29, ancho: 17, alto: 34, rot: 5, dy: -2 },
  { x: 48, ancho: 18, alto: 36, rot: -3, dy: 4 },
  { x: 68, ancho: 18, alto: 36, rot: 6, dy: -3 },
  { x: 88, ancho: 17, alto: 34, rot: -5, dy: 2 },
  { x: 107, ancho: 15, alto: 30, rot: 8, dy: 3 },
];

/** Del marfil apagado al blanco de consultorio. */
function tonoColor(tono: number) {
  const from = { h: 42, s: 34, l: 74 };
  const to = { h: 45, s: 32, l: 96 };
  const mix = tono / 100;
  return `hsl(${from.h + (to.h - from.h) * mix} ${from.s + (to.s - from.s) * mix}% ${
    from.l + (to.l - from.l) * mix
  }%)`;
}

export function SimuladorSonrisaMotor() {
  const [alineacion, setAlineacion] = useState(0);
  const [tono, setTono] = useState(0);
  const alineacionId = useId();
  const tonoId = useId();

  // 100 = alineado perfecto: la rotación y el desfase tienden a cero.
  const factor = 1 - alineacion / 100;
  const tocado = alineacion > 0 || tono > 0;

  return (
    <MotorShell
      {...simuladorSonrisaMotor}
      lead={tocado ? simuladorSonrisaMotor.lead : null}
      footnote={simuladorSonrisaMotor.disclaimer}
    >
      <div className={MOTOR_PANEL}>
        <svg
          viewBox="0 0 134 60"
          role="img"
          aria-label={`Sonrisa simulada con ${alineacion}% de alineación y ${tono}% de aclarado`}
          className="mx-auto h-auto w-full max-w-md"
        >
          <rect x="0" y="0" width="134" height="60" rx="6" fill="var(--bg-void)" />
          {DIENTES.map((diente) => {
            const cx = diente.x + diente.ancho / 2;
            const cy = 14 + diente.alto / 2 + diente.dy * factor;
            return (
              <rect
                key={diente.x}
                x={diente.x}
                y={14 + diente.dy * factor}
                width={diente.ancho}
                height={diente.alto}
                rx={4}
                fill={tonoColor(tono)}
                stroke="rgba(30,27,24,0.14)"
                strokeWidth={0.6}
                transform={`rotate(${diente.rot * factor} ${cx} ${cy})`}
                style={{ transition: "fill 200ms linear, transform 200ms linear" }}
              />
            );
          })}
        </svg>

        <p className="mt-4 text-xs leading-relaxed text-clinical">{simuladorSonrisaMotor.disclaimer}</p>

        <div className="mt-6 space-y-5">
          <div>
            <p id={alineacionId} className="flex justify-between text-sm text-foreground">
              <span>Alineación</span>
              <span className="text-clinical">{alineacion}%</span>
            </p>
            <Slider
              thumbLabel="Alineación"
              aria-describedby={alineacionId}
              min={0}
              max={100}
              step={1}
              value={[alineacion]}
              onValueChange={([valor]) => setAlineacion(valor)}
              className="mt-3"
            />
          </div>

          <div>
            <p id={tonoId} className="flex justify-between text-sm text-foreground">
              <span>Tono</span>
              <span className="text-clinical">{tono}%</span>
            </p>
            <Slider
              thumbLabel="Tono"
              aria-describedby={tonoId}
              min={0}
              max={100}
              step={1}
              value={[tono]}
              onValueChange={([valor]) => setTono(valor)}
              className="mt-3"
            />
          </div>
        </div>
      </div>
    </MotorShell>
  );
}
