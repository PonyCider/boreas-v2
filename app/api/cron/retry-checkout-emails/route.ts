import { NextResponse } from "next/server";
import { getTier } from "@/content/pricing";
import {
  sendRecordedCheckoutStartedEmail,
  sendRecordedPaymentStatusEmail,
} from "@/lib/checkout-email";
import { getRetryableEmailDeliveries } from "@/lib/db/checkout-repository";
import { logEvent } from "@/lib/server/log";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const pending = await getRetryableEmailDeliveries();
  let attempted = 0;

  for (const { delivery, order } of pending) {
    if (!(["esencial", "profesional", "deluxe"] as const).some((id) => id === order.tierId)) {
      logEvent("warn", "checkout_email_retry_invalid_tier", { reference: order.reference });
      continue;
    }
    const tierId = order.tierId as "esencial" | "profesional" | "deluxe";
    const tier = getTier(tierId);
    const price = {
      setup: order.setupAmount,
      deposit: order.depositAmount,
      monthly: order.monthlyAmount,
    };

    if (delivery.type === "checkout_started" && order.mercadoPagoPreferenceId) {
      attempted += 1;
      await sendRecordedCheckoutStartedEmail({
        orderId: order.id,
        reference: order.reference,
        preferenceId: order.mercadoPagoPreferenceId,
        input: {
          attemptId: order.attemptId,
          tierId,
          express: order.express,
          ia: order.ia,
          nombre: order.nombre,
          email: order.email,
          telefono: order.telefono,
          especialidad: order.especialidad,
          website: "",
        },
        tier,
        price,
      });
    } else if (delivery.type.startsWith("payment_") && order.paymentId) {
      attempted += 1;
      await sendRecordedPaymentStatusEmail({
        orderId: order.id,
        reference: order.reference,
        paymentId: Number(order.paymentId),
        status: order.paymentStatus,
        statusDetail: order.paymentStatusDetail || undefined,
        tier,
        express: order.express,
        ia: order.ia,
        price,
        contact: {
          nombre: order.nombre,
          email: order.email,
          telefono: order.telefono,
          especialidad: order.especialidad,
        },
      });
    }
  }

  logEvent("info", "checkout_email_retry_completed", { found: pending.length, attempted });
  return NextResponse.json({ ok: true, found: pending.length, attempted });
}
