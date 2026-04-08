import { Layout } from "@/components/layout/Layout";
import { AssignFeeModal } from "@/components/students/AssignFeeModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import type { Column } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUnenrollStudent, useWaiveFee } from "@/hooks/use-assignments";
import { useStudent, useStudentBalances } from "@/hooks/use-students";
import type { StudentBalance } from "@/types";
import { PaymentStatus } from "@/types";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  DollarSign,
  MinusCircle,
  Plus,
  UserCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function StatCard({
  label,
  value,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              {label}
            </p>
            <div className="text-lg font-display font-semibold text-foreground">
              {value}
            </div>
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

export default function StudentDetailPage() {
  const navigate = useNavigate();
  const { studentId } = useParams({ strict: false }) as { studentId: string };
  const id = BigInt(studentId ?? "0");

  const { data: student, isLoading: studentLoading } = useStudent(id);
  const { data: balances = [], isLoading: balancesLoading } =
    useStudentBalances(id);
  const waiveFee = useWaiveFee();
  const unenroll = useUnenrollStudent();

  const [assignOpen, setAssignOpen] = useState(false);
  const [unenrollTarget, setUnenrollTarget] = useState<StudentBalance | null>(
    null,
  );
  const [waiveTarget, setWaiveTarget] = useState<StudentBalance | null>(null);

  const totalDue = balances.reduce((s, b) => s + b.totalAmount, 0n);
  const totalPaid = balances.reduce((s, b) => s + b.paidAmount, 0n);
  const totalOutstanding = balances.reduce(
    (s, b) => s + b.outstandingAmount,
    0n,
  );

  const handleWaive = () => {
    if (!waiveTarget) return;
    waiveFee.mutate(
      {
        studentId: id,
        feeStructureId: waiveTarget.feeStructureId,
        reason: "Waived by admin",
      },
      {
        onSuccess: () => {
          toast.success("Fee waived successfully");
          setWaiveTarget(null);
        },
        onError: () => toast.error("Failed to waive fee"),
      },
    );
  };

  const handleUnenroll = () => {
    if (!unenrollTarget) return;
    unenroll.mutate(
      { studentId: id, feeStructureId: unenrollTarget.feeStructureId },
      {
        onSuccess: () => {
          toast.success(`Removed from "${unenrollTarget.feeStructureName}"`);
          setUnenrollTarget(null);
        },
        onError: () => toast.error("Failed to remove fee assignment"),
      },
    );
  };

  const columns: Column<StudentBalance>[] = [
    {
      key: "name",
      header: "Fee Structure",
      render: (b) => (
        <span className="font-medium text-foreground">
          {b.feeStructureName}
        </span>
      ),
    },
    {
      key: "total",
      header: "Total Due",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => <CurrencyDisplay amount={b.totalAmount} size="sm" />,
    },
    {
      key: "paid",
      header: "Paid",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => (
        <CurrencyDisplay
          amount={b.paidAmount}
          size="sm"
          className="text-emerald-600"
        />
      ),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => (
        <CurrencyDisplay
          amount={b.outstandingAmount}
          size="sm"
          className={
            b.outstandingAmount > 0n
              ? "text-destructive"
              : "text-muted-foreground"
          }
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (b) => <StatusBadge status={b.status} />,
    },
    {
      key: "actions",
      header: "",
      className: "w-36 text-right",
      render: (b) => (
        <div
          className="flex items-center gap-1 justify-end"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {b.status !== PaymentStatus.waived && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setWaiveTarget(b)}
              data-ocid="waive-fee-btn"
            >
              <MinusCircle className="w-3.5 h-3.5 mr-1" /> Waive
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setUnenrollTarget(b)}
            data-ocid="unenroll-fee-btn"
          >
            Remove
          </Button>
        </div>
      ),
    },
  ];

  if (studentLoading) {
    return (
      <Layout>
        <div className="p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout>
        <div className="p-6">
          <EmptyState
            icon={UserCircle}
            title="Student not found"
            description="This student may have been deleted or the ID is invalid."
            action={{
              label: "Back to Students",
              onClick: () => navigate({ to: "/students" }),
            }}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        {/* Back nav */}
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          onClick={() => navigate({ to: "/students" })}
          data-ocid="back-to-students"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>

        <PageHeader
          title={student.name}
          description={`${student.studentId} · ${student.email}`}
        >
          <Button
            type="button"
            onClick={() => setAssignOpen(true)}
            data-ocid="assign-fee-btn"
          >
            <Plus className="w-4 h-4 mr-2" /> Assign Fee
          </Button>
        </PageHeader>

        {/* Student info row */}
        <Card className="shadow-card mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Group
                </span>
                {student.group ? (
                  <Badge variant="secondary">{student.group}</Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">—</span>
                )}
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Enrolled
                </span>
                <span className="text-sm text-foreground">
                  {new Date(
                    Number(student.createdAt) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Assignments
                </span>
                <Badge variant="outline">{balances.length}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            label="Total Due"
            value={<CurrencyDisplay amount={totalDue} size="lg" />}
            icon={DollarSign}
            iconClass="bg-secondary text-muted-foreground"
          />
          <StatCard
            label="Total Paid"
            value={
              <CurrencyDisplay
                amount={totalPaid}
                size="lg"
                className="text-emerald-600"
              />
            }
            icon={CheckCircle2}
            iconClass="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            label="Outstanding"
            value={
              <CurrencyDisplay
                amount={totalOutstanding}
                size="lg"
                className={
                  totalOutstanding > 0n
                    ? "text-destructive"
                    : "text-muted-foreground"
                }
              />
            }
            icon={Clock}
            iconClass={
              totalOutstanding > 0n
                ? "bg-red-50 text-destructive"
                : "bg-secondary text-muted-foreground"
            }
          />
        </div>

        {/* Fee assignments table */}
        <Card className="shadow-card">
          <CardHeader className="pb-3 border-b border-border">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              Fee Assignments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={balances}
              keyExtractor={(b) => `${b.studentId}-${b.feeStructureId}`}
              isLoading={balancesLoading}
              className="border-0 rounded-none"
              emptyState={
                <EmptyState
                  icon={BookOpen}
                  title="No fee assignments"
                  description="This student has no fees assigned yet. Use the Assign Fee button to get started."
                  action={{
                    label: "Assign a fee",
                    onClick: () => setAssignOpen(true),
                  }}
                />
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Assign fee modal */}
      <AssignFeeModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        studentId={id}
        existingFeeIds={balances.map((b) => b.feeStructureId)}
      />

      {/* Unenroll confirmation */}
      <ConfirmDialog
        open={!!unenrollTarget}
        onOpenChange={(v) => {
          if (!v) setUnenrollTarget(null);
        }}
        title="Remove fee assignment?"
        description={`This will unenroll "${student.name}" from "${unenrollTarget?.feeStructureName}". Payment history will be retained.`}
        confirmLabel={unenroll.isPending ? "Removing…" : "Remove assignment"}
        onConfirm={handleUnenroll}
        variant="destructive"
      />

      {/* Waive confirmation */}
      <ConfirmDialog
        open={!!waiveTarget}
        onOpenChange={(v) => {
          if (!v) setWaiveTarget(null);
        }}
        title="Waive this fee?"
        description={`Waive "${waiveTarget?.feeStructureName}" for ${student.name}? The outstanding balance will be cleared.`}
        confirmLabel={waiveFee.isPending ? "Waiving…" : "Waive fee"}
        onConfirm={handleWaive}
      />
    </Layout>
  );
}
