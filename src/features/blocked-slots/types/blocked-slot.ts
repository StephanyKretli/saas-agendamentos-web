export type BlockedSlot = {
  id: string;
  start: string;
  end: string;
  reason?: string | null;
  createdAt?: string;
};

export type CreateBlockedSlotInput = {
  start: string;
  end: string;
  reason?: string;
};