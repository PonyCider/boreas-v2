import { describe, expect, it } from "vitest";
import { resolveMotorsSectionVariant } from "./section-variant";

describe("selección reversible de la sección de motores", () => {
  it("conserva legacy como valor seguro por defecto", () => {
    expect(resolveMotorsSectionVariant(undefined)).toBe("legacy");
    expect(resolveMotorsSectionVariant("legacy")).toBe("legacy");
    expect(resolveMotorsSectionVariant("otro")).toBe("legacy");
  });

  it("activa theater solo con una selección explícita", () => {
    expect(resolveMotorsSectionVariant("theater")).toBe("theater");
  });
});
