import { j as jsxRuntimeExports, c as cn } from "./index-JaIj-DYW.js";
import { b as Badge } from "./badge-Cou7lT_t.js";
import { P as PaymentStatus } from "./backend-BHrL9w1d.js";
const statusConfig = {
  [PaymentStatus.paid]: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  [PaymentStatus.pending]: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200"
  },
  [PaymentStatus.overdue]: {
    label: "Overdue",
    className: "bg-red-50 text-red-700 border-red-200"
  },
  [PaymentStatus.waived]: {
    label: "Waived",
    className: "bg-secondary text-muted-foreground border-border"
  },
  [PaymentStatus.partial]: {
    label: "Partial",
    className: "bg-blue-50 text-blue-700 border-blue-200"
  }
};
function StatusBadge({ status, className }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-secondary text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Badge,
    {
      variant: "outline",
      className: cn("text-xs font-medium border", config.className, className),
      children: config.label
    }
  );
}
export {
  StatusBadge as S
};
