"use client";

import { useMutation } from "@tanstack/react-query";
import { createPublicAppointment } from "../services/public-booking.api";
import type { CreatePublicAppointmentPayload } from "../types/public-booking.types";

type MutationParams = {
  username: string;
  payload: CreatePublicAppointmentPayload;
};

export function useCreatePublicAppointment() {
  return useMutation({
    mutationFn: ({ username, payload }: MutationParams) =>
      createPublicAppointment({ username, payload }),
  });
}