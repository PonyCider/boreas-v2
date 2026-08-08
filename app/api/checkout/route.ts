import { after, NextResponse } from "next/server";
import { getTier } from "@/content/pricing";
import { checkoutSchema } from "@/lib/checkout-schema";
import { sendRecordedCheckoutStartedEmail } from "@/lib/checkout-email";
import { DatabaseNotConfiguredError } from "@/lib/db";
import {
  checkoutOrderMatches,
  createOrGetCheckoutOrder,
  saveCheckoutError,
  saveCheckoutPreference,
} from "@/lib/db/checkout-repository";
import { createCheckoutPreference } from "@/lib/mercado-pago";
import { computeCheckoutPrice } from "@/lib/pricing";
import { logEvent } from "@/lib/server/log";
import { checkRateLimit } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

function safeErrorName(error: unknown) {
  return error instanceof Error ? error.name : "UnknownError";
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocido";

  try {
    const rateLimit = await checkRateLimit(`checkout:${ip}`, { limit: 5, windowMs: 60_000 });
    if (rateLimit.limited) {
      return NextResponse.json(
        { ok: false, code: "RATE_LIMITED", message: "Espera un momento antes de reintentar." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }
  } catch (error) {
    logEvent("error", "checkout_rate_limit_unavailable", { error: safeErrorName(error) });
    return NextResponse.json(
      { ok: false, code: "SERVICE_UNAVAILABLE", message: "El pago está temporalmente en mantenimiento." },
      { status: 503, headers: { "Retry-After": "30" } },
    );
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Revisa los datos del formulario.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const input = parsed.data;
  const tier = getTier(input.tierId);
  const price = computeCheckoutPrice(tier, { express: input.express, ia: input.ia });
  const reference = `BOR-${input.attemptId}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  let order: Awaited<ReturnType<typeof createOrGetCheckoutOrder>> | undefined;

  try {
    order = await createOrGetCheckoutOrder({ input, price, reference });
    if (!checkoutOrderMatches(order, input, price)) {
      return NextResponse.json(
        { ok: false, code: "ATTEMPT_CONFLICT", message: "Los datos del intento cambiaron. Actualiza la página." },
        { status: 409 },
      );
    }

    if (order.checkoutUrl && order.mercadoPagoPreferenceId) {
      logEvent("info", "checkout_preference_reused", { reference });
      return NextResponse.json({ ok: true, checkoutUrl: order.checkoutUrl, reference });
    }

    const preference = await createCheckoutPreference({ reference, siteUrl, input, tier, price });
    order = await saveCheckoutPreference({
      orderId: order.id,
      preferenceId: preference.id,
      checkoutUrl: preference.checkoutUrl,
    });
    if (!order) throw new Error("No se pudo guardar la preferencia");

    after(async () => {
      await sendRecordedCheckoutStartedEmail({
        orderId: order!.id,
        reference,
        preferenceId: preference.id,
        input,
        tier,
        price,
      });
    });

    logEvent("info", "checkout_preference_created", { reference, tierId: tier.id });
    return NextResponse.json({ ok: true, checkoutUrl: preference.checkoutUrl, reference });
  } catch (error) {
    if (order) {
      await saveCheckoutError(order.id, "CHECKOUT_START_FAILED", safeErrorName(error)).catch(() => undefined);
    }
    logEvent("error", "checkout_start_failed", { reference, error: safeErrorName(error) });
    const unavailable = error instanceof DatabaseNotConfiguredError;
    return NextResponse.json(
      {
        ok: false,
        code: unavailable ? "SERVICE_UNAVAILABLE" : "PAYMENT_PROVIDER_UNAVAILABLE",
        message: unavailable
          ? "El pago está temporalmente en mantenimiento."
          : "No pudimos abrir el pago. Tus datos no se perdieron; inténtalo de nuevo.",
      },
      { status: unavailable ? 503 : 502, headers: { "Retry-After": "30" } },
    );
  }
}
