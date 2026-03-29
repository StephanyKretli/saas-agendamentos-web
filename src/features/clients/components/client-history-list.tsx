"use client";

import { useState } from "react";
import { useClientHistory } from "../hooks/use-client-history";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, DollarSign, Clock, Scissors, Ban, RefreshCw, CalendarDays, Filter } from "lucide-react";

interface ClientHistoryListProps {
  clientId: string;
}

export function ClientHistoryList({ clientId }: ClientHistoryListProps) {
  // Estados para guardar as datas selecionadas
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  
  // Estados que realmente acionam a busca (para não pesquisar enquanto o utilizador ainda está a digitar)
  const [activeFromDate, setActiveFromDate] = useState<string | undefined>(undefined);
  const [activeToDate, setActiveToDate] = useState<string | undefined>(undefined);

  const { data, isLoading, isError, isFetching } = useClientHistory(clientId, activeFromDate, activeToDate);

  const handleFilter = () => {
    setActiveFromDate(fromDate || undefined);
    setActiveToDate(toDate || undefined);
  };

  const handleClearFilter = () => {
    setFromDate("");
    setToDate("");
    setActiveFromDate(undefined);
    setActiveToDate(undefined);
  };

  if (isLoading && !isFetching) {
    return (
      <div className="space-y-4">
        <div className="h-[120px] animate-pulse rounded-2xl bg-muted" />
        <div className="h-[200px] animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center text-destructive">
        <p className="font-semibold">Erro ao carregar o histórico.</p>
        <p className="text-sm opacity-80 mt-1">Tente abrir o histórico novamente.</p>
      </div>
    );
  }

  const { client, summary, items } = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* CABEÇALHO COM NOME E ANOTAÇÕES */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">{client.name}</h3>
            {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
          </div>
        </div>
        
        {client.notes && (
          <div className="mt-4 rounded-xl bg-amber-500/10 p-3 border border-amber-500/20">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Anotações do Salão</p>
            <p className="text-sm text-foreground italic">"{client.notes}"</p>
          </div>
        )}
      </div>

      {/* 🌟 FILTRO DE DATAS (NOVO) */}
      <div className="rounded-2xl border border-border bg-muted/10 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
          <Filter className="h-4 w-4" /> 
          <p>Filtrar por Período</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground ml-1">De:</label>
            <input 
              type="date" 
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-muted-foreground ml-1">Até:</label>
            <input 
              type="date" 
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <button 
            onClick={handleFilter}
            disabled={isFetching}
            className="flex-1 rounded-xl bg-primary text-primary-foreground py-2 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isFetching ? "Filtrando..." : "Aplicar Filtro"}
          </button>
          {(activeFromDate || activeToDate) && (
            <button 
              onClick={handleClearFilter}
              className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* RESUMO (MÉTRICAS) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 mb-2">
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Total Gasto</p>
          <p className="text-xl font-bold text-foreground mt-0.5">R$ {summary.totalSpentFormatted}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 mb-2">
            <Calendar className="h-4 w-4" />
          </div>
          <p className="text-xs font-medium text-muted-foreground">Visitas</p>
          <p className="text-xl font-bold text-foreground mt-0.5">{summary.completedAppointments}</p>
        </div>
      </div>

      {/* LISTA DE AGENDAMENTOS */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 px-1">
          {activeFromDate || activeToDate ? "Agendamentos Filtrados" : "Histórico de Agendamentos"}
        </h3>
        
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-8 text-center bg-muted/20">
            <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum agendamento encontrado no período.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((apt) => {
              const aptDate = new Date(apt.date);
              
              // Definindo cores baseadas no status
              let statusColor = "bg-muted text-muted-foreground";
              let StatusIcon = Clock;
              
              if (apt.status === "COMPLETED") {
                statusColor = "bg-green-500/10 text-green-600";
                StatusIcon = RefreshCw; // Usando RefreshCw temporariamente por não ter Check no import do exemplo
              } else if (apt.status === "CANCELED") {
                statusColor = "bg-destructive/10 text-destructive";
                StatusIcon = Ban;
              } else if (apt.status === "SCHEDULED") {
                statusColor = "bg-blue-500/10 text-blue-600";
                StatusIcon = Calendar;
              }

              return (
                <div key={apt.id} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground text-sm flex items-center gap-2">
                        {format(aptDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{format(aptDate, "HH:mm")}</span>
                        <span className="mx-1">•</span>
                        <Scissors className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">{apt.service.name}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusColor}`}>
                        <StatusIcon className="h-3 w-3" />
                        {apt.status === "COMPLETED" ? "Concluído" : apt.status === "CANCELED" ? "Cancelado" : "Marcado"}
                      </span>
                      <span className="text-sm font-bold text-foreground">
                        R$ {(apt.service.priceCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}