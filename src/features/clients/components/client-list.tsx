"use client";

import { Button } from "@/components/ui/button";
import { Phone, Mail, User, History, Trash2 } from "lucide-react";
import { useDeleteClient } from "@/features/clients/hooks/use-delete-client";
import { toast } from "react-hot-toast";

interface Client {
  id: string;
  name: string;
  phone?: string | null; 
  email?: string | null; 
}

interface ClientListProps {
  clients: Client[];
  onViewHistory: (id: string) => void;
  onDeleteSuccess: () => void;
}

export function ClientList({ clients, onViewHistory, onDeleteSuccess }: ClientListProps) {
  const { mutate: deleteClient, isPending } = useDeleteClient();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o cliente ${name}?`)) {
      deleteClient(id, {
        onSuccess: () => {
          toast.success("Cliente removido com sucesso!");
          onDeleteSuccess();
        },
        onError: () => {
          toast.error("Erro ao remover cliente.");
        }
      });
    }
  };

  return (
    <div className="grid gap-4">
      {clients.map((client) => (
        <div 
          key={client.id} 
          className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            
            {/* INFORMAÇÕES DO CLIENTE */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 text-primary">
                <User className="h-6 w-6" />
              </div>
              
              <div className="space-y-1">
                <h3 className="font-semibold text-lg leading-none">{client.name}</h3>
                
                <div className="flex flex-col gap-1.5 pt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{client.phone || "Sem telefone"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-50 sm:max-w-none">
                      {client.email || "Sem e-mail"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* AÇÕES */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewHistory(client.id)}
                className="rounded-xl h-10 px-4 hover:bg-primary hover:text-primary-foreground transition-all"
              >
                <History className="mr-2 h-4 w-4" />
                Ver Histórico
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                disabled={isPending}
                onClick={() => handleDelete(client.id, client.name)}
                className="rounded-xl h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}