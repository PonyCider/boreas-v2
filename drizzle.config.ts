import { defineConfig } from "drizzle-kit";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const databaseUrl =
  process.env.SUPABASE_DIRECT_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Falta SUPABASE_DIRECT_URL o SUPABASE_DATABASE_URL en .env.local",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
