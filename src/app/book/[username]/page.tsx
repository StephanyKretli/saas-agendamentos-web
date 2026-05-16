"use client";
export const dynamic = 'force-dynamic';

import * as React from "react";
import { useParams } from "next/navigation";
// 🌟 1. Adicionado o Wrench (Chave Inglesa) nas importações
import { ChevronLeft, Check, Wrench } from "lucide-react";
import { useBookingProfile } from "@/features/public-booking/hooks/use-booking-profile";
import { useBookingAvailability } from "@/features/public-booking/hooks/use-booking-availability";
import { useCreatePublicAppointment } from "@/features/public-booking/hooks/use-create-public-appointment";
import { ProfessionalHeader } from "@/features/public-booking/components/professional-header";
import { ServiceList } from "@/features/public-booking/components/service-list";
import { TimeSlotsGrid } from "@/features/public-booking/components/time-slots-grid";
import { BookingForm } from "@/features/public-booking/components/booking-form";
import { BookingSuccess } from "@/features/public-booking/components/booking-success";
import { Calendar } from "@/components/ui/calendar";
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

function formatDateLabel(date: Date | undefined) {
  if (!date) return "Não selecionada";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date);
}

function formatToYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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
        "min-w-50 shrink-0 text-left rounded-2xl border px-4 py-3 transition-all snap-start md:min-w-0",
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

// 🌟 2. Resumo lateral atualizado para mostrar o preço/tempo dinâmico
function SelectionSummary({
  selectedService,
  selectedProfessional,
  selectedDate,
  selectedTime,
  isMaintenanceBooking,
}: {
  selectedService: PublicService | null;
  selectedProfessional: any | null;
  selectedDate: Date | undefined; 
  selectedTime: string | null;
  isMaintenanceBooking: boolean;
}) {
  
  // Calcula valores reais baseados na flag de manutenção
  const isMaint = isMaintenanceBooking && selectedService?.hasMaintenance;
  const finalPrice = isMaint ? selectedService.maintenancePriceCents! : selectedService?.priceCents;
  const finalDuration = isMaint ? selectedService.maintenanceDurationMinutes : selectedService?.duration;
  const serviceName = selectedService ? `${selectedService.name}${isMaint ? ' (Manutenção)' : ''}` : "Não selecionado";

  return (
    <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sticky top-6">
      <h3 className="text-base font-semibold text-foreground">
        Resumo do agendamento
      </h3>

      <div className="mt-4 space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Serviço</p>
          <p className="mt-1 text-sm text-foreground">{serviceName}</p>
          {selectedService && (
            <p className="mt-1 text-xs text-muted-foreground">
              {finalDuration} min • {formatPrice(finalPrice || 0)}
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

  const { data, isLoading, isError } = useBookingProfile(username);

  const [currentStep, setCurrentStep] = React.useState(1);
  const [selectedService, setSelectedService] = React.useState<PublicService | null>(null);
  const [selectedProfessional, setSelectedProfessional] = React.useState<any | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  
  // 🌟 3. O estado mágico que controla o preço
  const [isMaintenanceBooking, setIsMaintenanceBooking] = React.useState(false);

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

  // 🌟 4. Adiciona a flag na query para caso o backend precise dela para calcular blocos
  const availabilityQuery = useBookingAvailability({
    username,
    serviceId: selectedService?.id ?? null,
    date: selectedDate ? formatToYYYYMMDD(selectedDate) : null,
    professionalId: selectedProfessional?.id ?? null, 
    isMaintenance: isMaintenanceBooking,
  });

  const createAppointmentMutation = useCreatePublicAppointment();

  React.useEffect(() => {
    setSelectedTime(null);
  }, [selectedService, selectedProfessional, selectedDate, isMaintenanceBooking]);

  async function handleSubmitBooking(values: PublicBookingFormValues) {
    if (!selectedService || !selectedDate || !selectedTime || !selectedProfessional) return;

    const dateString = formatToYYYYMMDD(selectedDate);

    const response = await createAppointmentMutation.mutateAsync({
      username,
      payload: {
        serviceId: selectedService.id,
        date: `${dateString}T${selectedTime}:00`,
        professionalId: selectedProfessional.id,
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        clientEmail: values.clientEmail || undefined,
        notes: values.notes || undefined,
        // 🌟 5. Envia a flag para o NestJS cobrar mais barato!
        isMaintenance: isMaintenanceBooking,
      },
    });

    setLastClientName(values.clientName);
    setCreatedAppointment(response);
    setCurrentStep(6);
  }

  if (isLoading) return <main className="p-8"><p>Carregando...</p></main>;
  if (isError) return <main className="p-8"><p>Erro ao carregar a página.</p></main>;
  if (!data) return null;

  const availableProfessionals = selectedService?.professionals || [];
  
  // Calcula o valor do depósito corretamente para a tela de Sucesso
  const isMaint = isMaintenanceBooking && selectedService?.hasMaintenance;
  const finalPriceCents = isMaint ? selectedService?.maintenancePriceCents! : selectedService?.priceCents!;

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="space-y-8">
        <ProfessionalHeader user={data.user} />

        {currentStep === 6 && createdAppointment ? (
          <div className="mx-auto max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <BookingSuccess 
              clientName={lastClientName} 
              serviceName={selectedService?.name!} 
              date={formatToYYYYMMDD(selectedDate!)} 
              time={selectedTime!}
              paymentStatus={createdAppointment.requirePix ? "PENDING" : "CONFIRMED"}
              depositCents={selectedService ? Math.round(finalPriceCents * 0.2) : 0}
              pixPayload={createdAppointment.pixData?.qrCodePayload}
            />
          </div>
        ) : (
          <>
            <section ref={stepsContainerRef} className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-2 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
              <StepBadge step={1} title="Serviço" active={currentStep === 1} done={currentStep > 1} onClick={() => setCurrentStep(1)} />
              <StepBadge step={2} title="Detalhes" active={currentStep === 2} done={currentStep > 2} onClick={() => setCurrentStep(2)} />
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
                    <ServiceList 
                      services={data.services} 
                      selectedServiceId={selectedService?.id ?? null} 
                      onSelectService={(service) => { 
                        setSelectedService(service); 
                        setSelectedProfessional(null); 
                        setIsMaintenanceBooking(false); // Reseta ao trocar de serviço
                        setCurrentStep(2); 
                      }} 
                    />
                  </section>
                )}

                {/* PASSO 2: PROFISSIONAL E TIPO DE ATENDIMENTO */}
                {currentStep === 2 && selectedService && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(1)} className="p-2 hover:bg-muted rounded-full transition-colors shrink-0">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Detalhes do Atendimento</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Configure as suas preferências</p>
                      </div>
                    </div>

                    {/* 🌟 6. EXPERIÊNCIA DO CLIENTE: Abas de Seleção elegantes */}
                    {selectedService.hasMaintenance && (
                      <div className="mb-8 space-y-3">
                        <label className="text-sm font-semibold text-foreground block">
                          Qual é o tipo de procedimento?
                        </label>
                        <div className="grid grid-cols-2 gap-2 p-1.5 bg-muted/60 rounded-xl border border-border/60">
                          
                          {/* Procedimento Inicial */}
                          <button
                            type="button"
                            onClick={() => setIsMaintenanceBooking(false)}
                            className={`flex flex-col items-center justify-center py-3 px-3 rounded-lg text-center transition-all duration-200 ${
                              !isMaintenanceBooking
                                ? "bg-background text-foreground shadow-sm font-semibold border border-border/50 scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                          >
                            <span className="text-sm">Procedimento Inicial</span>
                            <span className="text-xs opacity-80 font-normal mt-1">
                              {formatPrice(selectedService.priceCents)} • {selectedService.duration} min
                            </span>
                          </button>

                          {/* Manutenção */}
                          <button
                            type="button"
                            onClick={() => setIsMaintenanceBooking(true)}
                            className={`flex flex-col items-center justify-center py-3 px-3 rounded-lg text-center transition-all duration-200 ${
                              isMaintenanceBooking
                                ? "bg-primary/10 text-primary shadow-sm font-semibold border border-primary/20 scale-[1.02]"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                            }`}
                          >
                            <span className="text-sm flex items-center gap-1.5 justify-center">
                              <Wrench className="h-3.5 w-3.5" /> Manutenção
                            </span>
                            <span className="text-xs opacity-80 font-normal mt-1">
                              {formatPrice(selectedService.maintenancePriceCents || 0)} • {selectedService.maintenanceDurationMinutes} min
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-foreground block">
                        Escolha o profissional
                      </label>
                      {availableProfessionals.length === 0 ? (
                        <div className="p-4 text-center border rounded-2xl bg-muted/30">
                          <p className="text-sm text-muted-foreground">Nenhum profissional disponível para este serviço.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableProfessionals.map((prof) => (
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
                              </div>
                              {selectedProfessional?.id === prof.id && <Check className="absolute right-4 h-5 w-5 text-primary" />}
                            </button>
                          ))}
                        </div>
                      )}
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
                    
                    <div className="flex justify-center rounded-xl border border-border bg-background p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(newDate) => {
                          setSelectedDate(newDate);
                          if (newDate) {
                            setCurrentStep(4);
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-md"
                      />
                    </div>
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

              <div className="space-y-4 hidden md:block">
                <SelectionSummary 
                  selectedService={selectedService} 
                  selectedProfessional={selectedProfessional} 
                  selectedDate={selectedDate} 
                  selectedTime={selectedTime} 
                  isMaintenanceBooking={isMaintenanceBooking} 
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}