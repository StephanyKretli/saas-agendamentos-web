"use client";

import { useState } from "react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientForm } from "@/features/clients/components/client-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Users, X, Search } from "lucide-react"; 
import { ClientHistoryList } from "@/features/clients/components/client-history-list";
import { ClientsSkeleton } from "@/features/clients/components/clients-skeleton"; 
import { EmptyState } from "@/components/ui/empty-state";

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // <-- NOVO: Estado da busca

  const { data, isLoading, refetch } = useClients();
  const clientsList = Array.isArray(data) ? data : (data?.items ?? []);

  // LÓGICA DE BUSCA: Filtra por nome, telefone ou e-mail
  // LÓGICA DE BUSCA: Filtra ignorando acentos, maiúsculas/minúsculas e formatação de telefone
  const filteredClients = clientsList.filter((client) => {
    if (!searchQuery) return true;

    // 1. Prepara o que o usuário digitou (tira acentos, espaços no início/fim e deixa minúsculo)
    const normalizedQuery = searchQuery
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
      
    // 2. Extrai apenas os números da busca (para comparar com telefones)
    const queryNumbersOnly = searchQuery.replace(/\D/g, "");

    // 3. Prepara os dados do cliente para comparar de igual para igual
    const clientName = (client.name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
      
    const clientEmail = (client.email || "").toLowerCase();
    
    // Deixa o telefone do banco de dados apenas com números (ex: "(11) 9999" vira "119999")
    const clientPhoneOnlyNumbers = (client.phone || "").replace(/\D/g, ""); 
    const originalPhone = (client.phone || "").toLowerCase();

    // 4. Faz as comparações
    const nameMatch = clientName.includes(normalizedQuery);
    const emailMatch = clientEmail.includes(normalizedQuery);
    
    // Verifica se bate com os números limpos OU com a formatação exata que o usuário digitou
    const phoneMatch = (queryNumbersOnly.length > 0 && clientPhoneOnlyNumbers.includes(queryNumbersOnly)) 
                    || originalPhone.includes(normalizedQuery);

    return nameMatch || emailMatch || phoneMatch;
  });

  return (
    <div className="space-y-6 relative sm:space-y-8 animate-in fade-in duration-300">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie sua carteira de clientes, contatos e observações.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-sm w-full sm:w-auto h-11">
          <Plus className="mr-2 h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {/* BARRA DE BUSCA (Só aparece se houver pelo menos 1 cliente cadastrado no total) */}
      {!isLoading && clientsList.length > 0 && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Buscar por nome, telefone ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 w-full rounded-2xl border-border bg-card pl-11 pr-4 shadow-sm transition-all focus-visible:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      {isLoading ? (
        <ClientsSkeleton />
      ) : clientsList.length === 0 ? (
        // Estado 1: Conta novinha, não tem nenhum cliente ainda
        <EmptyState
          icon={Users}
          title="Nenhum cliente cadastrado"
          description="Comece adicionando seus clientes para gerenciar agendamentos e históricos."
          actionLabel="Cadastrar primeiro cliente"
          onAction={() => setIsFormOpen(true)}
        />
      ) : filteredClients.length === 0 ? (
        // Estado 2: Tem clientes, mas a busca não encontrou ninguém
        <EmptyState
          icon={Search}
          title="Nenhum resultado encontrado"
          description={`Não encontramos nenhum cliente correspondente a "${searchQuery}".`}
          actionLabel="Limpar busca"
          onAction={() => setSearchQuery("")}
        />
      ) : (
        // Estado 3: Lista de clientes filtrada
        <div className="animate-in fade-in duration-500">
          <ClientList 
            clients={filteredClients} 
            onViewHistory={(id) => setSelectedClientId(id)} 
            onDeleteSuccess={() => refetch()} // Atualizado para dar refetch após deletar
          />
        </div>
      )}

      {/* MODAL DE CADASTRO (CLIENTE) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-2xl border border-border animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Cadastrar Cliente</h2>
              <button 
                onClick={() => setIsFormOpen(false)} 
                className="rounded-full p-2 bg-muted/50 hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
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
          <div className="flex h-full w-full max-w-md flex-col bg-card shadow-2xl border-l border-border animate-in slide-in-from-right duration-500">
            
            <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-muted/10">
              <div>
                <h2 className="text-xl font-bold text-foreground">Histórico</h2>
                <p className="text-sm text-muted-foreground mt-1">Todos os agendamentos realizados.</p>
              </div>
              <button 
                onClick={() => setSelectedClientId(null)}
                className="rounded-full p-2 hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
              <ClientHistoryList clientId={selectedClientId} />
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}