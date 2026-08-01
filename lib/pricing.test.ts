// lib/pricing.test.ts
import { describe, it, expect } from "vitest";
import { getTier, IA_MONTHLY, IA_SETUP } from "@/content/pricing";
import { computePrice, formatMxn } from "@/lib/pricing";

const plain = { express: false, ia: false };

describe("computePrice", () => {
  it("devuelve el precio base sin toggles", () => {
    expect(computePrice(getTier("esencial"), plain)).toEqual({ setup: 12900, monthly: 590 });
    expect(computePrice(getTier("profesional"), plain)).toEqual({ setup: 19900, monthly: 890 });
    expect(computePrice(getTier("deluxe"), plain)).toEqual({ setup: 32900, monthly: 1490 });
  });

  it("Express suma el fee del paquete al setup y no toca la mensualidad", () => {
    expect(computePrice(getTier("esencial"), { express: true, ia: false })).toEqual({
      setup: 19900,
      monthly: 590,
    });
  });

  it("IA suma setup y mensualidad en Deluxe", () => {
    expect(computePrice(getTier("deluxe"), { express: false, ia: true })).toEqual({
      setup: 32900 + IA_SETUP,
      monthly: 1490 + IA_MONTHLY,
    });
  });

  it("IA se ignora en los paquetes que no la permiten", () => {
    expect(computePrice(getTier("esencial"), { express: false, ia: true })).toEqual({
      setup: 12900,
      monthly: 590,
    });
    expect(computePrice(getTier("profesional"), { express: false, ia: true })).toEqual({
      setup: 19900,
      monthly: 890,
    });
  });

  it("Organizaciones no tiene setup calculable", () => {
    const price = computePrice(getTier("organizaciones"), { express: true, ia: true });
    expect(price.setup).toBeNull();
    expect(price.monthly).toBe(2900 + IA_MONTHLY);
  });

  // Requisito del spec §4: el fee de Express es exactamente el salto al
  // siguiente paquete, para que subir de escalón sea la opción obvia.
  it("mantiene la escalera: paquete + Express cuesta lo mismo que el paquete de arriba", () => {
    const esencialExpress = computePrice(getTier("esencial"), { express: true, ia: false });
    const profesionalBase = computePrice(getTier("profesional"), plain);
    expect(esencialExpress.setup).toBe(profesionalBase.setup);

    const profesionalExpress = computePrice(getTier("profesional"), { express: true, ia: false });
    const deluxeBase = computePrice(getTier("deluxe"), plain);
    expect(profesionalExpress.setup).toBe(deluxeBase.setup);
  });
});

describe("formatMxn", () => {
  it("formatea con separador de miles y sin decimales", () => {
    expect(formatMxn(12900)).toBe("$12,900");
    expect(formatMxn(590)).toBe("$590");
  });
});
