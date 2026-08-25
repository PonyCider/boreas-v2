import type { TheaterMotorItem } from "@/content/motor-theater";
import { motorPanelId, motorTabId } from "./motor-band";
import { RegisteredMotorView } from "./motor-registry";

type MotorStageProps = {
  item: TheaterMotorItem;
};

export function MotorStage({ item }: MotorStageProps) {
  const viewKey = `${item.definition.motorId}@${item.definition.version}`;

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
          Motor actual montado sin modificar su flujo. Cambiar de segmento
          reinicia su estado.
        </p>
      </div>

      <div key={viewKey}>
        <RegisteredMotorView definition={item.definition} />
      </div>
    </section>
  );
}
