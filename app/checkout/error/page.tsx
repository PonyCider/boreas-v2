import { CheckoutReturn } from "@/components/checkout/checkout-return";
import { sanitizeCheckoutReference } from "@/lib/checkout-reference";

export default async function CheckoutErrorPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const reference = sanitizeCheckoutReference((await searchParams).external_reference);
  return <CheckoutReturn status="error" reference={reference} />;
}
