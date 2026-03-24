import { Skeleton } from "@/components/ui/skeleton";

export function ServicesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-500">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="space-y-4">
            {/* Título e Descrição */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md opacity-60" />
            </div>

            {/* Preço e Duração */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12 rounded-full" />
                <Skeleton className="h-4 w-12 rounded-full" />
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}