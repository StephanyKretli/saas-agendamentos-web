import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

function getTodayLocalDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function DatePickerCard({ value, onChange }: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Escolha a data
        </label>

        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={getTodayLocalDate()}
          className="h-11 rounded-xl"
        />
      </CardContent>
    </Card>
  );
}