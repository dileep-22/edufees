import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Download } from "lucide-react";
import { useMemo } from "react";
import { useAgingReport } from "../../hooks/use-payments";
import type { AgingBucket } from "../../types";

const BUCKET_CONFIG: Record<
  string,
  { label: string; barColor: string; bgColor: string; textColor: string }
> = {
  "0-30": {
    label: "0–30 Days",
    barColor: "bg-amber-400",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  "30-60": {
    label: "30–60 Days",
    barColor: "bg-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
  },
  "60+": {
    label: "60+ Days",
    barColor: "bg-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
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

const COLUMNS: Column<AgingBucket>[] = [
  {
    key: "bucket",
    header: "Aging Bucket",
    render: (b) => {
      const config = getBucketConfig(b.bucket);
      return (
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-md ${config.bgColor} ${config.textColor}`}
        >
          {config.label}
        </span>
      );
    },
  },
  {
    key: "count",
    header: "Overdue Fees",
    render: (b) => (
      <span className="text-sm font-semibold text-foreground">
        {b.count.toString()}
      </span>
    ),
    headerClassName: "text-right",
    className: "text-right",
  },
  {
    key: "totalAmount",
    header: "Total Overdue Amount",
    render: (b) => (
      <CurrencyDisplay
        amount={b.totalAmount}
        size="sm"
        className="text-red-600 font-semibold"
      />
    ),
    headerClassName: "text-right",
    className: "text-right",
  },
];

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

export function AgingReportTab() {
  const { data: buckets = [], isLoading } = useAgingReport();

  const totalOverdue = useMemo(
    () => buckets.reduce((sum, b) => sum + b.totalAmount, 0n),
    [buckets],
  );
  const totalCount = useMemo(
    () => buckets.reduce((sum, b) => sum + b.count, 0n),
    [buckets],
  );
  const hasData = buckets.some((b) => b.count > 0n);

  return (
    <div className="space-y-5" data-ocid="aging-report-tab">
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

      {/* Table */}
      <Card className="border border-border shadow-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">
              Aging Detail
            </p>
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
          <DataTable
            columns={COLUMNS}
            data={buckets}
            keyExtractor={(b) => b.bucket}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={AlertTriangle}
                title="No aging data"
                description="Great news! There are no overdue fees to report."
              />
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
