import { describe, expect, it } from "vitest";
import { checkoutSchema } from "@/lib/checkout-schema";

const valid = {
  attemptId: "00000000-0000-4000-8000-000000000001",
  nombre: "Dra. María González",
  email: "maria@consultorio.mx",
  telefono: "+52 55 1234 5678",
  especialidad: "Dermatología",
  website: "",
  tierId: "deluxe" as const,
  express: true,
  ia: true,
};

describe("checkoutSchema", () => {
  it("normaliza el teléfono", () => {
    expect(checkoutSchema.parse(valid).telefono).toBe("+525512345678");
  });

  it("acepta espacios, guiones y paréntesis en el teléfono", () => {
    const parsed = checkoutSchema.parse({
      ...valid,
      telefono: "+52 (55) 1234-5678",
    });
    expect(parsed.telefono).toBe("+525512345678");
  });

  it("rechaza un monto enviado por el navegador", () => {
    const parsed = checkoutSchema.parse({ ...valid, deposit: 1 });
    expect("deposit" in parsed).toBe(false);
  });

  it("rechaza IA fuera de Deluxe", () => {
    const result = checkoutSchema.safeParse({ ...valid, tierId: "profesional" });
    expect(result.success).toBe(false);
  });

  it("rechaza el honeypot", () => {
    const result = checkoutSchema.safeParse({ ...valid, website: "spam" });
    expect(result.success).toBe(false);
  });
});
