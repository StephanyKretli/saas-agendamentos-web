"use client";

type TimelineBlockedItemCardProps = {
  start: string;
  end: string;
};

export function TimelineBlockedItemCard({
  start,
  end,
}: TimelineBlockedItemCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-800">Horário bloqueado</p>
          <p className="text-xs text-gray-600">
            {start} - {end}
          </p>
        </div>

        <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs text-gray-700">
          Bloqueado
        </span>
      </div>
    </div>
  );
}