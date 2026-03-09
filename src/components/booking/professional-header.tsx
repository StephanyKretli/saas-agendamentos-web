import { Card, CardContent } from "@/components/ui/card";

type Props = {
  name: string;
  username: string;
};

export function ProfessionalHeader({ name, username }: Props) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
          {name?.charAt(0)?.toUpperCase() || "P"}
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {name}
          </h1>
          <p className="text-sm text-slate-500">@{username}</p>
          <p className="mt-2 text-sm text-slate-600">
            Escolha um serviço, selecione um horário disponível e confirme seu
            agendamento em poucos passos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}