import { after, NextResponse } from "next/server";
import { InvalidWebhookSignatureError, WebhookSignatureValidator } from "mercadopago";
import { sendRecordedPaymentStatusEmail } from "@/lib/checkout-email";
import {
  findCheckoutOrderByReference,
  paymentMatchesOrder,
  processPaymentEvent,
  recordIgnoredWebhook,
  recoverCheckoutOrder,
} from "@/lib/db/checkout-repository";
import { getMercadoPagoPayment } from "@/lib/mercado-pago";
import {
  parseAndVerifyBoreasPayment,
  PaymentVerificationError,
} from "@/lib/mercado-pago-webhook";
import { logEvent } from "@/lib/server/log";

export const runtime = "nodejs";

const NOTIFIABLE_STATUSES = new Set([
  "approved",
  "pending",
  "rejected",
  "cancelled",
  "refunded",
  "charged_back",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function attemptIdFromReference(reference: string) {
  const match = reference.match(
    /^BOR-([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i,
  );
  return match?.[1];
}

export async function POST(request: Request) {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) {
    logEvent("error", "webhook_secret_missing");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const body = asRecord(await request.json().catch(() => null));
  const bodyData = asRecord(body?.data);
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id") || bodyData?.id?.toString();
  const requestId = request.headers.get("x-request-id") || undefined;
  const notificationId = body?.id?.toString();
  const action = body?.action?.toString() || body?.type?.toString();

  try {
    WebhookSignatureValidator.validate({
      xSignature: request.headers.get("x-signature"),
      xRequestId: requestId,
      dataId,
      secret,
    });
  } catch (error) {
    logEvent("warn", "webhook_signature_rejected", {
      invalidSignature: error instanceof InvalidWebhookSignatureError,
      requestIdPresent: Boolean(requestId),
      signaturePresent: Boolean(request.headers.get("x-signature")),
      dataIdPresent: Boolean(dataId),
    });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (!dataId) return NextResponse.json({ ok: false }, { status: 400 });

  const baseEventKey = notificationId || requestId || `${dataId}:${action || "payment"}`;

  try {
    const payment = await getMercadoPagoPayment(dataId);
    let verified: ReturnType<typeof parseAndVerifyBoreasPayment>;

    try {
      verified = parseAndVerifyBoreasPayment(payment);
    } catch (error) {
      if (!(error instanceof PaymentVerificationError)) throw error;

      await recordIgnoredWebhook({
        eventKey: `${baseEventKey}:${error.code}`,
        notificationId,
        requestId,
        dataId,
        action,
        reference: payment.external_reference,
        paymentStatus: payment.status,
        payload: body,
        outcome: "payment_rejected_by_validation",
        errorCode: error.code,
      });
      logEvent(error.code === "FOREIGN_REFERENCE" ? "info" : "warn", "webhook_payment_ignored", {
        dataId,
        code: error.code,
      });
      return NextResponse.json({ ok: true, ignored: true });
    }

    let order = await findCheckoutOrderByReference(verified.reference);
    if (!order) {
      const attemptId = attemptIdFromReference(verified.reference);
      if (!attemptId) {
        await recordIgnoredWebhook({
          eventKey: `${baseEventKey}:UNKNOWN_ORDER`,
          notificationId,
          requestId,
          dataId,
          action,
          reference: verified.reference,
          paymentStatus: verified.status,
          payload: body,
          outcome: "unknown_order",
          errorCode: "UNKNOWN_ORDER",
        });
        return NextResponse.json({ ok: true, ignored: true });
      }

      order = await recoverCheckoutOrder({
        attemptId,
        reference: verified.reference,
        tierId: verified.tier.id,
        express: verified.config.express,
        ia: verified.config.ia,
        price: verified.price,
        contact: verified.contact,
      });
    }

    if (!order) throw new Error("No se pudo recuperar la orden del webhook");

    if (!paymentMatchesOrder(order, verified)) {
      await recordIgnoredWebhook({
        eventKey: `${baseEventKey}:ORDER_MISMATCH`,
        notificationId,
        requestId,
        dataId,
        action,
        reference: verified.reference,
        paymentStatus: verified.status,
        payload: body,
        outcome: "stored_order_mismatch",
        errorCode: "ORDER_MISMATCH",
      });
      logEvent("warn", "webhook_order_mismatch", { reference: verified.reference, dataId });
      return NextResponse.json({ ok: true, ignored: true });
    }

    const eventKey = `${baseEventKey}:${verified.status}`;
    const result = await processPaymentEvent({
      eventKey,
      notificationId,
      requestId,
      dataId,
      action,
      payload: body,
      order,
      paymentId: String(verified.paymentId),
      paymentStatus: verified.status,
      paymentStatusDetail: verified.statusDetail,
      paymentUpdatedAt: verified.paymentUpdatedAt,
    });

    if (NOTIFIABLE_STATUSES.has(verified.status)) {
      after(async () => {
        await sendRecordedPaymentStatusEmail({
          orderId: order!.id,
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
      });
    }

    logEvent("info", "webhook_payment_processed", {
      reference: verified.reference,
      status: verified.status,
      duplicate: result.duplicate,
    });
    return NextResponse.json({ ok: true, duplicate: result.duplicate });
  } catch (error) {
    logEvent("error", "webhook_processing_failed", {
      dataId,
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
