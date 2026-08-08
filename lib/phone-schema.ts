import { z } from "zod";

export const internationalPhoneSchema = z
  .string()
  .transform((value) => `+${value.replace(/\D/g, "")}`)
  .refine(
    (value) => /^\+\d{8,15}$/.test(value),
    "Revisa el número y el código de país",
  );
