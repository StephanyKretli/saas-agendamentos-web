import { Client } from "../types/clients.types";
import { Button } from "@/components/ui/button";

interface ClientListProps {
  clients: Client[];
  onViewHistory?: (clientId: string) => void;
  onDeleteSuccess?: () => void;
}

export function ClientList({ clients, onViewHistory }: ClientListProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-muted-foreground">Nenhum cliente cadastrado ainda.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <ul className="divide-y divide-border">
        {clients.map((client) => (
          <li key={client.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">{client.name}</p>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
              {client.email && (
                <p className="text-xs text-muted-foreground">{client.email}</p>
              )}
            </div>
            {onViewHistory && (
              <Button variant="outline" size="sm" onClick={() => onViewHistory(client.id)}>
                Ver Histórico
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}