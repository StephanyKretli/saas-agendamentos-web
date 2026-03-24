import { Skeleton } from "@/components/ui/skeleton";

export function TimelineSkeleton() {
  return (
    <div className="space-y-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 w-full">
          {/* Hora */}
          <div className="w-12 pt-2">
            <Skeleton className="h-4 w-10" />
          </div>

          <div className="flex-1 pb-4">
            <div className="h-28 w-full rounded-2xl border border-border bg-muted/40 p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-1/4 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}