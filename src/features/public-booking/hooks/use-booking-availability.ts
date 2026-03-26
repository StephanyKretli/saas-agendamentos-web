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
  return useQuery({
    queryKey: ["public-booking-availability", username, serviceId, date, professionalId],
    queryFn: () =>
      getBookingAvailability({
        username,
        serviceId: serviceId!,
        date: date!,
        professionalId: professionalId!, 
      }),
    enabled: !!username && !!serviceId && !!date && !!professionalId,
  });
}