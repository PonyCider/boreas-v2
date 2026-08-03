import { z } from "zod";

const contactFields = {
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(80),
  email: z.email("Revisa tu correo").max(120),
  telefono: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((digits) => digits.length === 10, "El teléfono debe tener 10 dígitos"),
  especialidad: z.string().trim().min(2, "Dinos tu especialidad").max(80),
  website: z.string().max(0, "Envío rechazado"),
};

export const checkoutSchema = z
  .object({
    ...contactFields,
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
