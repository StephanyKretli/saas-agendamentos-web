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
    <div className="rounded-3xl border border-green-500/30 bg-green-500/10 p-6 shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white shadow-sm">
        ✓
      </div>

      <div className="mt-4 text-center">
        <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">
          Agendamento confirmado!
        </h2>
        <p className="mt-2 text-sm text-green-600/80 dark:text-green-400/80">
          {clientName}, seu horário foi reservado com sucesso.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Serviço
          </p>
          <p className="mt-1 text-base font-semibold text-foreground">
            {serviceName}
          </p>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Data
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatDate(date)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-muted/30 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Horário
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {time}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-muted/20 px-4 py-4 text-center">
        <p className="text-sm text-muted-foreground">
          Você receberá a confirmação por e-mail ou WhatsApp em breve.
        </p>
      </div>
    </div>
  );
}