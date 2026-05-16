"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability } from "../services/public-booking.api";

type UseBookingAvailabilityParams = {
  username: string;
  serviceId: string | null;
  date: string | null;
  professionalId: string | null; 
  isMaintenance?: boolean; // 🌟 ADICIONADO AQUI
};

export function useBookingAvailability({
  username,
  serviceId,
  date,
  professionalId,
  isMaintenance, // 🌟 ADICIONADO AQUI
}: UseBookingAvailabilityParams) {
  
  // MÁGICA: Se não houver UUID do profissional, usa o username da URL!
  const effectiveProfId = professionalId || username;

  return useQuery({
    // 🌟 Adicionamos o isMaintenance na chave para forçar recarregamento se a aba mudar
    queryKey: ["public-booking-availability", username, serviceId, date, effectiveProfId, isMaintenance],
    queryFn: () =>
      getBookingAvailability({
        username,
        serviceId: serviceId!,
        date: date!,
        professionalId: effectiveProfId!,
        isMaintenance, // 🌟 Passa a flag para a API
      }),
    enabled: !!username && !!serviceId && !!date && !!effectiveProfId,
  });
}