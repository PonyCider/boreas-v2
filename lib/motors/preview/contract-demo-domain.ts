import {
  createMotorDomainRegistry,
  defineMotorDomain,
} from "@/lib/motors/runtime/domain";
import { runtimeContractDemoDefinition } from "@/content/motor-theater";

type ContractDemoInput = {
  intent: "valuation";
};

const contractDemoDomain = defineMotorDomain<ContractDemoInput>({
  identity: {
    motorId: runtimeContractDemoDefinition.motorId,
    version: runtimeContractDemoDefinition.version,
  },
  validate(input) {
    if (
      typeof input === "object" &&
      input !== null &&
      "intent" in input &&
      input.intent === "valuation"
    ) {
      return { valid: true, value: { intent: "valuation" } };
    }

    return {
      valid: false,
      issues: ["La fixture no contiene una intención reconocida."],
    };
  },
  evaluate() {
    return {
      patientResult: {
        kind: "contract-demo",
        title: "Tu resultado aparece primero",
        summary:
          "Esta salida es sintética. Demuestra que el motor entrega claridad antes de solicitar contacto.",
        disclaimer: "No es una cotización ni fue calculada con datos de una persona.",
      },
      specialistSummary: {
        title: "El especialista recibe contexto, no respuestas crudas",
        signals: [
          "Interés sintético en una valoración",
          "Resultado mostrado antes del contacto",
          "Sin respuestas clínicas ni datos personales",
        ],
        nextStep: "Ejemplo: revisar el resumen antes de ofrecer una valoración.",
      },
    };
  },
});

export const contractDemoDomainRegistry = createMotorDomainRegistry([
  contractDemoDomain,
]);
