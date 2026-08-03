import { describe, expect, it } from "vitest";
import { GAD7_BANDS, GAD7_MAX_SCORE, GAD7_QUESTIONS, gad7Lead } from "./gad7";
import { bandForScore, scoreQuiz } from "./quiz";

const band = (score: number) => bandForScore(GAD7_BANDS, score).id;

describe("GAD-7", () => {
  it("son 7 ítems de 0 a 3", () => {
    expect(GAD7_QUESTIONS).toHaveLength(7);
    expect(GAD7_MAX_SCORE).toBe(21);
    expect(scoreQuiz([0, 1, 2, 3, 3, 2, 1])).toBe(12);
  });

  // Los cortes son clínicos: en t y en t-1, o la persona ve una categoría equivocada.
  it.each([
    [0, "minima"],
    [4, "minima"],
    [5, "leve"],
    [9, "leve"],
    [10, "moderada"],
    [14, "moderada"],
    [15, "severa"],
    [21, "severa"],
  ])("puntaje %i cae en banda %s", (score, expected) => {
    expect(band(score)).toBe(expected);
  });

  it("solo marca crisis en la banda severa", () => {
    expect(bandForScore(GAD7_BANDS, 14).crisis).toBe(false);
    expect(bandForScore(GAD7_BANDS, 15).crisis).toBe(true);
  });

  it("el lead lleva banda y puntaje, nunca las respuestas", () => {
    const lead = gad7Lead(16);
    expect(lead.titulo).toContain("Ansiedad severa");
    expect(lead.senales.join(" ")).toContain("16 de 21");
    expect(JSON.stringify(lead)).not.toContain("Casi todos los días");
  });
});
