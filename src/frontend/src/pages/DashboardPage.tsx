import { Layout } from "@/components/layout/Layout";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DataTable } from "@/components/ui/DataTable";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollectionSummary } from "@/hooks/use-payments";
import { useAllBalances } from "@/hooks/use-students";
import { PaymentStatus } from "@/types";
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react";

interface SummaryCardProps {
  title: string;
  amount: bigint;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  isLoading: boolean;
}

function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconClass,
  isLoading,
}: SummaryCardProps) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
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
          </div>
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import type { Column } from "@/components/ui/DataTable";
import type { StudentBalance } from "@/types";

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

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useCollectionSummary();
  const { data: balances, isLoading: balancesLoading } = useAllBalances();

  const overdueSorted = (balances ?? [])
    .filter((b) => b.status === PaymentStatus.overdue)
    .slice(0, 10);

  const recentBalances = (balances ?? []).slice(0, 10);

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
          />
          <SummaryCard
            title="Outstanding"
            amount={summary?.totalOutstanding ?? 0n}
            icon={Clock}
            iconClass="bg-amber-50 text-amber-600"
            isLoading={summaryLoading}
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
