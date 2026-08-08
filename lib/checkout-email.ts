import { Resend } from "resend";
import type { Tier } from "@/content/pricing";
import type { CheckoutInput } from "@/lib/checkout-schema";
import { formatMxn, type CheckoutPrice } from "@/lib/pricing";
import {
  claimEmailDelivery,
  markEmailFailed,
  markEmailSent,
} from "@/lib/db/checkout-repository";
import { logEvent } from "@/lib/server/log";

function emailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL;

  if (!apiKey || !from || !to) {
    throw new Error("Faltan variables de entorno de Resend");
  }

  return { resend: new Resend(apiKey), from, to };
}

function planName(tier: Tier, ia: boolean) {
  return tier.id === "deluxe" && ia ? "Deluxe+" : tier.name;
}

export async function sendCheckoutStartedEmail({
  reference,
  preferenceId,
  input,
  tier,
  price,
}: {
  reference: string;
  preferenceId: string;
  input: CheckoutInput;
  tier: Tier;
  price: CheckoutPrice;
}) {
  const { resend, from, to } = emailConfig();
  const detail = [
    "PAGO AÚN NO CONFIRMADO",
    `Referencia: ${reference}`,
    `Preferencia Mercado Pago: ${preferenceId}`,
    "",
    `Paquete: ${planName(tier, input.ia)}`,
    `Entrega Express: ${input.express ? "sí" : "no"}`,
    `Asistente IA: ${input.ia ? "sí" : "no"}`,
    `Inversión inicial: ${formatMxn(price.setup)}`,
    `Anticipo enviado a checkout: ${formatMxn(price.deposit)}`,
    `Mensualidad posterior: ${formatMxn(price.monthly)}`,
    "",
    `Nombre: ${input.nombre}`,
    `Correo: ${input.email}`,
    `WhatsApp: ${input.telefono}`,
    `Especialidad: ${input.especialidad}`,
  ].join("\n");

  const { error } = await resend.emails.send(
    {
      from,
      to,
      replyTo: input.email,
      subject: `[${reference}] Checkout iniciado — ${planName(tier, input.ia)}`,
      text: detail,
    },
    { idempotencyKey: `checkout-started/${reference}` },
  );

  if (error) throw error;
}

export async function sendPaymentStatusEmail({
  reference,
  paymentId,
  status,
  statusDetail,
  tier,
  express,
  ia,
  price,
  contact,
}: {
  reference: string;
  paymentId: number;
  status: string;
  statusDetail?: string;
  tier: Tier;
  express: boolean;
  ia: boolean;
  price: CheckoutPrice;
  contact: { nombre?: string; email?: string; telefono?: string; especialidad?: string };
}) {
  const { resend, from, to } = emailConfig();
  const approved = status === "approved";
  const label = approved ? "ANTICIPO APROBADO" : `PAGO ${status.toUpperCase()}`;
  const detail = [
    label,
    `Referencia: ${reference}`,
    `Pago Mercado Pago: ${paymentId}`,
    `Estado: ${status}`,
    `Detalle: ${statusDetail || "—"}`,
    "",
    `Paquete: ${planName(tier, ia)}`,
    `Entrega Express: ${express ? "sí" : "no"}`,
    `Asistente IA: ${ia ? "sí" : "no"}`,
    `Inversión inicial: ${formatMxn(price.setup)}`,
    `Anticipo: ${formatMxn(price.deposit)}`,
    `Mensualidad posterior: ${formatMxn(price.monthly)}`,
    "",
    `Nombre: ${contact.nombre || "—"}`,
    `Correo: ${contact.email || "—"}`,
    `WhatsApp: ${contact.telefono || "—"}`,
    `Especialidad: ${contact.especialidad || "—"}`,
    approved ? "" : undefined,
    approved ? "Siguiente paso: contactar y solicitar el audio de un minuto." : undefined,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  const { error } = await resend.emails.send(
    {
      from,
      to,
      replyTo: contact.email,
      subject: `[${reference}] ${label} — ${planName(tier, ia)}`,
      text: detail,
    },
    { idempotencyKey: `payment/${paymentId}/${status}` },
  );

  if (error) throw error;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Error desconocido";
}

export async function sendRecordedCheckoutStartedEmail({
  orderId,
  reference,
  preferenceId,
  input,
  tier,
  price,
}: {
  orderId: string;
  reference: string;
  preferenceId: string;
  input: CheckoutInput;
  tier: Tier;
  price: CheckoutPrice;
}) {
  const dedupeKey = `checkout-started/${reference}`;
  const deliveryId = await claimEmailDelivery({
    orderId,
    reference,
    type: "checkout_started",
    dedupeKey,
  });
  if (!deliveryId) return;

  try {
    await sendCheckoutStartedEmail({ reference, preferenceId, input, tier, price });
    await markEmailSent(deliveryId);
  } catch (error) {
    await markEmailFailed(deliveryId, errorMessage(error));
    logEvent("error", "checkout_email_failed", { reference, type: "checkout_started" });
  }
}

export async function sendRecordedPaymentStatusEmail({
  orderId,
  reference,
  paymentId,
  status,
  statusDetail,
  tier,
  express,
  ia,
  price,
  contact,
}: Parameters<typeof sendPaymentStatusEmail>[0] & { orderId: string }) {
  const dedupeKey = `payment/${paymentId}/${status}`;
  const deliveryId = await claimEmailDelivery({
    orderId,
    reference,
    type: `payment_${status}`,
    dedupeKey,
  });
  if (!deliveryId) return;

  try {
    await sendPaymentStatusEmail({
      reference,
      paymentId,
      status,
      statusDetail,
      tier,
      express,
      ia,
      price,
      contact,
    });
    await markEmailSent(deliveryId);
  } catch (error) {
    await markEmailFailed(deliveryId, errorMessage(error));
    logEvent("error", "checkout_email_failed", { reference, paymentId, status });
  }
}
