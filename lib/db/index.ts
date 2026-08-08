import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("Falta SUPABASE_DATABASE_URL");
    this.name = "DatabaseNotConfiguredError";
  }
}

let client: ReturnType<typeof postgres> | undefined;
let database: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function isDatabaseConfigured() {
  return Boolean(process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL);
}

export function db() {
  if (database) return database;

  const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfiguredError();

  client = postgres(connectionString, {
    prepare: false,
    max: 5,
    connect_timeout: 10,
    idle_timeout: 20,
  });
  database = drizzle(client, { schema });
  return database;
}
