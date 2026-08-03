import { describe, expect, it } from "vitest";
import { parseAndVerifyBoreasPayment } from "@/lib/mercado-pago-webhook";

const payment = {
  id: 123,
  external_reference: "BOR-123",
  currency_id: "MXN",
  transaction_amount: 19450,
  status: "approved",
  status_detail: "accredited",
  metadata: {
    tier_id: "deluxe",
    express: false,
    ia: true,
    nombre: "Dra. María González",
    email: "maria@consultorio.mx",
  },
  payer: { email: "fallback@consultorio.mx" },
};

describe("parseAndVerifyBoreasPayment", () => {
  it("recalcula y valida el anticipo del pago", () => {
    const result = parseAndVerifyBoreasPayment(payment);
    expect(result.price.deposit).toBe(19450);
    expect(result.tier.id).toBe("deluxe");
    expect(result.contact.email).toBe("maria@consultorio.mx");
  });

  it("acepta booleanos serializados por metadata", () => {
    const result = parseAndVerifyBoreasPayment({
      ...payment,
      metadata: { ...payment.metadata, express: "0", ia: "1" },
    });
    expect(result.config).toEqual({ express: false, ia: true });
  });

  it("rechaza un monto manipulado", () => {
    expect(() =>
      parseAndVerifyBoreasPayment({ ...payment, transaction_amount: 1 }),
    ).toThrow("no coincide");
  });

  it("rechaza moneda o referencia ajenas", () => {
    expect(() => parseAndVerifyBoreasPayment({ ...payment, currency_id: "USD" })).toThrow(
      "moneda",
    );
    expect(() =>
      parseAndVerifyBoreasPayment({ ...payment, external_reference: "OTHER-123" }),
    ).toThrow("referencia");
  });
});
