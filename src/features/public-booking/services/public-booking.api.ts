import { apiFetch } from "@/lib/api";
import type { PublicBookingProfileResponse } from "../types/public-booking.types";

export async function getBookingProfile(
  username: string,
): Promise<PublicBookingProfileResponse> {
  return apiFetch<PublicBookingProfileResponse>(`/public/book/${username}`, {
    method: "GET",
    cache: "no-store",
  });
}