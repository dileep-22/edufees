import { b as useNavigate, e as useParams, r as reactExports, j as jsxRuntimeExports } from "./index-Bb6f_FCk.js";
import { E as EmptyState, C as CurrencyDisplay, D as DataTable } from "./EmptyState-CA2NJPcu.js";
import { L as Layout, P as PageHeader, U as Users, u as ue } from "./badge-BagwGDur.js";
import { S as StatusBadge } from "./StatusBadge-CM3TyK-N.js";
import { B as Button, F as FeePeriod } from "./backend-CvGl-pMz.js";
import { C as Card, c as CardContent } from "./card-Qs2UClye.js";
import { I as Input } from "./input-ZgbirZVl.js";
import { d as useFeeStructureBalances } from "./use-assignments-DnGPXMwb.js";
import { c as useFeeStructure, b as useDuplicateFeeStructure } from "./use-fee-structures-BrXYBxzF.js";
import { L as LoaderCircle } from "./loader-circle-D_lEcbKH.js";
import { C as CircleAlert } from "./circle-alert-Cp9yoInL.js";
import { A as ArrowLeft } from "./arrow-left-50EjHvfm.js";
import { C as Copy, S as SquarePen, A as Archive } from "./square-pen-Cwil6LmP.js";
import { C as Calendar } from "./calendar-DPhCqocg.js";
import { S as Search } from "./search-DRGzNiPY.js";
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
function isArchived(endDate) {
  const now = BigInt(Date.now()) * 1000000n;
  return endDate < now;
}
function FeeStructureDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const feeId = BigInt(params.id ?? "0");
  const { data: feeStructure, isLoading: loadingStructure } = useFeeStructure(feeId);
  const { data: balances = [], isLoading: loadingBalances } = useFeeStructureBalances(feeId);
  const duplicateMutation = useDuplicateFeeStructure();
  const [search, setSearch] = reactExports.useState("");
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return balances.filter(
      (b) => b.studentName.toLowerCase().includes(q) || b.studentId.toString().includes(q)
    );
  }, [balances, search]);
  const totalDue = reactExports.useMemo(
    () => balances.reduce((sum, b) => sum + b.totalAmount, 0n),
    [balances]
  );
  const totalPaid = reactExports.useMemo(
    () => balances.reduce((sum, b) => sum + b.paidAmount, 0n),
    [balances]
  );
  const totalOutstanding = reactExports.useMemo(
    () => balances.reduce((sum, b) => sum + b.outstandingAmount, 0n),
    [balances]
  );
  async function handleDuplicate() {
    if (!feeStructure) return;
    try {
      const copy = await duplicateMutation.mutateAsync(feeStructure.id);
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
  const columns = [
    {
      key: "student",
      header: "Student Name",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground block truncate", children: b.studentName }) })
    },
    {
      key: "studentId",
      header: "Student ID",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground font-mono", children: b.studentId.toString().padStart(8, "0") })
    },
    {
      key: "totalDue",
      header: "Total Due",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: b.totalAmount, size: "sm" })
    },
    {
      key: "paidAmount",
      header: "Paid Amount",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: b.paidAmount,
          size: "sm",
          className: b.paidAmount > 0n ? "text-emerald-600" : ""
        }
      )
    },
    {
      key: "balance",
      header: "Remaining Balance",
      headerClassName: "text-right",
      className: "text-right",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: b.outstandingAmount,
          size: "sm",
          className: b.outstandingAmount > 0n ? "text-accent-foreground" : "text-muted-foreground"
        }
      )
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: formatDate(b.dueDate) })
    },
    {
      key: "status",
      header: "Status",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: b.status })
    }
  ];
  if (loadingStructure) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 flex items-center justify-center min-h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-muted-foreground" }) }) });
  }
  if (!feeStructure) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: CircleAlert,
        title: "Fee structure not found",
        description: "This fee structure may have been deleted or does not exist",
        action: {
          label: "Back to Fee Structures",
          onClick: () => navigate({ to: "/fee-structures" })
        }
      }
    ) }) });
  }
  const archived = isArchived(feeStructure.endDate);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/fee-structures" }),
          "data-ocid": "back-button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        PageHeader,
        {
          title: feeStructure.name,
          description: feeStructure.description || void 0,
          className: "mb-0 flex-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: handleDuplicate,
                disabled: duplicateMutation.isPending,
                "data-ocid": "duplicate-button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4 h-4 mr-2" }),
                  "Duplicate"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => navigate({
                  to: "/fee-structures/$id/edit",
                  params: { id: feeStructure.id.toString() }
                }),
                "data-ocid": "edit-button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-4 h-4 mr-2" }),
                  "Edit"
                ]
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1", children: "Period" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: PERIOD_LABELS[feeStructure.period] ?? feeStructure.period })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1", children: "Fee Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: feeStructure.amount, size: "lg" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1 flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3" }),
          "Due Date"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatDate(feeStructure.dueDate) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `${archived ? "bg-muted/40" : "bg-card"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: archived ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-muted-foreground", children: "Archived" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: "Active" })
        ] }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 rounded-lg px-4 py-3 border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Active period:",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: formatDate(feeStructure.startDate) }),
        " ",
        "to",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: formatDate(feeStructure.endDate) })
      ] }),
      feeStructure.latePenalty && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mx-2 text-border", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Late penalty:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: feeStructure.latePenalty.__kind__ === "fixed" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: feeStructure.latePenalty.fixed,
                size: "sm"
              }
            ),
            " ",
            "fixed"
          ] }) : `${Number(feeStructure.latePenalty.percentage) / 100}%` })
        ] })
      ] })
    ] }),
    !loadingBalances && balances.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1", children: "Total Due" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: totalDue, size: "lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          balances.length,
          " enrolled student",
          balances.length !== 1 ? "s" : ""
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1", children: "Collected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CurrencyDisplay,
          {
            amount: totalPaid,
            size: "lg",
            className: "text-emerald-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          totalDue > 0n ? Math.round(Number(totalPaid * 100n / totalDue)) : 0,
          "% of total"
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1", children: "Outstanding" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CurrencyDisplay,
          {
            amount: totalOutstanding,
            size: "lg",
            className: totalOutstanding > 0n ? "text-destructive" : ""
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          totalDue > 0n ? Math.round(Number(totalOutstanding * 100n / totalDue)) : 0,
          "% remaining"
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Enrolled Students" }),
          !loadingBalances && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full", children: filtered.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search students...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "pl-9 h-8 text-sm w-52",
              "data-ocid": "student-search"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns,
          data: filtered,
          keyExtractor: (b) => `${b.studentId}-${b.feeStructureId}`,
          isLoading: loadingBalances,
          emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Users,
              title: search ? "No students match your search" : "No students enrolled",
              description: search ? "Try adjusting your search query" : "Students can be enrolled from the Students page"
            }
          )
        }
      )
    ] })
  ] }) });
}
export {
  FeeStructureDetailPage as default
};
