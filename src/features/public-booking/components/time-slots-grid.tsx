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
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Horários disponíveis
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Escolha um horário para continuar.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-11 animate-pulse rounded-xl border border-border bg-muted"
            />
          ))}
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-5">
          <p className="text-sm font-medium text-foreground">
            Nenhum horário disponível
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tente escolher outra data para ver novas opções.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {slots.map((slot) => {
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => onSelectTime(slot)}
                  className={[
                    "rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-background text-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {slot}
                </button>
              );
            })}
          </div>

          {selectedTime ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                Horário selecionado: {selectedTime}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Agora você já pode seguir para preencher seus dados.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}