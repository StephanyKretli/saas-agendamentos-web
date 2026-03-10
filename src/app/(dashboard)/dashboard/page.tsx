export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Agendamentos do mês</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">--</h2>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Concluídos</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">--</h2>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Cancelados</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">--</h2>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="text-sm text-muted-foreground">Receita esperada</p>
        <h2 className="mt-2 text-2xl font-semibold text-foreground">--</h2>
      </div>
    </div>
  );
}