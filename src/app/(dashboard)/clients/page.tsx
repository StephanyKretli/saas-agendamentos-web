"use client";

import { useState } from "react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientForm } from "@/features/clients/components/client-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ClientHistoryList } from "@/features/clients/components/client-history-list";

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useClients();
  const clientsList = Array.isArray(data) ? data : (data?.items ?? []);

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie sua carteira de clientes, contatos e observações.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <ClientList 
          clients={clientsList} 
          onViewHistory={(id) => setSelectedClientId(id)} 
          onDeleteSuccess={() => refetch()} 
        />
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Cadastrar Cliente</h2>
            <ClientForm 
              onSuccess={() => {
                setIsFormOpen(false);
                refetch();
              }} 
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {selectedClientId && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedClientId(null);
            }
          }}
        >
          <div className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl border-l border-border animate-in slide-in-from-right duration-300">
            
            <div className="flex items-center justify-between border-b border-border p-6 pb-4">
              <h2 className="text-xl font-semibold">Histórico de Agendamentos</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedClientId(null)}>
                Fechar
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <ClientHistoryList clientId={selectedClientId} />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}