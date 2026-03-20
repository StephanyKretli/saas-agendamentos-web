"use client";

import * as React from "react";
import { useRescheduleAppointment } from "@/features/appointments/hooks/use-reschedule-appointment";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";

type RescheduleModalProps = {
  open: boolean;
  onClose: () => void;
  selectedDate: string;
  appointment: {
    appointmentId: string;
    start: string;
    end: string;
    status: string;
    service: {
      id: string;
      name: string;
      duration: number;
    };
    client: {
      name: string;
    } | null;
  } | null;
};

type AvailabilityResponse = {
  date: string;
  slots: string[];
};

export function RescheduleModal({
  open,
  onClose,
  selectedDate,
  appointment,
}: RescheduleModalProps) {
  const [date, setDate] = React.useState(selectedDate);
  const [slots, setSlots] = React.useState<string[]>([]);
  const [selectedTime, setSelectedTime] = React.useState("");
  const [loadingSlots, setLoadingSlots] = React.useState(false);
  const [slotsError, setSlotsError] = React.useState<string | null>(null);

  const rescheduleMutation = useRescheduleAppointment(selectedDate);

  React.useEffect(() => {
    if (!open) return;

    setDate(selectedDate);
    setSelectedTime("");
    setSlots([]);
    setSlotsError(null);
  }, [open, selectedDate]);

  React.useEffect(() => {
    async function loadAvailability() {
      if (!open || !appointment?.service?.id || !date) return;

      try {
        setLoadingSlots(true);
        setSlotsError(null);

        const url = `/availability?serviceId=${appointment.service.id}&date=${date}&step=30`;

        const data = await api.get(url, {
          headers: getAuthHeaders(),
        }) as AvailabilityResponse;

        setSlots(data.slots ?? []);
      } catch (error) {
        console.error("Erro ao carregar horários:", error);
        setSlots([]);
        setSlotsError(
          error instanceof Error
            ? error.message
            : "Erro ao carregar horários disponíveis.",
        );
      } finally {
        setLoadingSlots(false);
      }
    }

    void loadAvailability();
  }, [open, appointment?.service?.id, date]);

  if (!open || !appointment) return null;
  console.log("Appointment recebido no modal:", appointment);

  async function handleConfirm() {
    if (!appointment || !selectedTime || appointment.status !== "SCHEDULED") {
        return;
    }

    const dateTime = `${selectedDate}T${selectedTime}:00`;

    await rescheduleMutation.mutateAsync({
      appointmentId: appointment.appointmentId,
      date: dateTime,
    });

    onClose();
    }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Reagendar atendimento
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {appointment.client?.name ?? "Cliente não informado"} •{" "}
              {appointment.service.name}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-muted-foreground hover:bg-muted"
          >
            Fechar
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Nova data
            </label>
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setSelectedTime("");
              }}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Horários disponíveis
            </label>

            {loadingSlots ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Carregando horários...
              </div>
            ) : slotsError ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-destructive">
                {slotsError}
              </div>
            ) : !slots.length ? (
              <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Nenhum horário disponível para esta data.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const active = selectedTime === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-foreground hover:bg-muted"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium"
          >
            Cancelar
          </button>

            <button
              type="button"
              disabled={!selectedTime || rescheduleMutation.isPending}
              onClick={() => void handleConfirm()}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {rescheduleMutation.isPending ? "Reagendando..." : "Confirmar"}
            </button>
        </div>
      </div>
    </div>
  );
}