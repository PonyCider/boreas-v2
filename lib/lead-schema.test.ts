import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/lead-schema";

const valid = {
  nombre: "Ana Ruiz",
  email: "ana@consultorio.mx",
  telefono: "5512345678",
  especialidad: "Psicología",
  mensaje: "",
  paquete: "profesional",
  express: false,
  ia: false,
  website: "",
};

describe("leadSchema", () => {
  it("acepta un lead válido", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza email inválido", () => {
    expect(leadSchema.safeParse({ ...valid, email: "ana@" }).success).toBe(false);
  });

  it("rechaza teléfono que no tenga 10 dígitos", () => {
    expect(leadSchema.safeParse({ ...valid, telefono: "551234" }).success).toBe(false);
  });

  it("acepta teléfono con espacios y guiones", () => {
    const parsed = leadSchema.safeParse({ ...valid, telefono: "55 1234-5678" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.telefono).toBe("5512345678");
  });

  it("rechaza un paquete que no existe", () => {
    expect(leadSchema.safeParse({ ...valid, paquete: "premium" }).success).toBe(false);
  });

  it("rechaza cuando el honeypot viene lleno", () => {
    expect(leadSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });
});
