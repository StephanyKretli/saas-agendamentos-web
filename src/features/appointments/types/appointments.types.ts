export type AppointmentStatus =
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELED";

export type Appointment = {
  id: string;
  date: string;
  status: AppointmentStatus;
  notes?: string | null;

  service: {
    id: string;
    name: string;
    duration: number;
    priceCents: number;
  };

  client: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
  };
};

export type PaginatedAppointmentsResponse = {
  items: Appointment[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};