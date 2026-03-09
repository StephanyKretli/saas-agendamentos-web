"use client";

import { useMemo, useState } from "react";
import { ProfessionalHeader } from "@/components/booking/professional-header";
import { ServiceList } from "@/components/booking/service-list";
import { DatePickerCard } from "@/components/booking/date-picker-card";
import { TimeSlotsGrid } from "@/components/booking/time-slots-grid";
import { BookingSummary } from "@/components/booking/booking-summary";
import { useBookingProfile } from "@/hooks/use-booking-profile";
import { useBookingAvailability } from "@/hooks/use-booking-availability";
import type { PublicService } from "@/types/booking";

type Props = {
  params: {
    username: string;
  };
};

export default function PublicBookingPage({ params }: Props) {
  const username = params.username;

  const { data, isLoading, error } = useBookingProfile(username);

  const [selectedService, setSelectedService] = useState<PublicService>();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const availability = useBookingAvailability(
    username,
    selectedService?.id,
    selectedDate,
    30,
  );

  const resetSlot = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot("");
  };

  const subtitle = useMemo(() => {
    if (!selectedService) return "Escolha um serviço para começar";
    if (!selectedDate) return "Agora selecione uma data";
    if (!selectedSlot) return "Agora escolha um horário";
    return "Tudo certo para continuar";
  }, [selectedService, selectedDate, selectedSlot]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl">Carregando...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-6xl rounded-2xl border border-red-200 bg-white p-8 text-red-600 shadow-sm">
          Não foi possível carregar esta agenda.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <ProfessionalHeader
          name={data.user.name}
          username={data.user.username}
        />

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-500">
                Agendamento online
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                {subtitle}
              </h2>
            </div>

            <ServiceList
              services={data.services}
              selectedServiceId={selectedService?.id}
              onSelect={(service) => {
                setSelectedService(service);
                setSelectedSlot("");
              }}
            />
          </section>

          <aside className="space-y-6">
            <DatePickerCard value={selectedDate} onChange={resetSlot} />

            <TimeSlotsGrid
              slots={availability.data?.slots || []}
              selectedSlot={selectedSlot}
              onSelect={setSelectedSlot}
              isLoading={availability.isLoading}
            />

            <BookingSummary
              service={selectedService}
              date={selectedDate}
              time={selectedSlot}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}