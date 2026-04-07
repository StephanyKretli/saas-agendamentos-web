"use client";

import { useQuery } from "@tanstack/react-query";
// Importe a função correta da sua API que busca os dados do agendamento pelo token
import { cancelAppointmentByToken } from "../api/cancel-appointment"; 

export function useCancelPreview(token: string) {
  return useQuery({
    queryKey: ["public-cancel-preview", token],
    queryFn: () => cancelAppointmentByToken(token),
    enabled: !!token, // Só roda a query se o token existir
  });
}