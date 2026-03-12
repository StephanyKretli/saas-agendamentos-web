import { CancelAppointmentCard } from "@/features/public-cancel/components/cancel-appointment-card";

type PageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function CancelAppointmentPage({ params }: PageProps) {
  const { token } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-4 py-10">
      <div className="w-full">
        <CancelAppointmentCard token={token} />
      </div>
    </main>
  );
}