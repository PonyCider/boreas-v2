import { NextResponse } from "next/server";
import { getTier } from "@/content/pricing";
import { checkoutSchema } from "@/lib/checkout-schema";
import { sendCheckoutStartedEmail } from "@/lib/checkout-email";
import { createCheckoutPreference } from "@/lib/mercado-pago";
import { computeCheckoutPrice } from "@/lib/pricing";
import { isRateLimited } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocido";

  if (isRateLimited(`checkout:${ip}`, { limit: 5, windowMs: 60_000 })) {
    return NextResponse.json({ ok: false, message: "Espera un momento antes de reintentar." }, { status: 429 });
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
  const reference = `BOR-${crypto.randomUUID()}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    const preference = await createCheckoutPreference({ reference, siteUrl, input, tier, price });

    await sendCheckoutStartedEmail({
      reference,
      preferenceId: preference.id,
      input,
      tier,
      price,
    });

    return NextResponse.json({ ok: true, checkoutUrl: preference.checkoutUrl });
  } catch (error) {
    console.error("No se pudo iniciar Checkout Pro", error);
    return NextResponse.json(
      { ok: false, message: "No pudimos abrir el pago. Tus datos no se perdieron; inténtalo de nuevo." },
      { status: 502 },
    );
  }
}
