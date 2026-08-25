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

const ContractDemoView = dynamic(
  () =>
    import("./contract-demo-view").then((module) => module.ContractDemoView),
  {
    loading: () => (
      <p className="text-sm text-muted" role="status">
        Preparando el runtime aislado…
      </p>
    ),
  },
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
]);

export function resolveMotorView(
  definition: MotorDefinition,
): ComponentType<MotorViewProps> {
  const key = motorDefinitionKey(definition);
  const View = motorViewRegistry.get(key);
  if (!View) throw new Error(`No existe MotorView registrada para ${key}`);
  return View;
}
