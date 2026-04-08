import { Layout } from "@/components/layout/Layout";
import { RecordPaymentModal } from "@/components/payments/RecordPaymentModal";
import { WaiveFeeModal } from "@/components/payments/WaiveFeeModal";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { DataTable } from "@/components/ui/DataTable";
import type { Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollectionSummary, usePayments } from "@/hooks/use-payments";
import { useAllBalances } from "@/hooks/use-students";
import { PaymentMethod, PaymentStatus } from "@/types";
import type { Payment, StudentBalance } from "@/types";
import {
  AlertCircle,
  Download,
  Filter,
  Plus,
  Receipt,
  Search,
  TrendingDown,
  Wallet,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

type TabView = "payments" | "balances";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.cash]: "Cash",
  [PaymentMethod.check]: "Check",
  [PaymentMethod.transfer]: "Bank Transfer",
  [PaymentMethod.online]: "Online",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OutstandingBanner({ isLoading }: { isLoading: boolean }) {
  const { data: summary } = useCollectionSummary();
  if (isLoading) return <Skeleton className="h-16 w-full rounded-xl mb-4" />;
  if (!summary) return null;
  const outstanding = summary.totalOutstanding;
  if (outstanding === 0n) return null;
  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5">
      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
        <AlertCircle className="w-4 h-4 text-amber-600" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-800">
          Outstanding Balance
        </p>
        <p className="text-xs text-amber-700">
          <CurrencyDisplay
            amount={outstanding}
            size="sm"
            className="text-amber-800 font-semibold"
          />{" "}
          remaining across all student-fee pairs
        </p>
      </div>
    </div>
  );
}

function SummaryStrip({ isLoading }: { isLoading: boolean }) {
  const { data: summary } = useCollectionSummary();
  const items = [
    {
      label: "Collected",
      amount: summary?.totalCollected ?? 0n,
      color: "text-emerald-600",
    },
    {
      label: "Outstanding",
      amount: summary?.totalOutstanding ?? 0n,
      color: "text-amber-600",
    },
    {
      label: "Overdue",
      amount: summary?.totalOverdue ?? 0n,
      color: "text-destructive",
    },
    {
      label: "Waived",
      amount: summary?.totalWaived ?? 0n,
      color: "text-muted-foreground",
    },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {items.map(({ label, amount, color }) => (
        <Card key={label} className="shadow-card">
          <CardContent className="px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {label}
            </p>
            {isLoading ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <CurrencyDisplay amount={amount} size="lg" className={color} />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PaymentsPage() {
  const [tab, setTab] = useState<TabView>("balances");
  const [recordOpen, setRecordOpen] = useState(false);
  const [recordTarget, setRecordTarget] = useState<StudentBalance | null>(null);
  const [waiveTarget, setWaiveTarget] = useState<StudentBalance | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [feeTypeFilter, setFeeTypeFilter] = useState<string>("all");

  // Date range defaults: last 90 days
  const now = BigInt(Date.now()) * 1_000_000n;
  const ninetyDaysAgo = now - BigInt(90 * 24 * 60 * 60) * 1_000_000_000n;
  const [fromDate] = useState<bigint>(ninetyDaysAgo);
  const [toDate] = useState<bigint>(now);

  const { data: payments, isLoading: paymentsLoading } = usePayments(
    fromDate,
    toDate,
  );
  const { data: balances, isLoading: balancesLoading } = useAllBalances();
  const { isLoading: summaryLoading } = useCollectionSummary();

  const uniqueFeeNames = useMemo(() => {
    const names = new Set<string>();
    for (const b of balances ?? []) {
      names.add(b.feeStructureName);
    }
    return Array.from(names).sort();
  }, [balances]);

  const filteredPayments = useMemo(() => {
    return (payments ?? []).filter((p) => {
      const matchSearch =
        !searchQuery ||
        p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMethod = methodFilter === "all" || p.method === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [payments, searchQuery, methodFilter]);

  const filteredBalances = useMemo(() => {
    return (balances ?? []).filter((b) => {
      const matchSearch =
        !searchQuery ||
        b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.feeStructureName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchFeeType =
        feeTypeFilter === "all" || b.feeStructureName === feeTypeFilter;
      return matchSearch && matchStatus && matchFeeType;
    });
  }, [balances, searchQuery, statusFilter, feeTypeFilter]);

  const totalOutstanding = useMemo(() => {
    return filteredBalances.reduce((sum, b) => sum + b.outstandingAmount, 0n);
  }, [filteredBalances]);

  const hasFilters =
    searchQuery ||
    statusFilter !== "all" ||
    methodFilter !== "all" ||
    feeTypeFilter !== "all";

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setFeeTypeFilter("all");
  }

  const paymentColumns: Column<Payment>[] = [
    {
      key: "receipt",
      header: "Receipt #",
      render: (row) => (
        <span className="font-mono text-xs font-semibold text-primary">
          {row.receiptNumber}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => (
        <CurrencyDisplay
          amount={row.amount}
          size="sm"
          className="font-semibold"
        />
      ),
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "method",
      header: "Method",
      render: (row) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground border border-border">
          {PAYMENT_METHOD_LABELS[row.method] ?? row.method}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (row) => (
        <span className="text-muted-foreground text-xs truncate max-w-[160px] block">
          {row.notes || "—"}
        </span>
      ),
    },
  ];

  const balanceColumns: Column<StudentBalance>[] = [
    {
      key: "student",
      header: "Student Name",
      render: (row) => <span className="font-medium">{row.studentName}</span>,
    },
    {
      key: "feeStructure",
      header: "Fee Structure",
      render: (row) => (
        <span className="text-muted-foreground text-sm">
          {row.feeStructureName}
        </span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (row) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(row.dueDate)}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total Due",
      render: (row) => <CurrencyDisplay amount={row.totalAmount} size="sm" />,
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "paid",
      header: "Paid",
      render: (row) => (
        <CurrencyDisplay
          amount={row.paidAmount}
          size="sm"
          className="text-emerald-600"
        />
      ),
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "outstanding",
      header: "Balance",
      render: (row) => (
        <CurrencyDisplay
          amount={row.outstandingAmount}
          size="sm"
          className={
            row.outstandingAmount > 0n
              ? "text-amber-600 font-semibold"
              : "text-muted-foreground"
          }
        />
      ),
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-1.5 justify-end">
          {row.status !== PaymentStatus.waived &&
            row.status !== PaymentStatus.paid && (
              <>
                <Button
                  type="button"
                  size="sm"
                  variant="default"
                  className="h-7 px-2.5 text-xs"
                  data-ocid="record-payment-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRecordTarget(row);
                    setRecordOpen(true);
                  }}
                >
                  Record Payment
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  data-ocid="waive-fee-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setWaiveTarget(row);
                  }}
                >
                  Waive
                </Button>
              </>
            )}
        </div>
      ),
      headerClassName: "text-right",
    },
  ];

  return (
    <Layout>
      <div className="p-6">
        <PageHeader
          title="Payments"
          description="Track fee collections and manage payment records"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            data-ocid="export-payments-btn"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button
            type="button"
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setRecordTarget(null);
              setRecordOpen(true);
            }}
            data-ocid="record-payment-cta"
          >
            <Plus className="w-3.5 h-3.5" />
            Record Payment
          </Button>
        </PageHeader>

        <SummaryStrip isLoading={summaryLoading} />
        <OutstandingBanner isLoading={balancesLoading} />

        {/* Tab switcher */}
        <div
          className="flex items-center gap-1 bg-secondary rounded-lg p-1 w-fit mb-5"
          data-ocid="payments-tab"
        >
          <button
            type="button"
            onClick={() => setTab("balances")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-smooth ${
              tab === "balances"
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="tab-balances"
          >
            Fee Balances
          </button>
          <button
            type="button"
            onClick={() => setTab("payments")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-smooth ${
              tab === "payments"
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
            data-ocid="tab-payments"
          >
            Payment History
          </button>
        </div>

        {/* Filters toolbar */}
        <Card className="shadow-card mb-4">
          <CardContent className="px-4 py-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder={
                    tab === "balances"
                      ? "Search students or fee structures…"
                      : "Search receipts or notes…"
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 border-0 shadow-none bg-transparent focus-visible:ring-0 p-0 text-sm"
                  data-ocid="payments-search"
                />
              </div>

              {tab === "balances" && (
                <>
                  <div className="flex items-center gap-2 shrink-0">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger
                        className="h-8 text-xs w-[130px]"
                        data-ocid="filter-status"
                      >
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        <SelectItem value={PaymentStatus.pending}>
                          Pending
                        </SelectItem>
                        <SelectItem value={PaymentStatus.partial}>
                          Partial
                        </SelectItem>
                        <SelectItem value={PaymentStatus.paid}>Paid</SelectItem>
                        <SelectItem value={PaymentStatus.overdue}>
                          Overdue
                        </SelectItem>
                        <SelectItem value={PaymentStatus.waived}>
                          Waived
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Select
                    value={feeTypeFilter}
                    onValueChange={setFeeTypeFilter}
                  >
                    <SelectTrigger
                      className="h-8 text-xs w-[160px]"
                      data-ocid="filter-fee-type"
                    >
                      <SelectValue placeholder="All fee types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All fee types</SelectItem>
                      {uniqueFeeNames.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {tab === "payments" && (
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger
                    className="h-8 text-xs w-[140px]"
                    data-ocid="filter-method"
                  >
                    <SelectValue placeholder="All methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All methods</SelectItem>
                    <SelectItem value={PaymentMethod.cash}>Cash</SelectItem>
                    <SelectItem value={PaymentMethod.check}>Check</SelectItem>
                    <SelectItem value={PaymentMethod.transfer}>
                      Bank Transfer
                    </SelectItem>
                    <SelectItem value={PaymentMethod.online}>Online</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 gap-1 text-xs text-muted-foreground"
                  onClick={clearFilters}
                  data-ocid="clear-filters-btn"
                >
                  <X className="w-3 h-3" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        {tab === "balances" ? (
          <>
            {filteredBalances.length > 0 && !balancesLoading && (
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-muted-foreground">
                  {filteredBalances.length} record
                  {filteredBalances.length !== 1 ? "s" : ""}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendingDown className="w-3.5 h-3.5" />
                  Running outstanding:{" "}
                  <CurrencyDisplay
                    amount={totalOutstanding}
                    size="sm"
                    className="font-semibold text-foreground"
                  />
                </div>
              </div>
            )}
            <Card className="shadow-card">
              <CardContent className="p-0">
                <DataTable
                  columns={balanceColumns}
                  data={filteredBalances}
                  keyExtractor={(row) =>
                    `${row.studentId}-${row.feeStructureId}`
                  }
                  isLoading={balancesLoading}
                  emptyState={
                    <EmptyState
                      icon={Wallet}
                      title="No fee balances found"
                      description={
                        hasFilters
                          ? "Try adjusting your filters to see more results."
                          : "Assign fees to students to start tracking balances."
                      }
                      action={
                        hasFilters
                          ? { label: "Clear filters", onClick: clearFilters }
                          : undefined
                      }
                    />
                  }
                  className="border-0 rounded-none"
                />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {filteredPayments.length > 0 && !paymentsLoading && (
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs text-muted-foreground">
                  {filteredPayments.length} payment
                  {filteredPayments.length !== 1 ? "s" : ""}
                </span>
                <span className="text-xs text-muted-foreground">
                  Total:{" "}
                  <CurrencyDisplay
                    amount={filteredPayments.reduce((s, p) => s + p.amount, 0n)}
                    size="sm"
                    className="font-semibold text-foreground"
                  />
                </span>
              </div>
            )}
            <Card className="shadow-card">
              <CardContent className="p-0">
                <DataTable
                  columns={paymentColumns}
                  data={filteredPayments}
                  keyExtractor={(row) => row.id.toString()}
                  isLoading={paymentsLoading}
                  emptyState={
                    <EmptyState
                      icon={Receipt}
                      title="No payments recorded"
                      description={
                        hasFilters
                          ? "No payments match your filters. Try adjusting the date range or method filter."
                          : "Record the first payment to get started."
                      }
                      action={
                        !hasFilters
                          ? {
                              label: "Record Payment",
                              onClick: () => {
                                setRecordTarget(null);
                                setRecordOpen(true);
                              },
                            }
                          : { label: "Clear filters", onClick: clearFilters }
                      }
                    />
                  }
                  className="border-0 rounded-none"
                />
              </CardContent>
            </Card>
          </>
        )}

        <RecordPaymentModal
          open={recordOpen}
          onOpenChange={(open) => {
            setRecordOpen(open);
            if (!open) setRecordTarget(null);
          }}
          prefillStudentId={recordTarget?.studentId}
          prefillFeeStructureId={recordTarget?.feeStructureId}
        />
        {waiveTarget && (
          <WaiveFeeModal
            open={!!waiveTarget}
            onOpenChange={(open) => {
              if (!open) setWaiveTarget(null);
            }}
            balance={waiveTarget}
          />
        )}
      </div>
    </Layout>
  );
}
