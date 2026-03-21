"use client";

import { useState } from "react";
import { useServices } from "@/features/services/hooks/use-services";
import { ServiceList } from "@/features/services/components/service-list";
import { ServiceForm } from "@/features/services/components/service-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ServicesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { data: services, isLoading, refetch } = useServices();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie os serviços que você oferece aos seus clientes.
          </p>
        </div>

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo serviço
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <ServiceList 
          services={services?.items || []} // Acesse a propriedade .items aqui
          onDeleteSuccess={() => refetch()} 
        />
      )}

      {/* Modal/Formulário de Criação */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Cadastrar Serviço</h2>
            <ServiceForm 
              onSuccess={() => {
                setIsFormOpen(false);
                refetch();
              }} 
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}