import { Layout } from "@/components/layout/Layout";
import { CsvImportModal } from "@/components/students/CsvImportModal";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssignFeeToGroup } from "@/hooks/use-assignments";
import { useFeeStructures } from "@/hooks/use-fee-structures";
import {
  useAllBalances,
  useCreateStudent,
  useDeleteStudent,
  useStudents,
  useUpdateStudent,
} from "@/hooks/use-students";
import type { Student, StudentBalance } from "@/types";
import { PaymentStatus } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import {
  Link2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Upload,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type StudentFormState = {
  name: string;
  studentId: string;
  email: string;
  group: string;
};

const emptyForm: StudentFormState = {
  name: "",
  studentId: "",
  email: "",
  group: "",
};

function StudentFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  isLoading,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initial: StudentFormState;
  onSave: (data: StudentFormState) => void;
  isLoading: boolean;
  title: string;
}) {
  const [form, setForm] = useState<StudentFormState>(initial);
  const field =
    (k: keyof StudentFormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  // Reset form when dialog opens with new initial
  const handleOpenChange = (v: boolean) => {
    if (v) setForm(initial);
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[460px]"
        data-ocid="student-form-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="sf-name">Full Name</Label>
            <Input
              id="sf-name"
              placeholder="Jane Doe"
              value={form.name}
              onChange={field("name")}
              data-ocid="student-name-input"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sf-sid">Student ID</Label>
            <Input
              id="sf-sid"
              placeholder="STU-2024-001"
              value={form.studentId}
              onChange={field("studentId")}
              data-ocid="student-id-input"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sf-email">Email</Label>
            <Input
              id="sf-email"
              type="email"
              placeholder="jane@school.edu"
              value={form.email}
              onChange={field("email")}
              data-ocid="student-email-input"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="sf-group">Group / Cohort</Label>
            <Input
              id="sf-group"
              placeholder="e.g. Class A, Year 2"
              value={form.group}
              onChange={field("group")}
              data-ocid="student-group-input"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading || !form.name.trim() || !form.studentId.trim()}
            onClick={() => onSave(form)}
            data-ocid="student-form-submit"
          >
            {isLoading ? "Saving…" : "Save student"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function GroupAssignModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [group, setGroup] = useState("");
  const [feeId, setFeeId] = useState("");
  const { data: feeStructures = [] } = useFeeStructures();
  const assign = useAssignFeeToGroup();

  const handleSubmit = () => {
    if (!group.trim() || !feeId) return;
    assign.mutate(
      { group: group.trim(), feeStructureId: BigInt(feeId) },
      {
        onSuccess: (results) => {
          toast.success(
            `Assigned fee to ${results.length} student(s) in group "${group}"`,
          );
          onOpenChange(false);
          setGroup("");
          setFeeId("");
        },
        onError: () => toast.error("Failed to assign fee to group"),
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px]"
        data-ocid="group-assign-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display">
            Assign Fee to Group
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-1.5">
            <Label htmlFor="ga-group">Group / Cohort Name</Label>
            <Input
              id="ga-group"
              placeholder="e.g. Year 2"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              data-ocid="group-name-input"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ga-fee">Fee Structure</Label>
            <Select value={feeId} onValueChange={setFeeId}>
              <SelectTrigger id="ga-fee" data-ocid="group-fee-select">
                <SelectValue placeholder="Select a fee structure…" />
              </SelectTrigger>
              <SelectContent>
                {feeStructures.map((fs) => (
                  <SelectItem key={fs.id.toString()} value={fs.id.toString()}>
                    {fs.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={assign.isPending || !group.trim() || !feeId}
            onClick={handleSubmit}
            data-ocid="group-assign-submit"
          >
            {assign.isPending ? "Assigning…" : "Assign to group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StudentsPage() {
  const navigate = useNavigate();
  const { data: students = [], isLoading } = useStudents();
  const { data: allBalances = [] } = useAllBalances();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [csvOpen, setCsvOpen] = useState(false);
  const [groupAssignOpen, setGroupAssignOpen] = useState(false);

  // Derive outstanding balance per student from allBalances
  const outstandingMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const b of allBalances) {
      const key = b.studentId.toString();
      map.set(key, (map.get(key) ?? 0) + b.outstandingAmount);
    }
    return map;
  }, [allBalances]);

  const groups = useMemo(() => {
    const set = new Set(students.map((s) => s.group).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q);
      const matchGroup = groupFilter === "all" || s.group === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [students, search, groupFilter]);

  const columns: Column<Student>[] = [
    {
      key: "name",
      header: "Name",
      render: (s) => (
        <span className="font-medium text-foreground">{s.name}</span>
      ),
    },
    {
      key: "studentId",
      header: "Student ID",
      render: (s) => (
        <span className="font-mono text-sm text-muted-foreground">
          {s.studentId}
        </span>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (s) => <span className="text-muted-foreground">{s.email}</span>,
    },
    {
      key: "group",
      header: "Group",
      render: (s) =>
        s.group ? (
          <Badge variant="secondary" className="text-xs">
            {s.group}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        ),
    },
    {
      key: "outstanding",
      header: "Outstanding",
      headerClassName: "text-right",
      className: "text-right",
      render: (s) => {
        const amt = outstandingMap.get(s.id.toString()) ?? 0n;
        return (
          <CurrencyDisplay
            amount={amt}
            size="sm"
            className={amt > 0n ? "text-destructive" : "text-muted-foreground"}
          />
        );
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (s) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Student actions"
              data-ocid="student-row-actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate({ to: `/students/${s.id}` })}
              data-ocid="student-view"
            >
              <Users className="w-3.5 h-3.5 mr-2" /> View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setEditTarget(s)}
              data-ocid="student-edit"
            >
              <Pencil className="w-3.5 h-3.5 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteTarget(s)}
              data-ocid="student-delete"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleAdd = (form: StudentFormState) => {
    createStudent.mutate(form, {
      onSuccess: () => {
        toast.success("Student added");
        setAddOpen(false);
      },
      onError: () => toast.error("Failed to add student"),
    });
  };

  const handleEdit = (form: StudentFormState) => {
    if (!editTarget) return;
    updateStudent.mutate(
      { id: editTarget.id, ...form },
      {
        onSuccess: () => {
          toast.success("Student updated");
          setEditTarget(null);
        },
        onError: () => toast.error("Failed to update student"),
      },
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteStudent.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Student deleted");
        setDeleteTarget(null);
      },
      onError: () => toast.error("Failed to delete student"),
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <PageHeader
          title="Students"
          description={`${students.length} student${students.length !== 1 ? "s" : ""} enrolled`}
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => setCsvOpen(true)}
            data-ocid="import-csv-btn"
          >
            <Upload className="w-4 h-4 mr-2" /> Import CSV
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setGroupAssignOpen(true)}
            data-ocid="group-assign-btn"
          >
            <Link2 className="w-4 h-4 mr-2" /> Assign to Group
          </Button>
          <Button
            type="button"
            onClick={() => setAddOpen(true)}
            data-ocid="add-student-btn"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </PageHeader>

        <Card className="shadow-card">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">
                All Students
              </CardTitle>
              <div className="flex gap-2 flex-wrap">
                {groups.length > 0 && (
                  <Select value={groupFilter} onValueChange={setGroupFilter}>
                    <SelectTrigger
                      className="h-8 text-xs w-36"
                      data-ocid="group-filter"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All groups</SelectItem>
                      {groups.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="relative">
                  <Input
                    className="h-8 text-xs pl-3 w-48"
                    placeholder="Search students…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    data-ocid="student-search"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={filtered}
              keyExtractor={(s) => s.id.toString()}
              isLoading={isLoading}
              className="border-0 rounded-none"
              onRowClick={(s) => navigate({ to: `/students/${s.id}` })}
              emptyState={
                search || groupFilter !== "all" ? (
                  <EmptyState
                    icon={Users}
                    title="No students found"
                    description="Try adjusting your search or filter."
                  />
                ) : (
                  <EmptyState
                    icon={UserPlus}
                    title="No students yet"
                    description="Add your first student to start tracking fees and payments."
                    action={{
                      label: "Add first student",
                      onClick: () => setAddOpen(true),
                    }}
                    secondaryAction={
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline underline-offset-2 transition-colors"
                        onClick={() => setCsvOpen(true)}
                        data-ocid="empty-import-csv-link"
                      >
                        Import from CSV
                      </button>
                    }
                  />
                )
              }
            />
          </CardContent>
        </Card>
      </div>

      {/* Add dialog */}
      <StudentFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        initial={emptyForm}
        onSave={handleAdd}
        isLoading={createStudent.isPending}
        title="Add Student"
      />

      {/* Edit dialog */}
      <StudentFormDialog
        open={!!editTarget}
        onOpenChange={(v) => {
          if (!v) setEditTarget(null);
        }}
        initial={
          editTarget
            ? {
                name: editTarget.name,
                studentId: editTarget.studentId,
                email: editTarget.email,
                group: editTarget.group,
              }
            : emptyForm
        }
        onSave={handleEdit}
        isLoading={updateStudent.isPending}
        title="Edit Student"
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v) setDeleteTarget(null);
        }}
        title="Delete student?"
        description={`This will permanently remove "${deleteTarget?.name}" and all their fee assignments. This action cannot be undone.`}
        confirmLabel="Delete student"
        onConfirm={handleDelete}
        variant="destructive"
      />

      {/* CSV Import */}
      <CsvImportModal open={csvOpen} onOpenChange={setCsvOpen} />

      {/* Group assign */}
      <GroupAssignModal
        open={groupAssignOpen}
        onOpenChange={setGroupAssignOpen}
      />
    </Layout>
  );
}
