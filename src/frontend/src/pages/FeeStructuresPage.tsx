import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { type Column, DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Archive,
  Copy,
  Edit,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/layout/Layout";
import {
  useDeleteFeeStructure,
  useDuplicateFeeStructure,
  useFeeStructures,
} from "../hooks/use-fee-structures";
import { FeePeriod } from "../types";
import type { FeeStructure } from "../types";

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

function isArchived(feeStructure: FeeStructure): boolean {
  const now = new Date();
  return new Date(feeStructure.endDate) < now;
}

export default function FeeStructuresPage() {
  const navigate = useNavigate();
  const { data: feeStructures = [], isLoading } = useFeeStructures();
  const deleteMutation = useDeleteFeeStructure();
  const duplicateMutation = useDuplicateFeeStructure();

  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<FeeStructure | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return feeStructures.filter(
      (fs) =>
        fs.name.toLowerCase().includes(q) ||
        PERIOD_LABELS[fs.period]?.toLowerCase().includes(q),
    );
  }, [feeStructures, search]);

  const archived = useMemo(() => filtered.filter(isArchived), [filtered]);
  const active = useMemo(
    () => filtered.filter((fs) => !isArchived(fs)),
    [filtered],
  );

  async function handleDuplicate(fs: FeeStructure) {
    try {
      const copy = await duplicateMutation.mutateAsync(fs.id);
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

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Fee structure deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete fee structure");
    }
  }

  const columns: Column<FeeStructure>[] = [
    {
      key: "name",
      header: "Name",
      render: (fs) => (
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <FileText className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <span className="font-medium text-foreground truncate block">
              {fs.name}
            </span>
            {fs.description && (
              <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
                {fs.description}
              </span>
            )}
          </div>
          {isArchived(fs) && (
            <Badge
              variant="outline"
              className="text-xs shrink-0 text-muted-foreground border-border"
            >
              <Archive className="w-3 h-3 mr-1" />
              Archived
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      render: (fs) => (
        <Badge variant="secondary" className="text-xs font-medium">
          {PERIOD_LABELS[fs.period] ?? fs.period}
        </Badge>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      headerClassName: "text-right",
      className: "text-right",
      render: (fs) => <CurrencyDisplay amount={fs.amount} size="sm" />,
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (fs) => (
        <span className="text-sm text-foreground">
          {formatDate(fs.dueDate)}
        </span>
      ),
    },
    {
      key: "latePenalty",
      header: "Late Penalty",
      render: (fs) => {
        if (!fs.latePenalty)
          return <span className="text-muted-foreground text-xs">—</span>;
        if (fs.latePenalty.__kind__ === "fixed") {
          return (
            <span className="text-sm text-foreground">
              <CurrencyDisplay amount={fs.latePenalty.fixed} size="sm" /> fixed
            </span>
          );
        }
        return (
          <span className="text-sm text-foreground">
            {Number(fs.latePenalty.percentage) / 100}% of amount
          </span>
        );
      },
    },
    {
      key: "dates",
      header: "Active Period",
      render: (fs) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDate(fs.startDate)} – {formatDate(fs.endDate)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-12",
      className: "w-12",
      render: (fs) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              data-ocid="fee-structure-actions"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate({
                  to: "/fee-structures/$id",
                  params: { id: fs.id.toString() },
                });
              }}
              data-ocid="action-view-students"
            >
              <Users className="w-4 h-4 mr-2" />
              View Students
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                navigate({
                  to: "/fee-structures/$id/edit",
                  params: { id: fs.id.toString() },
                });
              }}
              data-ocid="action-edit"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicate(fs);
              }}
              data-ocid="action-duplicate"
            >
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(fs);
              }}
              className="text-destructive focus:text-destructive"
              data-ocid="action-delete"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const hasArchived = archived.length > 0;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Fee Structures"
          description="Define and manage fee structures for your institution"
        >
          <Button
            onClick={() => navigate({ to: "/fee-structures/new" })}
            data-ocid="create-fee-structure"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Fee Structure
          </Button>
        </PageHeader>

        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search fee structures..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-ocid="fee-structure-search"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {filtered.length} structure{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Active structures */}
        <div className="space-y-2">
          <DataTable
            columns={columns}
            data={active}
            keyExtractor={(fs) => fs.id.toString()}
            isLoading={isLoading}
            onRowClick={(fs) =>
              navigate({
                to: "/fee-structures/$id",
                params: { id: fs.id.toString() },
              })
            }
            emptyState={
              <EmptyState
                icon={AlertCircle}
                title={search ? "No results found" : "No fee structures yet"}
                description={
                  search
                    ? "Try adjusting your search query"
                    : "Create your first fee structure to start managing fees"
                }
                action={
                  !search
                    ? {
                        label: "Add Fee Structure",
                        onClick: () => navigate({ to: "/fee-structures/new" }),
                      }
                    : undefined
                }
              />
            }
          />
        </div>

        {/* Archived section */}
        {hasArchived && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Archive className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Archived ({archived.length})
              </h2>
            </div>
            <div className="opacity-70">
              <DataTable
                columns={columns}
                data={archived}
                keyExtractor={(fs) => fs.id.toString()}
                isLoading={false}
                onRowClick={(fs) =>
                  navigate({
                    to: "/fee-structures/$id",
                    params: { id: fs.id.toString() },
                  })
                }
              />
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Fee Structure"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Layout>
  );
}
