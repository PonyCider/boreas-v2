import { describe, expect, it } from "vitest";
import {
  createMotorDomainRegistry,
  defineMotorDomain,
  evaluateMotorDomain,
  motorDefinitionKey,
} from "./domain";
import type { MotorDefinition } from "./types";

const definition: MotorDefinition = {
  motorId: "runtime-contract-demo",
  version: "1.0.0",
  family: "calculator",
  specialties: ["dental"],
  label: "Contrato demo",
  promise: "Demostrar la frontera portable.",
  capabilities: ["patient-result", "specialist-summary"],
  consent: {
    required: true,
    version: "demo-v1",
    purpose: "Demostrar el contrato sin enviar datos.",
  },
};

const domain = defineMotorDomain<{ amount: number }>({
  identity: { motorId: definition.motorId, version: definition.version },
  validate(input) {
    if (
      typeof input === "object" &&
      input !== null &&
      "amount" in input &&
      typeof input.amount === "number" &&
      input.amount > 0
    ) {
      return { valid: true, value: { amount: input.amount } };
    }

    return { valid: false, issues: ["amount debe ser mayor que cero"] };
  },
  evaluate(input) {
    return {
      patientResult: {
        kind: "demo-result",
        title: "Resultado de demostración",
        summary: `Cantidad validada: ${input.amount}`,
      },
      specialistSummary: {
        title: "Resumen sintético",
        signals: [`Cantidad: ${input.amount}`],
        nextStep: "Revisar el contexto antes de contactar.",
      },
    };
  },
});

describe("MotorDefinition", () => {
  it("es metadata serializable sin funciones ni referencias de UI", () => {
    expect(JSON.parse(JSON.stringify(definition))).toEqual(definition);
  });
});

describe("MotorDomainRegistry", () => {
  it("valida y deriva las dos caras sin montar React", () => {
    const registry = createMotorDomainRegistry([domain]);

    expect(
      evaluateMotorDomain(registry, definition, { amount: 12 }),
    ).toEqual({
      valid: true,
      outcome: {
        patientResult: {
          kind: "demo-result",
          title: "Resultado de demostración",
          summary: "Cantidad validada: 12",
        },
        specialistSummary: {
          title: "Resumen sintético",
          signals: ["Cantidad: 12"],
          nextStep: "Revisar el contexto antes de contactar.",
        },
      },
    });
  });

  it("devuelve issues y no inventa un resultado para entrada inválida", () => {
    const registry = createMotorDomainRegistry([domain]);

    expect(evaluateMotorDomain(registry, definition, { amount: 0 })).toEqual({
      valid: false,
      issues: ["amount debe ser mayor que cero"],
    });
  });

  it("rechaza IDs y versiones duplicados", () => {
    expect(() => createMotorDomainRegistry([domain, domain])).toThrow(
      motorDefinitionKey(definition),
    );
  });
});
