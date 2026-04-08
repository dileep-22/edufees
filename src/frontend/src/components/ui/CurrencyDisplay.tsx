import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  amount: bigint;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<string, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg font-semibold",
  xl: "text-2xl font-bold font-display",
};

export function CurrencyDisplay({
  amount,
  className,
  size = "md",
}: CurrencyDisplayProps) {
  // Amounts stored in cents (bigint), display as dollars
  const dollars = Number(amount) / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(dollars);

  return (
    <span
      className={cn(sizeClasses[size], "font-mono tabular-nums", className)}
    >
      {formatted}
    </span>
  );
}
