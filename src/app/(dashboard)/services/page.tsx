"use client";

import { useState } from "react";
import { useServices } from "@/features/services/hooks/use-services";
import { ServiceList } from "@/features/services/components/service-list";
import { ServiceForm } from "@/features/services/components/service-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Plus, Scissors } from "lucide-react";
import { ServicesSkeleton } from "@/features/services/components/services-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Service } from "@/features/services/types/services.types";
import { motion } from "framer-motion";
import { GuideLink } from "@/features/guide/components/guide-link";

export default function ServicesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const { data, isLoading, refetch } = useServices();
  const servicesList = Array.isArray(data) ? data : (data?.items ?? []);

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setTimeout(() => setEditingService(null), 300); // Aguarda o fim da animação elástica
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 max-w-6xl mx-auto">
      
      {/* 🌟 CABEÇALHO PADRONIZADO */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Scissors className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">Serviços</h1>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              Gerencie os serviços oferecidos, duração e os respetivos valores.
            </p>
            <GuideLink section="servicos" className="mt-2" />
          </div>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button 
            onClick={() => { setEditingService(null); setIsFormOpen(true); }} 
            className="rounded-xl shadow-sm w-full sm:w-auto h-12 font-bold"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo serviço
          </Button>
        </motion.div>
      </motion.div>

      {/* 🌟 CONTEÚDO PRINCIPAL COM TRANSIÇÕES */}
      <div className="relative">
        {isLoading ? (
          <ServicesSkeleton />
        ) : servicesList.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <EmptyState
              icon={Scissors}
              title="Nenhum serviço cadastrado"
              description="Ainda não cadastrou nenhum serviço. Adicione o seu primeiro serviço para poder receber agendamentos."
              actionLabel="Cadastrar primeiro serviço"
              onAction={() => { setEditingService(null); setIsFormOpen(true); }}
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden p-2 sm:p-4"
          >
            <ServiceList 
              services={servicesList} 
              onDeleteSuccess={() => refetch()} 
              onEdit={(service) => { 
                setEditingService(service);
                setIsFormOpen(true);
              }}
            />
          </motion.div>
        )}
      </div>

      {/* 🌟 MODAL DE CRIAÇÃO/EDIÇÃO */}
      <Modal
        open={isFormOpen}
        onClose={handleCloseModal}
        title={editingService ? "Editar Serviço" : "Cadastrar Serviço"}
      >
        <ServiceForm
          initialData={editingService}
          onSuccess={() => {
            handleCloseModal();
            refetch();
          }}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
}