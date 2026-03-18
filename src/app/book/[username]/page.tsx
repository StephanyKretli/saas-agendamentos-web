"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useBookingProfile } from "@/features/public-booking/hooks/use-booking-profile";
import { useBookingAvailability } from "@/features/public-booking/hooks/use-booking-availability";
import { useCreatePublicAppointment } from "@/features/public-booking/hooks/use-create-public-appointment";
import { ProfessionalHeader } from "@/features/public-booking/components/professional-header";
import { ServiceList } from "@/features/public-booking/components/service-list";
import { DatePickerCard } from "@/features/public-booking/components/date-picker-card";
import { TimeSlotsGrid } from "@/features/public-booking/components/time-slots-grid";
import { BookingForm } from "@/features/public-booking/components/booking-form";
import { BookingSuccess } from "@/features/public-booking/components/booking-success";
import type {
  CreatePublicAppointmentResponse,
  PublicService,
} from "@/features/public-booking/types/public-booking.types";
import type { PublicBookingFormValues } from "@/features/public-booking/schemas/public-booking.schema";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

function formatDateLabel(date: string | null) {
  if (!date) return "Não selecionada";

  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

function StepBadge({
  step,
  title,
  active,
  done,
}: {
  step: number;
  title: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3 transition-colors",
        active
          ? "border-primary bg-primary/5"
          : done
            ? "border-green-200 bg-green-50"
            : "border-border bg-card",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
            active
              ? "bg-primary text-primary-foreground"
              : done
                ? "bg-green-600 text-white"
                : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {done ? "✓" : step}
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
      </div>
    </div>
  );
}

function SelectionSummary({
  selectedService,
  selectedDate,
  selectedTime,
}: {
  selectedService: PublicService | null;
  selectedDate: string | null;
  selectedTime: string | null;
}) {
  return (
    <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-semibold text-foreground">
        Resumo do agendamento
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Serviço
          </p>
          <p className="mt-1 text-sm text-foreground">
            {selectedService ? selectedService.name : "Nenhum serviço selecionado"}
          </p>
          {selectedService ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedService.duration} min •{" "}
              {formatPrice(selectedService.priceCents)}
            </p>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Data
          </p>
          <p className="mt-1 text-sm text-foreground">
            {formatDateLabel(selectedDate)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Horário
          </p>
          <p className="mt-1 text-sm text-foreground">
            {selectedTime ?? "Não selecionado"}
          </p>
        </div>
      </div>
    </aside>
  );
}

export default function BookingPage() {
  const params = useParams();
  const username = String(params.username ?? "");

  const { data, isLoading, isError, error } = useBookingProfile(username);

  const [selectedService, setSelectedService] =
    React.useState<PublicService | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] =
    React.useState<CreatePublicAppointmentResponse | null>(null);
  const [lastClientName, setLastClientName] = React.useState("");

  const availabilityQuery = useBookingAvailability({
    username,
    serviceId: selectedService?.id ?? null,
    date: selectedDate,
  });

  const createAppointmentMutation = useCreatePublicAppointment();

  React.useEffect(() => {
    setSelectedTime(null);
  }, [selectedService, selectedDate]);

  async function handleSubmitBooking(values: PublicBookingFormValues) {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const response = await createAppointmentMutation.mutateAsync({
      username,
      payload: {
        serviceId: selectedService.id,
        date: `${selectedDate}T${selectedTime}:00`,
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        clientEmail: values.clientEmail || undefined,
        notes: values.notes || undefined,
      },
    });

    setLastClientName(values.clientName);
    setCreatedAppointment(response);
  }

  const hasService = !!selectedService;
  const hasDate = !!selectedDate;
  const hasTime = !!selectedTime;

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            Carregando página de agendamento...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-red-700">
            Não foi possível carregar a página
          </h2>
          <p className="mt-2 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Ocorreu um erro ao buscar os dados."}
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="space-y-8">
        <ProfessionalHeader user={data.user} />

        {createdAppointment && selectedService && selectedDate && selectedTime ? (
          <div className="mx-auto max-w-2xl">
            <BookingSuccess
              clientName={lastClientName}
              serviceName={selectedService.name}
              date={selectedDate}
              time={selectedTime}
            />
          </div>
        ) : (
          <>
            <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <StepBadge step={1} title="Escolha o serviço" active={!hasService} done={hasService} />
              <StepBadge step={2} title="Escolha a data" active={hasService && !hasDate} done={hasDate} />
              <StepBadge step={3} title="Escolha o horário" active={hasService && hasDate && !hasTime} done={hasTime} />
              <StepBadge step={4} title="Preencha seus dados" active={hasService && hasDate && hasTime} done={false} />
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      Escolha um serviço
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Selecione abaixo o atendimento que deseja agendar.
                    </p>
                  </div>

                  <ServiceList
                    services={data.services}
                    selectedServiceId={selectedService?.id ?? null}
                    onSelectService={(service) => setSelectedService(service)}
                  />
                </section>

                {selectedService ? (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                    <DatePickerCard
                      value={selectedDate}
                      onChange={(value) => setSelectedDate(value)}
                    />
                  </section>
                ) : null}

                {selectedService && selectedDate ? (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                    <TimeSlotsGrid
                      slots={availabilityQuery.data?.slots ?? []}
                      selectedTime={selectedTime}
                      onSelectTime={(time) => setSelectedTime(time)}
                      isLoading={availabilityQuery.isLoading}
                    />
                  </section>
                ) : null}

                {selectedService && selectedDate && selectedTime ? (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                    <BookingForm
                      onSubmit={handleSubmitBooking}
                      isSubmitting={createAppointmentMutation.isPending}
                    />
                  </section>
                ) : null}

                {createAppointmentMutation.isError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {createAppointmentMutation.error instanceof Error
                      ? createAppointmentMutation.error.message
                      : "Não foi possível concluir o agendamento."}
                  </div>
                ) : null}
              </div>

              <div className="space-y-4">
                <SelectionSummary
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />

                {selectedService && selectedDate && !availabilityQuery.isLoading ? (
                  <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                    <h3 className="text-base font-semibold text-foreground">
                      Próximo passo
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {!selectedTime
                        ? "Escolha um horário disponível para continuar."
                        : "Agora é só preencher seus dados para confirmar o agendamento."}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}