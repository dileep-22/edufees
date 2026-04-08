import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Download,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAgingReport, useAgingReportDetail } from "../../hooks/use-payments";
import type { AgingBucket, AgingBucketDetail } from "../../types";

const BUCKET_CONFIG: Record<
  string,
  {
    label: string;
    barColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    index: number;
  }
> = {
  "0-30": {
    label: "0–30 Days",
    barColor: "bg-amber-400",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
    index: 0,
  },
  "30-60": {
    label: "30–60 Days",
    barColor: "bg-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
    index: 1,
  },
  "60+": {
    label: "60+ Days",
    barColor: "bg-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
    index: 2,
  },
};

function getBucketConfig(bucket: string) {
  for (const key of Object.keys(BUCKET_CONFIG)) {
    if (bucket.includes(key)) return BUCKET_CONFIG[key];
  }
  return {
    label: bucket,
    barColor: "bg-primary",
    bgColor: "bg-secondary",
    textColor: "text-foreground",
    borderColor: "border-border",
    index: -1,
  };
}

function exportCsv(data: AgingBucket[]): void {
  const headers = ["Bucket", "Count", "Total Amount"];
  const rows = data.map((b) => [
    getBucketConfig(b.bucket).label,
    b.count.toString(),
    (Number(b.totalAmount) / 100).toFixed(2),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aging-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function AgingBarChart({ buckets }: { buckets: AgingBucket[] }) {
  const maxAmount = useMemo(
    () => buckets.reduce((m, b) => (b.totalAmount > m ? b.totalAmount : m), 0n),
    [buckets],
  );

  if (buckets.length === 0) return null;

  return (
    <div className="space-y-3">
      {buckets.map((bucket) => {
        const config = getBucketConfig(bucket.bucket);
        const pct =
          maxAmount > 0n
            ? Math.round((Number(bucket.totalAmount) / Number(maxAmount)) * 100)
            : 0;
        return (
          <div key={bucket.bucket} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${config.textColor}`}>
                {config.label}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground text-xs">
                  {bucket.count.toString()} fees
                </span>
                <CurrencyDisplay amount={bucket.totalAmount} size="sm" />
              </div>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${config.barColor}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DrillDownTable({
  bucketIndex,
  config,
  enabled,
}: {
  bucketIndex: number;
  config: ReturnType<typeof getBucketConfig>;
  enabled: boolean;
}) {
  const { data: details = [], isLoading } = useAgingReportDetail(
    bucketIndex,
    enabled,
  );

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (details.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-4 py-6 text-center">
        No records found for this bucket.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Student Name
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Student ID
            </th>
            <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Fee Structure
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Days Overdue
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Amount Due
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Amount Paid
            </th>
            <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Outstanding
            </th>
          </tr>
        </thead>
        <tbody>
          {details.map((item: AgingBucketDetail, idx: number) => {
            const outstanding = item.amountDue - item.amountPaid;
            return (
              <tr
                key={`${item.studentId}-${idx}`}
                className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {item.studentName}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {item.studentId}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.feeStructureName}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={cn(
                      "font-semibold text-xs px-2 py-0.5 rounded-md",
                      config.bgColor,
                      config.textColor,
                    )}
                  >
                    {item.daysOverdue.toString()}d
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <CurrencyDisplay amount={item.amountDue} size="sm" />
                </td>
                <td className="px-4 py-3 text-right">
                  <CurrencyDisplay
                    amount={item.amountPaid}
                    size="sm"
                    className="text-emerald-700"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <CurrencyDisplay
                    amount={outstanding > 0n ? outstanding : 0n}
                    size="sm"
                    className="text-red-600 font-semibold"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function AgingBucketRow({
  bucket,
  isExpanded,
  onToggle,
}: {
  bucket: AgingBucket;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const config = getBucketConfig(bucket.bucket);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-secondary/40",
          isExpanded ? "bg-secondary/30" : "bg-card",
        )}
        data-ocid={`aging-bucket-${bucket.bucket}`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
          <span
            className={cn(
              "inline-flex items-center text-sm font-semibold px-2.5 py-0.5 rounded-md",
              config.bgColor,
              config.textColor,
            )}
          >
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Overdue Fees</p>
            <p className="text-sm font-bold text-foreground">
              {bucket.count.toString()}
            </p>
          </div>
          <div className="text-right min-w-[100px]">
            <p className="text-xs text-muted-foreground">Total Overdue</p>
            <CurrencyDisplay
              amount={bucket.totalAmount}
              size="sm"
              className="text-red-600 font-semibold"
            />
          </div>
        </div>
      </button>

      {isExpanded && (
        <div
          className={cn(
            "border-t ml-4 mr-0 rounded-bl-lg border-l-2",
            config.borderColor,
          )}
        >
          <div className={cn("bg-secondary/20")}>
            <DrillDownTable
              bucketIndex={config.index}
              config={config}
              enabled={isExpanded}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function AgingReportTab() {
  const { data: buckets = [], isLoading, isError } = useAgingReport();
  const [expandedBucket, setExpandedBucket] = useState<string | null>(null);

  const totalOverdue = useMemo(
    () => buckets.reduce((sum, b) => sum + b.totalAmount, 0n),
    [buckets],
  );
  const totalCount = useMemo(
    () => buckets.reduce((sum, b) => sum + b.count, 0n),
    [buckets],
  );
  const hasData = buckets.some((b) => b.count > 0n);

  const handleToggle = (bucket: string) => {
    setExpandedBucket((prev) => (prev === bucket ? null : bucket));
  };

  return (
    <div className="space-y-5" data-ocid="aging-report-tab">
      {/* Error banner */}
      {isError && (
        <div
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-ocid="aging-error-banner"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load aging report</p>
            <p className="text-xs mt-0.5 opacity-80">
              Unable to retrieve overdue data. Please refresh the page or try
              again. Ensure you are signed in with admin access.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border border-border shadow-card">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Total Overdue
              </p>
              {isLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <CurrencyDisplay
                  amount={totalOverdue}
                  size="xl"
                  className="text-red-600"
                />
              )}
            </CardContent>
          </Card>
          <Card className="border border-border shadow-card">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Overdue Fees
              </p>
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                <p className="text-2xl font-bold font-display text-foreground">
                  {totalCount.toString()}
                </p>
              )}
            </CardContent>
          </Card>
          {(isLoading ? ["skel-1", "skel-2"] : buckets.slice(0, 3)).map(
            (item) => {
              if (isLoading) {
                return (
                  <Skeleton
                    key={item as string}
                    className="h-20 w-full rounded-xl col-span-1"
                  />
                );
              }
              const b = item as AgingBucket;
              if (b.count === 0n) return null;
              const config = getBucketConfig(b.bucket);
              return (
                <Card
                  key={b.bucket}
                  className={`border col-span-1 ${config.bgColor} border-opacity-50`}
                >
                  <CardContent className="p-4">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide mb-1 ${config.textColor}`}
                    >
                      {config.label}
                    </p>
                    <p
                      className={`text-lg font-bold font-display ${config.textColor}`}
                    >
                      {b.count.toString()} fees
                    </p>
                  </CardContent>
                </Card>
              );
            },
          )}
        </div>

        {/* Bar Chart */}
        <Card className="border border-border shadow-card">
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-foreground">
              Overdue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !hasData ? (
              <EmptyState
                icon={AlertTriangle}
                title="No overdue fees"
                description="All fees are current — no overdue payments to report."
                className="py-8"
              />
            ) : (
              <AgingBarChart buckets={buckets} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Drill-Down Table */}
      <Card className="border border-border shadow-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Aging Detail
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Click a bucket to drill down into individual overdue payments
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => exportCsv(buckets)}
              disabled={buckets.length === 0}
              data-ocid="export-aging-csv"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : !hasData ? (
            <EmptyState
              icon={AlertTriangle}
              title="No aging data"
              description="Great news! There are no overdue fees to report."
            />
          ) : (
            <div className="space-y-2">
              {buckets.map((bucket) => (
                <AgingBucketRow
                  key={bucket.bucket}
                  bucket={bucket}
                  isExpanded={expandedBucket === bucket.bucket}
                  onToggle={() => handleToggle(bucket.bucket)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
