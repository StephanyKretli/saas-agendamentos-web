import { apiFetch } from "./api";
import type {
  AvailabilityResponse,
  CreatePublicAppointmentPayload,
  CreatedAppointmentResponse,
  PublicProfileResponse,
} from "@/types/booking";

export function getPublicProfile(username: string) {
  return apiFetch<PublicProfileResponse>(`/public/book/${username}`);
}

export function getPublicAvailability(
  username: string,
  serviceId: string,
  date: string,
  step = 30,
) {
  const query = new URLSearchParams({
    serviceId,
    date,
    step: String(step),
  });

  return apiFetch<AvailabilityResponse>(
    `/public/book/${username}/availability?${query.toString()}`,
  );
}

export function createPublicAppointment(
  username: string,
  payload: CreatePublicAppointmentPayload,
) {
  return apiFetch<CreatedAppointmentResponse>(
    `/public/book/${username}/appointments`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}