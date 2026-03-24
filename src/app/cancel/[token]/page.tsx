"use client";

import { useParams } from "next/navigation";
import { CancelAppointmentCard } from "@/features/public-cancel/components/cancel-appointment-card";

export default function CancelPage() {
  const params = useParams();
  const token = String(params.token ?? "");

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 px-4 py-10">
      <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
        <CancelAppointmentCard token={token} />
      </div>
    </main>
  );
}