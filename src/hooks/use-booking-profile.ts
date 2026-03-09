"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/lib/booking-api";

export function useBookingProfile(username: string) {
  return useQuery({
    queryKey: ["booking-profile", username],
    queryFn: () => getPublicProfile(username),
    enabled: !!username,
  });
}