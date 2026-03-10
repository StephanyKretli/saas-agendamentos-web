"use client";

import * as React from "react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useClientHistory } from "@/features/clients/hooks/use-client-history";
import { ClientCard } from "@/features/clients/components/client-card";
import { ClientHistoryCard } from "@/features/clients/components/client-history-card";

export default function ClientsPage() {
  const { data, isLoading, isError, error } = useClients();
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(
    null,
  );

  const historyQuery = useClientHistory(selectedClientId);

  const clients = data?.items ?? [];
  const selectedClient = clients.find((client) => client.id === selectedClientId);

  React.useEffect(() => {
    if (clients.length && !selectedClientId) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando clientes...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 text-sm text-muted-foreground">
        {error instanceof Error
          ? error.message
          : "Não foi possível carregar os clientes."}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Visualize seus clientes e acompanhe o histórico de atendimentos.
        </p>
      </div>

      {!clients.length ? (
        <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="space-y-3">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                isSelected={selectedClientId === client.id}
                onSelect={setSelectedClientId}
              />
            ))}
          </div>

          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="text-base font-semibold text-foreground">
                {selectedClient?.name || "Cliente"}
              </h2>
              <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Telefone:</span>{" "}
                  {selectedClient?.phone || "-"}
                </p>
                <p>
                  <span className="font-medium text-foreground">E-mail:</span>{" "}
                  {selectedClient?.email || "Sem e-mail"}
                </p>
                <p>
                  <span className="font-medium text-foreground">Observações:</span>{" "}
                  {selectedClient?.notes || "Sem observações"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                Histórico de atendimentos
              </h3>

              {historyQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">
                  Carregando histórico...
                </p>
              ) : historyQuery.isError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-muted-foreground">
                  {historyQuery.error instanceof Error
                    ? historyQuery.error.message
                    : "Não foi possível carregar o histórico."}
                </div>
              ) : !historyQuery.data?.length ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  Nenhum atendimento encontrado para este cliente.
                </div>
              ) : (
                <div className="space-y-3">
                  {historyQuery.data.map((item) => (
                    <ClientHistoryCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}