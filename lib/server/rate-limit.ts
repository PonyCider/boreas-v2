import { createHmac } from "node:crypto";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimitWindows } from "@/lib/db/schema";

export type RateLimitResult = {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

function hashKey(key: string) {
  const salt = process.env.RATE_LIMIT_SALT;
  if (!salt || salt.length < 32) {
    throw new Error("Falta RATE_LIMIT_SALT de al menos 32 caracteres");
  }
  return createHmac("sha256", salt).update(key).digest("hex");
}

export async function checkRateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStartMs = Math.floor(now / windowMs) * windowMs;
  const windowStart = new Date(windowStartMs);
  const expiresAt = new Date(windowStartMs + windowMs);
  const keyHash = hashKey(key);

  const [window] = await db()
    .insert(rateLimitWindows)
    .values({ keyHash, windowStart, expiresAt, count: 1 })
    .onConflictDoUpdate({
      target: [rateLimitWindows.keyHash, rateLimitWindows.windowStart],
      set: { count: sql`${rateLimitWindows.count} + 1` },
    })
    .returning({ count: rateLimitWindows.count });

  const count = window?.count ?? limit + 1;
  return {
    limited: count > limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil((expiresAt.getTime() - now) / 1000)),
  };
}
