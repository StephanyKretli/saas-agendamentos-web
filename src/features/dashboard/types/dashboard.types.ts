export type DashboardMetrics = {
  month: string;
  totalAppointments: number;
  scheduled: number;
  completed: number;
  canceled: number;
  expectedRevenueFormatted: string;
  realizedRevenueFormatted: string;
  cancelRate: number;
  mostBookedService:
    | {
        name: string;
        count: number;
      }
    | null;
};