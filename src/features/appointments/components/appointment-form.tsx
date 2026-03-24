"use client";

import { useState } from "react";
import { toast } from "react-hot-toast"; //
import { Calendar, Clock, User, Scissors, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useServices } from "@/features/services/hooks/use-services"; 
import { createAppointment } from "../services/appointments.api";

interface AppointmentFormProps {
  initialDate?: string; 
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AppointmentForm({ initialDate, onSuccess, onCancel }: AppointmentFormProps) {
  const [clientId, setClientId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: clientsData } = useClients();
  const { data: servicesData } = useServices();

  const clients = Array.isArray(clientsData) ? clientsData : (clientsData?.items ?? []);
  const services = Array.isArray(servicesData) ? servicesData : (servicesData?.items ?? []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        clientId,
        serviceId,
        date: `${date}T${time}:00`, 
        notes,
      };
      
      await createAppointment(payload);
      
      toast.success("Agendamento criado com sucesso!"); // Substitui o console/alert
      onSuccess?.();
      
    } catch (error: any) {
      // Exibe a mensagem tratada pelo seu interceptor da api.ts
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
            onChange={(e) => setServiceId(e.target.value)}
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