type BookingSuccessProps = {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
};

export function BookingSuccess({
  clientName,
  serviceName,
  date,
  time,
}: BookingSuccessProps) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">
          Agendamento confirmado
        </h2>
        <p className="text-sm text-muted-foreground">
          Tudo certo, {clientName}. Seu horário foi reservado com sucesso.
        </p>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">Serviço:</span>{" "}
          {serviceName}
        </p>
        <p>
          <span className="font-medium text-foreground">Data:</span> {date}
        </p>
        <p>
          <span className="font-medium text-foreground">Horário:</span> {time}
        </p>
      </div>
    </section>
  );
}