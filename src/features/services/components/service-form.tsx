"use client";

import * as React from "react";
import { useCreateService } from "../hooks/use-create-service";
import { Service } from "../types/services.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ServiceFormValues = {
  name: string;
  duration: number;
  price: number;
};

// Ajustamos a interface para bater com o que a página envia
interface ServiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: Service; // Usamos o tipo Service do seu projeto
  submitLabel?: string;
}

export function ServiceForm({
  onSuccess,
  onCancel,
  initialValues,
  submitLabel = "Salvar",
}: ServiceFormProps) {
  // Integramos a mutação diretamente no formulário
  const createService = useCreateService();

  const [name, setName] = React.useState(initialValues?.name ?? "");
  const [duration, setDuration] = React.useState(initialValues?.duration ?? 30);
  const [price, setPrice] = React.useState(initialValues?.priceCents ?? 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: name.trim(),
      duration,
      priceCents: Math.round(price * 100), 
    };

    try {
      await createService.mutateAsync(payload);
      
      onSuccess?.(); 
    } catch (error) {

      console.error("Erro ao salvar o serviço:", error);
    }
  }

  const isPending = createService.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Nome do serviço
        </label>
        <Input
          placeholder="Ex.: Corte masculino"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Digite o nome que será exibido para o cliente no agendamento.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Duração
        </label>
        <Input
          type="number"
          placeholder="Ex.: 30"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Informe a duração em minutos. Exemplo: 30, 45, 60.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Preço
        </label>
        <Input
          type="number"
          step="0.01"
          placeholder="Ex.: 50.00"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Informe o valor em reais. Exemplo: 50 para R$ 50,00.
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button 
          type="submit" 
          disabled={isPending}
        >
          {isPending ? "Salvando..." : submitLabel}
        </Button>

        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}