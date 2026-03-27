"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability } from "../services/public-booking.api";

type UseBookingAvailabilityParams = {
  username: string;
  serviceId: string | null;
  date: string | null;
  professionalId: string | null; 
};

export function useBookingAvailability({
  username,
  serviceId,
  date,
  professionalId, 
}: UseBookingAvailabilityParams) {
  
  // 🌟 MÁGICA: Se não houver UUID do profissional, usa o username da URL!
  const effectiveProfId = professionalId || username;

  return useQuery({
    queryKey: ["public-booking-availability", username, serviceId, date, effectiveProfId],
    queryFn: () =>
      getBookingAvailability({
        username,
        serviceId: serviceId!,
        date: date!,
        professionalId: effectiveProfId!, 
      }),
    enabled: !!username && !!serviceId && !!date && !!effectiveProfId,
  });
}