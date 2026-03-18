"use client";

import * as React from "react";
import type { PublicBookingFormValues } from "../schemas/public-booking.schema";

type BookingFormProps = {
  onSubmit: (values: PublicBookingFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function BookingForm({
  onSubmit,
  isSubmitting = false,
}: BookingFormProps) {
  const [values, setValues] = React.useState<PublicBookingFormValues>({
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    notes: "",
  });

  function handleChange(
    field: keyof PublicBookingFormValues,
    value: string,
  ) {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!values.clientName || !values.clientPhone) {
      return;
    }

    await onSubmit(values);
  }

  const isDisabled =
    isSubmitting ||
    !values.clientName.trim() ||
    !values.clientPhone.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Seus dados
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Preencha as informações abaixo para confirmar o agendamento.
        </p>
      </div>

      {/* Nome */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          Nome completo
        </label>
        <input
          type="text"
          value={values.clientName}
          onChange={(e) => handleChange("clientName", e.target.value)}
          placeholder="Digite seu nome"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Telefone */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          WhatsApp
        </label>
        <input
          type="tel"
          value={values.clientPhone}
          onChange={(e) => handleChange("clientPhone", e.target.value)}
          placeholder="(00) 00000-0000"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          Email (opcional)
        </label>
        <input
          type="email"
          value={values.clientEmail}
          onChange={(e) => handleChange("clientEmail", e.target.value)}
          placeholder="seu@email.com"
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Observações */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-foreground">
          Observações (opcional)
        </label>
        <textarea
          value={values.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Alguma informação importante?"
          rows={3}
          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Confiança */}
      <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          Seus dados serão usados apenas para confirmar o agendamento.
        </p>
      </div>

      {/* Botão */}
      <button
        type="submit"
        disabled={isDisabled}
        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Confirmando agendamento..." : "Confirmar agendamento"}
      </button>
    </form>
  );
}