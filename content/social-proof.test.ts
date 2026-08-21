import { describe, expect, it } from "vitest";

import { socialProofCases, socialProofHeading } from "./social-proof";

const dentalSpecialties = new Set([
  "odontologia-integral",
  "implantologia",
  "ortodoncia",
  "odontopediatria",
]);

const promotionalMetricPattern = /(?:\+\s*\d|\d+(?:[.,]\d+)?\s*(?:%|×|x|estrellas?|pacientes?|citas?))/i;

describe("Prueba social", () => {
  it("publica exactamente ocho casos con ids e índices únicos", () => {
    expect(socialProofCases).toHaveLength(8);
    expect(new Set(socialProofCases.map(({ id }) => id)).size).toBe(8);
    expect(new Set(socialProofCases.map(({ index }) => index)).size).toBe(8);
  });

  it("equilibra cuatro casos por carril", () => {
    expect(socialProofCases.filter(({ lane }) => lane === "primary")).toHaveLength(4);
    expect(socialProofCases.filter(({ lane }) => lane === "secondary")).toHaveLength(4);
  });

  it("mantiene cuatro casos dentales y cuatro de otras especialidades", () => {
    const dentalCases = socialProofCases.filter(({ specialty }) => dentalSpecialties.has(specialty));
    expect(dentalCases).toHaveLength(4);
    expect(socialProofCases.length - dentalCases.length).toBe(4);
  });

  it("declara contenido completo y citas de 16 a 32 palabras", () => {
    for (const item of socialProofCases) {
      expect(item.quote.trim()).not.toBe("");
      expect(item.project.trim()).not.toBe("");
      expect(item.role.trim()).not.toBe("");
      expect(item.qualitySignals.every((signal) => signal.trim() !== "")).toBe(true);

      const wordCount = item.quote.trim().split(/\s+/).length;
      expect(wordCount).toBeGreaterThanOrEqual(16);
      expect(wordCount).toBeLessThanOrEqual(32);
    }
  });

  it("no fabrica métricas promocionales", () => {
    for (const item of socialProofCases) {
      expect(item.quote).not.toMatch(promotionalMetricPattern);
      expect(item.project).not.toMatch(promotionalMetricPattern);
      expect(item.qualitySignals.join(" ")).not.toMatch(promotionalMetricPattern);
    }
  });

  it("declara que los casos son representativos y no identificables", () => {
    expect(socialProofHeading.disclosure).toContain("Escenarios representativos");
    expect(socialProofHeading.disclosure).toContain("No corresponden a testimonios");
  });
});
