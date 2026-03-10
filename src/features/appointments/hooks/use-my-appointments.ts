"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "../services/appointments.api";

export function useMyAppointments() {
  return useQuery({
    queryKey: ["appointments", "me"],
    queryFn: getMyAppointments,
  });
}