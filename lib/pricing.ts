import type { Tier } from "@/content/pricing";
import { IA_MONTHLY, IA_SETUP } from "@/content/pricing";

export type PlanConfig = { express: boolean; ia: boolean };

/**
 * Lo que el visitante eligió en una card. Vive aquí y no en el componente de
 * sección para que el formulario pueda importarlo sin ciclo de dependencias.
 */
export type Selection = { tier: Tier; config: PlanConfig };

/** setup null = bajo cotización (Organizaciones). */
export type ComputedPrice = { setup: number | null; monthly: number };

export type CheckoutPrice = {
  setup: number;
  deposit: number;
  monthly: number;
};

export function computePrice(tier: Tier, config: PlanConfig): ComputedPrice {
  // Los toggles se ignoran silenciosamente donde el paquete no los permite:
  // la UI no los ofrece ahí, y así un estado viejo nunca produce un precio falso.
  const iaOn = config.ia && tier.allowsIa;
  const expressFee = config.express && tier.expressFee !== null ? tier.expressFee : 0;

  const setup =
    tier.setup === null ? null : tier.setup + expressFee + (iaOn ? IA_SETUP : 0);

  return { setup, monthly: tier.monthly + (iaOn ? IA_MONTHLY : 0) };
}

/**
 * El anticipo es siempre 50% de la inversión inicial. La mensualidad se
 * devuelve como contexto, pero nunca participa en el cobro de Checkout Pro.
 */
export function computeCheckoutPrice(tier: Tier, config: PlanConfig): CheckoutPrice {
  const price = computePrice(tier, config);

  if (price.setup === null) {
    throw new Error(`El paquete ${tier.id} requiere cotización`);
  }

  return {
    setup: price.setup,
    deposit: price.setup / 2,
    monthly: price.monthly,
  };
}

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/** "$12,900" — sin decimales, sin sufijo de moneda. */
export function formatMxn(amount: number): string {
  return mxn.format(amount).replace(/\s*MXN\s*/, "").trim();
}
