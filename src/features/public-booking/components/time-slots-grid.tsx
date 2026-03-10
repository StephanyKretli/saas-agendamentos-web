type TimeSlotsGridProps = {
  slots: string[];
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isLoading?: boolean;
};

export function TimeSlotsGrid({
  slots,
  selectedTime,
  onSelectTime,
  isLoading = false,
}: TimeSlotsGridProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Horários disponíveis
        </h3>
        <p className="text-sm text-muted-foreground">
          Escolha um horário para continuar.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Nenhum horário disponível para a data selecionada.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot;

            return (
              <button
                key={slot}
                type="button"
                onClick={() => onSelectTime(slot)}
                className={[
                  "rounded-xl border px-4 py-2 text-sm font-medium transition",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}