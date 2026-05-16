import { api } from "@/lib/api";
import type {
  CreatePublicAppointmentPayload,
  CreatePublicAppointmentResponse,
  PublicAvailabilityResponse,
  PublicBookingProfileResponse,
} from "../types/public-booking.types";

export async function getBookingProfile(
  username: string,
): Promise<PublicBookingProfileResponse> {
  return api.get(`/public/book/${username}`, {
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  }) as Promise<PublicBookingProfileResponse>;
}

export async function getBookingAvailability(params: {
  username: string;
  serviceId: string;
  date: string;
  professionalId: string; 
  isMaintenance?: boolean;
}): Promise<PublicAvailabilityResponse> {
  const searchParams = new URLSearchParams({
    serviceId: params.serviceId,
    date: params.date,
    professionalId: params.professionalId, 
  });

  // 🌟 A PEÇA QUE FALTAVA: Adicionar a flag na URL se for manutenção!
  if (params.isMaintenance) {
    searchParams.append("isMaintenance", "true");
  }

  return api.get(
    `/public/book/${params.username}/availability?${searchParams.toString()}`,
    {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    }
  ) as Promise<PublicAvailabilityResponse>;
}

export async function createPublicAppointment(params: {
  username: string;
  payload: CreatePublicAppointmentPayload;
}): Promise<CreatePublicAppointmentResponse> {
  return api.post(
    `/public/book/${params.username}/appointments`,
    params.payload
  ) as Promise<CreatePublicAppointmentResponse>;
}