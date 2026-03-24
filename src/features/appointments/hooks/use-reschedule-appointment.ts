"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { queryKeys } from "@/lib/query-keys";

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
        { date }, // O corpo deve ser um objeto com a chave 'date'
        { headers: getAuthHeaders() }
      );
    },
    onSuccess: async (data, variables) => {
      // Invalida o dia atual
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(currentDate),
      });

      // Invalida o novo dia (pegando apenas YYYY-MM-DD da string ISO)
      const newDateOnly = variables.date.split('T')[0];
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(newDateOnly),
      });
    },
  });
}