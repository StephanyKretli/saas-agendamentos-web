"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Scissors, Clock, DollarSign, Wrench, User, Check } from "lucide-react"; 
import { Button } from "@/components/ui/button";
// 🌟 CORREÇÃO: Importação oficial do useTeam
import { useTeam } from "@/features/team/hooks/use-team"; 
import { createService } from "../services/services.api"; 

interface ServiceFormProps {
  initialData?: any; 
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ServiceForm({ initialData, onSuccess, onCancel }: ServiceFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [duration, setDuration] = useState(initialData?.duration || "");
  const [price, setPrice] = useState(initialData?.priceCents ? (initialData.priceCents / 100).toString() : "");
  
  const [selectedProfessionalIds, setSelectedProfessionalIds] = useState<string[]>(
    initialData?.professionalIds || []
  );

  const [hasMaintenance, setHasMaintenance] = useState(initialData?.hasMaintenance || false);
  const [maintenanceDuration, setMaintenanceDuration] = useState(initialData?.maintenanceDurationMinutes || "");
  const [maintenancePrice, setMaintenancePrice] = useState(
    initialData?.maintenancePriceCents ? (initialData.maintenancePriceCents / 100).toString() : ""
  );

  const [isLoading, setIsLoading] = useState(false);

  // 🌟 CORREÇÃO: Utilizando o useTeam e mapeando os dados reais da equipe
  const { data: teamData } = useTeam();
  const professionals = Array.isArray(teamData) 
    ? teamData 
    : ((teamData as any)?.items ?? []);

  const handleToggleProfessional = (id: string) => {
    setSelectedProfessionalIds((prev) =>
      prev.includes(id) 
        ? prev.filter((pId) => pId !== id) 
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedProfessionalIds.length === 0) {
      toast.error("Selecione pelo menos um profissional para este serviço.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name,
        duration: Number(duration),
        priceCents: Math.round(Number(price) * 100),
        hasMaintenance,
        maintenanceDurationMinutes: hasMaintenance ? Number(maintenanceDuration) : null,
        maintenancePriceCents: hasMaintenance ? Math.round(Number(maintenancePrice) * 100) : null,
        professionalIds: selectedProfessionalIds, 
        icon: initialData?.icon || "scissors", 
      };

      await createService(payload);
      
      toast.success("Serviço salvo com sucesso!");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar o serviço");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        
        {/* NOME DO SERVIÇO */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Scissors className="h-4 w-4 text-muted-foreground" />
            Nome do Serviço
          </label>
          <input 
            type="text"
            required
            placeholder="Ex: Extensão de Cílios - Volume Russo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* SELEÇÃO MÚLTIPLA DE PROFISSIONAIS REAIS (EQUIPE) */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="h-4 w-4 text-muted-foreground" />
            Profissionais que realizam este serviço
          </label>
          
          {professionals.length === 0 ? (
            <div className="p-4 text-center border rounded-xl bg-muted/30">
               <p className="text-sm text-muted-foreground">Nenhum profissional cadastrado na equipe.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {professionals.map((prof: any) => {
                const isSelected = selectedProfessionalIds.includes(prof.id);
                return (
                  <button
                    key={prof.id}
                    type="button"
                    onClick={() => handleToggleProfessional(prof.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm font-medium transition-all duration-200 shadow-sm ${
                      isSelected
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-background border-input text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <span className="truncate">{prof.name}</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isSelected 
                        ? "bg-primary border-primary text-primary-foreground" 
                        : "border-muted-foreground/40 bg-background"
                    }`}>
                      {isSelected && <Check className="h-3 w-3 stroke-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* DURAÇÃO E PREÇO PADRÃO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Duração (minutos)
            </label>
            <input 
              type="number" 
              required
              placeholder="Ex: 120"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Preço Cobrado (R$)
            </label>
            <input 
              type="number" 
              step="0.01"
              required
              placeholder="Ex: 150.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* DIVISOR / TOGGLE DE MANUTENÇÃO NATIVA */}
        <div className="flex items-center justify-between p-4 bg-muted/50 border border-border rounded-xl mt-6">
          <div className="flex gap-3 items-center">
            <div className="p-2 bg-background border border-border rounded-lg text-foreground shadow-sm">
              <Wrench className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">
                Oferece preço diferenciado para Manutenção?
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                Ative se esse serviço possuir um retorno mais rápido e barato.
              </span>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={hasMaintenance}
              onChange={(e) => setHasMaintenance(e.target.checked)}
            />
            <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* CAMPOS CONDICIONAIS DA MANUTENÇÃO */}
        {hasMaintenance && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/10 border border-border border-dashed rounded-xl mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col justify-between gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                Duração da Manutenção (min)
              </label>
              <input 
                type="number" 
                required={hasMaintenance}
                placeholder="Ex: 60"
                value={maintenanceDuration}
                onChange={(e) => setMaintenanceDuration(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex flex-col justify-between gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                Preço da Manutenção (R$)
              </label>
              <input 
                type="number" 
                step="0.01"
                required={hasMaintenance}
                placeholder="Ex: 80.00"
                value={maintenancePrice}
                onChange={(e) => setMaintenancePrice(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        )}
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={isLoading}
          className="rounded-xl"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="rounded-xl px-8"
        >
          {isLoading ? "Salvando..." : "Salvar Serviço"}
        </Button>
      </div>
    </form>
  );
}