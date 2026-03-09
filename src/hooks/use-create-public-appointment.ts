"use client";

import { useMutation } from "@tanstack/react-query";
import { createPublicAppointment } from "@/lib/booking-api";
import type { CreatePublicAppointmentPayload } from "@/types/booking";

export function useCreatePublicAppointment(username: string) {
  return useMutation({
    mutationFn: (payload: CreatePublicAppointmentPayload) =>
      createPublicAppointment(username, payload),
  });
}