export type CancelPreviewResponse = {
  id: string;
  status: "SCHEDULED" | "CANCELED" | "COMPLETED";
  date: string;
  serviceName: string;
  clientName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  canCancel: boolean;
};

export type CancelAppointmentResponse = {
  id: string;
  status: "CANCELED";
  date: string;
  serviceName: string;   
  clientName?: string | null;
  canCancel: boolean;
};