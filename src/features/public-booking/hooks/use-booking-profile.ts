"use client";

import { useQuery } from "@tanstack/react-query";
import { getBookingProfile } from "../services/public-booking.api";

export function useBookingProfile(username: string) {
  return useQuery({
    queryKey: ["public-booking-profile", username],
    queryFn: () => getBookingProfile(username),
    enabled: !!username,
  });
}