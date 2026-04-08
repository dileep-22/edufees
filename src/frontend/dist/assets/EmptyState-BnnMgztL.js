import { j as jsxRuntimeExports, c as cn } from "./index-JaIj-DYW.js";
import { B as Button } from "./button-BhNjEAR1.js";
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
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
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: action.onClick, "data-ocid": "empty-state-cta", children: action.label })
      ]
    }
  );
}
export {
  EmptyState as E
};
