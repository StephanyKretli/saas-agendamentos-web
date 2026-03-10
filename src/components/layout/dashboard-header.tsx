export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-background px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Painel</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie sua agenda, clientes e serviços.
        </p>
      </div>
    </header>
  );
}