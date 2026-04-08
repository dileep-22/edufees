import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Banknote,
  Building2,
  CreditCard,
  Download,
  Globe,
} from "lucide-react";
import { useMemo } from "react";
import { usePaymentMethodBreakdown } from "../../hooks/use-payments";
import { PaymentMethod } from "../../types";

const METHOD_CONFIG: Record<
  PaymentMethod,
  {
    label: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    barColor: string;
  }
> = {
  [PaymentMethod.cash]: {
    label: "Cash",
    icon: Banknote,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    barColor: "bg-emerald-500",
  },
  [PaymentMethod.check]: {
    label: "Check",
    icon: CreditCard,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
  },
  [PaymentMethod.transfer]: {
    label: "Bank Transfer",
    icon: Building2,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    barColor: "bg-purple-500",
  },
  [PaymentMethod.online]: {
    label: "Online",
    icon: Globe,
    color: "text-primary",
    bgColor: "bg-primary/10",
    barColor: "bg-primary",
  },
};

const METHODS = [
  PaymentMethod.cash,
  PaymentMethod.check,
  PaymentMethod.transfer,
  PaymentMethod.online,
] as const;

function exportCsv(
  data: Array<{
    method: string;
    label: string;
    amount: bigint;
    percentage: number;
  }>,
): void {
  const headers = ["Payment Method", "Amount", "Percentage"];
  const rows = data.map((d) => [
    d.label,
    (Number(d.amount) / 100).toFixed(2),
    `${d.percentage.toFixed(1)}%`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payment-methods.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function DonutChart({
  segments,
}: {
  segments: Array<{ method: PaymentMethod; pct: number; amount: bigint }>;
}) {
  const total = segments.reduce((s, seg) => s + Number(seg.amount), 0);
  if (total === 0) return null;

  let cumPct = 0;
  const r = 80;
  const cx = 100;
  const cy = 100;

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-48 h-48"
        role="img"
        aria-label="Payment method distribution chart"
      >
        <title>Payment method distribution</title>
        {segments.map((seg) => {
          if (seg.pct === 0) return null;
          const config = METHOD_CONFIG[seg.method];
          const startAngle = cumPct * 3.6 - 90;
          const endAngle = (cumPct + seg.pct) * 3.6 - 90;
          const start = {
            x: cx + r * Math.cos((startAngle * Math.PI) / 180),
            y: cy + r * Math.sin((startAngle * Math.PI) / 180),
          };
          const end = {
            x: cx + r * Math.cos((endAngle * Math.PI) / 180),
            y: cy + r * Math.sin((endAngle * Math.PI) / 180),
          };
          const largeArc = seg.pct > 50 ? 1 : 0;
          const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
          cumPct += seg.pct;
          return (
            <path
              key={seg.method}
              d={d}
              className={config.barColor.replace("bg-", "fill-")}
              opacity={0.85}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={50} className="fill-card" />
      </svg>
    </div>
  );
}

export function PaymentMethodsTab() {
  const { data: breakdown, isLoading, isError } = usePaymentMethodBreakdown();

  const segments = useMemo(() => {
    if (!breakdown)
      return METHODS.map((m) => ({ method: m, amount: 0n, pct: 0 }));
    const total = METHODS.reduce((s, m) => s + Number(breakdown[m]), 0);
    return METHODS.map((m) => ({
      method: m,
      amount: breakdown[m],
      pct: total > 0 ? (Number(breakdown[m]) / total) * 100 : 0,
    }));
  }, [breakdown]);

  const total = useMemo(
    () => segments.reduce((s, seg) => s + seg.amount, 0n),
    [segments],
  );
  const hasData = total > 0n;

  const csvData = segments.map((s) => ({
    method: s.method,
    label: METHOD_CONFIG[s.method].label,
    amount: s.amount,
    percentage: s.pct,
  }));

  return (
    <div className="space-y-5" data-ocid="payment-methods-tab">
      {/* Error banner */}
      {isError && (
        <div
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-ocid="methods-error-banner"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load payment methods data</p>
            <p className="text-xs mt-0.5 opacity-80">
              Unable to retrieve payment breakdown. Please refresh the page or
              try again. Ensure you are signed in with admin access.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Donut chart */}
        <Card className="border border-border shadow-card lg:col-span-1">
          <CardHeader className="pb-2 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-foreground">
              Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Skeleton className="w-48 h-48 rounded-full" />
              </div>
            ) : !hasData ? (
              <EmptyState
                icon={CreditCard}
                title="No payment data"
                description="No payments have been recorded yet."
                className="py-8"
              />
            ) : (
              <DonutChart segments={segments} />
            )}
          </CardContent>
        </Card>

        {/* Method cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {METHODS.map((method) => {
            const config = METHOD_CONFIG[method];
            const seg = segments.find((s) => s.method === method);
            const Icon = config.icon;
            return (
              <Card key={method} className="border border-border shadow-card">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor}`}
                    >
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {config.label}
                      </p>
                      {isLoading ? (
                        <Skeleton className="h-7 w-24 mt-1" />
                      ) : (
                        <>
                          <CurrencyDisplay
                            amount={seg?.amount ?? 0n}
                            size="lg"
                          />
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {seg ? seg.pct.toFixed(1) : "0.0"}% of total
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {!isLoading && seg && total > 0n && (
                    <div className="mt-3">
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
                          style={{ width: `${seg.pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Summary table */}
      <Card className="border border-border shadow-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Payment Method Summary
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportCsv(csvData)}
              disabled={!hasData}
              data-ocid="export-methods-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : !hasData ? (
            <EmptyState
              icon={CreditCard}
              title="No payment methods data"
              description="Record payments to see a breakdown by payment method."
            />
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary border-b border-border">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Method
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Share
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {segments.map((seg) => {
                    const config = METHOD_CONFIG[seg.method];
                    const Icon = config.icon;
                    return (
                      <tr
                        key={seg.method}
                        className="border-b border-border last:border-0 bg-card hover:bg-secondary/50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.bgColor}`}
                            >
                              <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                            </div>
                            <span className="font-medium">{config.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <CurrencyDisplay amount={seg.amount} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${config.barColor}`}
                                style={{ width: `${seg.pct}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground text-xs w-10 text-right">
                              {seg.pct.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-secondary/40 border-t-2 border-border">
                    <td className="px-4 py-3 font-semibold text-foreground">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CurrencyDisplay
                        amount={total}
                        size="sm"
                        className="font-bold"
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground text-xs">
                      100%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
