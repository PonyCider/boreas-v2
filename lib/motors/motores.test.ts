import { describe, expect, it } from "vitest";
import { DOLOR_BANDS, DOLOR_MAX_SCORE, DOLOR_QUESTIONS, dolorLead } from "./dolor";
import {
  TRIAGE_BANDS,
  TRIAGE_MAX_SCORE,
  TRIAGE_QUESTIONS,
  triageLead,
} from "./pre-triage";
import { calcularMetabolica, metabolicaLead, validarCampo } from "./metabolica";
import { bandForScore } from "./quiz";

describe("Evaluador de dolor", () => {
  it.each([
    [0, "manejable"],
    [4, "manejable"],
    [5, "atencion"],
    [9, "atencion"],
    [10, "prioritario"],
    [13, "prioritario"],
    [14, "medica"],
    [DOLOR_MAX_SCORE, "medica"],
  ])("puntaje %i cae en banda %s", (score, expected) => {
    expect(bandForScore(DOLOR_BANDS, score).id).toBe(expected);
  });

  // La bandera roja de esfínteres vale 12: sola no basta, pero con cualquier
  // otra respuesta que sume 2 ya cruza a valoración médica.
  it("la bandera roja neurológica domina el resultado", () => {
    const soloBandera = 12;
    expect(bandForScore(DOLOR_BANDS, soloBandera).id).toBe("prioritario");
    expect(bandForScore(DOLOR_BANDS, soloBandera + 2).crisis).toBe(true);
  });

  it("el lead no incluye las respuestas", () => {
    const lead = dolorLead(15);
    expect(lead.senales.join(" ")).toContain("banderas rojas");
    expect(JSON.stringify(lead)).not.toContain("orina");
  });

  it("tiene 4 preguntas", () => {
    expect(DOLOR_QUESTIONS).toHaveLength(4);
  });
});

describe("Pre-triage", () => {
  it.each([
    [0, "baja"],
    [4, "baja"],
    [5, "media"],
    [10, "media"],
    [11, "alta"],
    [TRIAGE_MAX_SCORE, "alta"],
  ])("puntaje %i cae en banda %s", (score, expected) => {
    expect(bandForScore(TRIAGE_BANDS, score).id).toBe(expected);
  });

  it("solo la banda alta activa el bloque de urgencia", () => {
    expect(bandForScore(TRIAGE_BANDS, 10).crisis).toBe(false);
    expect(bandForScore(TRIAGE_BANDS, 11).crisis).toBe(true);
    expect(triageLead(11).senales.join(" ")).toContain("911");
  });

  it("son 5 preguntas de 0 a 3", () => {
    expect(TRIAGE_QUESTIONS).toHaveLength(5);
    expect(TRIAGE_MAX_SCORE).toBe(15);
  });
});

describe("Calculadora metabólica", () => {
  // Caso de referencia Mifflin-St Jeor: hombre 30 años, 80 kg, 180 cm
  // 10*80 + 6.25*180 - 5*30 + 5 = 1780 kcal basales.
  it("calcula el basal de la ecuación", () => {
    const { basal } = calcularMetabolica({
      sexo: "hombre",
      edad: 30,
      peso: 80,
      estatura: 180,
      actividad: "sedentario",
    });
    expect(basal).toBe(1780);
  });

  // Mujer 30 años, 60 kg, 165 cm: 600 + 1031.25 - 150 - 161 = 1320.25 → 1320.
  it("usa la constante distinta por sexo", () => {
    const { basal } = calcularMetabolica({
      sexo: "mujer",
      edad: 30,
      peso: 60,
      estatura: 165,
      actividad: "sedentario",
    });
    expect(basal).toBe(1320);
  });

  it("aplica el factor de actividad y redondea a la decena", () => {
    const { mantenimiento } = calcularMetabolica({
      sexo: "hombre",
      edad: 30,
      peso: 80,
      estatura: 180,
      actividad: "moderado",
    });
    expect(mantenimiento).toBe(2760); // 1780 * 1.55 = 2759 → 2760
    expect(mantenimiento % 10).toBe(0);
  });

  it("rechaza valores fuera de rango y acepta los límites", () => {
    expect(validarCampo("edad", 17)).toContain("entre 18 y 90");
    expect(validarCampo("edad", 18)).toBeNull();
    expect(validarCampo("edad", 90)).toBeNull();
    expect(validarCampo("edad", 91)).toContain("entre 18 y 90");
    expect(validarCampo("peso", Number.NaN)).toContain("escribe un número");
    expect(validarCampo("estatura", 220)).toBeNull();
  });

  it("el lead lleva el número, no los datos corporales crudos", () => {
    const resultado = calcularMetabolica({
      sexo: "mujer",
      edad: 40,
      peso: 70,
      estatura: 160,
      actividad: "ligero",
    });
    const lead = metabolicaLead(resultado, "ligero");
    expect(lead.titulo).toContain(`${resultado.mantenimiento} kcal`);
    expect(JSON.stringify(lead)).not.toContain("70");
  });
});
