"use client";

import * as React from "react";
import { useClients } from "@/features/clients/hooks/use-clients";
import { useClientHistory } from "@/features/clients/hooks/use-client-history";
import { ClientCard } from "@/features/clients/components/client-card";
import { ClientHistoryCard } from "@/features/clients/components/client-history-card";

function getClientStats(history: Array<{ status: string }>) {
  const total = history.length;
  const scheduled = history.filter((item) => item.status === "SCHEDULED").length;
  const completed = history.filter((item) => item.status === "COMPLETED").length;
  const canceled = history.filter((item) => item.status === "CANCELED").length;

  return {
    total,
    scheduled,
    completed,
    canceled,
  };
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function ClientsPage() {
  const { data, isLoading, isError, error } = useClients();
  const [selectedClientId, setSelectedClientId] = React.useState<string | null>(
    null,
  );

  const clients = data?.items ?? [];
  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? null;

  React.useEffect(() => {
    if (clients.length && !selectedClientId) {
      setSelectedClientId(clients[0].id);
    }
  }, [clients, selectedClientId]);

  const historyQuery = useClientHistory(selectedClientId);
  const history = historyQuery.data?.items ?? [];
  const summary = historyQuery.data?.summary;

  const stats = React.useMemo(() => getClientStats(history), [history]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Carregando seus clientes...
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-border bg-muted"
              />
            ))}
          </div>

          <div className="space-y-4">
            <div className="h-32 animate-pulse rounded-2xl border border-border bg-muted" />
            <div className="h-48 animate-pulse rounded-2xl border border-border bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar seus clientes.
          </p>
        </div>

        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          {error instanceof Error
            ? error.message
            : "Não foi possível carregar os clientes."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Visualize seus clientes e acompanhe o histórico de atendimentos.
        </p>
      </div>

      {!clients.length ? (
        <div className="rounded-2xl border border-border bg-card px-4 py-8 text-sm text-muted-foreground shadow-sm">
          Nenhum cliente encontrado.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <section className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-medium text-foreground">
                {clients.length} cliente(s) cadastrado(s)
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Selecione um cliente para ver os detalhes e o histórico.
              </p>
            </div>

            <div className="space-y-3">
              {clients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  isSelected={client.id === selectedClientId}
                  onSelect={setSelectedClientId}
                />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Cliente selecionado
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-foreground">
                    {selectedClient?.name || "Cliente"}
                  </h2>
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Telefone
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {selectedClient?.phone || "-"}
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    E-mail
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {selectedClient?.email || "Sem e-mail"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-muted/20 px-4 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Observações
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {selectedClient?.notes || "Sem observações"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Atendimentos" value={stats.total} />
              <StatCard label="Agendados" value={stats.scheduled} />
              <StatCard label="Concluídos" value={stats.completed} />
              <StatCard label="Cancelados" value={stats.canceled} />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Histórico de atendimentos
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Veja os atendimentos já registrados para este cliente.
                </p>
              </div>

              {historyQuery.isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-32 animate-pulse rounded-2xl border border-border bg-muted"
                    />
                  ))}
                </div>
              ) : historyQuery.isError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
                  {historyQuery.error instanceof Error
                    ? historyQuery.error.message
                    : "Não foi possível carregar o histórico."}
                </div>
              ) : !history.length ? (
                <div className="rounded-2xl border border-border bg-card px-4 py-6 text-sm text-muted-foreground shadow-sm">
                  Nenhum atendimento encontrado para este cliente.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => (
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