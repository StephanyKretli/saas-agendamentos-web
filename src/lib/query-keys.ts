export const queryKeys = {
  services: ["services"] as const,
  dayTimeline: (date: string) => ["appointments-day-timeline", date] as const,
  publicBookingAvailability: (
    username: string | null,
    serviceId: string | null,
    date: string | null,
  ) =>
    ["public-booking-availability", username, serviceId, date] as const,
};