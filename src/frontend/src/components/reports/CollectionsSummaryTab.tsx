import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  Download,
  MinusCircle,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useCollectionSummary, usePayments } from "../../hooks/use-payments";
import { PaymentMethod, PaymentStatus } from "../../types";
import type { Payment } from "../../types";

const DATE_RANGES = [
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "Last year", days: 365 },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: PaymentStatus.paid },
  { label: "Pending", value: PaymentStatus.pending },
  { label: "Overdue", value: PaymentStatus.overdue },
  { label: "Waived", value: PaymentStatus.waived },
  { label: "Partial", value: PaymentStatus.partial },
];

const METHOD_OPTIONS = [
  { label: "All Methods", value: "all" },
  { label: "Cash", value: PaymentMethod.cash },
  { label: "Check", value: PaymentMethod.check },
  { label: "Transfer", value: PaymentMethod.transfer },
  { label: "Online", value: PaymentMethod.online },
];

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMethod(method: PaymentMethod): string {
  return method.charAt(0).toUpperCase() + method.slice(1);
}

const COLUMNS: Column<Payment>[] = [
  {
    key: "receipt",
    header: "Receipt #",
    render: (r) => (
      <span className="font-mono text-xs">{r.receiptNumber || "—"}</span>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (r) => <span className="text-sm">{formatDate(r.date)}</span>,
  },
  {
    key: "method",
    header: "Method",
    render: (r) => (
      <span className="capitalize text-sm">{formatMethod(r.method)}</span>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    render: (r) => <CurrencyDisplay amount={r.amount} size="sm" />,
    headerClassName: "text-right",
    className: "text-right",
  },
  {
    key: "notes",
    header: "Notes",
    render: (r) => (
      <span className="text-sm text-muted-foreground truncate max-w-[180px] block">
        {r.notes || "—"}
      </span>
    ),
  },
];

function SummaryCard({
  icon: Icon,
  label,
  amount,
  color,
}: { icon: React.ElementType; label: string; amount: bigint; color: string }) {
  return (
    <Card className="border border-border shadow-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              {label}
            </p>
            <CurrencyDisplay amount={amount} size="xl" />
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function exportCsv(payments: Payment[]): void {
  const headers = ["Receipt #", "Date", "Method", "Amount (cents)", "Notes"];
  const rows = payments.map((p) => [
    p.receiptNumber,
    formatDate(p.date),
    p.method,
    p.amount.toString(),
    `"${p.notes.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "collections-summary.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function CollectionsSummaryTab() {
  const [dateRange, setDateRange] = useState("30");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");

  const navigate = useNavigate();

  const days = Number(dateRange);
  const now = BigInt(Date.now()) * 1_000_000n;
  const from = (BigInt(Date.now()) - BigInt(days * 86_400_000)) * 1_000_000n;

  const {
    data: payments = [],
    isLoading: paymentsLoading,
    isError: paymentsError,
  } = usePayments(from, now);
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useCollectionSummary();

  const isZeroData =
    !summaryLoading &&
    summary !== undefined &&
    summary.totalCollected === 0n &&
    summary.totalOutstanding === 0n &&
    summary.totalOverdue === 0n &&
    summary.paymentCount === 0n;

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== "all" && p.method !== methodFilter) return false;
      return true;
    });
  }, [payments, methodFilter]);

  const summaryCards = [
    {
      icon: TrendingUp,
      label: "Total Collected",
      amount: summary?.totalCollected ?? 0n,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: Clock,
      label: "Outstanding",
      amount: summary?.totalOutstanding ?? 0n,
      color: "bg-amber-50 text-amber-700",
    },
    {
      icon: AlertTriangle,
      label: "Overdue",
      amount: summary?.totalOverdue ?? 0n,
      color: "bg-red-50 text-red-700",
    },
    {
      icon: MinusCircle,
      label: "Waived",
      amount: summary?.totalWaived ?? 0n,
      color: "bg-secondary text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-5" data-ocid="collections-summary-tab">
      {/* Error banner */}
      {(summaryError || paymentsError) && (
        <div
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-ocid="collections-error-banner"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load data</p>
            <p className="text-xs mt-0.5 opacity-80">
              Unable to retrieve report data. Please refresh the page or try
              again. If the issue persists, ensure you are signed in with admin
              access.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summaryCards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Zero-data empty state */}
      {isZeroData ? (
        <Card className="border border-border shadow-card">
          <CardContent className="p-0">
            <EmptyState
              icon={TrendingUp}
              title="No payments recorded yet"
              description="Start tracking fee collections by recording your first payment."
              action={{
                label: "Record first payment",
                onClick: () => navigate({ to: "/payments" }),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        /* Filters + Table */
        <Card className="border border-border shadow-card">
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40" data-ocid="filter-date-range">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGES.map((r) => (
                    <SelectItem key={r.days} value={String(r.days)}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36" data-ocid="filter-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-36" data-ocid="filter-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHOD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => exportCsv(filtered)}
                  disabled={filtered.length === 0}
                  data-ocid="export-collections-csv"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>

            <DataTable
              columns={COLUMNS}
              data={filtered}
              keyExtractor={(p) => p.id.toString()}
              isLoading={paymentsLoading}
              emptyState={
                <EmptyState
                  icon={TrendingUp}
                  title="No payments found"
                  description="No payments match your current filters. Try adjusting the date range or filter criteria."
                />
              }
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
