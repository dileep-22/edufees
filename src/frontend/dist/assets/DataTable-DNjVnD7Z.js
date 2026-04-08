import { j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-JaIj-DYW.js";
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
export {
  CurrencyDisplay as C,
  DataTable as D
};
