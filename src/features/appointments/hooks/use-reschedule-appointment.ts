"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "react-hot-toast"; //

type RescheduleInput = {
  appointmentId: string;
  date: string;
};

export function useRescheduleAppointment(currentDate: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ appointmentId, date }: RescheduleInput) => {
      return api.patch(
        `/appointments/${appointmentId}/reschedule`, 
        { date }, 
        { headers: getAuthHeaders() }
      );
    },
    onSuccess: async (data, variables) => {
      // Invalida o dia de onde o agendamento saiu
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(currentDate),
      });

      // Invalida o novo dia para onde o agendamento foi
      const newDateOnly = variables.date.split('T')[0];
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(newDateOnly),
      });

      // Limpa cache de disponibilidade pública se houver
      await queryClient.invalidateQueries({
        queryKey: ["public-booking-availability"],
      });

      toast.success("Agendamento reagendado com sucesso!"); //
    },
    onError: (error: any) => {
      // Usa a mensagem tratada pelo seu interceptor do axios
      toast.error(error.message || "Erro ao reagendar agendamento"); //
    },
  });
}