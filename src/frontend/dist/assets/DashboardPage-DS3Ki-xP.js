import { b as useNavigate, j as jsxRuntimeExports, S as Skeleton } from "./index-Bb6f_FCk.js";
import { L as Layout, P as PageHeader, a as LayoutDashboard } from "./badge-BagwGDur.js";
import { E as EmptyState, D as DataTable, C as CurrencyDisplay } from "./EmptyState-CA2NJPcu.js";
import { S as StatusBadge } from "./StatusBadge-CM3TyK-N.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Qs2UClye.js";
import { u as useCollectionSummary, a as useCollectionTrends } from "./use-payments-9ZgJc-fZ.js";
import { u as useAllBalances } from "./use-students-DOaJ0Z6A.js";
import { c as createLucideIcon, P as PaymentStatus } from "./backend-CvGl-pMz.js";
import { C as CircleCheck } from "./circle-check-Jprpe-d9.js";
import { C as Clock } from "./clock-BlbnH8KW.js";
import { C as CircleAlert } from "./circle-alert-Cp9yoInL.js";
import { T as TrendingUp } from "./trending-up-Ccsl6Tm9.js";
import { T as TrendingDown } from "./trending-down-ZNKMG5l1.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function calcPercentChange(current, previous) {
  if (previous === 0n) return null;
  return Math.round(Number((current - previous) * 10000n / previous) / 100);
}
function formatPercent(pct) {
  return pct > 0 ? `+${pct}%` : `${pct}%`;
}
function TrendBadge({
  current,
  previous,
  invertColors = false
}) {
  const pct = calcPercentChange(current, previous);
  if (pct === null) return null;
  if (pct === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-0.5 text-xs font-medium text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "w-3 h-3" }),
      "No change"
    ] });
  }
  const isPositive = pct > 0;
  const isGood = invertColors ? !isPositive : isPositive;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-0.5 text-xs font-semibold ${isGood ? "text-emerald-600" : "text-destructive"}`,
      children: [
        isPositive ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3 h-3" }),
        formatPercent(pct)
      ]
    }
  );
}
function SummaryCard({
  title,
  amount,
  icon: Icon,
  iconClass,
  isLoading,
  trend,
  secondaryLine
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-institutional", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5", children: title }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount,
          size: "xl",
          className: "text-foreground"
        }
      ),
      secondaryLine && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: secondaryLine }),
      trend && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mt-2", children: [
        trend,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "vs last 30 days" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ml-3 ${iconClass}`,
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
function PenaltyLine({ summary }) {
  const withPenalty = summary.totalOutstandingWithPenalty;
  const base = summary.totalOutstanding;
  if (!withPenalty || withPenalty === base) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-amber-600 font-medium flex items-center gap-1", children: [
    "Incl. penalties:",
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      CurrencyDisplay,
      {
        amount: withPenalty,
        className: "text-xs text-amber-600 font-medium"
      }
    )
  ] });
}
function DashboardPage() {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useCollectionSummary();
  const { data: trends, isLoading: trendsLoading } = useCollectionTrends();
  const { data: balances, isLoading: balancesLoading } = useAllBalances();
  const overdueSorted = (balances ?? []).filter((b) => b.status === PaymentStatus.overdue).slice(0, 10);
  const recentBalances = (balances ?? []).slice(0, 10);
  const hasNoData = !summaryLoading && !balancesLoading && (summary == null ? void 0 : summary.paymentCount) === 0n && (balances ?? []).length === 0;
  const isLoadingTrends = summaryLoading || trendsLoading;
  const collectedTrend = trends && !isLoadingTrends ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    TrendBadge,
    {
      current: trends.currentPeriodTotal,
      previous: trends.previousPeriodTotal,
      invertColors: false
    }
  ) : null;
  const outstandingTrend = trends && !isLoadingTrends && summary ? /* @__PURE__ */ jsxRuntimeExports.jsx(
    TrendBadge,
    {
      current: summary.totalOutstanding,
      previous: (
        // Approximate: previous outstanding ≈ current - (current period collected - previous period collected)
        summary.totalOutstanding + (trends.previousPeriodTotal > trends.currentPeriodTotal ? trends.previousPeriodTotal - trends.currentPeriodTotal : 0n)
      ),
      invertColors: true
    }
  ) : null;
  if (hasNoData) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: "Dashboard",
          description: "Overview of fee collection and payment status"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: LayoutDashboard,
          title: "No data yet — let's get started",
          description: "Create your first fee structure to begin managing collections, tracking payments, and monitoring outstanding balances.",
          action: {
            label: "Get started — create your first fee structure",
            onClick: () => navigate({ to: "/fee-structures/new" })
          }
        }
      ) })
    ] }) });
  }
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
          isLoading: summaryLoading,
          trend: collectedTrend
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SummaryCard,
        {
          title: "Outstanding",
          amount: (summary == null ? void 0 : summary.totalOutstanding) ?? 0n,
          icon: Clock,
          iconClass: "bg-amber-50 text-amber-600",
          isLoading: summaryLoading,
          trend: outstandingTrend,
          secondaryLine: summary ? /* @__PURE__ */ jsxRuntimeExports.jsx(PenaltyLine, { summary }) : null
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
