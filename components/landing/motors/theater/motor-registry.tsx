"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { motorDefinitionKey } from "@/lib/motors/runtime/domain";
import type {
  MotorDefinition,
  MotorIdentity,
} from "@/lib/motors/runtime/types";

export type MotorViewProps = {
  definition: MotorDefinition;
};

type MotorViewEntry = {
  identity: MotorIdentity;
  View: ComponentType<MotorViewProps>;
};

function LoadingMotorView() {
  return (
    <p className="text-sm text-muted" role="status">
      Preparando el motor…
    </p>
  );
}

function loadLegacyMotor(
  loader: () => Promise<ComponentType>,
): ComponentType<MotorViewProps> {
  return dynamic<MotorViewProps>(
    () =>
      loader().then((LegacyView) => {
        function LegacyMotorAdapter() {
          return <LegacyView />;
        }

        return LegacyMotorAdapter;
      }),
    { loading: LoadingMotorView },
  );
}

const ContractDemoView = dynamic<MotorViewProps>(
  () =>
    import("./contract-demo-view").then((module) => module.ContractDemoView),
  { loading: LoadingMotorView },
);

const AgendaCalView = loadLegacyMotor(() =>
  import("../agenda-cal").then((module) => module.AgendaCalMotor),
);
const TamizajeGad7View = loadLegacyMotor(() =>
  import("../tamizaje-gad7").then((module) => module.TamizajeGad7Motor),
);
const CalculadoraMetabolicaView = loadLegacyMotor(() =>
  import("../calculadora-metabolica").then(
    (module) => module.CalculadoraMetabolicaMotor,
  ),
);
const EvaluadorDolorView = loadLegacyMotor(() =>
  import("../evaluador-dolor").then((module) => module.EvaluadorDolorMotor),
);
const PreTriageView = loadLegacyMotor(() =>
  import("../pre-triage").then((module) => module.PreTriageMotor),
);
const CotizadorDentalView = dynamic<MotorViewProps>(
  () =>
    import("../dental/dental-quote-experience").then(
      (module) => module.DentalQuoteExperience,
    ),
  { loading: LoadingMotorView },
);

function createMotorViewRegistry(entries: readonly MotorViewEntry[]) {
  const registry = new Map<string, ComponentType<MotorViewProps>>();

  for (const entry of entries) {
    const key = motorDefinitionKey(entry.identity);
    if (registry.has(key)) throw new Error(`MotorView duplicada: ${key}`);
    registry.set(key, entry.View);
  }

  return registry;
}

export const motorViewRegistry = createMotorViewRegistry([
  {
    identity: { motorId: "runtime-contract-demo", version: "1.0.0" },
    View: ContractDemoView,
  },
  {
    identity: { motorId: "agenda-cal", version: "1.0.0" },
    View: AgendaCalView,
  },
  {
    identity: { motorId: "tamizaje-gad7", version: "1.0.0" },
    View: TamizajeGad7View,
  },
  {
    identity: { motorId: "calculadora-metabolica", version: "1.0.0" },
    View: CalculadoraMetabolicaView,
  },
  {
    identity: { motorId: "evaluador-dolor", version: "1.0.0" },
    View: EvaluadorDolorView,
  },
  {
    identity: { motorId: "pre-triage", version: "1.0.0" },
    View: PreTriageView,
  },
  {
    identity: { motorId: "cotizador-dental", version: "2.0.0" },
    View: CotizadorDentalView,
  },
]);

export function resolveMotorView(
  definition: MotorDefinition,
): ComponentType<MotorViewProps> {
  const key = motorDefinitionKey(definition);
  const View = motorViewRegistry.get(key);
  if (!View) throw new Error(`No existe MotorView registrada para ${key}`);
  return View;
}

export function RegisteredMotorView({ definition }: MotorViewProps) {
  const key = motorDefinitionKey(definition);

  if (key === "runtime-contract-demo@1.0.0") {
    return <ContractDemoView definition={definition} />;
  }
  if (key === "agenda-cal@1.0.0") {
    return <AgendaCalView definition={definition} />;
  }
  if (key === "tamizaje-gad7@1.0.0") {
    return <TamizajeGad7View definition={definition} />;
  }
  if (key === "calculadora-metabolica@1.0.0") {
    return <CalculadoraMetabolicaView definition={definition} />;
  }
  if (key === "evaluador-dolor@1.0.0") {
    return <EvaluadorDolorView definition={definition} />;
  }
  if (key === "pre-triage@1.0.0") {
    return <PreTriageView definition={definition} />;
  }
  if (key === "cotizador-dental@2.0.0") {
    return <CotizadorDentalView definition={definition} />;
  }

  throw new Error(`No existe MotorView registrada para ${key}`);
}
