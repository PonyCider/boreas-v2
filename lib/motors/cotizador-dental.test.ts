import { describe, expect, it } from "vitest";
import {
  TRATAMIENTOS,
  cotizadorLead,
  formatearPeso,
  formatearRango,
  tratamientoPorId,
} from "./cotizador-dental";

describe("Catálogo de tratamientos", () => {
  it("no repite ids", () => {
    const ids = TRATAMIENTOS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  // Un rango invertido publicaría un precio mínimo mayor al máximo: información
  // engañosa, no un bug cosmético.
  it.each(TRATAMIENTOS.map((t) => [t.id, t] as const))("%s tiene un rango válido", (_id, t) => {
    expect(t.min).toBeGreaterThan(0);
    expect(t.max).toBeGreaterThan(t.min);
  });

  it("todo tratamiento declara visitas y qué incluye", () => {
    for (const t of TRATAMIENTOS) {
      expect(t.visitas).not.toBe("");
      expect(t.incluye.length).toBeGreaterThan(0);
    }
  });

  it("cae al primer tratamiento si el id no existe", () => {
    expect(tratamientoPorId("no-existe")).toBe(TRATAMIENTOS[0]);
  });
});

describe("Formato de moneda", () => {
  it("no muestra centavos", () => {
    expect(formatearPeso(1500)).not.toContain(".");
  });

  it("separa el rango con guión largo", () => {
    expect(formatearRango(tratamientoPorId("limpieza"))).toContain("–");
  });
});

describe("Lead del cotizador", () => {
  const lead = cotizadorLead(tratamientoPorId("corona"));

  it("nombra el tratamiento y su rango", () => {
    expect(lead.titulo).toContain("corona");
    expect(lead.titulo).toContain("3,000");
  });

  // El especialista recibe contexto, no un formulario transcrito.
  it("no expone más de tres señales", () => {
    expect(lead.senales.length).toBeLessThanOrEqual(3);
  });
});
