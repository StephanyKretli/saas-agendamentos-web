import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { PublicService } from "@/types/temp";

type Props = {
  service: PublicService;
  selected: boolean;
  onSelect: () => void;
};

export function ServiceCard({ service, selected, onSelect }: Props) {
  return (
    <button className="w-full text-left" onClick={onSelect} type="button">
      <Card
        className={cn(
          "rounded-2xl border transition-all duration-200",
          selected
            ? "border-slate-900 shadow-md ring-2 ring-slate-900/10"
            : "border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md",
        )}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                {service.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {formatDuration(service.duration)}
              </p>
            </div>

            <span className="text-sm font-medium text-slate-800">
              {formatPrice(service.priceCents)}
            </span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}