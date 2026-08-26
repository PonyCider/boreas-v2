import { describe, expect, it } from "vitest";
import { resolveMotorsSectionVariant } from "./section-variant";

describe("selección reversible de la sección de motores", () => {
  it("activa theater como valor predeterminado", () => {
    expect(resolveMotorsSectionVariant(undefined)).toBe("theater");
    expect(resolveMotorsSectionVariant("theater")).toBe("theater");
    expect(resolveMotorsSectionVariant("otro")).toBe("theater");
  });

  it("restaura legacy solo con una selección explícita", () => {
    expect(resolveMotorsSectionVariant("legacy")).toBe("legacy");
  });
});
