import { describe, expect, it } from "vitest";
import {
  createInitialMotorState,
  transitionMotorState,
} from "./state";
import type {
  LeadSubmission,
  MotorDefinition,
  PatientResult,
  SpecialistSummary,
} from "./types";

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

const patientResult: PatientResult = {
  kind: "demo-result",
  title: "Resultado de demostración",
  summary: "El paciente recibe claridad antes del contacto.",
};

const specialistSummary: SpecialistSummary = {
  title: "Resumen sintético",
  signals: ["Interés simulado"],
  nextStep: "Ejemplo: ofrecer una valoración.",
};

const submission: LeadSubmission = {
  submissionId: "submission-demo-1",
  motorId: definition.motorId,
  motorVersion: definition.version,
  contact: {
    name: "Paciente de demostración",
    channel: "email",
    value: "demo@example.invalid",
  },
  specialistSummary,
  consent: {
    version: "demo-v1",
    acceptedAt: "2026-08-24T00:00:00.000Z",
    purpose: "Demostrar el contrato sin enviar datos.",
  },
};

function stateWithResult() {
  const started = transitionMotorState(createInitialMotorState(definition), {
    type: "START",
  });

  return transitionMotorState(started, {
    type: "RESULT_READY",
    patientResult,
    specialistSummary,
  });
}

describe("MotorRuntimeState", () => {
  it("obliga a entregar resultado antes de solicitar contacto", () => {
    const initial = createInitialMotorState(definition);
    const capture = transitionMotorState(initial, { type: "START" });

    expect(() =>
      transitionMotorState(capture, { type: "REQUEST_CONTACT" }),
    ).toThrow(/captura.*REQUEST_CONTACT/i);

    const result = transitionMotorState(capture, {
      type: "RESULT_READY",
      patientResult,
      specialistSummary,
    });
    const contact = transitionMotorState(result, { type: "REQUEST_CONTACT" });

    expect(result.status).toBe("resultado-paciente");
    expect(contact.status).toBe("contacto");
  });

  it("conserva las dos caras cuando el envío falla", () => {
    const contact = transitionMotorState(stateWithResult(), {
      type: "REQUEST_CONTACT",
    });
    const sending = transitionMotorState(contact, {
      type: "SUBMIT",
      submission,
    });
    const failed = transitionMotorState(sending, {
      type: "SUBMIT_FAILED",
      message: "Red no disponible",
    });

    expect(failed).toMatchObject({
      status: "error-recuperable",
      patientResult,
      specialistSummary,
      submission,
      message: "Red no disponible",
    });
  });

  it("impide que un estado urgente avance al CTA comercial", () => {
    const capture = transitionMotorState(createInitialMotorState(definition), {
      type: "START",
    });
    const urgent = transitionMotorState(capture, {
      type: "URGENT_RESULT",
      patientResult: {
        ...patientResult,
        kind: "urgent-guidance",
        title: "Atención prioritaria",
      },
      resources: ["Llama a servicios de emergencia de tu localidad."],
    });

    expect(urgent.status).toBe("urgente");
    expect(() =>
      transitionMotorState(urgent, { type: "REQUEST_CONTACT" }),
    ).toThrow(/urgente.*REQUEST_CONTACT/i);
  });

  it("una configuración inválida nunca produce resultado", () => {
    const invalid = transitionMotorState(createInitialMotorState(definition), {
      type: "CONFIG_INVALID",
      reason: "Falta una regla requerida",
    });

    expect(invalid.status).toBe("configuración-inválida");
    expect(() =>
      transitionMotorState(invalid, {
        type: "RESULT_READY",
        patientResult,
        specialistSummary,
      }),
    ).toThrow(/configuración-inválida.*RESULT_READY/i);
  });

  it("completa una demo sin afirmar que el consultorio confirmó", () => {
    const contact = transitionMotorState(stateWithResult(), {
      type: "REQUEST_CONTACT",
    });
    const sending = transitionMotorState(contact, {
      type: "SUBMIT",
      submission,
    });
    const completed = transitionMotorState(sending, {
      type: "DEMO_COMPLETED",
      message: "Ningún consultorio recibió estos datos.",
    });

    expect(completed).toMatchObject({
      status: "demo-completada",
      message: "Ningún consultorio recibió estos datos.",
    });
  });
});
