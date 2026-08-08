import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getTier } from "@/content/pricing";
import { leadSchema } from "@/lib/lead-schema";
import { computePrice, formatMxn } from "@/lib/pricing";
import { logEvent } from "@/lib/server/log";
import { checkRateLimit } from "@/lib/server/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocido";

  try {
    const rateLimit = await checkRateLimit(`lead:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
    if (rateLimit.limited) {
      return NextResponse.json(
        { ok: false, code: "RATE_LIMITED" },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
      );
    }
  } catch (error) {
    logEvent("error", "lead_rate_limit_unavailable", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ ok: false, code: "SERVICE_UNAVAILABLE" }, { status: 503 });
  }

  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const lead = parsed.data;
  const tier = getTier(lead.paquete);
  const price = computePrice(tier, { express: lead.express, ia: lead.ia });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.error("Faltan variables de entorno de Resend");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const detail = [
    `Paquete: ${tier.name}`,
    `Entrega Express: ${lead.express ? "sí" : "no"}`,
    `Asistente IA: ${lead.ia ? "sí" : "no"}`,
    `Setup: ${price.setup === null ? "cotización" : formatMxn(price.setup)}`,
    `Mensualidad: ${formatMxn(price.monthly)}`,
    "",
    `Nombre: ${lead.nombre}`,
    `Correo: ${lead.email}`,
    `Teléfono: ${lead.telefono}`,
    `Especialidad: ${lead.especialidad}`,
    `Mensaje: ${lead.mensaje || "(sin mensaje)"}`,
  ].join("\n");

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `Lead ${tier.name} — ${lead.nombre}`,
      text: detail,
    });

    if (error) throw error;
  } catch (error) {
    console.error("Resend falló", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
