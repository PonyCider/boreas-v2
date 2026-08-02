import { z } from "zod";
import type { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { getTier } from "@/content/pricing";
import { computeCheckoutPrice } from "@/lib/pricing";

const booleanMetadata = z.preprocess((value) => {
  if (value === true || value === "true" || value === 1 || value === "1") return true;
  if (value === false || value === "false" || value === 0 || value === "0") return false;
  return value;
}, z.boolean());

const metadataSchema = z.object({
  tier_id: z.enum(["esencial", "profesional", "deluxe"]),
  express: booleanMetadata,
  ia: booleanMetadata,
  nombre: z.string().optional(),
  email: z.string().optional(),
  telefono: z.string().optional(),
  especialidad: z.string().optional(),
});

type VerifiablePayment = Pick<
  PaymentResponse,
  | "id"
  | "external_reference"
  | "currency_id"
  | "transaction_amount"
  | "status"
  | "status_detail"
  | "metadata"
  | "payer"
>;

export function parseAndVerifyBoreasPayment(payment: VerifiablePayment) {
  if (!payment.id || !payment.external_reference?.startsWith("BOR-")) {
    throw new Error("El pago no pertenece a una referencia Boreas válida");
  }

  if (payment.currency_id !== "MXN") {
    throw new Error("La moneda del pago no coincide");
  }

  const metadata = metadataSchema.parse(payment.metadata);
  const tier = getTier(metadata.tier_id);
  const config = { express: metadata.express, ia: metadata.ia };
  const price = computeCheckoutPrice(tier, config);

  if (payment.transaction_amount !== price.deposit) {
    throw new Error("El monto del pago no coincide con el anticipo esperado");
  }

  return {
    paymentId: payment.id,
    reference: payment.external_reference,
    status: payment.status || "unknown",
    statusDetail: payment.status_detail,
    tier,
    config,
    price,
    contact: {
      nombre: metadata.nombre,
      email: metadata.email || payment.payer?.email,
      telefono: metadata.telefono || payment.payer?.phone?.number,
      especialidad: metadata.especialidad,
    },
  };
}
