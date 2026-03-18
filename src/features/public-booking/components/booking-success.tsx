"use client";

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
    <div className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white text-lg font-bold">
        ✓
      </div>

      <h2 className="mt-4 text-xl font-semibold text-green-700">
        Agendamento confirmado!
      </h2>

      <p className="mt-2 text-sm text-green-700/80">
        {clientName}, seu horário foi reservado com sucesso.
      </p>

      <div className="mt-6 rounded-2xl border border-green-200 bg-white p-4 text-left">
        <p className="text-sm text-muted-foreground">
          Serviço
        </p>
        <p className="font-medium text-foreground">
          {serviceName}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Data</p>
            <p className="font-medium text-foreground">
              {formatDate(date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Horário</p>
            <p className="font-medium text-foreground">
              {time}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <p className="text-sm text-muted-foreground">
          Você receberá uma confirmação no seu contato informado.
        </p>

        <p className="text-sm text-muted-foreground">
          Caso precise cancelar ou reagendar, utilize o link enviado.
        </p>
      </div>
    </div>
  );
}