import type { TheaterMotorItem } from "@/content/motor-theater";
import { motorPanelId, motorTabId } from "./motor-band";
import { RegisteredMotorView } from "./motor-registry";

type MotorStageProps = {
  item: TheaterMotorItem;
  mode?: "preview" | "production";
};

export function MotorStagePlaceholder({ item }: { item: TheaterMotorItem }) {
  return (
    <section
      id={motorPanelId(item.id)}
      role="tabpanel"
      aria-labelledby={motorTabId(item.id)}
      className="mt-8 min-h-[34rem] rounded-[28px] border border-border bg-surface p-6 sm:p-9"
    >
      <p className="text-sm text-muted" role="status">
        Preparando la experiencia interactiva…
      </p>
    </section>
  );
}

export function MotorStage({ item, mode = "preview" }: MotorStageProps) {
  const viewKey = `${item.definition.motorId}@${item.definition.version}`;
  const isDentalV2 = viewKey === "cotizador-dental@2.0.0";

  return (
    <section
      id={motorPanelId(item.id)}
      role="tabpanel"
      aria-labelledby={motorTabId(item.id)}
      tabIndex={0}
      className="mt-8 min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Motor {item.position}
          </p>
          <h2 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">
            {item.motor}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-muted">
          {isDentalV2
            ? mode === "preview"
              ? "Referencia portable. El resultado aparece antes del contacto y el demo no envía datos."
              : "Obtén un rango orientativo antes de decidir si quieres iniciar una conversación."
            : mode === "preview"
              ? "Motor actual montado sin modificar su flujo. Cambiar de segmento reinicia su estado."
              : "Completa el recorrido y recibe orientación antes de iniciar una conversación."}
        </p>
      </div>

      <div key={viewKey}>
        <RegisteredMotorView definition={item.definition} />
      </div>
    </section>
  );
}
