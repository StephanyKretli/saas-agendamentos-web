type BookingSuccessProps = {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
};

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function BookingSuccess({
  clientName,
  serviceName,
  date,
  time,
}: BookingSuccessProps) {
  return (
    <div className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
        ✓
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-2xl font-semibold text-green-700">
          Agendamento confirmado!
        </h2>
        <p className="mt-2 text-sm text-green-700/80">
          {clientName}, seu horário foi reservado com sucesso.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-green-200 bg-white p-5 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Serviço
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {serviceName}
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Data
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatDate(date)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Horário
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {time}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-white/70 px-4 py-4">
        <p className="text-sm text-muted-foreground">
          Você receberá a confirmação no contato informado.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Caso precise cancelar ou reagendar, use o link enviado.
        </p>
      </div>
    </div>
  );
}