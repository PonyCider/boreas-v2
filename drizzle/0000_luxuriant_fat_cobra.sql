CREATE TABLE "checkout_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"attempt_id" uuid NOT NULL,
	"reference" text NOT NULL,
	"mercado_pago_preference_id" text,
	"checkout_url" text,
	"tier_id" text NOT NULL,
	"express" boolean NOT NULL,
	"ia" boolean NOT NULL,
	"setup_amount" integer NOT NULL,
	"deposit_amount" integer NOT NULL,
	"monthly_amount" integer NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"telefono" text NOT NULL,
	"especialidad" text NOT NULL,
	"payment_id" text,
	"payment_status" text DEFAULT 'not_started' NOT NULL,
	"payment_status_detail" text,
	"payment_updated_at" timestamp with time zone,
	"last_error_code" text,
	"last_error_detail" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"checkout_order_id" uuid,
	"reference" text NOT NULL,
	"type" text NOT NULL,
	"dedupe_key" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"last_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sent_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "rate_limit_windows" (
	"key_hash" text NOT NULL,
	"window_start" timestamp with time zone NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	CONSTRAINT "rate_limit_windows_key_hash_window_start_pk" PRIMARY KEY("key_hash","window_start")
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_key" text NOT NULL,
	"notification_id" text,
	"request_id" text,
	"data_id" text,
	"action" text,
	"reference" text,
	"payment_status" text,
	"signature_valid" boolean DEFAULT false NOT NULL,
	"processing_status" text DEFAULT 'received' NOT NULL,
	"outcome" text,
	"error_code" text,
	"payload" jsonb,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL,
	"processed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_checkout_order_id_checkout_orders_id_fk" FOREIGN KEY ("checkout_order_id") REFERENCES "public"."checkout_orders"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "checkout_orders_attempt_id_unique" ON "checkout_orders" USING btree ("attempt_id");--> statement-breakpoint
CREATE UNIQUE INDEX "checkout_orders_reference_unique" ON "checkout_orders" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "checkout_orders_payment_id_idx" ON "checkout_orders" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "checkout_orders_status_idx" ON "checkout_orders" USING btree ("payment_status");--> statement-breakpoint
CREATE UNIQUE INDEX "email_deliveries_dedupe_key_unique" ON "email_deliveries" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "email_deliveries_reference_idx" ON "email_deliveries" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "email_deliveries_status_idx" ON "email_deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "rate_limit_windows_expires_at_idx" ON "rate_limit_windows" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_events_event_key_unique" ON "webhook_events" USING btree ("event_key");--> statement-breakpoint
CREATE INDEX "webhook_events_reference_idx" ON "webhook_events" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "webhook_events_data_id_idx" ON "webhook_events" USING btree ("data_id");
--> statement-breakpoint
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_tier_check" CHECK ("tier_id" IN ('esencial', 'profesional', 'deluxe'));
--> statement-breakpoint
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_amounts_check" CHECK ("setup_amount" >= 0 AND "deposit_amount" >= 0 AND "monthly_amount" >= 0);
--> statement-breakpoint
ALTER TABLE "checkout_orders" ADD CONSTRAINT "checkout_orders_reference_check" CHECK ("reference" ~ '^BOR-[0-9a-fA-F-]{36}$');
--> statement-breakpoint
ALTER TABLE "email_deliveries" ADD CONSTRAINT "email_deliveries_status_check" CHECK ("status" IN ('pending', 'sent', 'failed'));
--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_processing_status_check" CHECK ("processing_status" IN ('received', 'processed', 'ignored'));
--> statement-breakpoint
ALTER TABLE "rate_limit_windows" ADD CONSTRAINT "rate_limit_windows_count_check" CHECK ("count" > 0);
--> statement-breakpoint
ALTER TABLE "checkout_orders" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "email_deliveries" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "rate_limit_windows" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "webhook_events" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DO $$
BEGIN
	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
		REVOKE ALL ON TABLE "checkout_orders", "email_deliveries", "rate_limit_windows", "webhook_events" FROM anon;
	END IF;
	IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
		REVOKE ALL ON TABLE "checkout_orders", "email_deliveries", "rate_limit_windows", "webhook_events" FROM authenticated;
	END IF;
END $$;
