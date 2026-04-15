import { Layout } from "@/components/layout/Layout";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCollectionSummary,
  useCollectionTrends,
} from "@/hooks/use-payments";
import { useAllBalances } from "@/hooks/use-students";
import { PaymentStatus } from "@/types";
import type {
  CollectionSummary,
  CollectionTrends,
  StudentBalance,
} from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function calcPercentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) * 100) / previous);
}

function formatPercent(pct: number): string {
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}

// ── TrendBadge ────────────────────────────────────────────────────────────────

interface TrendBadgeProps {
  current: number;
  previous: number;
  invertColors?: boolean; // true = up is bad (outstanding), false = up is good (collected)
}

function TrendBadge({
  current,
  previous,
  invertColors = false,
}: TrendBadgeProps) {
  const pct = calcPercentChange(current, previous);

  if (pct === null) return null;

  if (pct === 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground">
        <Minus className="w-3 h-3" />
        No change
      </span>
    );
  }

  const isPositive = pct > 0;
  // For "collected", up is good (green). For "outstanding", up is bad (red).
  const isGood = invertColors ? !isPositive : isPositive;

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
        isGood ? "text-emerald-600" : "text-destructive"
      }`}
    >
      {isPositive ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {formatPercent(pct)}
    </span>
  );
}

// ── SummaryCard ───────────────────────────────────────────────────────────────

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  isLoading: boolean;
  trend?: React.ReactNode;
  secondaryLine?: React.ReactNode;
}

function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconClass,
  isLoading,
  trend,
  secondaryLine,
}: SummaryCardProps) {
  return (
    <div className="card-institutional">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              {title}
            </p>
            {isLoading ? (
              <Skeleton className="h-7 w-28 mt-1" />
            ) : (
              <CurrencyDisplay
                amount={amount}
                size="xl"
                className="text-foreground"
              />
            )}
            {secondaryLine && !isLoading && (
              <div className="mt-1">{secondaryLine}</div>
            )}
            {trend && !isLoading && (
              <div className="flex items-center gap-1.5 mt-2">
                {trend}
                <span className="text-xs text-muted-foreground">
                  vs last 30 days
                </span>
              </div>
            )}
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-3 ${iconClass}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </div>
  );
}

// ── Balance table columns ─────────────────────────────────────────────────────

const balanceColumns: Column<StudentBalance>[] = [
  {
    key: "name",
    header: "Student Name",
    render: (row) => <span className="font-medium">{row.studentName}</span>,
  },
  {
    key: "feeStructure",
    header: "Fee Structure",
    render: (row) => (
      <span className="text-muted-foreground">{row.feeStructureName}</span>
    ),
  },
  {
    key: "total",
    header: "Total Due",
    render: (row) => <CurrencyDisplay amount={row.totalAmount} />,
    headerClassName: "text-right",
    className: "text-right",
  },
  {
    key: "paid",
    header: "Paid",
    render: (row) => (
      <CurrencyDisplay amount={row.paidAmount} className="text-emerald-600" />
    ),
    headerClassName: "text-right",
    className: "text-right",
  },
  {
    key: "outstanding",
    header: "Outstanding",
    render: (row) => <CurrencyDisplay amount={row.outstandingAmount} />,
    headerClassName: "text-right",
    className: "text-right",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => <StatusBadge status={row.status} />,
  },
];

// ── PenaltySecondaryLine ──────────────────────────────────────────────────────

function PenaltyLine({ summary }: { summary: CollectionSummary }) {
  const withPenalty = summary.totalOutstandingWithPenalty;
  const base = summary.totalOutstanding;
  if (!withPenalty || withPenalty === base) return null;
  return (
    <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
      Incl. penalties:{" "}
      <CurrencyDisplay
        amount={withPenalty}
        className="text-xs text-amber-600 font-medium"
      />
    </span>
  );
}

// ── DashboardPage ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useCollectionSummary();
  const { data: trends, isLoading: trendsLoading } = useCollectionTrends();
  const { data: balances, isLoading: balancesLoading } = useAllBalances();

  const overdueSorted = (balances ?? [])
    .filter((b) => b.status === PaymentStatus.overdue)
    .slice(0, 10);

  const recentBalances = (balances ?? []).slice(0, 10);

  // Determine empty state: no fees assigned and no payments
  const hasNoData =
    !summaryLoading &&
    !balancesLoading &&
    summary?.paymentCount === 0n &&
    (balances ?? []).length === 0;

  const isLoadingTrends = summaryLoading || trendsLoading;

  const collectedTrend =
    trends && !isLoadingTrends ? (
      <TrendBadge
        current={trends.currentPeriodTotal}
        previous={trends.previousPeriodTotal}
        invertColors={false}
      />
    ) : null;

  const outstandingTrend =
    trends && !isLoadingTrends && summary ? (
      <TrendBadge
        current={summary.totalOutstanding}
        previous={
          // Approximate: previous outstanding ≈ current - (current period collected - previous period collected)
          summary.totalOutstanding +
          (trends.previousPeriodTotal > trends.currentPeriodTotal
            ? trends.previousPeriodTotal - trends.currentPeriodTotal
            : 0n)
        }
        invertColors={true}
      />
    ) : null;

  if (hasNoData) {
    return (
      <Layout>
        <div className="p-6">
          <PageHeader
            title="Dashboard"
            description="Overview of fee collection and payment status"
          />
          <div className="mt-8">
            <EmptyState
              icon={LayoutDashboard}
              title="No data yet — let's get started"
              description="Create your first fee structure to begin managing collections, tracking payments, and monitoring outstanding balances."
              action={{
                label: "Get started — create your first fee structure",
                onClick: () => navigate({ to: "/fee-structures/new" }),
              }}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <PageHeader
          title="Dashboard"
          description="Overview of fee collection and payment status"
        />

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            title="Total Collected"
            amount={summary?.totalCollected ?? 0n}
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
            isLoading={summaryLoading}
            trend={collectedTrend}
          />
          <SummaryCard
            title="Outstanding"
            amount={summary?.totalOutstanding ?? 0n}
            icon={Clock}
            iconClass="bg-amber-50 text-amber-600"
            isLoading={summaryLoading}
            trend={outstandingTrend}
            secondaryLine={summary ? <PenaltyLine summary={summary} /> : null}
          />
          <SummaryCard
            title="Overdue"
            amount={summary?.totalOverdue ?? 0n}
            icon={AlertCircle}
            iconClass="bg-red-50 text-red-600"
            isLoading={summaryLoading}
          />
          <SummaryCard
            title="Waived"
            amount={summary?.totalWaived ?? 0n}
            icon={TrendingUp}
            iconClass="bg-secondary text-muted-foreground"
            isLoading={summaryLoading}
          />
        </div>

        {/* Overdue section */}
        {(overdueSorted.length > 0 || balancesLoading) && (
          <div className="mb-8">
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Overdue Balances
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={balanceColumns}
                  data={overdueSorted}
                  keyExtractor={(row) =>
                    `${row.studentId}-${row.feeStructureId}`
                  }
                  isLoading={balancesLoading}
                  className="border-0 rounded-none"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* All balances */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Recent Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={balanceColumns}
              data={recentBalances}
              keyExtractor={(row) => `${row.studentId}-${row.feeStructureId}`}
              isLoading={balancesLoading}
              emptyState="No balances found. Assign fees to students to get started."
              className="border-0 rounded-none"
            />
          </CardContent>
        </Card>

        {/* Stats row */}
        {summary && !summaryLoading && (
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              Total payments recorded:{" "}
              <span className="font-semibold text-foreground">
                {summary.paymentCount.toString()}
              </span>
            </span>
          </div>
        )}
      </div>
    </Layout>
  );
}
