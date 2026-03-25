"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react"; // <-- Adicionamos o ícone de voltar
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

// Atualizado para ser clicável e responsivo no mobile (scroll horizontal)
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
  selectedDate,
  selectedTime,
}: {
  selectedService: PublicService | null;
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

  // NOVO: Controle de estado do passo atual
  const [currentStep, setCurrentStep] = React.useState(1);

  const [selectedService, setSelectedService] = React.useState<PublicService | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = React.useState<CreatePublicAppointmentResponse | null>(null);
  const [lastClientName, setLastClientName] = React.useState("");

  const stepsContainerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    // Sempre que o currentStep mudar, procuramos o botão ativo e deslizamos até ele
    if (stepsContainerRef.current) {
      const activeElement = stepsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({ 
          behavior: "smooth", 
          inline: "center", // Mantém o cartão no centro da tela no mobile
          block: "nearest" 
        });
      }
    }
  }, [currentStep]);

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
    setCurrentStep(5); // Vai para a tela de sucesso
  }

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
        <div className="w-full max-w-xl rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-destructive">
            Não foi possível carregar a página
          </h2>
          <p className="mt-2 text-sm text-destructive/80">
            {error instanceof Error
              ? error.message
              : "Ocorreu um erro ao buscar os dados."}
          </p>
        </div>
      </main>
    );
  }

  if (!data) return null;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="space-y-8">
        <ProfessionalHeader user={data.user} />

        {currentStep === 5 && createdAppointment && selectedService && selectedDate && selectedTime ? (
          <div className="mx-auto max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <BookingSuccess
              clientName={lastClientName}
              serviceName={selectedService.name}
              date={selectedDate}
              time={selectedTime}
            />
          </div>
        ) : (
          <>
            {/* Barra de Passos - Scroll Horizontal no Mobile */}
            <section ref={stepsContainerRef} className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-2 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
              <StepBadge 
                step={1} title="Escolha o serviço" 
                active={currentStep === 1} done={currentStep > 1} 
                onClick={() => setCurrentStep(1)} 
              />
              <StepBadge 
                step={2} title="Escolha a data" 
                active={currentStep === 2} done={currentStep > 2} 
                onClick={() => setCurrentStep(2)} 
              />
              <StepBadge 
                step={3} title="Escolha o horário" 
                active={currentStep === 3} done={currentStep > 3} 
                onClick={() => setCurrentStep(3)} 
              />
              <StepBadge 
                step={4} title="Preencha seus dados" 
                active={currentStep === 4} done={false} 
                onClick={() => setCurrentStep(4)} 
              />
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              
              {/* Área de Conteúdo Dinâmico */}
              <div className="space-y-6">
                
                {/* PASSO 1: SERVIÇOS */}
                {currentStep === 1 && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-4">
                      <h2 className="text-xl font-semibold text-foreground">Escolha um serviço</h2>
                      <p className="mt-1 text-sm text-muted-foreground">Selecione abaixo o atendimento que deseja agendar.</p>
                    </div>

                    <ServiceList
                      services={data.services}
                      selectedServiceId={selectedService?.id ?? null}
                      onSelectService={(service) => {
                        setSelectedService(service);
                        setCurrentStep(2); // Avança automaticamente para a data
                      }}
                    />
                  </section>
                )}

                {/* PASSO 2: DATA */}
                {currentStep === 2 && selectedService && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button 
                        onClick={() => setCurrentStep(1)} 
                        className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                      >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Escolha a data</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Para quando deseja marcar o serviço?</p>
                      </div>
                    </div>

                    <DatePickerCard
                      value={selectedDate}
                      onChange={(value) => {
                        setSelectedDate(value);
                        setCurrentStep(3); // Avança automaticamente para o horário
                      }}
                    />
                  </section>
                )}

                {/* PASSO 3: HORÁRIO */}
                {currentStep === 3 && selectedService && selectedDate && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button 
                        onClick={() => setCurrentStep(2)} 
                        className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                      >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Escolha o horário</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Selecione uma das opções disponíveis.</p>
                      </div>
                    </div>

                    <TimeSlotsGrid
                      slots={availabilityQuery.data?.slots ?? []}
                      selectedTime={selectedTime}
                      onSelectTime={(time) => {
                        setSelectedTime(time);
                        setCurrentStep(4); // Avança automaticamente para o formulário
                      }}
                      isLoading={availabilityQuery.isLoading}
                    />
                  </section>
                )}

                {/* PASSO 4: FORMULÁRIO */}
                {currentStep === 4 && selectedService && selectedDate && selectedTime && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button 
                        onClick={() => setCurrentStep(3)} 
                        className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                      >
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Quase lá!</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Preencha seus dados para confirmar.</p>
                      </div>
                    </div>

                    <BookingForm
                      onSubmit={handleSubmitBooking}
                      isSubmitting={createAppointmentMutation.isPending}
                    />
                    
                    {createAppointmentMutation.isError && (
                      <div className="mt-4 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {createAppointmentMutation.error instanceof Error
                          ? createAppointmentMutation.error.message
                          : "Não foi possível concluir o agendamento."}
                      </div>
                    )}
                  </section>
                )}
              </div>

              {/* Sidebar de Resumo - Fica em baixo no Mobile e Lateral no Desktop */}
              <div className="space-y-4">
                <SelectionSummary
                  selectedService={selectedService}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}