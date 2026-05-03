"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { getAuthHeaders } from "@/lib/auth-headers";
import { queryKeys } from "@/lib/query-keys";
import { toast } from "react-hot-toast"; 
import { extractErrorMessage } from "@/lib/error-utils";


export function useCancelAppointment(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      return api.patch(`/appointments/${appointmentId}/cancel`, {}, {
        headers: getAuthHeaders(),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dayTimeline(date), //
      });

      toast.success("Agendamento cancelado com sucesso!"); //
    },
    onError: (error: unknown) => {
              const errorMessage = extractErrorMessage(error, "Erro ao cancelar agendamento");
              toast.error(errorMessage);
            },
  });
}