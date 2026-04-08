import { r as reactExports, j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-JaIj-DYW.js";
import { B as Building2, C as CreditCard, U as Users, L as Layout, P as PageHeader } from "./badge-Cou7lT_t.js";
import { u as useDirection, a as useControllableState, P as Primitive, b as useId, c as composeEventHandlers, d as createContextScope } from "./Combination-99tTHa6i.js";
import { R as Root, I as Item, c as createRovingFocusGroupScope } from "./index-B5VWj3Iz.js";
import { P as Presence } from "./index-CO6Xcq0I.js";
import { C as CurrencyDisplay, D as DataTable } from "./DataTable-DNjVnD7Z.js";
import { E as EmptyState } from "./EmptyState-BnnMgztL.js";
import { B as Button } from "./button-BhNjEAR1.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-j9vFOIPS.js";
import { a as useAgingReport, b as usePayments, u as useCollectionSummary, c as usePaymentMethodBreakdown } from "./use-payments-DzGjzONa.js";
import { T as TriangleAlert, D as Download } from "./triangle-alert-JHDKxG3U.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BDSf899r.js";
import { c as createLucideIcon, P as PaymentStatus, b as PaymentMethod } from "./backend-BHrL9w1d.js";
import { T as TrendingUp } from "./trending-up-mdAh6wTL.js";
import { C as Clock } from "./clock-B4nU2UVR.js";
import { C as CircleMinus } from "./circle-minus-CN8D1acB.js";
import { S as StatusBadge } from "./StatusBadge-CcMlBmQV.js";
import { u as useAllBalances } from "./use-students-Cfl-MhrV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }]
];
const Banknote = createLucideIcon("banknote", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }]
];
const Globe = createLucideIcon("globe", __iconNode);
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const BUCKET_CONFIG = {
  "0-30": {
    label: "0–30 Days",
    barColor: "bg-amber-400",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700"
  },
  "30-60": {
    label: "30–60 Days",
    barColor: "bg-orange-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700"
  },
  "60+": {
    label: "60+ Days",
    barColor: "bg-red-600",
    bgColor: "bg-red-50",
    textColor: "text-red-700"
  }
};
function getBucketConfig(bucket) {
  for (const key of Object.keys(BUCKET_CONFIG)) {
    if (bucket.includes(key)) return BUCKET_CONFIG[key];
  }
  return {
    label: bucket,
    barColor: "bg-primary",
    bgColor: "bg-secondary",
    textColor: "text-foreground"
  };
}
function exportCsv$3(data) {
  const headers = ["Bucket", "Count", "Total Amount"];
  const rows = data.map((b) => [
    getBucketConfig(b.bucket).label,
    b.count.toString(),
    (Number(b.totalAmount) / 100).toFixed(2)
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "aging-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}
const COLUMNS$1 = [
  {
    key: "bucket",
    header: "Aging Bucket",
    render: (b) => {
      const config = getBucketConfig(b.bucket);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `inline-flex items-center gap-1.5 text-sm font-medium px-2 py-0.5 rounded-md ${config.bgColor} ${config.textColor}`,
          children: config.label
        }
      );
    }
  },
  {
    key: "count",
    header: "Overdue Fees",
    render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground", children: b.count.toString() }),
    headerClassName: "text-right",
    className: "text-right"
  },
  {
    key: "totalAmount",
    header: "Total Overdue Amount",
    render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      CurrencyDisplay,
      {
        amount: b.totalAmount,
        size: "sm",
        className: "text-red-600 font-semibold"
      }
    ),
    headerClassName: "text-right",
    className: "text-right"
  }
];
function AgingBarChart({ buckets }) {
  const maxAmount = reactExports.useMemo(
    () => buckets.reduce((m, b) => b.totalAmount > m ? b.totalAmount : m, 0n),
    [buckets]
  );
  if (buckets.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: buckets.map((bucket) => {
    const config = getBucketConfig(bucket.bucket);
    const pct = maxAmount > 0n ? Math.round(Number(bucket.totalAmount) / Number(maxAmount) * 100) : 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-medium ${config.textColor}`, children: config.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
            bucket.count.toString(),
            " fees"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: bucket.totalAmount, size: "sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-full rounded-full transition-all duration-700 ${config.barColor}`,
          style: { width: `${pct}%` }
        }
      ) })
    ] }, bucket.bucket);
  }) });
}
function AgingReportTab() {
  const { data: buckets = [], isLoading } = useAgingReport();
  const totalOverdue = reactExports.useMemo(
    () => buckets.reduce((sum, b) => sum + b.totalAmount, 0n),
    [buckets]
  );
  const totalCount = reactExports.useMemo(
    () => buckets.reduce((sum, b) => sum + b.count, 0n),
    [buckets]
  );
  const hasData = buckets.some((b) => b.count > 0n);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "aging-report-tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Total Overdue" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            CurrencyDisplay,
            {
              amount: totalOverdue,
              size: "xl",
              className: "text-red-600"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Overdue Fees" }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-16" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold font-display text-foreground", children: totalCount.toString() })
        ] }) }),
        (isLoading ? ["skel-1", "skel-2"] : buckets.slice(0, 3)).map(
          (item) => {
            if (isLoading) {
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                Skeleton,
                {
                  className: "h-20 w-full rounded-xl col-span-1"
                },
                item
              );
            }
            const b = item;
            if (b.count === 0n) return null;
            const config = getBucketConfig(b.bucket);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: `border col-span-1 ${config.bgColor} border-opacity-50`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: `text-xs font-semibold uppercase tracking-wide mb-1 ${config.textColor}`,
                      children: config.label
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: `text-lg font-bold font-display ${config.textColor}`,
                      children: [
                        b.count.toString(),
                        " fees"
                      ]
                    }
                  )
                ] })
              },
              b.bucket
            );
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 pt-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Overdue Breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" }, i)) }) : !hasData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: TriangleAlert,
            title: "No overdue fees",
            description: "All fees are current — no overdue payments to report.",
            className: "py-8"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AgingBarChart, { buckets }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Aging Detail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => exportCsv$3(buckets),
            disabled: buckets.length === 0,
            "data-ocid": "export-aging-csv",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
              "Export CSV"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns: COLUMNS$1,
          data: buckets,
          keyExtractor: (b) => b.bucket,
          isLoading,
          emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: TriangleAlert,
              title: "No aging data",
              description: "Great news! There are no overdue fees to report."
            }
          )
        }
      )
    ] }) })
  ] });
}
const DATE_RANGES = [
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "Last year", days: 365 }
];
const STATUS_OPTIONS$1 = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: PaymentStatus.paid },
  { label: "Pending", value: PaymentStatus.pending },
  { label: "Overdue", value: PaymentStatus.overdue },
  { label: "Waived", value: PaymentStatus.waived },
  { label: "Partial", value: PaymentStatus.partial }
];
const METHOD_OPTIONS = [
  { label: "All Methods", value: "all" },
  { label: "Cash", value: PaymentMethod.cash },
  { label: "Check", value: PaymentMethod.check },
  { label: "Transfer", value: PaymentMethod.transfer },
  { label: "Online", value: PaymentMethod.online }
];
function formatDate$1(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatMethod(method) {
  return method.charAt(0).toUpperCase() + method.slice(1);
}
const COLUMNS = [
  {
    key: "receipt",
    header: "Receipt #",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs", children: r.receiptNumber || "—" })
  },
  {
    key: "date",
    header: "Date",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: formatDate$1(r.date) })
  },
  {
    key: "method",
    header: "Method",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-sm", children: formatMethod(r.method) })
  },
  {
    key: "amount",
    header: "Amount",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: r.amount, size: "sm" }),
    headerClassName: "text-right",
    className: "text-right"
  },
  {
    key: "notes",
    header: "Notes",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground truncate max-w-[180px] block", children: r.notes || "—" })
  }
];
function SummaryCard({
  icon: Icon,
  label,
  amount,
  color
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount, size: "xl" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-5 h-5" })
      }
    )
  ] }) }) });
}
function exportCsv$2(payments) {
  const headers = ["Receipt #", "Date", "Method", "Amount (cents)", "Notes"];
  const rows = payments.map((p) => [
    p.receiptNumber,
    formatDate$1(p.date),
    p.method,
    p.amount.toString(),
    `"${p.notes.replace(/"/g, '""')}"`
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "collections-summary.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function CollectionsSummaryTab() {
  const [dateRange, setDateRange] = reactExports.useState("30");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [methodFilter, setMethodFilter] = reactExports.useState("all");
  const days = Number(dateRange);
  const now = BigInt(Date.now()) * 1000000n;
  const from = (BigInt(Date.now()) - BigInt(days * 864e5)) * 1000000n;
  const { data: payments = [], isLoading: paymentsLoading } = usePayments(
    from,
    now
  );
  const { data: summary, isLoading: summaryLoading } = useCollectionSummary();
  const filtered = reactExports.useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== "all" && p.method !== methodFilter) return false;
      return true;
    });
  }, [payments, methodFilter]);
  const summaryCards = [
    {
      icon: TrendingUp,
      label: "Total Collected",
      amount: (summary == null ? void 0 : summary.totalCollected) ?? 0n,
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      icon: Clock,
      label: "Outstanding",
      amount: (summary == null ? void 0 : summary.totalOutstanding) ?? 0n,
      color: "bg-amber-50 text-amber-700"
    },
    {
      icon: TriangleAlert,
      label: "Overdue",
      amount: (summary == null ? void 0 : summary.totalOverdue) ?? 0n,
      color: "bg-red-50 text-red-700"
    },
    {
      icon: CircleMinus,
      label: "Waived",
      amount: (summary == null ? void 0 : summary.totalWaived) ?? 0n,
      color: "bg-secondary text-muted-foreground"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "collections-summary-tab", children: [
    summaryLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: summaryCards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryCard, { ...card }, card.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: dateRange, onValueChange: setDateRange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-40", "data-ocid": "filter-date-range", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DATE_RANGES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: String(r.days), children: r.label }, r.days)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "filter-status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS$1.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: methodFilter, onValueChange: setMethodFilter, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "filter-method", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: METHOD_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => exportCsv$2(filtered),
            disabled: filtered.length === 0,
            "data-ocid": "export-collections-csv",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
              "Export CSV"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns: COLUMNS,
          data: filtered,
          keyExtractor: (p) => p.id.toString(),
          isLoading: paymentsLoading,
          emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: TrendingUp,
              title: "No payments found",
              description: "No payments match your current filters. Try adjusting the date range or filter criteria."
            }
          )
        }
      )
    ] }) })
  ] });
}
const METHOD_CONFIG = {
  [PaymentMethod.cash]: {
    label: "Cash",
    icon: Banknote,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    barColor: "bg-emerald-500"
  },
  [PaymentMethod.check]: {
    label: "Check",
    icon: CreditCard,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500"
  },
  [PaymentMethod.transfer]: {
    label: "Bank Transfer",
    icon: Building2,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    barColor: "bg-purple-500"
  },
  [PaymentMethod.online]: {
    label: "Online",
    icon: Globe,
    color: "text-primary",
    bgColor: "bg-primary/10",
    barColor: "bg-primary"
  }
};
const METHODS = [
  PaymentMethod.cash,
  PaymentMethod.check,
  PaymentMethod.transfer,
  PaymentMethod.online
];
function exportCsv$1(data) {
  const headers = ["Payment Method", "Amount", "Percentage"];
  const rows = data.map((d) => [
    d.label,
    (Number(d.amount) / 100).toFixed(2),
    `${d.percentage.toFixed(1)}%`
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "payment-methods.csv";
  a.click();
  URL.revokeObjectURL(url);
}
function DonutChart({
  segments
}) {
  const total = segments.reduce((s, seg) => s + Number(seg.amount), 0);
  if (total === 0) return null;
  let cumPct = 0;
  const r = 80;
  const cx = 100;
  const cy = 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 200 200",
      className: "w-48 h-48",
      role: "img",
      "aria-label": "Payment method distribution chart",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Payment method distribution" }),
        segments.map((seg) => {
          if (seg.pct === 0) return null;
          const config = METHOD_CONFIG[seg.method];
          const startAngle = cumPct * 3.6 - 90;
          const endAngle = (cumPct + seg.pct) * 3.6 - 90;
          const start = {
            x: cx + r * Math.cos(startAngle * Math.PI / 180),
            y: cy + r * Math.sin(startAngle * Math.PI / 180)
          };
          const end = {
            x: cx + r * Math.cos(endAngle * Math.PI / 180),
            y: cy + r * Math.sin(endAngle * Math.PI / 180)
          };
          const largeArc = seg.pct > 50 ? 1 : 0;
          const d = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
          cumPct += seg.pct;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              d,
              className: config.barColor.replace("bg-", "fill-"),
              opacity: 0.85
            },
            seg.method
          );
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx, cy, r: 50, className: "fill-card" })
      ]
    }
  ) });
}
function PaymentMethodsTab() {
  const { data: breakdown, isLoading } = usePaymentMethodBreakdown();
  const segments = reactExports.useMemo(() => {
    if (!breakdown)
      return METHODS.map((m) => ({ method: m, amount: 0n, pct: 0 }));
    const total2 = METHODS.reduce((s, m) => s + Number(breakdown[m]), 0);
    return METHODS.map((m) => ({
      method: m,
      amount: breakdown[m],
      pct: total2 > 0 ? Number(breakdown[m]) / total2 * 100 : 0
    }));
  }, [breakdown]);
  const total = reactExports.useMemo(
    () => segments.reduce((s, seg) => s + seg.amount, 0n),
    [segments]
  );
  const hasData = total > 0n;
  const csvData = segments.map((s) => ({
    method: s.method,
    label: METHOD_CONFIG[s.method].label,
    amount: s.amount,
    percentage: s.pct
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "payment-methods-tab", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border border-border shadow-card lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-5 px-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Distribution" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 pb-5", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-48 h-48 rounded-full" }) }) : !hasData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: CreditCard,
            title: "No payment data",
            description: "No payments have been recorded yet.",
            className: "py-8"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(DonutChart, { segments }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 grid grid-cols-2 gap-4", children: METHODS.map((method) => {
        const config = METHOD_CONFIG[method];
        const seg = segments.find((s) => s.method === method);
        const Icon = config.icon;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bgColor}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-5 h-5 ${config.color}` })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: config.label }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  CurrencyDisplay,
                  {
                    amount: (seg == null ? void 0 : seg.amount) ?? 0n,
                    size: "lg"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                  seg ? seg.pct.toFixed(1) : "0.0",
                  "% of total"
                ] })
              ] })
            ] })
          ] }),
          !isLoading && seg && total > 0n && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all duration-700 ${config.barColor}`,
              style: { width: `${seg.pct}%` }
            }
          ) }) })
        ] }) }, method);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Payment Method Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => exportCsv$1(csvData),
            disabled: !hasData,
            "data-ocid": "export-methods-csv",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
              "Export CSV"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded" }, i)) }) : !hasData ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        EmptyState,
        {
          icon: CreditCard,
          title: "No payment methods data",
          description: "Record payments to see a breakdown by payment method."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-border overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-secondary border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Share" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          segments.map((seg) => {
            const config = METHOD_CONFIG[seg.method];
            const Icon = config.icon;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border last:border-0 bg-card hover:bg-secondary/50 transition-colors",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `w-7 h-7 rounded-lg flex items-center justify-center ${config.bgColor}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-3.5 h-3.5 ${config.color}` })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: config.label })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: seg.amount, size: "sm" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-1.5 bg-secondary rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `h-full rounded-full ${config.barColor}`,
                        style: { width: `${seg.pct}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs w-10 text-right", children: [
                      seg.pct.toFixed(1),
                      "%"
                    ] })
                  ] }) })
                ]
              },
              seg.method
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-secondary/40 border-t-2 border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 font-semibold text-foreground", children: "Total" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: total,
                size: "sm",
                className: "font-bold"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-muted-foreground text-xs", children: "100%" })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
const STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Paid", value: PaymentStatus.paid },
  { label: "Pending", value: PaymentStatus.pending },
  { label: "Overdue", value: PaymentStatus.overdue },
  { label: "Waived", value: PaymentStatus.waived },
  { label: "Partial", value: PaymentStatus.partial }
];
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function exportCsv(data) {
  const headers = [
    "Student Name",
    "Student ID",
    "Fee Structure",
    "Total Amount",
    "Paid",
    "Outstanding",
    "Status",
    "Due Date"
  ];
  const rows = data.map((b) => [
    `"${b.studentName}"`,
    b.studentId.toString(),
    `"${b.feeStructureName}"`,
    (Number(b.totalAmount) / 100).toFixed(2),
    (Number(b.paidAmount) / 100).toFixed(2),
    (Number(b.outstandingAmount) / 100).toFixed(2),
    b.status,
    formatDate(b.dueDate)
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
function StudentBalancesTab() {
  const [sortField, setSortField] = reactExports.useState("outstanding");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const { data: balances = [], isLoading } = useAllBalances();
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };
  const processed = reactExports.useMemo(() => {
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
  const columns = [
    {
      key: "studentName",
      header: "Student",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground", children: b.studentName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "ID: ",
          b.studentId.toString()
        ] })
      ] }),
      headerClassName: "cursor-pointer"
    },
    {
      key: "feeStructure",
      header: "Fee Structure",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: b.feeStructureName })
    },
    {
      key: "totalAmount",
      header: "Total",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: b.totalAmount, size: "sm" }),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "paidAmount",
      header: "Paid",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: b.paidAmount,
          size: "sm",
          className: "text-emerald-700"
        }
      ),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "outstandingAmount",
      header: "Outstanding",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: b.outstandingAmount,
          size: "sm",
          className: b.outstandingAmount > 0n ? "text-red-600 font-semibold" : ""
        }
      ),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "status",
      header: "Status",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: b.status })
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (b) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: formatDate(b.dueDate) })
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", "data-ocid": "student-balances-tab", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Sort by:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: sortField === "outstanding" ? "default" : "outline",
            size: "sm",
            onClick: () => handleSort("outstanding"),
            "data-ocid": "sort-outstanding",
            children: [
              "Outstanding",
              " ",
              sortField === "outstanding" && (sortDir === "asc" ? "↑" : "↓")
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: sortField === "dueDate" ? "default" : "outline",
            size: "sm",
            onClick: () => handleSort("dueDate"),
            "data-ocid": "sort-due-date",
            children: [
              "Due Date",
              " ",
              sortField === "dueDate" && (sortDir === "asc" ? "↑" : "↓")
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "filter-balance-status", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STATUS_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-2", children: [
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          processed.length,
          " records"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            variant: "outline",
            size: "sm",
            onClick: () => exportCsv(processed),
            disabled: processed.length === 0,
            "data-ocid": "export-balances-csv",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
              "Export CSV"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DataTable,
      {
        columns,
        data: processed,
        keyExtractor: (b) => `${b.studentId}-${b.feeStructureId}`,
        isLoading,
        emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: Users,
            title: "No student balances found",
            description: "No balances match your current filters. Assign fee structures to students to see balances here."
          }
        )
      }
    )
  ] }) }) });
}
const TABS = [
  { value: "collections", label: "Collections Summary" },
  { value: "balances", label: "Student Balances" },
  { value: "aging", label: "Aging Report" },
  { value: "methods", label: "Payment Methods" }
];
function ReportsPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", "data-ocid": "reports-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Reports",
        description: "Financial insights and payment analytics across all fee structures"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "collections", className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "bg-secondary border border-border h-auto p-1 gap-1", children: TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsTrigger,
        {
          value: tab.value,
          className: "text-sm font-medium data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground",
          "data-ocid": `tab-${tab.value}`,
          children: tab.label
        },
        tab.value
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "collections", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionsSummaryTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "balances", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StudentBalancesTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "aging", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AgingReportTab, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "methods", className: "mt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentMethodsTab, {}) })
    ] })
  ] }) });
}
export {
  ReportsPage as default
};
