import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex min-h-100 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction} variant="outline" className="rounded-xl">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}