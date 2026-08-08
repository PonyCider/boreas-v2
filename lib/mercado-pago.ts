import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import type { Tier } from "@/content/pricing";
import type { CheckoutInput } from "@/lib/checkout-schema";
import type { CheckoutPrice } from "@/lib/pricing";

function client() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Falta MERCADOPAGO_ACCESS_TOKEN");

  return new MercadoPagoConfig({
    accessToken,
    options: { timeout: 10_000 },
  });
}

export async function createCheckoutPreference({
  reference,
  siteUrl,
  webhookSiteUrl,
  input,
  tier,
  price,
}: {
  reference: string;
  siteUrl: string;
  webhookSiteUrl?: string;
  input: CheckoutInput;
  tier: Tier;
  price: CheckoutPrice;
}) {
  const baseUrl = siteUrl.replace(/\/$/, "");
  const webhookBaseUrl = (webhookSiteUrl || siteUrl).replace(/\/$/, "");
  const preference = new Preference(client());
  const displayName = tier.id === "deluxe" && input.ia ? "Deluxe+" : tier.name;

  const response = await preference.create({
    body: {
      items: [
        {
          id: `boreas-${tier.id}-deposit`,
          title: `Anticipo Boreas — ${displayName}`,
          description: "50% de la inversión inicial. Mensualidad no incluida.",
          category_id: "services",
          quantity: 1,
          currency_id: "MXN",
          unit_price: price.deposit,
        },
      ],
      payer: {
        name: input.nombre,
        email: input.email,
        phone: { number: input.telefono },
      },
      external_reference: reference,
      metadata: {
        tier_id: tier.id,
        express: input.express,
        ia: input.ia,
        setup: price.setup,
        deposit: price.deposit,
        monthly: price.monthly,
        nombre: input.nombre,
        email: input.email,
        telefono: input.telefono,
        especialidad: input.especialidad,
      },
      additional_info: `Boreas ${displayName}. Anticipo 50% de inversión inicial.`,
      statement_descriptor: "BOREAS",
      back_urls: {
        success: `${baseUrl}/checkout/exito`,
        pending: `${baseUrl}/checkout/pendiente`,
        failure: `${baseUrl}/checkout/error`,
      },
      auto_return: "approved",
      notification_url: `${webhookBaseUrl}/api/mercado-pago/webhook`,
    },
    requestOptions: { idempotencyKey: reference },
  });

  if (!response.id || !response.init_point) {
    throw new Error("Mercado Pago no devolvió una URL de checkout");
  }

  return { id: response.id, checkoutUrl: response.init_point };
}

export async function getMercadoPagoPayment(id: string) {
  return new Payment(client()).get({ id });
}
