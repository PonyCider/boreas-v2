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

export type PaymentVerificationCode =
  | "FOREIGN_REFERENCE"
  | "CURRENCY_MISMATCH"
  | "INVALID_METADATA"
  | "AMOUNT_MISMATCH";

export class PaymentVerificationError extends Error {
  constructor(
    public readonly code: PaymentVerificationCode,
    message: string,
  ) {
    super(message);
    this.name = "PaymentVerificationError";
  }
}

type VerifiablePayment = Pick<
  PaymentResponse,
  | "id"
  | "external_reference"
  | "currency_id"
  | "transaction_amount"
  | "status"
  | "status_detail"
  | "date_last_updated"
  | "metadata"
  | "payer"
>;

export function parseAndVerifyBoreasPayment(payment: VerifiablePayment) {
  if (!payment.id || !payment.external_reference?.startsWith("BOR-")) {
    throw new PaymentVerificationError(
      "FOREIGN_REFERENCE",
      "El pago no pertenece a una referencia Boreas válida",
    );
  }

  if (payment.currency_id !== "MXN") {
    throw new PaymentVerificationError("CURRENCY_MISMATCH", "La moneda del pago no coincide");
  }

  const parsedMetadata = metadataSchema.safeParse(payment.metadata);
  if (!parsedMetadata.success) {
    throw new PaymentVerificationError("INVALID_METADATA", "La metadata del pago no es válida");
  }
  const metadata = parsedMetadata.data;
  const tier = getTier(metadata.tier_id);
  const config = { express: metadata.express, ia: metadata.ia };
  const price = computeCheckoutPrice(tier, config);

  if (payment.transaction_amount !== price.deposit) {
    throw new PaymentVerificationError(
      "AMOUNT_MISMATCH",
      "El monto del pago no coincide con el anticipo esperado",
    );
  }

  return {
    paymentId: payment.id,
    reference: payment.external_reference,
    status: payment.status || "unknown",
    statusDetail: payment.status_detail,
    paymentUpdatedAt: payment.date_last_updated ? new Date(payment.date_last_updated) : new Date(),
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
