import { Card, CardContent } from "@/components/ui/card";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { PublicService } from "@/features/public-booking/types/public-booking.types";
type Props = {
  service?: PublicService;
  date?: string;
  time?: string;
};

export function BookingSummary({ service, date, time }: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <h3 className="mb-4 text-sm font-medium text-slate-700">Resumo</h3>

        <div className="space-y-3 text-sm text-slate-600">
          <div>
            <span className="block text-xs uppercase tracking-wide text-slate-400">
              Serviço
            </span>
            <span className="font-medium text-slate-900">
              {service?.name || "Selecione um serviço"}
            </span>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-slate-400">
              Duração
            </span>
            <span>{service ? formatDuration(service.duration) : "--"}</span>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-slate-400">
              Valor
            </span>
            <span>{service ? formatPrice(service.priceCents) : "--"}</span>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-slate-400">
              Data
            </span>
            <span>{date || "--"}</span>
          </div>

          <div>
            <span className="block text-xs uppercase tracking-wide text-slate-400">
              Horário
            </span>
            <span>{time || "--"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}