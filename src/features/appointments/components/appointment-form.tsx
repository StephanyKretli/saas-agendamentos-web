"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useClients } from "@/features/clients/hooks/use-clients";
// 👇 IMPORTANTE: Ajuste o caminho do seu hook de serviços, se necessário
import { useServices } from "@/features/services/hooks/use-services"; 

interface AppointmentFormProps {
  initialDate?: string; // Para já vir preenchido se o usuário clicou num dia específico
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AppointmentForm({ initialDate, onSuccess, onCancel }: AppointmentFormProps) {
  // 1. Estados do formulário
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Buscando os dados para preencher os Selects (Dropdowns)
  const { data: clientsData } = useClients();
  const { data: servicesData } = useServices();

  // Nossas travas de segurança padrão Sênior 🛡️
  const clients = Array.isArray(clientsData) ? clientsData : (clientsData?.items ?? []);
  const services = Array.isArray(servicesData) ? servicesData : (servicesData?.items ?? []);

  // 3. Função de envio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 🚧 AQUI VAI A CHAMADA PARA A SUA API (POST /appointments)
      const payload = {
        clientId,
        serviceId,
        date, // Ex: "2026-03-23"
        time, // Ex: "14:30"
        notes,
      };
      
      console.log("Enviando para a API:", payload);
      
      // Simulando o tempo de requisição
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Se deu certo, avisa o componente pai para fechar o modal e recarregar a lista
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
      alert("Ocorreu um erro ao tentar salvar o agendamento.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      
      {/* SELEÇÃO DE CLIENTE E SERVIÇO */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cliente</label>
          <select 
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Selecione um cliente...</option>
            {clients.map((client: any) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Serviço</label>
          <select 
            required
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Selecione um serviço...</option>
            {services.map((service: any) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DATA E HORA (Lado a lado) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Data</label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Horário</label>
          <input 
            type="time" 
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* OBSERVAÇÕES */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Observações (Opcional)</label>
        <textarea 
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Cliente pediu para usar produto sem perfume..."
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  );
}