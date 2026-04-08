import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className,
      )}
      data-ocid="empty-state"
    >
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-5">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} data-ocid="empty-state-cta">
          {action.label}
        </Button>
      )}
    </div>
  );
}
