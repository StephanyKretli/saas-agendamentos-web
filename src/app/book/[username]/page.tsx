"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, User as UserIcon, Check } from "lucide-react";
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
// 👇 Importar o hook de Equipa para listar os profissionais
import { useTeam } from "@/features/team/hooks/use-team";

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
  onClick,
}: {
  step: number;
  title: string;
  active: boolean;
  done: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!active && !done}
      data-active={active}
      className={[
        "min-w-[200px] shrink-0 text-left rounded-2xl border px-4 py-3 transition-all snap-start md:min-w-0",
        active
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : done
            ? "border-green-500/30 bg-green-500/10 hover:bg-green-500/20 cursor-pointer"
            : "border-border bg-card opacity-60 cursor-not-allowed",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <div
          className={[
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            active
              ? "bg-primary text-primary-foreground"
              : done
                ? "bg-green-500 text-white"
                : "bg-muted text-muted-foreground",
          ].join(" ")}
        >
          {done ? "✓" : step}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
      </div>
    </button>
  );
}

function SelectionSummary({
  selectedService,
  selectedProfessional,
  selectedDate,
  selectedTime,
}: {
  selectedService: PublicService | null;
  selectedProfessional: any | null;
  selectedDate: string | null;
  selectedTime: string | null;
}) {
  return (
    <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sticky top-6">
      <h3 className="text-base font-semibold text-foreground">
        Resumo do agendamento
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Serviço</p>
          <p className="mt-1 text-sm text-foreground">{selectedService ? selectedService.name : "Não selecionado"}</p>
          {selectedService && (
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedService.duration} min • {formatPrice(selectedService.priceCents)}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Profissional</p>
          <p className="mt-1 text-sm text-foreground">{selectedProfessional ? selectedProfessional.name : "Não selecionado"}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</p>
          <p className="mt-1 text-sm text-foreground">{formatDateLabel(selectedDate)}</p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Horário</p>
          <p className="mt-1 text-sm text-foreground">{selectedTime ?? "Não selecionado"}</p>
        </div>
      </div>
    </aside>
  );
}

export default function BookingPage() {
  const params = useParams();
  const username = String(params.username ?? "");

  const { data, isLoading, isError, error } = useBookingProfile(username);
  const { data: team } = useTeam(); // 👇 Hook da equipa adicionado

  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedService, setSelectedService] = React.useState<PublicService | null>(null);
  const [selectedProfessional, setSelectedProfessional] = React.useState<any | null>(null); // 👇 Novo estado
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = React.useState<CreatePublicAppointmentResponse | null>(null);
  const [lastClientName, setLastClientName] = React.useState("");

  const stepsContainerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (stepsContainerRef.current) {
      const activeElement = stepsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [currentStep]);

  // 👇 O Hook de disponibilidade agora recebe o professionalId
  const availabilityQuery = useBookingAvailability({
    username,
    serviceId: selectedService?.id ?? null,
    date: selectedDate,
    professionalId: selectedProfessional?.id ?? null, 
  });

  const createAppointmentMutation = useCreatePublicAppointment();

  React.useEffect(() => {
    setSelectedTime(null);
  }, [selectedService, selectedProfessional, selectedDate]);

  async function handleSubmitBooking(values: PublicBookingFormValues) {
    if (!selectedService || !selectedDate || !selectedTime || !selectedProfessional) return;

    const response = await createAppointmentMutation.mutateAsync({
      username,
      payload: {
        serviceId: selectedService.id,
        date: `${selectedDate}T${selectedTime}:00`,
        professionalId: selectedProfessional.id, // 👇 Enviando ao criar
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        clientEmail: values.clientEmail || undefined,
        notes: values.notes || undefined,
      },
    });

    setLastClientName(values.clientName);
    setCreatedAppointment(response);
    setCurrentStep(6); // Ajustado para o passo final
  }

  if (isLoading) return <main className="..."><p>Carregando...</p></main>;
  if (isError) return <main className="..."><p>Erro ao carregar</p></main>;
  if (!data) return null;

  // Montando a lista de profissionais (Admin + Equipa)
  const professionals = [
    { id: data.user.id, name: data.user.name, role: "ADMIN", avatarUrl: data.user.avatarUrl },
    ...(Array.isArray(team) ? team : [])
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="space-y-8">
        <ProfessionalHeader user={data.user} />

        {currentStep === 6 && createdAppointment ? (
          <div className="mx-auto max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <BookingSuccess clientName={lastClientName} serviceName={selectedService?.name!} date={selectedDate!} time={selectedTime!} />
          </div>
        ) : (
          <>
            <section ref={stepsContainerRef} className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-2 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
              <StepBadge step={1} title="Serviço" active={currentStep === 1} done={currentStep > 1} onClick={() => setCurrentStep(1)} />
              <StepBadge step={2} title="Profissional" active={currentStep === 2} done={currentStep > 2} onClick={() => setCurrentStep(2)} />
              <StepBadge step={3} title="Data" active={currentStep === 3} done={currentStep > 3} onClick={() => setCurrentStep(3)} />
              <StepBadge step={4} title="Horário" active={currentStep === 4} done={currentStep > 4} onClick={() => setCurrentStep(4)} />
              <StepBadge step={5} title="Seus dados" active={currentStep === 5} done={false} onClick={() => setCurrentStep(5)} />
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                
                {/* PASSO 1: SERVIÇOS */}
                {currentStep === 1 && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Escolha um serviço</h2>
                    </div>
                    <ServiceList services={data.services} selectedServiceId={selectedService?.id ?? null} onSelectService={(service) => { setSelectedService(service); setCurrentStep(2); }} />
                  </section>
                )}

                {/* PASSO 2: PROFISSIONAL */}
                {currentStep === 2 && selectedService && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(1)} className="p-2 hover:bg-muted rounded-full transition-colors shrink-0">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Escolha o profissional</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Quem gostaria que realizasse o serviço?</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {professionals.map((prof) => (
                        <button
                          key={prof.id}
                          onClick={() => { setSelectedProfessional(prof); setCurrentStep(3); }}
                          className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${selectedProfessional?.id === prof.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:bg-muted/50"}`}
                        >
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {prof.avatarUrl ? <img src={prof.avatarUrl} alt={prof.name} className="h-full w-full object-cover"/> : prof.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-foreground">{prof.name}</p>
                            <p className="text-xs text-muted-foreground">{prof.role === 'ADMIN' ? 'Especialista' : 'Profissional'}</p>
                          </div>
                          {selectedProfessional?.id === prof.id && <Check className="absolute right-4 h-5 w-5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* PASSO 3: DATA */}
                {currentStep === 3 && selectedService && selectedProfessional && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(2)} className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold">Escolha a data</h2>
                      </div>
                    </div>
                    <DatePickerCard value={selectedDate} onChange={(value) => { setSelectedDate(value); setCurrentStep(4); }} />
                  </section>
                )}

                {/* PASSO 4: HORÁRIO */}
                {currentStep === 4 && selectedDate && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(3)} className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold">Escolha o horário</h2>
                      </div>
                    </div>
                    <TimeSlotsGrid slots={availabilityQuery.data?.slots ?? []} selectedTime={selectedTime} onSelectTime={(time) => { setSelectedTime(time); setCurrentStep(5); }} isLoading={availabilityQuery.isLoading} />
                  </section>
                )}

                {/* PASSO 5: FORMULÁRIO */}
                {currentStep === 5 && selectedTime && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(4)} className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold">Quase lá!</h2>
                      </div>
                    </div>
                    <BookingForm onSubmit={handleSubmitBooking} isSubmitting={createAppointmentMutation.isPending} />
                  </section>
                )}
              </div>

              <div className="space-y-4">
                <SelectionSummary selectedService={selectedService} selectedProfessional={selectedProfessional} selectedDate={selectedDate} selectedTime={selectedTime} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}