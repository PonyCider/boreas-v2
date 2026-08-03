import { NextResponse } from "next/server";
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from "mercadopago";
import { sendPaymentStatusEmail } from "@/lib/checkout-email";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";
import { parseAndVerifyBoreasPayment } from "@/lib/mercado-pago-webhook";

export const runtime = "nodejs";

const NOTIFIABLE_STATUSES = new Set([
  "approved",
  "pending",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
]);

export async function POST(request: Request) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Falta MERCADOPAGO_WEBHOOK_SECRET");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") || body?.data?.id?.toString();

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId,
      secret,
    });
  } catch (error) {
    if (error instanceof InvalidWebhookSignatureError) {
      console.warn("Firma de Mercado Pago rechazada", {
        reason: error.reason,
        requestIdPresent: Boolean(request.headers.get("x-request-id")),
        signaturePresent: Boolean(request.headers.get("x-signature")),
        dataIdPresent: Boolean(dataId),
      });
    } else {
      console.error("No se pudo validar la firma de Mercado Pago", error);
    }
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (!dataId) return NextResponse.json({ ok: false }, { status: 400 });

  try {
    const payment = await getMercadoPagoPayment(dataId);
    const verified = parseAndVerifyBoreasPayment(payment);

    if (NOTIFIABLE_STATUSES.has(verified.status)) {
      await sendPaymentStatusEmail({
        reference: verified.reference,
        paymentId: verified.paymentId,
        status: verified.status,
        statusDetail: verified.statusDetail,
        tier: verified.tier,
        express: verified.config.express,
        ia: verified.config.ia,
        price: verified.price,
        contact: verified.contact,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("No se pudo procesar el webhook de Mercado Pago", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
