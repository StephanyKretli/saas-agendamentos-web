"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Clock, User, Scissors, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useServices } from "@/features/services/hooks/use-services"; 
import { createAppointment } from "../services/appointments.api";

interface AppointmentFormProps {
  initialDate?: string; 
  professionalId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AppointmentForm({ initialDate, professionalId, onSuccess, onCancel }: AppointmentFormProps) {
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  // 🌟 1. Adicionado o estado para controlar se é manutenção
  const [isMaintenanceBooking, setIsMaintenanceBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: clientsData } = useClients();
  const { data: servicesData } = useServices();

  const clients = Array.isArray(clientsData) ? clientsData : (clientsData?.items ?? []);
  const services = Array.isArray(servicesData) ? servicesData : (servicesData?.items ?? []);

  // 🌟 2. Encontra os detalhes do serviço que a pessoa selecionou no select
  const selectedServiceDetails = services.find((s: any) => s.id === serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        clientId,
        serviceId,
        date: `${date}T${time}:00`, 
        notes,
        professionalId,
        // 🌟 3. Envia a flag para o back-end saber que deve cobrar mais barato
        isMaintenance: isMaintenanceBooking,
      };
      
      await createAppointment(payload);
      
      toast.success("Agendamento criado com sucesso!");
      onSuccess?.();
      
    } catch (error: any) {
      toast.error(error.message || "Erro ao salvar agendamento");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4">
        {/* CLIENTE */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="h-4 w-4 text-muted-foreground" />
            Cliente
          </label>
          <select 
            required
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Selecione um cliente...</option>
            {clients.map((client: any) => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>

        {/* SERVIÇO */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Scissors className="h-4 w-4 text-muted-foreground" />
            Serviço
          </label>
          <select 
            required
            value={serviceId}
            // Quando troca de serviço, reseta a caixinha de manutenção por segurança
            onChange={(e) => {
              setServiceId(e.target.value);
              setIsMaintenanceBooking(false); 
            }}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Selecione um serviço...</option>
            {services.map((service: any) => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.duration} min)
              </option>
            ))}
          </select>
        </div>

        {/* 🌟 4. A CAIXINHA DE MANUTENÇÃO */}
        {selectedServiceDetails?.hasMaintenance && (
          <div className="mt-2 flex items-center justify-between p-4 bg-zinc-800/50 border border-zinc-700 rounded-xl">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-100">
                É um agendamento de manutenção?
              </span>
              <span className="text-xs text-zinc-400 mt-1">
                Tempo: {selectedServiceDetails.maintenanceDurationMinutes} min • 
                Preço: R$ {(selectedServiceDetails.maintenancePriceCents / 100).toFixed(2)}
              </span>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={isMaintenanceBooking}
                onChange={(e) => setIsMaintenanceBooking(e.target.checked)}
              />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        )}
      </div>

      {/* DATA E HORA */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Data
          </label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Horário
          </label>
          <input 
            type="time" 
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary"
          />
        </div>
      </div>

      {/* OBSERVAÇÕES */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <AlignLeft className="h-4 w-4 text-muted-foreground" />
          Observações (Opcional)
        </label>
        <textarea 
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas importantes sobre o atendimento..."
          className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary"
        />
      </div>

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
          {isLoading ? "Salvando..." : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  );
}