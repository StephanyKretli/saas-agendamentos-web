import type { Client } from "../types/clients.types";

type ClientCardProps = {
  client: Client;
  isSelected: boolean;
  onSelect: (clientId: string) => void;
};

function getInitial(name?: string | null) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

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
        "w-full rounded-2xl border bg-card p-4 text-left shadow-sm transition-all",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {getInitial(client.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-foreground">
                {client.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {client.phone}
              </p>
            </div>

            {isSelected ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                Selecionado
              </span>
            ) : null}
          </div>

          <p className="mt-2 truncate text-sm text-muted-foreground">
            {client.email || "Sem e-mail"}
          </p>
        </div>
      </div>
    </button>
  );
}