import { r as reactExports, j as jsxRuntimeExports, c as cn, d as useNavigate, e as useParams, S as Skeleton } from "./index-JaIj-DYW.js";
import { b as Badge, u as ue, L as Layout, c as CircleUser, P as PageHeader } from "./badge-Cou7lT_t.js";
import { C as CurrencyDisplay, D as DataTable } from "./DataTable-DNjVnD7Z.js";
import { B as Button } from "./button-BhNjEAR1.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-uSh9PWD4.js";
import { L as Label, P as Primitive } from "./label-CVO_xGdb.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BDSf899r.js";
import { b as useAssignFeeToStudent, u as useWaiveFee, c as useUnenrollStudent } from "./use-assignments-DAVqeI1f.js";
import { u as useFeeStructures } from "./use-fee-structures-FAYFZaAD.js";
import { c as createLucideIcon, P as PaymentStatus } from "./backend-BHrL9w1d.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Ct8oKSNX.js";
import { E as EmptyState } from "./EmptyState-BnnMgztL.js";
import { S as StatusBadge } from "./StatusBadge-CcMlBmQV.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-j9vFOIPS.js";
import { f as useStudent, g as useStudentBalances } from "./use-students-Cfl-MhrV.js";
import { A as ArrowLeft } from "./arrow-left-CCssa-t4.js";
import { P as Plus } from "./index-YYemiEJn.js";
import { D as DollarSign } from "./dollar-sign-Q7gHkhNm.js";
import { C as CircleCheck } from "./circle-check-Cbfh-3nd.js";
import { C as Clock } from "./clock-B4nU2UVR.js";
import { C as CircleMinus } from "./circle-minus-CN8D1acB.js";
import "./Combination-99tTHa6i.js";
import "./index-CO6Xcq0I.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 7v14", key: "1akyts" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z",
      key: "ruj8y"
    }
  ]
];
const BookOpen = createLucideIcon("book-open", __iconNode);
function AssignFeeModal({
  open,
  onOpenChange,
  studentId,
  existingFeeIds = []
}) {
  const [selectedId, setSelectedId] = reactExports.useState("");
  const { data: feeStructures = [], isLoading } = useFeeStructures();
  const assignFee = useAssignFeeToStudent();
  const existingSet = new Set(existingFeeIds.map((id) => id.toString()));
  const available = feeStructures.filter(
    (fs) => !existingSet.has(fs.id.toString())
  );
  const selectedFs = feeStructures.find(
    (fs) => fs.id.toString() === selectedId
  );
  const handleSubmit = () => {
    if (!selectedId) return;
    assignFee.mutate(
      { studentId, feeStructureId: BigInt(selectedId) },
      {
        onSuccess: () => {
          ue.success(`Fee "${selectedFs == null ? void 0 : selectedFs.name}" assigned`);
          setSelectedId("");
          onOpenChange(false);
        },
        onError: () => ue.error("Failed to assign fee")
      }
    );
  };
  const handleClose = (v) => {
    if (!v) setSelectedId("");
    onOpenChange(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[440px]", "data-ocid": "assign-fee-dialog", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4" }),
      " Assign Fee Structure"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "af-select", children: "Fee Structure" }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 rounded-md bg-secondary animate-pulse" }) : available.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-border bg-secondary/40 p-3 text-sm text-muted-foreground", children: "All available fee structures are already assigned to this student." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedId, onValueChange: setSelectedId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "af-select", "data-ocid": "fee-structure-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a fee structure…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: available.map((fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: fs.id.toString(), children: fs.name }, fs.id.toString())) })
        ] })
      ] }),
      selectedFs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-secondary/40 p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: selectedFs.name }),
        selectedFs.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: selectedFs.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide font-semibold", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: selectedFs.amount, size: "sm" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide font-semibold", children: "Period" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs capitalize", children: selectedFs.period })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide font-semibold", children: "Due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: new Date(
              Number(selectedFs.dueDate) / 1e6
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: () => handleClose(false),
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          disabled: assignFee.isPending || !selectedId || available.length === 0,
          onClick: handleSubmit,
          "data-ocid": "assign-fee-submit",
          children: assignFee.isPending ? "Assigning…" : "Assign fee"
        }
      )
    ] })
  ] }) });
}
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "separator",
      decorative,
      orientation,
      className: cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      ),
      ...props
    }
  );
}
function StatCard({
  label,
  value,
  icon: Icon,
  iconClass
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-display font-semibold text-foreground", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconClass}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
      }
    )
  ] }) }) });
}
function StudentDetailPage() {
  const navigate = useNavigate();
  const { studentId } = useParams({ strict: false });
  const id = BigInt(studentId ?? "0");
  const { data: student, isLoading: studentLoading } = useStudent(id);
  const { data: balances = [], isLoading: balancesLoading } = useStudentBalances(id);
  const waiveFee = useWaiveFee();
  const unenroll = useUnenrollStudent();
  const [assignOpen, setAssignOpen] = reactExports.useState(false);
  const [unenrollTarget, setUnenrollTarget] = reactExports.useState(
    null
  );
  const [waiveTarget, setWaiveTarget] = reactExports.useState(null);
  const totalDue = balances.reduce((s, b) => s + b.totalAmount, 0n);
  const totalPaid = balances.reduce((s, b) => s + b.paidAmount, 0n);
  const totalOutstanding = balances.reduce(
    (s, b) => s + b.outstandingAmount,
    0n
  );
  const handleWaive = () => {
    if (!waiveTarget) return;
    waiveFee.mutate(
      {
        studentId: id,
        feeStructureId: waiveTarget.feeStructureId,
        reason: "Waived by admin"
      },
      {
        onSuccess: () => {
          ue.success("Fee waived successfully");
          setWaiveTarget(null);
        },
        onError: () => ue.error("Failed to waive fee")
      }
    );
  };
  const handleUnenroll = () => {
    if (!unenrollTarget) return;
    unenroll.mutate(
      { studentId: id, feeStructureId: unenrollTarget.feeStructureId },
      {
        onSuccess: () => {
          ue.success(`Removed from "${unenrollTarget.feeStructureName}"`);
          setUnenrollTarget(null);
        },
        onError: () => ue.error("Failed to remove fee assignment")
      }
    );
  };
  const columns = [
    {
      key: "name",
      header: "Fee Structure",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: b.feeStructureName })
    },
    {
      key: "total",
      header: "Total Due",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: b.totalAmount, size: "sm" })
    },
    {
      key: "paid",
      header: "Paid",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: b.paidAmount,
          size: "sm",
          className: "text-emerald-600"
        }
      )
    },
    {
      key: "outstanding",
      header: "Outstanding",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: b.outstandingAmount,
          size: "sm",
          className: b.outstandingAmount > 0n ? "text-destructive" : "text-muted-foreground"
        }
      )
    },
    {
      key: "status",
      header: "Status",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: b.status })
    },
    {
      key: "actions",
      header: "",
      className: "w-36 text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1 justify-end",
          onClick: (e) => e.stopPropagation(),
          onKeyDown: (e) => e.stopPropagation(),
          children: [
            b.status !== PaymentStatus.waived && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-7 text-xs text-muted-foreground hover:text-foreground",
                onClick: () => setWaiveTarget(b),
                "data-ocid": "waive-fee-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleMinus, { className: "w-3.5 h-3.5 mr-1" }),
                  " Waive"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                className: "h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10",
                onClick: () => setUnenrollTarget(b),
                "data-ocid": "unenroll-fee-btn",
                children: "Remove"
              }
            )
          ]
        }
      )
    }
  ];
  if (studentLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
    ] }) });
  }
  if (!student) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: CircleUser,
        title: "Student not found",
        description: "This student may have been deleted or the ID is invalid.",
        action: {
          label: "Back to Students",
          onClick: () => navigate({ to: "/students" })
        }
      }
    ) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4",
          onClick: () => navigate({ to: "/students" }),
          "data-ocid": "back-to-students",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            " Back to Students"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: student.name,
          description: `${student.studentId} · ${student.email}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              onClick: () => setAssignOpen(true),
              "data-ocid": "assign-fee-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                " Assign Fee"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Group" }),
          student.group ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", children: student.group }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Enrolled" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: new Date(
            Number(student.createdAt) / 1e6
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: "Assignments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", children: balances.length })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Due",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: totalDue, size: "lg" }),
            icon: DollarSign,
            iconClass: "bg-secondary text-muted-foreground"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Total Paid",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: totalPaid,
                size: "lg",
                className: "text-emerald-600"
              }
            ),
            icon: CircleCheck,
            iconClass: "bg-emerald-50 text-emerald-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          StatCard,
          {
            label: "Outstanding",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: totalOutstanding,
                size: "lg",
                className: totalOutstanding > 0n ? "text-destructive" : "text-muted-foreground"
              }
            ),
            icon: Clock,
            iconClass: totalOutstanding > 0n ? "bg-red-50 text-destructive" : "bg-secondary text-muted-foreground"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-muted-foreground" }),
          "Fee Assignments"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DataTable,
          {
            columns,
            data: balances,
            keyExtractor: (b) => `${b.studentId}-${b.feeStructureId}`,
            isLoading: balancesLoading,
            className: "border-0 rounded-none",
            emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: BookOpen,
                title: "No fee assignments",
                description: "This student has no fees assigned yet. Use the Assign Fee button to get started.",
                action: {
                  label: "Assign a fee",
                  onClick: () => setAssignOpen(true)
                }
              }
            )
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AssignFeeModal,
      {
        open: assignOpen,
        onOpenChange: setAssignOpen,
        studentId: id,
        existingFeeIds: balances.map((b) => b.feeStructureId)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!unenrollTarget,
        onOpenChange: (v) => {
          if (!v) setUnenrollTarget(null);
        },
        title: "Remove fee assignment?",
        description: `This will unenroll "${student.name}" from "${unenrollTarget == null ? void 0 : unenrollTarget.feeStructureName}". Payment history will be retained.`,
        confirmLabel: unenroll.isPending ? "Removing…" : "Remove assignment",
        onConfirm: handleUnenroll,
        variant: "destructive"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!waiveTarget,
        onOpenChange: (v) => {
          if (!v) setWaiveTarget(null);
        },
        title: "Waive this fee?",
        description: `Waive "${waiveTarget == null ? void 0 : waiveTarget.feeStructureName}" for ${student.name}? The outstanding balance will be cleared.`,
        confirmLabel: waiveFee.isPending ? "Waiving…" : "Waive fee",
        onConfirm: handleWaive
      }
    )
  ] });
}
export {
  StudentDetailPage as default
};
