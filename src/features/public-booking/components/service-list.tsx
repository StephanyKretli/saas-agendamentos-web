import type { PublicService } from "../types/public-booking.types";

type ServiceListProps = {
  services: PublicService[];
  selectedServiceId: string | null;
  onSelectService: (service: PublicService) => void;
};

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export function ServiceList({
  services,
  selectedServiceId,
  onSelectService,
}: ServiceListProps) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-5">
        <p className="text-sm font-medium text-foreground">
          Nenhum serviço disponível
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Este profissional ainda não cadastrou serviços para agendamento.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {services.map((service) => {
        const isSelected = selectedServiceId === service.id;

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelectService(service)}
            className={`w-full rounded-2xl border p-4 text-left transition-all ${
              isSelected
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-background hover:bg-muted/40"
            }`}
          >
            <div className="flex items-start gap-4">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name}
                  className="h-20 w-20 rounded-2xl border border-border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-xs text-muted-foreground">
                  Sem imagem
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {service.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {service.duration} min
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isSelected ? "Selecionado" : "Selecionar"}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-foreground">
                  {formatPrice(service.priceCents)}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}