import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

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
          min={new Date().toISOString().split("T")[0]}
          className="h-11 rounded-xl"
        />
      </CardContent>
    </Card>
  );
}