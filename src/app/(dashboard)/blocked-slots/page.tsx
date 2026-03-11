import { BlockedDatesForm } from "@/features/blocked-dates/components/blocked-dates-form"
import { BlockedDatesList } from "@/features/blocked-dates/components/blocked-dates-list"

export default function BlockedDatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bloqueios de agenda
        </h1>

        <p className="text-sm text-zinc-500">
          Bloqueie dias em que você não estará disponível.
        </p>
      </div>

      <BlockedDatesForm />

      <BlockedDatesList />
    </div>
  )
}