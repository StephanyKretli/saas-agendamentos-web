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

function formatDateLabel(value: string | null) {
  if (!value) return "Nenhuma data selecionada";

  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function DatePickerCard({ value, onChange }: DatePickerCardProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">
          Escolha uma data
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Selecione o dia desejado para ver os horários disponíveis.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <label className="mb-2 block text-sm font-medium text-foreground">
          Data do atendimento
        </label>

        <input
          type="date"
          min={getTodayDate()}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:ring-2 focus:ring-ring"
        />

        <div className="mt-4 rounded-2xl border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Data selecionada
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            {formatDateLabel(value)}
          </p>
        </div>
      </div>
    </div>
  );
}