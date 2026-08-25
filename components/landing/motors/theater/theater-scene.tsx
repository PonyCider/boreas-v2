import { ArrowDown, Check, CircleUserRound, Clock3 } from "lucide-react";
import type { ConversionTheaterAct } from "@/content/motor-theater";

type TheaterSceneProps = {
  act: ConversionTheaterAct;
  actIndex: number;
  compact?: boolean;
};

const signals = [
  "¿Cuánto me va a costar?",
  "¿Cuántas citas necesito?",
  "¿Qué incluye?",
] as const;

function SceneVisit() {
  return (
    <div className="grid min-h-[25rem] place-items-center p-5 sm:p-8">
      <div className="w-full max-w-lg">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-accent/30 bg-accent-soft text-accent">
          <CircleUserRound aria-hidden className="size-9" />
        </div>
        <p className="mt-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-clinical">
          Visita anónima
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {signals.map((signal) => (
            <div key={signal} className="rounded-2xl border border-dashed border-border bg-elevated p-4 text-center text-sm leading-5 text-muted">
              {signal}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center font-display text-2xl text-foreground">
          La intención existe. Todavía está dispersa.
        </p>
      </div>
    </div>
  );
}

function SceneMotor() {
  return (
    <div className="min-h-[25rem] p-5 sm:p-8">
      <div className="rounded-[22px] border border-border bg-elevated p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Tratamiento seleccionado</p>
            <h4 className="mt-2 font-display text-3xl text-foreground">Resina dental</h4>
          </div>
          <span className="rounded-full border border-accent/25 bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent">Motor V2</span>
        </div>
        <div className="mt-7 space-y-3">
          {[
            ["Rango", "$1,200 – $2,500"],
            ["Visitas", "1 cita"],
            ["Incluye", "Anestesia, retiro de caries y resina"],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 rounded-xl border border-border bg-background p-4 sm:grid-cols-[7rem_1fr] sm:items-center">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-clinical">{label}</span>
              <span className="text-sm font-medium leading-5 text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 border-l-2 border-accent pl-4 text-sm leading-6 text-muted">
          Reglas revisadas por el consultorio. Sin inventar diagnósticos ni precios.
        </p>
      </div>
    </div>
  );
}

function SceneFaces() {
  return (
    <div className="grid min-h-[25rem] gap-3 p-4 sm:p-6 lg:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-[20px] border border-border bg-background p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-accent">Lo que ve el paciente</p>
        <p className="mt-5 text-xs uppercase tracking-[0.13em] text-clinical">Rango estimado</p>
        <p className="mt-2 font-display text-3xl leading-none text-foreground">$1,200 – $2,500</p>
        <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted"><Clock3 aria-hidden className="size-4 text-accent" /> 1 cita estimada</p>
        <ul className="mt-6 space-y-2 text-sm text-muted">
          {["Anestesia local", "Retiro de caries", "Resina del color del diente"].map((item) => (
            <li key={item} className="flex gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-mint" />{item}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-[20px] border border-accent/30 bg-accent-soft p-5">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-accent">Esto recibe el consultorio</p>
        <p className="mt-5 font-display text-2xl text-foreground">Interés en resina dental</p>
        <dl className="mt-5 space-y-3">
          {[
            ["Rango visto", "$1,200 – $2,500"],
            ["Prioridad", "Entender el precio"],
            ["Horizonte", "Este mes"],
          ].map(([label, value]) => (
            <div key={label} className="border-b border-line pb-3 last:border-0">
              <dt className="text-xs text-clinical">{label}</dt>
              <dd className="mt-1 text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-sm font-medium leading-6 text-foreground">Ofrecer una valoración con el contexto ya preparado.</p>
      </div>
    </div>
  );
}

function SceneControl() {
  return (
    <div className="grid min-h-[25rem] place-items-center p-5 sm:p-8">
      <div className="w-full max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">La escena queda viva</p>
        <h4 className="mt-4 font-display text-4xl leading-tight text-foreground">El paciente puede continuar.</h4>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted">La banda conserva seis especialidades. El cotizador dental completo aparece justo después de este recorrido.</p>
        <div className="mt-7 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {["Agenda", "Mental", "Nutrición", "Fisio", "Medicina", "Dental"].map((item, index) => (
            <span key={item} className={`rounded-xl border px-2 py-3 text-[0.68rem] font-medium ${index === 5 ? "border-accent bg-accent-soft text-accent" : "border-border bg-elevated text-muted"}`}>{item}</span>
          ))}
        </div>
        <span className="btn btn-p pointer-events-none mt-8 gap-2">Probar el motor <ArrowDown aria-hidden className="size-4" /></span>
      </div>
    </div>
  );
}

export function TheaterScene({ act, actIndex, compact = false }: TheaterSceneProps) {
  return (
    <div
      aria-hidden="true"
      data-theater-scene={actIndex}
      className={`overflow-hidden rounded-[28px] border border-white/12 bg-surface shadow-[0_30px_100px_-45px_rgb(0_0_0/0.95)] ${compact ? "mt-4" : ""}`}
    >
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Escena {act.position}</span>
        <span className="text-xs text-clinical">{act.eyebrow}</span>
      </div>
      <div key={act.id}>
        {actIndex === 0 ? <SceneVisit /> : null}
        {actIndex === 1 ? <SceneMotor /> : null}
        {actIndex === 2 ? <SceneFaces /> : null}
        {actIndex === 3 ? <SceneControl /> : null}
      </div>
    </div>
  );
}
