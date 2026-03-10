export type DashboardMetrics = {
  month: string;
  expectedRevenueCents: number;
  expectedRevenueFormatted: string;
  realizedRevenueCents: number;
  realizedRevenueFormatted: string;
  totalAppointments: number;
  scheduled: number;
  completed: number;
  canceled: number;
  cancelRate: string;
  mostBookedService: string | null;
};