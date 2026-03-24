export type DashboardMetrics = {
  month: string;
  totalAppointments: number;
  scheduled: number;
  completed: number;
  canceled: number;
  expectedRevenueFormatted: string;
  realizedRevenueFormatted: string;
  cancelRate: string | number;
  mostBookedService: { name: string; count: number; } | null;
};

export type TodayAppointment = {
  id: string;
  clientName: string;
  serviceName: string;
  startTime: string; 
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";
};