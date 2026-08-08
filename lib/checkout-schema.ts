import { z } from "zod";
import { internationalPhoneSchema } from "@/lib/phone-schema";

const contactFields = {
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(80),
  email: z.email("Revisa tu correo").max(120),
  telefono: internationalPhoneSchema,
  especialidad: z.string().trim().min(2, "Dinos tu especialidad").max(80),
  website: z.string().max(0, "Envío rechazado"),
};

export const checkoutSchema = z
  .object({
    ...contactFields,
    attemptId: z.uuid("El intento de checkout no es válido"),
    tierId: z.enum(["esencial", "profesional", "deluxe"]),
    express: z.boolean(),
    ia: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.ia && value.tierId !== "deluxe") {
      context.addIssue({
        code: "custom",
        path: ["ia"],
        message: "El Asistente IA solo está disponible en Deluxe",
      });
    }
  });

export type CheckoutInput = z.infer<typeof checkoutSchema>;
