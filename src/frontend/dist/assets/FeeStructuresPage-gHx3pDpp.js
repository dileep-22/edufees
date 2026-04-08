import { b as useNavigate, r as reactExports, j as jsxRuntimeExports } from "./index-Bb6f_FCk.js";
import { C as ConfirmDialog } from "./ConfirmDialog-ClvdOGYa.js";
import { D as DataTable, E as EmptyState, C as CurrencyDisplay } from "./EmptyState-CA2NJPcu.js";
import { L as Layout, P as PageHeader, u as ue, d as Badge, U as Users } from "./badge-BagwGDur.js";
import { c as createLucideIcon, B as Button, F as FeePeriod } from "./backend-CvGl-pMz.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, E as Ellipsis, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator, T as Trash2 } from "./dropdown-menu-BLYBOEMa.js";
import { I as Input } from "./input-ZgbirZVl.js";
import { u as useFeeStructures, a as useDeleteFeeStructure, b as useDuplicateFeeStructure } from "./use-fee-structures-BrXYBxzF.js";
import { P as Plus } from "./index-CKCQw2RY.js";
import { S as Search } from "./search-DRGzNiPY.js";
import { C as CircleAlert } from "./circle-alert-Cp9yoInL.js";
import { A as Archive, S as SquarePen, C as Copy } from "./square-pen-Cwil6LmP.js";
import "./Combination-BTsKCupS.js";
import "./index-BaoaRZan.js";
import "./index-BLPLWcsf.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode);
const PERIOD_LABELS = {
  [FeePeriod.annual]: "Annual",
  [FeePeriod.semester]: "Semester",
  [FeePeriod.term]: "Term",
  [FeePeriod.monthly]: "Monthly"
};
function formatDate(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function isArchived(feeStructure) {
  const now = BigInt(Date.now()) * 1000000n;
  return feeStructure.endDate < now;
}
function FeeStructuresPage() {
  const navigate = useNavigate();
  const { data: feeStructures = [], isLoading } = useFeeStructures();
  const deleteMutation = useDeleteFeeStructure();
  const duplicateMutation = useDuplicateFeeStructure();
  const [search, setSearch] = reactExports.useState("");
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return feeStructures.filter(
      (fs) => {
        var _a;
        return fs.name.toLowerCase().includes(q) || ((_a = PERIOD_LABELS[fs.period]) == null ? void 0 : _a.toLowerCase().includes(q));
      }
    );
  }, [feeStructures, search]);
  const archived = reactExports.useMemo(() => filtered.filter(isArchived), [filtered]);
  const active = reactExports.useMemo(
    () => filtered.filter((fs) => !isArchived(fs)),
    [filtered]
  );
  async function handleDuplicate(fs) {
    try {
      const copy = await duplicateMutation.mutateAsync(fs.id);
      if (copy) {
        ue.success("Fee structure duplicated");
        navigate({
          to: "/fee-structures/$id/edit",
          params: { id: copy.id.toString() }
        });
      }
    } catch {
      ue.error("Failed to duplicate fee structure");
    }
  }
  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      ue.success("Fee structure deleted");
      setDeleteTarget(null);
    } catch {
      ue.error("Failed to delete fee structure");
    }
  }
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (fs) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate block", children: fs.name }),
          fs.description && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate block max-w-[200px]", children: fs.description })
        ] }),
        isArchived(fs) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "text-xs shrink-0 text-muted-foreground border-border",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-3 h-3 mr-1" }),
              "Archived"
            ]
          }
        )
      ] })
    },
    {
      key: "period",
      header: "Period",
      render: (fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs font-medium", children: PERIOD_LABELS[fs.period] ?? fs.period })
    },
    {
      key: "amount",
      header: "Amount",
      headerClassName: "text-right",
      className: "text-right",
      render: (fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: fs.amount, size: "sm" })
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (fs) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: formatDate(fs.dueDate) })
    },
    {
      key: "latePenalty",
      header: "Late Penalty",
      render: (fs) => {
        if (!fs.latePenalty)
          return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" });
        if (fs.latePenalty.__kind__ === "fixed") {
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: fs.latePenalty.fixed, size: "sm" }),
            " fixed"
          ] });
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground", children: [
          Number(fs.latePenalty.percentage) / 100,
          "% of amount"
        ] });
      }
    },
    {
      key: "dates",
      header: "Active Period",
      render: (fs) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: [
        formatDate(fs.startDate),
        " – ",
        formatDate(fs.endDate)
      ] })
    },
    {
      key: "actions",
      header: "",
      headerClassName: "w-12",
      className: "w-12",
      render: (fs) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "w-8 h-8",
            "data-ocid": "fee-structure-actions",
            onClick: (e) => e.stopPropagation(),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "w-4 h-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-44", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: (e) => {
                e.stopPropagation();
                navigate({
                  to: "/fee-structures/$id",
                  params: { id: fs.id.toString() }
                });
              },
              "data-ocid": "action-view-students",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 mr-2" }),
                "View Students"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: (e) => {
                e.stopPropagation();
                navigate({
                  to: "/fee-structures/$id/edit",
                  params: { id: fs.id.toString() }
                });
              },
              "data-ocid": "action-edit",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4 mr-2" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: (e) => {
                e.stopPropagation();
                handleDuplicate(fs);
              },
              "data-ocid": "action-duplicate",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4 mr-2" }),
                "Duplicate"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: (e) => {
                e.stopPropagation();
                setDeleteTarget(fs);
              },
              className: "text-destructive focus:text-destructive",
              "data-ocid": "action-delete",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 mr-2" }),
                "Delete"
              ]
            }
          )
        ] })
      ] })
    }
  ];
  const hasArchived = archived.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Fee Structures",
          description: "Define and manage fee structures for your institution",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => navigate({ to: "/fee-structures/new" }),
              "data-ocid": "create-fee-structure",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                "Add Fee Structure"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search fee structures...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-9",
              "data-ocid": "fee-structure-search"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
          filtered.length,
          " structure",
          filtered.length !== 1 ? "s" : ""
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns,
          data: active,
          keyExtractor: (fs) => fs.id.toString(),
          isLoading,
          onRowClick: (fs) => navigate({
            to: "/fee-structures/$id",
            params: { id: fs.id.toString() }
          }),
          emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: CircleAlert,
              title: search ? "No results found" : "No fee structures yet",
              description: search ? "Try adjusting your search query" : "Create your first fee structure to start managing fees",
              action: !search ? {
                label: "Add Fee Structure",
                onClick: () => navigate({ to: "/fee-structures/new" })
              } : void 0
            }
          )
        }
      ) }),
      hasArchived && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: [
            "Archived (",
            archived.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DataTable,
          {
            columns,
            data: archived,
            keyExtractor: (fs) => fs.id.toString(),
            isLoading: false,
            onRowClick: (fs) => navigate({
              to: "/fee-structures/$id",
              params: { id: fs.id.toString() }
            })
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (open) => !open && setDeleteTarget(null),
        title: "Delete Fee Structure",
        description: `Are you sure you want to delete "${deleteTarget == null ? void 0 : deleteTarget.name}"? This action cannot be undone.`,
        confirmLabel: "Delete",
        variant: "destructive",
        onConfirm: handleDelete
      }
    )
  ] });
}
export {
  FeeStructuresPage as default
};
