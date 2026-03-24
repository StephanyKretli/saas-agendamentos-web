"use client";

import { useState } from "react";
import { useServices } from "@/features/services/hooks/use-services";
import { ServiceList } from "@/features/services/components/service-list";
import { ServiceForm } from "@/features/services/components/service-form";
import { Button } from "@/components/ui/button";
import { Plus, Scissors, X } from "lucide-react";
import { ServicesSkeleton } from "@/features/services/components/services-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Service } from "@/features/services/types/services.types";

export default function ServicesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data, isLoading, refetch } = useServices();
  const servicesList = Array.isArray(data) ? data : (data?.items ?? []);

  // Limpa tudo certinho ao fechar o modal
  const handleCloseModal = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingService(null), 200); // Aguarda a animação para limpar
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Serviços</h1>
          <p className="text-sm text-muted-foreground">Gerencie os serviços oferecidos.</p>
        </div>
        <Button onClick={() => { setEditingService(null); setIsFormOpen(true); }} className="rounded-xl shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      {isLoading ? (
        <ServicesSkeleton />
      ) : servicesList.length === 0 ? (
        <EmptyState
          icon={Scissors}
          title="Nenhum serviço encontrado"
          description="Você ainda não cadastrou nenhum serviço. Adicione um para começar a realizar agendamentos."
          actionLabel="Cadastrar primeiro serviço"
          onAction={() => { setEditingService(null); setIsFormOpen(true); }}
        />
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <ServiceList 
            services={servicesList} 
            onDeleteSuccess={() => refetch()} 
            onEdit={(service) => { 
              setEditingService(service); // Salva o serviço clicado
              setIsFormOpen(true);        // Abre o modal
            }}
          />
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              {/* O título DEVE MUDAR para 'Editar Serviço' se funcionar */}
              <h2 className="text-xl font-semibold">
                {editingService ? "Editar Serviço" : "Cadastrar Serviço"}
              </h2>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <ServiceForm 
              initialValues={editingService} 
              onSuccess={() => {
                handleCloseModal();
                refetch();
              }} 
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}