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
import { AlertCircle, Download, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useAllBalances } from "../../hooks/use-students";
import type { StudentBalance } from "../../types";
import { PaymentStatus } from "../../types";

type SortField = "outstanding" | "dueDate" | "studentName" | "totalAmount";
type SortDir = "asc" | "desc";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: PaymentStatus.paid },
  { label: "Pending", value: PaymentStatus.pending },
  { label: "Overdue", value: PaymentStatus.overdue },
  { label: "Waived", value: PaymentStatus.waived },
  { label: "Partial", value: PaymentStatus.partial },
];

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function exportCsv(data: StudentBalance[]): void {
  const headers = [
    "Student Name",
    "Student ID",
    "Fee Structure",
    "Total Amount",
    "Paid",
    "Outstanding",
    "Penalties",
    "Status",
    "Due Date",
  ];
  const rows = data.map((b) => [
    `"${b.studentName}"`,
    b.studentId.toString(),
    `"${b.feeStructureName}"`,
    (Number(b.totalAmount) / 100).toFixed(2),
    (Number(b.paidAmount) / 100).toFixed(2),
    (Number(b.outstandingAmount) / 100).toFixed(2),
    (Number(b.penaltyAmount) / 100).toFixed(2),
    b.status,
    formatDate(b.dueDate),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student-balances.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function StudentBalancesTab() {
  const [sortField, setSortField] = useState<SortField>("outstanding");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: balances = [], isLoading, isError } = useAllBalances();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const processed = useMemo(() => {
    let list = [...balances];
    if (statusFilter !== "all")
      list = list.filter((b) => b.status === statusFilter);
    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "outstanding")
        cmp = Number(a.outstandingAmount - b.outstandingAmount);
      else if (sortField === "dueDate") cmp = Number(a.dueDate - b.dueDate);
      else if (sortField === "studentName")
        cmp = a.studentName.localeCompare(b.studentName);
      else if (sortField === "totalAmount")
        cmp = Number(a.totalAmount - b.totalAmount);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [balances, statusFilter, sortField, sortDir]);

  const hasPenalties = processed.some((b) => b.penaltyAmount > 0n);
  const totalPenalties = useMemo(
    () => processed.reduce((sum, b) => sum + b.penaltyAmount, 0n),
    [processed],
  );

  const columns: Column<StudentBalance>[] = [
    {
      key: "studentName",
      header: "Student",
      render: (b) => (
        <div>
          <p className="font-medium text-sm text-foreground">{b.studentName}</p>
          <p className="text-xs text-muted-foreground">
            ID: {b.studentId.toString()}
          </p>
        </div>
      ),
      headerClassName: "cursor-pointer",
    },
    {
      key: "feeStructure",
      header: "Fee Structure",
      render: (b) => <span className="text-sm">{b.feeStructureName}</span>,
    },
    {
      key: "totalAmount",
      header: "Total",
      render: (b) => <CurrencyDisplay amount={b.totalAmount} size="sm" />,
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "paidAmount",
      header: "Paid",
      render: (b) => (
        <CurrencyDisplay
          amount={b.paidAmount}
          size="sm"
          className="text-emerald-700"
        />
      ),
      headerClassName: "text-right",
      className: "text-right",
    },
    {
      key: "outstandingAmount",
      header: "Outstanding",
      render: (b) => (
        <CurrencyDisplay
          amount={b.outstandingAmount}
          size="sm"
          className={
            b.outstandingAmount > 0n ? "text-red-600 font-semibold" : ""
          }
        />
      ),
      headerClassName: "text-right",
      className: "text-right",
    },
    ...(hasPenalties
      ? ([
          {
            key: "penaltyAmount",
            header: "Penalties",
            render: (b) =>
              b.penaltyAmount > 0n ? (
                <CurrencyDisplay
                  amount={b.penaltyAmount}
                  size="sm"
                  className="text-amber-600 font-semibold"
                />
              ) : (
                <span className="text-xs text-muted-foreground">—</span>
              ),
            headerClassName: "text-right",
            className: "text-right",
          },
        ] as Column<StudentBalance>[])
      : []),
    {
      key: "status",
      header: "Status",
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (b) => <span className="text-sm">{formatDate(b.dueDate)}</span>,
    },
  ];

  return (
    <div className="space-y-4" data-ocid="student-balances-tab">
      {/* Error banner */}
      {isError && (
        <div
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          data-ocid="balances-error-banner"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to load student balances</p>
            <p className="text-xs mt-0.5 opacity-80">
              Unable to retrieve balance data. Please refresh the page or try
              again. Ensure you are signed in with admin access.
            </p>
          </div>
        </div>
      )}

      <Card className="border border-border shadow-card">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                Sort by:
              </span>
              <Button
                type="button"
                variant={sortField === "outstanding" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("outstanding")}
                data-ocid="sort-outstanding"
              >
                Outstanding{" "}
                {sortField === "outstanding" && (sortDir === "asc" ? "↑" : "↓")}
              </Button>
              <Button
                type="button"
                variant={sortField === "dueDate" ? "default" : "outline"}
                size="sm"
                onClick={() => handleSort("dueDate")}
                data-ocid="sort-due-date"
              >
                Due Date{" "}
                {sortField === "dueDate" && (sortDir === "asc" ? "↑" : "↓")}
              </Button>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36" data-ocid="filter-balance-status">
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

            <div className="ml-auto flex items-center gap-2">
              {!isLoading && (
                <span className="text-xs text-muted-foreground">
                  {processed.length} records
                </span>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => exportCsv(processed)}
                disabled={processed.length === 0}
                data-ocid="export-balances-csv"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <DataTable
            columns={columns}
            data={processed}
            keyExtractor={(b) => `${b.studentId}-${b.feeStructureId}`}
            isLoading={isLoading}
            emptyState={
              <EmptyState
                icon={Users}
                title="No student balances found"
                description="No balances match your current filters. Assign fee structures to students to see balances here."
              />
            }
          />

          {/* Penalties Footer */}
          {!isLoading && hasPenalties && (
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Total Penalties (shown above)
              </span>
              <CurrencyDisplay
                amount={totalPenalties}
                size="sm"
                className="text-amber-600 font-semibold"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
