import { j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-Bb6f_FCk.js";
import { B as Button } from "./backend-CvGl-pMz.js";
const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg font-semibold",
  xl: "text-2xl font-bold font-display"
};
function CurrencyDisplay({
  amount,
  className,
  size = "md"
}) {
  const dollars = Number(amount) / 100;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(dollars);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(sizeClasses[size], "font-mono tabular-nums", className),
      children: formatted
    }
  );
}
function DataTable({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyState,
  className,
  onRowClick
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: cn(
        "rounded-lg border border-border overflow-hidden",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "data-table", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-secondary border-b border-border", children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: cn(
              "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
              col.headerClassName
            ),
            children: col.header
          },
          col.key
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: isLoading ? Array.from({ length: 5 }, (_, i) => `skel-${i}`).map((id) => /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border last:border-0", children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-[120px]" }) }, col.key)) }, id)) : data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "td",
          {
            colSpan: columns.length,
            className: "text-center py-12 text-muted-foreground",
            children: emptyState ?? "No data available"
          }
        ) }) : data.map((row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "tr",
          {
            "data-ocid": "table-row",
            onClick: onRowClick ? () => onRowClick(row) : void 0,
            onKeyDown: onRowClick ? (e) => {
              if (e.key === "Enter" || e.key === " ")
                onRowClick(row);
            } : void 0,
            tabIndex: onRowClick ? 0 : void 0,
            role: onRowClick ? "button" : void 0,
            className: cn(
              "border-b border-border last:border-0 bg-card hover:bg-secondary/50 transition-colors",
              onRowClick && "cursor-pointer"
            ),
            children: columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: cn("px-4 py-3 text-foreground", col.className),
                children: col.render(row)
              },
              col.key
            ))
          },
          keyExtractor(row)
        )) })
      ] }) })
    }
  );
}
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center py-16 px-8 text-center",
        className
      ),
      "data-ocid": "empty-state",
      children: [
        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-6 h-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: title }),
        description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-sm mb-5", children: description }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: action.onClick, "data-ocid": "empty-state-cta", children: action.label }),
        secondaryAction && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: secondaryAction })
      ]
    }
  );
}
export {
  CurrencyDisplay as C,
  DataTable as D,
  EmptyState as E
};
