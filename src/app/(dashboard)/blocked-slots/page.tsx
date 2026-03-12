import { BlockedSlotForm } from "@/features/blocked-slots/components/blocked-slot-form";
import { BlockedSlotList } from "@/features/blocked-slots/components/blocked-slot-list";

export default function BlockedSlotsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">
          Bloqueios de horário
        </h1>
        <p className="text-sm text-muted-foreground">
          Bloqueie intervalos específicos para evitar agendamentos nesses períodos.
        </p>
      </div>

      <BlockedSlotForm />
      <BlockedSlotList />
    </div>
  );
}