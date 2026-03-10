"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingAvailability } from "../services/public-booking.api";

type UseBookingAvailabilityParams = {
  username: string;
  serviceId: string | null;
  date: string | null;
};

export function useBookingAvailability({
  username,
  serviceId,
  date,
}: UseBookingAvailabilityParams) {
  return useQuery({
    queryKey: ["public-booking-availability", username, serviceId, date],
    queryFn: () =>
      getBookingAvailability({
        username,
        serviceId: serviceId!,
        date: date!,
      }),
    enabled: !!username && !!serviceId && !!date,
  });
}