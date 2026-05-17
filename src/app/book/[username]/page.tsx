"use client";
export const dynamic = 'force-dynamic';

import * as React from "react";
import { useParams } from "next/navigation";
import { ChevronLeft, Check, Wrench, Search, Plus, Trash2, Scissors } from "lucide-react";
import { useBookingProfile } from "@/features/public-booking/hooks/use-booking-profile";
import { useBookingAvailability } from "@/features/public-booking/hooks/use-booking-availability";
import { useCreatePublicAppointment } from "@/features/public-booking/hooks/use-create-public-appointment";
import { ProfessionalHeader } from "@/features/public-booking/components/professional-header";
import { TimeSlotsGrid } from "@/features/public-booking/components/time-slots-grid";
import { BookingForm } from "@/features/public-booking/components/booking-form";
import { BookingSuccess } from "@/features/public-booking/components/booking-success";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import type {
  CreatePublicAppointmentResponse,
  PublicService,
} from "@/features/public-booking/types/public-booking.types";
import type { PublicBookingFormValues } from "@/features/public-booking/schemas/public-booking.schema";

// --- TIPAGEM DO CARRINHO ---
export interface CartItem {
  service: PublicService;
  isMaintenance: boolean;
  finalPrice: number;
  finalDuration: number;
}

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

function StepBadge({ step, title, active, done, onClick }: any) {
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
        <div className={[
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
            active ? "bg-primary text-primary-foreground" : done ? "bg-green-500 text-white" : "bg-muted text-muted-foreground",
          ].join(" ")}>
          {done ? "✓" : step}
        </div>
        <div><p className="text-sm font-medium text-foreground">{title}</p></div>
      </div>
    </button>
  );
}

// 🌟 RESUMO LATERAL ATUALIZADO PARA MÚLTIPLOS SERVIÇOS
function SelectionSummary({ cart, selectedProfessional, selectedDate, selectedTime }: any) {
  const totalDuration = cart.reduce((acc: number, item: CartItem) => acc + item.finalDuration, 0);
  const totalPrice = cart.reduce((acc: number, item: CartItem) => acc + item.finalPrice, 0);

  return (
    <aside className="rounded-3xl border border-border bg-card p-5 shadow-sm sticky top-6">
      <h3 className="text-base font-semibold text-foreground border-b pb-3 mb-4">
        Resumo do agendamento
      </h3>
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Serviços Selecionados</p>
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum serviço selecionado</p>
          ) : (
            <div className="space-y-2">
              {cart.map((item: CartItem, idx: number) => (
                <div key={idx} className="bg-muted/40 p-2 rounded-lg text-sm">
                  <p className="font-medium">{item.service.name} {item.isMaintenance && <span className="text-primary text-xs">(Manutenção)</span>}</p>
                  <p className="text-xs text-muted-foreground">{item.finalDuration} min • {formatPrice(item.finalPrice)}</p>
                </div>
              ))}
              <div className="flex justify-between font-bold text-sm pt-2 border-t mt-2">
                <span>Total ({totalDuration} min)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Profissional</p>
          <p className="mt-1 text-sm text-foreground">{selectedProfessional ? selectedProfessional.name : "Não selecionado"}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Data</p>
            <p className="mt-1 text-sm text-foreground">{formatDateLabel(selectedDate)}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Horário</p>
            <p className="mt-1 text-sm text-foreground">{selectedTime ?? "Não selecionado"}</p>
          </div>
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
  const [searchTerm, setSearchTerm] = React.useState("");
  
  // 🌟 ESTADO DO CARRINHO (Substitui o selectedService singular)
  const [cart, setCart] = React.useState<CartItem[]>([]);
  
  const [selectedProfessional, setSelectedProfessional] = React.useState<any | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  
  const [createdAppointment, setCreatedAppointment] = React.useState<CreatePublicAppointmentResponse | null>(null);
  const [lastClientName, setLastClientName] = React.useState("");

  const stepsContainerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    if (stepsContainerRef.current) {
      const activeElement = stepsContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) activeElement.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentStep]);

  // Filtra serviços baseado na busca
  const filteredServices = React.useMemo(() => {
    if (!data?.services) return [];
    return data.services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data?.services, searchTerm]);

  // Lógica para adicionar ao carrinho
  const handleAddService = (service: PublicService, isMaintenance: boolean) => {
    if (cart.some(item => item.service.id === service.id && item.isMaintenance === isMaintenance)) return;
    
    setCart([...cart, {
      service,
      isMaintenance,
      finalPrice: isMaintenance ? service.maintenancePriceCents! : service.priceCents,
      finalDuration: isMaintenance ? service.maintenanceDurationMinutes! : service.duration
    }]);
  };

  const handleRemoveService = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // ⚠️ ATENÇÃO: A query do backend precisará ser ajustada para receber arrays no futuro.
  // Por enquanto, enviamos um payload modificado.
  const availabilityQuery = useBookingAvailability({
    username,
    cartItems: cart.map(item => ({ serviceId: item.service.id, isMaintenance: item.isMaintenance })), // Adaptar no backend
    date: selectedDate ? formatToYYYYMMDD(selectedDate) : null,
    professionalId: selectedProfessional?.id ?? null,
  });

  const createAppointmentMutation = useCreatePublicAppointment();

  React.useEffect(() => {
    setSelectedTime(null);
  }, [cart, selectedProfessional, selectedDate]);

  async function handleSubmitBooking(values: PublicBookingFormValues) {
    if (cart.length === 0 || !selectedDate || !selectedTime || !selectedProfessional) return;

    const dateString = formatToYYYYMMDD(selectedDate);

    const response = await createAppointmentMutation.mutateAsync({
      username,
      payload: {
        services: cart.map(item => ({ serviceId: item.service.id, isMaintenance: item.isMaintenance })), // Adaptar DTO no backend
        date: `${dateString}T${selectedTime}:00`,
        professionalId: selectedProfessional.id,
        clientName: values.clientName,
        clientPhone: values.clientPhone,
        clientEmail: values.clientEmail || undefined,
        notes: values.notes || undefined,
      },
    });

    setLastClientName(values.clientName);
    setCreatedAppointment(response);
    setCurrentStep(6);
  }

  if (isLoading) return <main className="p-8"><p>Carregando...</p></main>;
  if (isError) return <main className="p-8"><p>Erro ao carregar a página.</p></main>;
  if (!data) return null;

  // Cruza os profissionais que fazem TODOS os serviços selecionados (ou simplifica para os profissionais do 1º serviço no MVP)
  const availableProfessionals = cart.length > 0 ? (cart[0].service.professionals || []) : [];

  const totalDepositCents = cart.reduce((acc, item) => acc + Math.round(item.finalPrice * 0.2), 0);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <div className="space-y-8">
        <ProfessionalHeader user={data.user} />

        {currentStep === 6 && createdAppointment ? (
          <div className="mx-auto max-w-2xl animate-in fade-in zoom-in-95 duration-300">
            <BookingSuccess 
              clientName={lastClientName} 
              serviceName={`${cart.length} serviço(s)`} 
              date={formatToYYYYMMDD(selectedDate!)} 
              time={selectedTime!}
              paymentStatus={createdAppointment.requirePix ? "PENDING" : "CONFIRMED"}
              depositCents={totalDepositCents}
              pixPayload={createdAppointment.pixData?.qrCodePayload}
            />
          </div>
        ) : (
          <>
            <section ref={stepsContainerRef} className="flex gap-3 overflow-x-auto pb-2 snap-x md:grid md:grid-cols-2 xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
              <StepBadge step={1} title="Serviços" active={currentStep === 1} done={currentStep > 1} onClick={() => setCurrentStep(1)} />
              <StepBadge step={2} title="Profissional" active={currentStep === 2} done={currentStep > 2} onClick={() => setCurrentStep(2)} />
              <StepBadge step={3} title="Data" active={currentStep === 3} done={currentStep > 3} onClick={() => setCurrentStep(3)} />
              <StepBadge step={4} title="Horário" active={currentStep === 4} done={currentStep > 4} onClick={() => setCurrentStep(4)} />
              <StepBadge step={5} title="Seus dados" active={currentStep === 5} done={false} onClick={() => setCurrentStep(5)} />
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-6">
                
                {/* PASSO 1: BUSCA, CARRINHO E ESCOLHA DE MANUTENÇÃO */}
                {currentStep === 1 && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">Monte seu atendimento</h2>
                      <p className="text-sm text-muted-foreground mt-1">Busque e adicione os procedimentos que deseja.</p>
                    </div>

                    {/* Barra de Busca */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Buscar serviço..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>

                    {/* Lista Dinâmica com Manutenção */}
                    <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                      {filteredServices.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">Nenhum serviço encontrado.</p>
                      ) : (
                        filteredServices.map((service) => (
                          <div key={service.id} className="p-4 rounded-xl border border-border bg-background flex flex-col sm:flex-row gap-4 justify-between sm:items-center hover:border-primary/30 transition-colors">
                            <div>
                              <h3 className="font-semibold text-foreground flex items-center gap-2">
                                {service.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{service.duration} min • {formatPrice(service.priceCents)}</p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleAddService(service, false)}
                                className="whitespace-nowrap"
                              >
                                <Plus className="h-4 w-4 mr-1" /> Adicionar
                              </Button>

                              {service.hasMaintenance && (
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  onClick={() => handleAddService(service, true)}
                                  className="whitespace-nowrap bg-primary/10 text-primary hover:bg-primary/20 border-primary/20"
                                >
                                  <Wrench className="h-4 w-4 mr-1" /> Manutenção
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer do Passo 1 (Avançar) */}
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {cart.length} serviço(s) selecionado(s)
                      </p>
                      <Button 
                        disabled={cart.length === 0} 
                        onClick={() => { setSelectedProfessional(null); setCurrentStep(2); }}
                      >
                        Avançar para Profissional
                      </Button>
                    </div>
                  </section>
                )}

                {/* PASSO 2: PROFISSIONAL */}
                {currentStep === 2 && cart.length > 0 && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(1)} className="p-2 hover:bg-muted rounded-full transition-colors shrink-0">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <div>
                        <h2 className="text-xl font-semibold text-foreground">Escolha o profissional</h2>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {availableProfessionals.length === 0 ? (
                        <div className="p-4 text-center border rounded-2xl bg-muted/30">
                          <p className="text-sm text-muted-foreground">Nenhum profissional disponível.</p>
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
                {currentStep === 3 && cart.length > 0 && selectedProfessional && (
                  <section className="rounded-3xl border border-border bg-card p-5 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="mb-6 flex items-center gap-3">
                      <button onClick={() => setCurrentStep(2)} className="p-2 hover:bg-muted rounded-full">
                        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <h2 className="text-xl font-semibold">Escolha a data</h2>
                    </div>
                    <div className="flex justify-center rounded-xl border border-border bg-background p-3">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(newDate) => { setSelectedDate(newDate); if (newDate) setCurrentStep(4); }}
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
                      <h2 className="text-xl font-semibold">Escolha o horário</h2>
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
                      <h2 className="text-xl font-semibold">Quase lá!</h2>
                    </div>
                    <BookingForm onSubmit={handleSubmitBooking} isSubmitting={createAppointmentMutation.isPending} />
                  </section>
                )}
              </div>

              <div className="space-y-4 hidden md:block">
                <SelectionSummary 
                  cart={cart}
                  selectedProfessional={selectedProfessional} 
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