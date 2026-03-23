"use client";

import { useClientHistory } from "../hooks/use-client-history";
import { ClientHistoryCard } from "./client-history-card";
import { Loader2 } from "lucide-react"; 

interface ClientHistoryListProps {
  clientId: string;
}

export function ClientHistoryList({ clientId }: ClientHistoryListProps) {
  const { data, isLoading, isError } = useClientHistory(clientId);

  if (isLoading) {
    return (
      <div className="flex py-10 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500 text-center py-4">
        Não foi possível carregar o histórico no momento.
      </p>
    );
  }

  const historyList = Array.isArray(data) ? data : (data?.items ?? []);

  if (historyList.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Nenhum agendamento encontrado para este cliente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto pb-6 pr-2">
      {historyList.map((item: any) => (
        <ClientHistoryCard key={item.id} item={item} />
      ))}
    </div>
  );
}