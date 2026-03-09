import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  slots: string[];
  selectedSlot?: string;
  onSelect: (slot: string) => void;
  isLoading?: boolean;
};

export function TimeSlotsGrid({
  slots,
  selectedSlot,
  onSelect,
  isLoading,
}: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-slate-700">Horários</h3>
        </div>

        {isLoading ? (
          <div className="text-sm text-slate-500">Carregando horários...</div>
        ) : slots.length === 0 ? (
          <div className="text-sm text-slate-500">
            Nenhum horário disponível para esta data.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => onSelect(slot)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-sm font-medium transition",
                  selectedSlot === slot
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                )}
              >
                {slot}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}