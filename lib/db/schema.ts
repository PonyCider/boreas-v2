import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const checkoutOrders = pgTable(
  "checkout_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    attemptId: uuid("attempt_id").notNull(),
    reference: text("reference").notNull(),
    mercadoPagoPreferenceId: text("mercado_pago_preference_id"),
    checkoutUrl: text("checkout_url"),
    tierId: text("tier_id").notNull(),
    express: boolean("express").notNull(),
    ia: boolean("ia").notNull(),
    setupAmount: integer("setup_amount").notNull(),
    depositAmount: integer("deposit_amount").notNull(),
    monthlyAmount: integer("monthly_amount").notNull(),
    nombre: text("nombre").notNull(),
    email: text("email").notNull(),
    telefono: text("telefono").notNull(),
    especialidad: text("especialidad").notNull(),
    paymentId: text("payment_id"),
    paymentStatus: text("payment_status").notNull().default("not_started"),
    paymentStatusDetail: text("payment_status_detail"),
    paymentUpdatedAt: timestamp("payment_updated_at", { withTimezone: true }),
    lastErrorCode: text("last_error_code"),
    lastErrorDetail: text("last_error_detail"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("checkout_orders_attempt_id_unique").on(table.attemptId),
    uniqueIndex("checkout_orders_reference_unique").on(table.reference),
    index("checkout_orders_payment_id_idx").on(table.paymentId),
    index("checkout_orders_status_idx").on(table.paymentStatus),
  ],
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventKey: text("event_key").notNull(),
    notificationId: text("notification_id"),
    requestId: text("request_id"),
    dataId: text("data_id"),
    action: text("action"),
    reference: text("reference"),
    paymentStatus: text("payment_status"),
    signatureValid: boolean("signature_valid").notNull().default(false),
    processingStatus: text("processing_status").notNull().default("received"),
    outcome: text("outcome"),
    errorCode: text("error_code"),
    payload: jsonb("payload").$type<Record<string, unknown> | null>(),
    receivedAt: timestamp("received_at", { withTimezone: true }).defaultNow().notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("webhook_events_event_key_unique").on(table.eventKey),
    index("webhook_events_reference_idx").on(table.reference),
    index("webhook_events_data_id_idx").on(table.dataId),
  ],
);

export const emailDeliveries = pgTable(
  "email_deliveries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    checkoutOrderId: uuid("checkout_order_id").references(() => checkoutOrders.id, {
      onDelete: "set null",
    }),
    reference: text("reference").notNull(),
    type: text("type").notNull(),
    dedupeKey: text("dedupe_key").notNull(),
    status: text("status").notNull().default("pending"),
    attempts: integer("attempts").notNull().default(1),
    lastError: text("last_error"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("email_deliveries_dedupe_key_unique").on(table.dedupeKey),
    index("email_deliveries_reference_idx").on(table.reference),
    index("email_deliveries_status_idx").on(table.status),
  ],
);

export const rateLimitWindows = pgTable(
  "rate_limit_windows",
  {
    keyHash: text("key_hash").notNull(),
    windowStart: timestamp("window_start", { withTimezone: true }).notNull(),
    count: integer("count").notNull().default(1),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.keyHash, table.windowStart] }),
    index("rate_limit_windows_expires_at_idx").on(table.expiresAt),
  ],
);

export type CheckoutOrder = typeof checkoutOrders.$inferSelect;
