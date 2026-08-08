import { and, eq, isNull, lt, lte, or, sql } from "drizzle-orm";
import type { CheckoutInput } from "@/lib/checkout-schema";
import { db } from "@/lib/db";
import {
  checkoutOrders,
  emailDeliveries,
  webhookEvents,
  type CheckoutOrder,
} from "@/lib/db/schema";
import type { CheckoutPrice } from "@/lib/pricing";

export async function createOrGetCheckoutOrder({
  input,
  price,
  reference,
}: {
  input: CheckoutInput;
  price: CheckoutPrice;
  reference: string;
}) {
  const database = db();
  await database
    .insert(checkoutOrders)
    .values({
      attemptId: input.attemptId,
      reference,
      tierId: input.tierId,
      express: input.express,
      ia: input.ia,
      setupAmount: price.setup,
      depositAmount: price.deposit,
      monthlyAmount: price.monthly,
      nombre: input.nombre,
      email: input.email,
      telefono: input.telefono,
      especialidad: input.especialidad,
    })
    .onConflictDoNothing({ target: checkoutOrders.attemptId });

  const [order] = await database
    .select()
    .from(checkoutOrders)
    .where(eq(checkoutOrders.attemptId, input.attemptId))
    .limit(1);

  if (!order) throw new Error("No se pudo persistir el intento de checkout");
  return order;
}

export function checkoutOrderMatches(
  order: CheckoutOrder,
  input: CheckoutInput,
  price: CheckoutPrice,
) {
  return (
    order.tierId === input.tierId &&
    order.express === input.express &&
    order.ia === input.ia &&
    order.setupAmount === price.setup &&
    order.depositAmount === price.deposit &&
    order.monthlyAmount === price.monthly &&
    order.nombre === input.nombre &&
    order.email === input.email &&
    order.telefono === input.telefono &&
    order.especialidad === input.especialidad
  );
}

export async function saveCheckoutPreference({
  orderId,
  preferenceId,
  checkoutUrl,
}: {
  orderId: string;
  preferenceId: string;
  checkoutUrl: string;
}) {
  const [order] = await db()
    .update(checkoutOrders)
    .set({
      mercadoPagoPreferenceId: preferenceId,
      checkoutUrl,
      paymentStatus: "preference_created",
      lastErrorCode: null,
      lastErrorDetail: null,
      updatedAt: new Date(),
    })
    .where(eq(checkoutOrders.id, orderId))
    .returning();
  return order;
}

export async function saveCheckoutError(orderId: string, code: string, detail: string) {
  await db()
    .update(checkoutOrders)
    .set({ lastErrorCode: code, lastErrorDetail: detail.slice(0, 500), updatedAt: new Date() })
    .where(eq(checkoutOrders.id, orderId));
}

export async function findCheckoutOrderByReference(reference: string) {
  const [order] = await db()
    .select()
    .from(checkoutOrders)
    .where(eq(checkoutOrders.reference, reference))
    .limit(1);
  return order;
}

export async function recoverCheckoutOrder({
  attemptId,
  reference,
  tierId,
  express,
  ia,
  price,
  contact,
}: {
  attemptId: string;
  reference: string;
  tierId: string;
  express: boolean;
  ia: boolean;
  price: CheckoutPrice;
  contact: { nombre?: string; email?: string; telefono?: string; especialidad?: string };
}) {
  await db()
    .insert(checkoutOrders)
    .values({
      attemptId,
      reference,
      tierId,
      express,
      ia,
      setupAmount: price.setup,
      depositAmount: price.deposit,
      monthlyAmount: price.monthly,
      nombre: contact.nombre || "No disponible",
      email: contact.email || "no-disponible@boreas.one",
      telefono: contact.telefono || "No disponible",
      especialidad: contact.especialidad || "No disponible",
      paymentStatus: "recovered",
    })
    .onConflictDoNothing({ target: checkoutOrders.reference });
  return findCheckoutOrderByReference(reference);
}

export function paymentMatchesOrder(
  order: CheckoutOrder,
  verified: {
    tier: { id: string };
    config: { express: boolean; ia: boolean };
    price: CheckoutPrice;
  },
) {
  return (
    order.tierId === verified.tier.id &&
    order.express === verified.config.express &&
    order.ia === verified.config.ia &&
    order.depositAmount === verified.price.deposit &&
    order.setupAmount === verified.price.setup &&
    order.monthlyAmount === verified.price.monthly
  );
}

export async function processPaymentEvent({
  eventKey,
  notificationId,
  requestId,
  dataId,
  action,
  payload,
  order,
  paymentId,
  paymentStatus,
  paymentStatusDetail,
  paymentUpdatedAt,
}: {
  eventKey: string;
  notificationId?: string;
  requestId?: string;
  dataId: string;
  action?: string;
  payload: Record<string, unknown> | null;
  order: CheckoutOrder;
  paymentId: string;
  paymentStatus: string;
  paymentStatusDetail?: string;
  paymentUpdatedAt: Date;
}) {
  return db().transaction(async (tx) => {
    const inserted = await tx
      .insert(webhookEvents)
      .values({
        eventKey,
        notificationId,
        requestId,
        dataId,
        action,
        reference: order.reference,
        paymentStatus,
        signatureValid: true,
        payload,
      })
      .onConflictDoNothing({ target: webhookEvents.eventKey })
      .returning({ id: webhookEvents.id });

    if (inserted.length === 0) {
      const [existing] = await tx
        .select({ status: webhookEvents.processingStatus })
        .from(webhookEvents)
        .where(eq(webhookEvents.eventKey, eventKey))
        .limit(1);
      if (existing?.status === "processed") return { duplicate: true };
    }

    await tx
      .update(checkoutOrders)
      .set({
        paymentId,
        paymentStatus,
        paymentStatusDetail,
        paymentUpdatedAt,
        lastErrorCode: null,
        lastErrorDetail: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(checkoutOrders.id, order.id),
          or(isNull(checkoutOrders.paymentUpdatedAt), lte(checkoutOrders.paymentUpdatedAt, paymentUpdatedAt)),
        ),
      );

    await tx
      .update(webhookEvents)
      .set({ processingStatus: "processed", outcome: "payment_recorded", processedAt: new Date() })
      .where(eq(webhookEvents.eventKey, eventKey));

    return { duplicate: false };
  });
}

export async function recordIgnoredWebhook({
  eventKey,
  notificationId,
  requestId,
  dataId,
  action,
  reference,
  paymentStatus,
  payload,
  outcome,
  errorCode,
}: {
  eventKey: string;
  notificationId?: string;
  requestId?: string;
  dataId?: string;
  action?: string;
  reference?: string;
  paymentStatus?: string;
  payload: Record<string, unknown> | null;
  outcome: string;
  errorCode: string;
}) {
  await db()
    .insert(webhookEvents)
    .values({
      eventKey,
      notificationId,
      requestId,
      dataId,
      action,
      reference,
      paymentStatus,
      signatureValid: true,
      processingStatus: "ignored",
      outcome,
      errorCode,
      payload,
      processedAt: new Date(),
    })
    .onConflictDoNothing({ target: webhookEvents.eventKey });
}

export async function claimEmailDelivery({
  orderId,
  reference,
  type,
  dedupeKey,
}: {
  orderId?: string;
  reference: string;
  type: string;
  dedupeKey: string;
}) {
  const database = db();
  const inserted = await database
    .insert(emailDeliveries)
    .values({ checkoutOrderId: orderId, reference, type, dedupeKey })
    .onConflictDoNothing({ target: emailDeliveries.dedupeKey })
    .returning({ id: emailDeliveries.id });
  if (inserted[0]) return inserted[0].id;

  const [retry] = await database
    .update(emailDeliveries)
    .set({ status: "pending", attempts: sql`${emailDeliveries.attempts} + 1`, updatedAt: new Date() })
    .where(and(eq(emailDeliveries.dedupeKey, dedupeKey), eq(emailDeliveries.status, "failed")))
    .returning({ id: emailDeliveries.id });
  return retry?.id;
}

export async function markEmailSent(id: string) {
  await db()
    .update(emailDeliveries)
    .set({ status: "sent", sentAt: new Date(), lastError: null, updatedAt: new Date() })
    .where(eq(emailDeliveries.id, id));
}

export async function markEmailFailed(id: string, error: string) {
  await db()
    .update(emailDeliveries)
    .set({ status: "failed", lastError: error.slice(0, 500), updatedAt: new Date() })
    .where(eq(emailDeliveries.id, id));
}

export async function getRetryableEmailDeliveries(limit = 20) {
  return db()
    .select({ delivery: emailDeliveries, order: checkoutOrders })
    .from(emailDeliveries)
    .innerJoin(checkoutOrders, eq(emailDeliveries.checkoutOrderId, checkoutOrders.id))
    .where(and(eq(emailDeliveries.status, "failed"), lt(emailDeliveries.attempts, 5)))
    .limit(limit);
}
