import { z } from "zod";
import { internationalPhoneSchema } from "@/lib/phone-schema";

export const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(80),
  email: z.email("Revisa tu correo").max(120),
  telefono: internationalPhoneSchema,
  especialidad: z.string().trim().min(2, "Dinos tu especialidad").max(80),
  mensaje: z.string().trim().max(1000).default(""),
  paquete: z.enum(["esencial", "profesional", "deluxe", "organizaciones"]),
  express: z.boolean(),
  ia: z.boolean(),
  website: z.string().max(0, "Envío rechazado"),
});

export type LeadInput = z.infer<typeof leadSchema>;
