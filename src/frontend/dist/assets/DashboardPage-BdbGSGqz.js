import { j as jsxRuntimeExports, S as Skeleton } from "./index-JaIj-DYW.js";
import { L as Layout, P as PageHeader } from "./badge-Cou7lT_t.js";
import { D as DataTable, C as CurrencyDisplay } from "./DataTable-DNjVnD7Z.js";
import { S as StatusBadge } from "./StatusBadge-CcMlBmQV.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-j9vFOIPS.js";
import { u as useCollectionSummary } from "./use-payments-DzGjzONa.js";
import { u as useAllBalances } from "./use-students-Cfl-MhrV.js";
import { P as PaymentStatus } from "./backend-BHrL9w1d.js";
import { C as CircleCheck } from "./circle-check-Cbfh-3nd.js";
import { C as Clock } from "./clock-B4nU2UVR.js";
import { C as CircleAlert } from "./circle-alert-C_68Qos-.js";
import { T as TrendingUp } from "./trending-up-mdAh6wTL.js";
function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconClass,
  isLoading
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5", children: title }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount,
          size: "xl",
          className: "text-foreground"
        }
      )
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
const balanceColumns = [
  {
    key: "name",
    header: "Student Name",
    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: row.studentName })
  },
  {
    key: "feeStructure",
    header: "Fee Structure",
    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: row.feeStructureName })
  },
  {
    key: "total",
    header: "Total Due",
    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: row.totalAmount }),
    headerClassName: "text-right",
    className: "text-right"
  },
  {
    key: "paid",
    header: "Paid",
    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: row.paidAmount, className: "text-emerald-600" }),
    headerClassName: "text-right",
    className: "text-right"
  },
  {
    key: "outstanding",
    header: "Outstanding",
    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: row.outstandingAmount }),
    headerClassName: "text-right",
    className: "text-right"
  },
  {
    key: "status",
    header: "Status",
    render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
  }
];
function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useCollectionSummary();
  const { data: balances, isLoading: balancesLoading } = useAllBalances();
  const overdueSorted = (balances ?? []).filter((b) => b.status === PaymentStatus.overdue).slice(0, 10);
  const recentBalances = (balances ?? []).slice(0, 10);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Dashboard",
        description: "Overview of fee collection and payment status"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Total Collected",
          amount: (summary == null ? void 0 : summary.totalCollected) ?? 0n,
          icon: CircleCheck,
          iconClass: "bg-emerald-50 text-emerald-600",
          isLoading: summaryLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Outstanding",
          amount: (summary == null ? void 0 : summary.totalOutstanding) ?? 0n,
          icon: Clock,
          iconClass: "bg-amber-50 text-amber-600",
          isLoading: summaryLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Overdue",
          amount: (summary == null ? void 0 : summary.totalOverdue) ?? 0n,
          icon: CircleAlert,
          iconClass: "bg-red-50 text-red-600",
          isLoading: summaryLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Waived",
          amount: (summary == null ? void 0 : summary.totalWaived) ?? 0n,
          icon: TrendingUp,
          iconClass: "bg-secondary text-muted-foreground",
          isLoading: summaryLoading
        }
      )
    ] }),
    (overdueSorted.length > 0 || balancesLoading) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-destructive" }),
        "Overdue Balances"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns: balanceColumns,
          data: overdueSorted,
          keyExtractor: (row) => `${row.studentId}-${row.feeStructureId}`,
          isLoading: balancesLoading,
          className: "border-0 rounded-none"
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Recent Balances" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns: balanceColumns,
          data: recentBalances,
          keyExtractor: (row) => `${row.studentId}-${row.feeStructureId}`,
          isLoading: balancesLoading,
          emptyState: "No balances found. Assign fees to students to get started.",
          className: "border-0 rounded-none"
        }
      ) })
    ] }),
    summary && !summaryLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex items-center gap-4 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      "Total payments recorded:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: summary.paymentCount.toString() })
    ] }) })
  ] }) });
}
export {
  DashboardPage as default
};
