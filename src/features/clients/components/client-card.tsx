import type { Client } from "../types/clients.types";

type ClientCardProps = {
  client: Client;
  isSelected: boolean;
  onSelect: (clientId: string) => void;
};

export function ClientCard({
  client,
  isSelected,
  onSelect,
}: ClientCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(client.id)}
      className={[
        "w-full rounded-2xl border bg-card p-4 text-left shadow-sm transition",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            {client.name}
          </h3>

          <p className="text-sm text-muted-foreground">{client.phone}</p>

          <p className="text-sm text-muted-foreground">
            {client.email || "Sem e-mail"}
          </p>
        </div>

        {isSelected ? (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Selecionado
          </span>
        ) : null}
      </div>
    </button>
  );
}