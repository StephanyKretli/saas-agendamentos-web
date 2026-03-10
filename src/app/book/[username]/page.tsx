"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useBookingProfile } from "@/features/public-booking/hooks/use-booking-profile";
import { useBookingAvailability } from "@/features/public-booking/hooks/use-booking-availability";
import { ProfessionalHeader } from "@/features/public-booking/components/professional-header";
import { ServiceList } from "@/features/public-booking/components/service-list";
import { DatePickerCard } from "@/features/public-booking/components/date-picker-card";
import { TimeSlotsGrid } from "@/features/public-booking/components/time-slots-grid";
import type { PublicService } from "@/features/public-booking/types/public-booking.types";

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(priceCents / 100);
}

export default function BookingPage() {
  const params = useParams();
  const username = String(params.username ?? "");

  const { data, isLoading, isError, error } = useBookingProfile(username);

  const [selectedService, setSelectedService] =
    React.useState<PublicService | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const availabilityQuery = useBookingAvailability({
    username,
    serviceId: selectedService?.id ?? null,
    date: selectedDate,
  });

  React.useEffect(() => {
    setSelectedTime(null);
  }, [selectedService, selectedDate]);

  if (isLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-3xl bg-muted" />
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
          <div className="h-24 animate-pulse rounded-2xl bg-muted" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Não foi possível carregar a página
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10">
      <div className="space-y-6">
        <ProfessionalHeader user={data.user} />

        <section className="space-y-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Escolha um serviço
            </h2>
            <p className="text-sm text-muted-foreground">
              Selecione abaixo o atendimento que deseja agendar.
            </p>
          </div>

          <ServiceList
            services={data.services}
            selectedServiceId={selectedService?.id ?? null}
            onSelectService={setSelectedService}
          />
        </section>

        {selectedService ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="text-base font-semibold text-foreground">
              Serviço selecionado
            </h3>

            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Serviço:</span>{" "}
                {selectedService.name}
              </p>
              <p>
                <span className="font-medium text-foreground">Duração:</span>{" "}
                {selectedService.duration} min
              </p>
              <p>
                <span className="font-medium text-foreground">Preço:</span>{" "}
                {formatPrice(selectedService.priceCents)}
              </p>
            </div>
          </section>
        ) : null}

        {selectedService ? (
          <DatePickerCard value={selectedDate} onChange={setSelectedDate} />
        ) : null}

        {selectedService && selectedDate ? (
          <TimeSlotsGrid
            slots={availabilityQuery.data?.slots ?? []}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            isLoading={availabilityQuery.isLoading}
          />
        ) : null}
      </div>
    </main>
  );
}