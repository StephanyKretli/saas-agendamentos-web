"use client";

import { useState } from "react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientForm } from "@/features/clients/components/client-form";
import { Button } from "@/components/ui/button";
import { Plus, Users, X } from "lucide-react"; 
import { ClientHistoryList } from "@/features/clients/components/client-history-list";
import { ClientsSkeleton } from "@/features/clients/components/clients-skeleton"; 
import { EmptyState } from "@/components/ui/empty-state";

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useClients();
  const clientsList = Array.isArray(data) ? data : (data?.items ?? []);

  return (
    <div className="space-y-6 relative">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie sua carteira de clientes, contatos e observações.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      {isLoading ? (
        <ClientsSkeleton />
      ) : clientsList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Comece adicionando seus clientes para gerenciar agendamentos e históricos."
          actionLabel="Cadastrar primeiro cliente"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="animate-in fade-in duration-500">
          <ClientList 
            clients={clientsList} 
            onViewHistory={(id) => setSelectedClientId(id)} 
            onDeleteSuccess={() => {}} 
          />
        </div>
      )}

      {/* MODAL DE CADASTRO (CLIENTE) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Cadastrar Cliente</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFormOpen(false)} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
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

      {/* DRAWER LATERAL (HISTÓRICO) */}
      {selectedClientId && (
        <div 
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedClientId(null);
          }}
        >
          <div className="flex h-full w-full max-w-md flex-col bg-background shadow-2xl border-l border-border animate-in slide-in-from-right duration-500">
            
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <h2 className="text-xl font-semibold">Histórico</h2>
                <p className="text-xs text-muted-foreground mt-1">Todos os agendamentos realizados.</p>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setSelectedClientId(null)}
                className="rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-muted/5">
              <ClientHistoryList clientId={selectedClientId} />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}