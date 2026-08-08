import { describe, expect, it } from "vitest";
import { sanitizeCheckoutReference } from "@/lib/checkout-reference";

describe("sanitizeCheckoutReference", () => {
  it("acepta únicamente referencias Boreas con UUID", () => {
    expect(
      sanitizeCheckoutReference("BOR-00000000-0000-4000-8000-000000000001"),
    ).toBe("BOR-00000000-0000-4000-8000-000000000001");
  });

  it("rechaza valores manipulados o nulos", () => {
    expect(sanitizeCheckoutReference("null")).toBeUndefined();
    expect(sanitizeCheckoutReference("<script>alert(1)</script>")).toBeUndefined();
    expect(sanitizeCheckoutReference(undefined)).toBeUndefined();
  });
});
