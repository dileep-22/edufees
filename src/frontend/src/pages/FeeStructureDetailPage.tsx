import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  Archive,
  ArrowLeft,
  Calendar,
  Copy,
  Edit,
  Loader2,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/layout/Layout";
import { useFeeStructureBalances } from "../hooks/use-assignments";
import {
  useDuplicateFeeStructure,
  useFeeStructure,
} from "../hooks/use-fee-structures";
import { FeePeriod } from "../types";
import type { StudentBalance } from "../types";

const PERIOD_LABELS: Record<FeePeriod, string> = {
  [FeePeriod.annual]: "Annual",
  [FeePeriod.semester]: "Semester",
  [FeePeriod.term]: "Term",
  [FeePeriod.monthly]: "Monthly",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isArchived(endDate: string): boolean {
  return new Date(endDate) < new Date();
}

export default function FeeStructureDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const feeId = Number(params.id ?? "0");

  const { data: feeStructure, isLoading: loadingStructure } =
    useFeeStructure(feeId);
  const { data: balances = [], isLoading: loadingBalances } =
    useFeeStructureBalances(feeId);
  const duplicateMutation = useDuplicateFeeStructure();

  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return balances.filter(
      (b) =>
        b.studentName.toLowerCase().includes(q) ||
        b.studentId.toString().includes(q),
    );
  }, [balances, search]);

  // Summary stats
  const totalDue = useMemo(
    () => balances.reduce((sum, b) => sum + b.totalAmount, 0n),
    [balances],
  );
  const totalPaid = useMemo(
    () => balances.reduce((sum, b) => sum + b.paidAmount, 0n),
    [balances],
  );
  const totalOutstanding = useMemo(
    () => balances.reduce((sum, b) => sum + b.outstandingAmount, 0n),
    [balances],
  );

  async function handleDuplicate() {
    if (!feeStructure) return;
    try {
      const copy = await duplicateMutation.mutateAsync(feeStructure.id);
      if (copy) {
        toast.success("Fee structure duplicated");
        navigate({
          to: "/fee-structures/$id/edit",
          params: { id: copy.id.toString() },
        });
      }
    } catch {
      toast.error("Failed to duplicate fee structure");
    }
  }

  const columns: Column<StudentBalance>[] = [
    {
      key: "student",
      header: "Student Name",
      render: (b) => (
        <div className="min-w-0">
          <span className="font-medium text-foreground block truncate">
            {b.studentName}
          </span>
        </div>
      ),
    },
    {
      key: "studentId",
      header: "Student ID",
      render: (b) => (
        <span className="text-sm text-muted-foreground font-mono">
          {b.studentId.toString().padStart(8, "0")}
        </span>
      ),
    },
    {
      key: "totalDue",
      header: "Total Due",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => <CurrencyDisplay amount={b.totalAmount} size="sm" />,
    },
    {
      key: "paidAmount",
      header: "Paid Amount",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => (
        <CurrencyDisplay
          amount={b.paidAmount}
          size="sm"
          className={b.paidAmount > 0n ? "text-emerald-600" : ""}
        />
      ),
    },
    {
      key: "balance",
      header: "Remaining Balance",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => (
        <CurrencyDisplay
          amount={b.outstandingAmount}
          size="sm"
          className={
            b.outstandingAmount > 0n
              ? "text-accent-foreground"
              : "text-muted-foreground"
          }
        />
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (b) => (
        <span className="text-sm text-foreground">{formatDate(b.dueDate)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (b) => <StatusBadge status={b.status} />,
    },
  ];

  if (loadingStructure) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-64">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!feeStructure) {
    return (
      <Layout>
        <div className="p-6">
          <EmptyState
            icon={AlertCircle}
            title="Fee structure not found"
            description="This fee structure may have been deleted or does not exist"
            action={{
              label: "Back to Fee Structures",
              onClick: () => navigate({ to: "/fee-structures" }),
            }}
          />
        </div>
      </Layout>
    );
  }

  const archived = isArchived(feeStructure.endDate);

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/fee-structures" })}
            data-ocid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <PageHeader
            title={feeStructure.name}
            description={feeStructure.description || undefined}
            className="mb-0 flex-1"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              disabled={duplicateMutation.isPending}
              data-ocid="duplicate-button"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() =>
                navigate({
                  to: "/fee-structures/$id/edit",
                  params: { id: feeStructure.id.toString() },
                })
              }
              data-ocid="edit-button"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </PageHeader>
        </div>

        {/* Metadata cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                Period
              </p>
              <p className="text-sm font-semibold text-foreground">
                {PERIOD_LABELS[feeStructure.period] ?? feeStructure.period}
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                Fee Amount
              </p>
              <CurrencyDisplay amount={feeStructure.amount} size="lg" />
            </CardContent>
          </Card>
          <Card className="bg-card">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due Date
              </p>
              <p className="text-sm font-semibold text-foreground">
                {formatDate(feeStructure.dueDate)}
              </p>
            </CardContent>
          </Card>
          <Card className={`${archived ? "bg-muted/40" : "bg-card"}`}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                Status
              </p>
              <div className="flex items-center gap-1.5">
                {archived ? (
                  <>
                    <Archive className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">
                      Archived
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-semibold text-foreground">
                      Active
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active period info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-3 border border-border">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>
            Active period:{" "}
            <strong className="text-foreground">
              {formatDate(feeStructure.startDate)}
            </strong>{" "}
            to{" "}
            <strong className="text-foreground">
              {formatDate(feeStructure.endDate)}
            </strong>
          </span>
          {feeStructure.latePenalty && (
            <>
              <span className="mx-2 text-border">·</span>
              <span>
                Late penalty:{" "}
                <strong className="text-foreground">
                  {feeStructure.latePenalty.__kind__ === "fixed" ? (
                    <>
                      <CurrencyDisplay
                        amount={feeStructure.latePenalty.fixed}
                        size="sm"
                      />{" "}
                      fixed
                    </>
                  ) : (
                    `${Number(feeStructure.latePenalty.percentage) / 100}%`
                  )}
                </strong>
              </span>
            </>
          )}
        </div>

        {/* Collection summary */}
        {!loadingBalances && balances.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Total Due
                </p>
                <CurrencyDisplay amount={totalDue} size="lg" />
                <p className="text-xs text-muted-foreground mt-1">
                  {balances.length} enrolled student
                  {balances.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Collected
                </p>
                <CurrencyDisplay
                  amount={totalPaid}
                  size="lg"
                  className="text-emerald-600"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDue > 0n
                    ? Math.round(Number((totalPaid * 100n) / totalDue))
                    : 0}
                  % of total
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                  Outstanding
                </p>
                <CurrencyDisplay
                  amount={totalOutstanding}
                  size="lg"
                  className={totalOutstanding > 0n ? "text-destructive" : ""}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {totalDue > 0n
                    ? Math.round(Number((totalOutstanding * 100n) / totalDue))
                    : 0}
                  % remaining
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enrolled students table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Enrolled Students
              </h2>
              {!loadingBalances && (
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-sm w-52"
                data-ocid="student-search"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            keyExtractor={(b) => `${b.studentId}-${b.feeStructureId}`}
            isLoading={loadingBalances}
            emptyState={
              <EmptyState
                icon={Users}
                title={
                  search
                    ? "No students match your search"
                    : "No students enrolled"
                }
                description={
                  search
                    ? "Try adjusting your search query"
                    : "Students can be enrolled from the Students page"
                }
              />
            }
          />
        </div>
      </div>
    </Layout>
  );
}
