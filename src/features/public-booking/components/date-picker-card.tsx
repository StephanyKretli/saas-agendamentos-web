type DatePickerCardProps = {
  value: string | null;
  onChange: (value: string) => void;
};

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function DatePickerCard({ value, onChange }: DatePickerCardProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Escolha uma data
        </h3>
        <p className="text-sm text-muted-foreground">
          Selecione o dia desejado para ver os horários disponíveis.
        </p>
      </div>

      <div className="mt-4">
        <input
          type="date"
          min={getTodayDate()}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
        />
      </div>
    </section>
  );
}