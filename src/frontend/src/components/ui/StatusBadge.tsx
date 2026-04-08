import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "../../types";

interface StatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  [PaymentStatus.paid]: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [PaymentStatus.pending]: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [PaymentStatus.overdue]: {
    label: "Overdue",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  [PaymentStatus.waived]: {
    label: "Waived",
    className: "bg-secondary text-muted-foreground border-border",
  },
  [PaymentStatus.partial]: {
    label: "Partial",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-secondary text-muted-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={cn("text-xs font-medium border", config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
