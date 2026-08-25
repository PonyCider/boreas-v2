import { describe, expect, it, vi } from "vitest";
import { DemoMotorLeadTransport } from "./demo-transport";
import type { LeadSubmission } from "./types";

const submission: LeadSubmission = {
  submissionId: "submission-demo-1",
  motorId: "runtime-contract-demo",
  motorVersion: "1.0.0",
  contact: {
    name: "Paciente de demostración",
    channel: "email",
    value: "demo@example.invalid",
  },
  specialistSummary: {
    title: "Resumen sintético",
    signals: ["Interés simulado"],
    nextStep: "Ejemplo: ofrecer una valoración.",
  },
  consent: {
    version: "demo-v1",
    acceptedAt: "2026-08-24T00:00:00.000Z",
    purpose: "Demostrar el contrato sin enviar datos.",
  },
};

describe("DemoMotorLeadTransport", () => {
  it("no usa red ni almacenamiento y nunca devuelve confirmado", async () => {
    const fetchMock = vi.fn();
    const setItem = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { setItem });

    const result = await new DemoMotorLeadTransport().submitLead(submission);

    expect(result).toEqual({
      status: "demo-completada",
      submissionId: submission.submissionId,
      message: "Demostración completada. Ningún consultorio recibió estos datos.",
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
