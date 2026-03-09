"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicAvailability } from "@/lib/booking-api";

export function useBookingAvailability(
  username: string,
  serviceId?: string,
  date?: string,
  step = 30,
) {
  return useQuery({
    queryKey: ["booking-availability", username, serviceId, date, step],
    queryFn: () => getPublicAvailability(username, serviceId!, date!, step),
    enabled: !!username && !!serviceId && !!date,
  });
}