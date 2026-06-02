"use client";

import { useState, useEffect } from "react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { ClientList } from "@/features/clients/components/client-list";
import { ClientForm } from "@/features/clients/components/client-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientHistoryList } from "@/features/clients/components/client-history-list";
import { ClientsSkeleton } from "@/features/clients/components/clients-skeleton"; 
import { EmptyState } from "@/components/ui/empty-state";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Users, X, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, refetch } = useClients(page, debouncedSearch);
  
  // LEITURA DIRETA E SEGURA
  const clientsList = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      
      {/* CABEÇALHO */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Clientes</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Gerencie a sua carteira de clientes, contactos e observações.
            </p>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-sm w-full sm:w-auto h-12 font-bold">
            <Plus className="mr-2 h-4 w-4" />
            Novo cliente
          </Button>
        </motion.div>
      </motion.div>

      {/* BARRA DE BUSCA */}
      {(!isLoading || clientsList.length > 0 || searchQuery) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="relative group"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Procurar por nome, telefone ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border-border/50 bg-card pl-12 pr-12 shadow-sm transition-all focus-visible:ring-primary/50 focus-visible:border-primary text-base"
          />
        </motion.div>
      )}

      {/* CONTEÚDO */}
      <div className="relative">
        {isLoading ? (
          <ClientsSkeleton />
        ) : clientsList.length === 0 ? (
          <EmptyState
            icon={searchQuery ? Search : Users}
            title={searchQuery ? "Nenhum resultado encontrado" : "Nenhum cliente cadastrado"}
            description={searchQuery ? `Não encontrámos nenhum cliente correspondente a "${searchQuery}".` : "Comece por adicionar os seus clientes para gerenciar agendamentos e históricos."}
            actionLabel={searchQuery ? "Limpar busca" : "Cadastrar primeiro cliente"}
            onAction={() => searchQuery ? setSearchQuery("") : setIsFormOpen(true)}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <ClientList 
              clients={clientsList} 
              onViewHistory={(id) => setSelectedClientId(id)} 
              onDeleteSuccess={() => refetch()} 
            />
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <span className="text-sm font-medium text-muted-foreground">Página {page} de {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* MODAL E DRAWER */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl border">
              <ClientForm onSuccess={() => { setIsFormOpen(false); refetch(); }} onCancel={() => setIsFormOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Clientes</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Gerencie a sua carteira de clientes, contactos e observações.
            </p>
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button onClick={() => setIsFormOpen(true)} className="rounded-xl shadow-sm w-full sm:w-auto h-12 font-bold">
            <Plus className="mr-2 h-4 w-4" />
            Novo cliente
          </Button>
        </motion.div>
      </motion.div>

      {(!isLoading || clientsList.length > 0 || searchQuery) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="relative group"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Procurar por nome, telefone ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 w-full rounded-2xl border-border/50 bg-card pl-12 pr-12 shadow-sm transition-all focus-visible:ring-primary/50 focus-visible:border-primary text-base"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="p-1.5 bg-muted rounded-full hover:bg-muted-foreground/20">
                  <X className="h-4 w-4" />
                </div>
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <div className="relative">
        {isLoading ? (
          <ClientsSkeleton />
        ) : clientsList.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <EmptyState
              icon={searchQuery ? Search : Users}
              title={searchQuery ? "Nenhum resultado encontrado" : "Nenhum cliente cadastrado"}
              description={searchQuery ? `Não encontrámos nenhum cliente correspondente a "${searchQuery}".` : "Comece por adicionar os seus clientes para gerenciar agendamentos e históricos."}
              actionLabel={searchQuery ? "Limpar busca" : "Cadastrar primeiro cliente"}
              onAction={() => searchQuery ? setSearchQuery("") : setIsFormOpen(true)}
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
          >
            <ClientList 
              clients={clientsList} 
              onViewHistory={(id) => setSelectedClientId(id)} 
              onDeleteSuccess={() => refetch()} 
            />

            
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-muted/20">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-semibold shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                
                <span className="text-sm font-medium text-muted-foreground">
                  Página <strong className="text-foreground">{page}</strong> de {totalPages}
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="font-semibold shadow-sm"
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 sm:p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-card p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClientId && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedClientId(null);
            }}
          >
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 250, damping: 30 }}
              className="flex h-full w-full max-w-md flex-col bg-card shadow-2xl border-l border-border"
            >
              <div className="flex items-center justify-between border-b border-border p-5 sm:p-6 bg-muted/30">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
