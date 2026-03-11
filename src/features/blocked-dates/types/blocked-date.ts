export type BlockedDate = {
  id: string
  date: string
  reason?: string | null
  createdAt?: string
}

export type CreateBlockedDateInput = {
  date: string
  reason?: string
}