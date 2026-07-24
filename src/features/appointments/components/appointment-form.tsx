"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { Calendar, Clock, User, Scissors, AlignLeft, Search } from "lucide-react";
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
  
  // 🌟 NOVOS ESTADOS PARA A BUSCA INTELIGENTE
  const [clientSearch, setClientSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState(initialDate || "");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isMaintenanceBooking, setIsMaintenanceBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 🌟 ESTADO DO PASSE LIVRE
  const [ignoreRules, setIgnoreRules] = useState(false);

  // 🌟 DEBOUNCE: Espera 300ms depois que você parar de digitar para buscar na API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(clientSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca os clientes passando o texto da pesquisa!
  const { data: clientsData, isLoading: isSearchingClients } = useClients(1, debouncedSearch);
  const { data: servicesData } = useServices();

  const payloadClients = (clientsData as any)?.data ? (clientsData as any).data : clientsData;
  const payloadServices = (servicesData as any)?.data ? (servicesData as any).data : servicesData;

  const clients = Array.isArray(payloadClients) ? payloadClients : (payloadClients?.items ?? []);
  const services = Array.isArray(payloadServices) ? payloadServices : (payloadServices?.items ?? []);

  const selectedServiceDetails = services.find((s: any) => s.id === serviceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId) {
      toast.error("Por favor, selecione um cliente da lista.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        clientId,
        serviceId,
        date: `${date}T${time}:00`, 
        notes,
        professionalId,
        isMaintenance: isMaintenanceBooking,
        // 🌟 O PASSE LIVRE ENVIADO PARA A API
        ignoreAvailabilityRules: ignoreRules,
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
        
        {/* 🌟 CLIENTE - COMBOBOX DE PESQUISA */}
        <div className="space-y-2" ref={wrapperRef}>
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="h-4 w-4 text-muted-foreground" />
            Cliente
          </label>
          <div className="relative">
            <div className="relative">
              <input 
                type="text"
                required={!clientId} 
                value={clientSearch}
                onChange={(e) => {
                  setClientSearch(e.target.value);
                  setIsDropdownOpen(true);
                  if (clientId) setClientId(""); // Limpa o ID se você alterar o texto
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Digite para buscar pelo nome ou telefone..."
                className="w-full rounded-xl border border-input bg-background pl-3 pr-10 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            </div>

            {/* O Dropdown flutuante com os resultados */}
            {isDropdownOpen && (
              <div className="absolute z-50 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-border bg-card shadow-lg py-1 custom-scrollbar">
                {isSearchingClients ? (
                  <div className="p-3 text-sm text-center text-muted-foreground animate-pulse">Buscando...</div>
                ) : clients.length === 0 ? (
                  <div className="p-3 text-sm text-center text-muted-foreground">Nenhum cliente encontrado.</div>
                ) : (
                  clients.map((client: any) => (
                    <button
                      key={client.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault(); // Impede que o input perca o foco antes do clique
                        setClientId(client.id);
                        setClientSearch(client.name);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex flex-col items-start px-3 py-2 hover:bg-muted transition-colors text-left"
                    >
                      <span className="text-sm font-medium text-foreground">{client.name}</span>
                      {client.phone && <span className="text-xs text-muted-foreground mt-0.5">{client.phone}</span>}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
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

        {/* A CAIXINHA DE MANUTENÇÃO */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 min-w-0">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Data
          </label>
          <input 
            type="date" 
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary"
          />
        </div>
        <div className="space-y-2 min-w-0">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Horário
          </label>
          <input 
            type="time" 
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-primary"
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

      {/* 🌟 CHECKBOX DE ENCAIXE VIP */}
      <div className="flex items-center space-x-3 mt-4 mb-2 p-4 bg-zinc-900/40 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-colors">
        <input
          type="checkbox"
          id="ignoreRules"
          checked={ignoreRules}
          onChange={(e) => setIgnoreRules(e.target.checked)}
          className="w-4 h-4 text-zinc-100 bg-zinc-950 border-zinc-700 rounded focus:ring-zinc-800 focus:ring-2 cursor-pointer transition-all"
        />
        <div className="flex flex-col">
          <label htmlFor="ignoreRules" className="text-sm font-medium text-zinc-200 cursor-pointer select-none">
            Forçar Encaixe VIP
          </label>
          <span 
            className="text-xs text-zinc-500 cursor-pointer select-none" 
            onClick={() => setIgnoreRules(!ignoreRules)}
          >
            Ignorar bloqueios, pausas e horário de funcionamento
          </span>
        </div>
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