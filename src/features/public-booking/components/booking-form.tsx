"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  publicBookingFormSchema,
  type PublicBookingFormValues,
} from "../schemas/public-booking.schema";

type BookingFormProps = {
  onSubmit: (values: PublicBookingFormValues) => void;
  isSubmitting?: boolean;
};

export function BookingForm({
  onSubmit,
  isSubmitting = false,
}: BookingFormProps) {
  const form = useForm<PublicBookingFormValues>({
    resolver: zodResolver(publicBookingFormSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      notes: "",
    },
  });

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Seus dados
        </h3>
        <p className="text-sm text-muted-foreground">
          Preencha as informações para confirmar o agendamento.
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 space-y-4"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nome</label>
          <input
            type="text"
            {...form.register("clientName")}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            placeholder="Seu nome"
          />
          {form.formState.errors.clientName ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.clientName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Telefone</label>
          <input
            type="text"
            {...form.register("clientPhone")}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            placeholder="(31) 99999-9999"
          />
          {form.formState.errors.clientPhone ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.clientPhone.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            E-mail
          </label>
          <input
            type="email"
            {...form.register("clientEmail")}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            placeholder="voce@email.com"
          />
          {form.formState.errors.clientEmail ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.clientEmail.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Observações
          </label>
          <textarea
            rows={4}
            {...form.register("notes")}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
            placeholder="Escreva algo importante sobre seu atendimento, se quiser."
          />
          {form.formState.errors.notes ? (
            <p className="text-xs text-destructive">
              {form.formState.errors.notes.message}
            </p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Confirmando agendamento..." : "Confirmar agendamento"}
        </button>
      </form>
    </section>
  );
}