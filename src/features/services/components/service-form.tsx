"use client";

import * as React from "react";

type Props = {
  onSubmit: (values: {
    name: string;
    duration: number;
    price: number;
  }) => void;
  isSubmitting?: boolean;
};

export function ServiceForm({ onSubmit, isSubmitting = false }: Props) {
  const [name, setName] = React.useState("");
  const [duration, setDuration] = React.useState(30);
  const [price, setPrice] = React.useState(0);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    onSubmit({
      name,
      duration,
      price,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Nome do serviço
        </label>
        <input
          placeholder="Ex.: Corte masculino"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-input px-3 py-2"
        />
        <p className="text-xs text-muted-foreground">
          Digite o nome que será exibido para o cliente no agendamento.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Duração
        </label>
        <input
          type="number"
          placeholder="Ex.: 30"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full rounded-lg border border-input px-3 py-2"
        />
        <p className="text-xs text-muted-foreground">
          Informe a duração em minutos. Exemplo: 30, 45, 60.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Preço
        </label>
        <input
          type="number"
          step="0.01"
          placeholder="Ex.: 50,00"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="w-full rounded-lg border border-input px-3 py-2"
        />
        <p className="text-xs text-muted-foreground">
          Informe o valor em reais. Exemplo: 50 para R$ 50,00.
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}