"use client";

import React, { useEffect, useState } from "react";
import { Service } from "../types/services.types";
import { useCreateService } from "../hooks/use-create-service";
import { useUpdateService } from "../hooks/use-update-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { IconPicker } from "./icon-picker";

interface ServiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: Service | null;
  submitLabel?: string;
}

export function ServiceForm({
  onSuccess,
  onCancel,
  initialValues,
  submitLabel = "Salvar",
}: ServiceFormProps) {
  const createService = useCreateService();
  const updateService = useUpdateService();

  const [name, setName] = useState("");
  const [duration, setDuration] = useState<number | string>(30);
  const [price, setPrice] = useState<number | string>(0);
  // 1. Novo estado para o ícone (padrão 'scissors')
  const [icon, setIcon] = useState("scissors");

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDuration(initialValues.duration || 30);
      // 2. Carrega o ícone existente se estiver editando
      setIcon((initialValues as any).icon || "scissors");
      
      const dbPrice = (initialValues as any).priceCents ?? (initialValues as any).price ?? 0;
      setPrice(Number(dbPrice) / 100);
    } else {
      setName("");
      setDuration(30);
      setPrice(0);
      setIcon("scissors");
    }
  }, [initialValues]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const targetId = initialValues?.id || (initialValues as any)?._id;

    const payload = {
      name: name.trim(),
      duration: Number(duration),
      priceCents: Math.round(Number(price) * 100), 
      icon, // 3. Inclui o ícone selecionado no payload
    };

    try {
      if (targetId) {
        await updateService.mutateAsync({
          id: targetId,
          ...payload,
        });
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await createService.mutateAsync(payload);
        toast.success("Serviço criado com sucesso!");
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      toast.error(error.message || "Erro ao salvar serviço");
    }
  }

  const isPending = createService.isPending || updateService.isPending;
  const isEditing = Boolean(initialValues?.id || (initialValues as any)?._id);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Nome do serviço</label>
        <Input
          placeholder="Ex.: Corte masculino"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isPending}
        />
      </div>

      {/* 4. Adicionado o Seletor de Ícones aqui */}
      <div className="py-2">
        <IconPicker 
          value={icon} 
          onChange={(newIcon) => setIcon(newIcon)} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Duração (minutos)</label>
          <Input
            type="number"
            placeholder="Ex.: 30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            disabled={isPending}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Preço (R$)</label>
          <Input
            type="number"
            step="0.01"
            placeholder="Ex.: 50.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            disabled={isPending}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={isPending} className="min-w-[120px]">
          {isPending ? "Salvando..." : isEditing ? "Atualizar Serviço" : "Cadastrar Serviço"}
        </Button>

        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}