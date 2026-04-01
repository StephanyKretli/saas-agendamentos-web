"use client";

import React, { useEffect, useState } from "react";
import { Service } from "../types/services.types";
import { useCreateService } from "../hooks/use-create-service";
import { useUpdateService } from "../hooks/use-update-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { IconPicker } from "./icon-picker";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { Checkbox } from "@/components/ui/checkbox";

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
  const [icon, setIcon] = useState("scissors");
  
  // 🌟 NOVO: Estado para guardar os IDs dos profissionais selecionados
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([]);

  // 🌟 NOVO: Busca a equipe para mostrar nas checkboxes
  const { data: team = [], isLoading: isLoadingTeam } = useQuery({
    queryKey: ["team-list-for-services"],
    queryFn: async () => {
      const res = await api.get("/team", { headers: getAuthHeaders() });
      return (res as unknown) as { id: string; name: string }[];
    }
  });

  useEffect(() => {
    if (initialValues) {
      setName(initialValues.name || "");
      setDuration(initialValues.duration || 30);
      setIcon(initialValues.icon || "scissors");
      
      const dbPrice = (initialValues as any).priceCents ?? (initialValues as any).price ?? 0;
      setPrice(Number(dbPrice) / 100);

      // 🌟 Carrega os profissionais que já estavam marcados neste serviço
      if (initialValues.professionals) {
        setSelectedProfessionals(initialValues.professionals.map(p => p.id));
      } else {
        setSelectedProfessionals([]);
      }
    } else {
      setName("");
      setDuration(30);
      setPrice(0);
      setIcon("scissors");
      setSelectedProfessionals([]);
    }
  }, [initialValues]);

  // Função para marcar/desmarcar um profissional da lista
  const toggleProfessional = (id: string) => {
    setSelectedProfessionals((prev) => 
      prev.includes(id) 
        ? prev.filter((p) => p !== id) 
        : [...prev, id]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const targetId = initialValues?.id || (initialValues as any)?._id;

    const payload = {
      name: name.trim(),
      duration: Number(duration),
      priceCents: Math.round(Number(price) * 100), 
      icon, 
      professionalIds: selectedProfessionals, // 🌟 Envia a lista para a API
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
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* 🌟 NOVA SECÇÃO: Seletor de Profissionais */}
      <div className="space-y-3 pt-2 border-t border-border">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Quem realiza este serviço?</label>
          <p className="text-[0.8rem] text-muted-foreground">
            Selecione os membros da equipe que estão aptos a realizar este serviço.
          </p>
        </div>
        
        {isLoadingTeam ? (
          <p className="text-sm text-muted-foreground animate-pulse">Carregando equipe...</p>
        ) : team.length === 0 ? (
          <p className="text-sm text-muted-foreground italic bg-muted/50 p-3 rounded-lg border border-border">
            Você ainda não tem membros na equipe. Pode adicioná-los no menu Equipe.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/20 p-4 rounded-xl border border-border max-h-40 overflow-y-auto">
            {team.map((member) => (
              <div key={member.id} className="flex items-center space-x-2.5">
                <Checkbox 
                  id={`prof-${member.id}`} 
                  checked={selectedProfessionals.includes(member.id)}
                  onCheckedChange={() => toggleProfessional(member.id)}
                  disabled={isPending}
                />
                <label 
                  htmlFor={`prof-${member.id}`} 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {member.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button type="submit" disabled={isPending} className="min-w-30">
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