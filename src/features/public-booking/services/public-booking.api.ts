import { apiFetch } from "@/lib/api";
import type {
  PublicAvailabilityResponse,
  PublicBookingProfileResponse,
} from "../types/public-booking.types";

export async function getBookingProfile(
  username: string,
): Promise<PublicBookingProfileResponse> {
  return apiFetch<PublicBookingProfileResponse>(`/public/book/${username}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function getBookingAvailability(params: {
  username: string;
  serviceId: string;
  date: string;
}): Promise<PublicAvailabilityResponse> {
  const searchParams = new URLSearchParams({
    serviceId: params.serviceId,
    date: params.date,
  });

  return apiFetch<PublicAvailabilityResponse>(
    `/public/book/${params.username}/availability?${searchParams.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
}