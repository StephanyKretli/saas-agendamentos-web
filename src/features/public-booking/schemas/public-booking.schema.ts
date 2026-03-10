import { z } from "zod";

export const publicBookingFormSchema = z.object({
  clientName: z
    .string()
    .min(3, "Informe o nome do cliente.")
    .max(100, "Nome muito longo."),
  clientPhone: z
    .string()
    .min(8, "Informe um telefone válido.")
    .max(20, "Telefone muito longo."),
  clientEmail: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "Informe um e-mail válido.",
    }),
  notes: z
    .string()
    .max(300, "Observação muito longa.")
    .optional()
    .or(z.literal("")),
});

export type PublicBookingFormValues = z.infer<typeof publicBookingFormSchema>;