import { r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-Bb6f_FCk.js";
import { R as Receipt, u as ue, L as Layout, P as PageHeader } from "./badge-BagwGDur.js";
import { c as createLucideIcon, b as PaymentMethod, B as Button, P as PaymentStatus } from "./backend-CvGl-pMz.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, X } from "./dialog-Dt1rluZ7.js";
import { I as Input } from "./input-ZgbirZVl.js";
import { L as Label } from "./label-Cpv5MIfx.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ds_eZocB.js";
import { T as Textarea } from "./textarea-DRJ5mr63.js";
import { u as useFeeStructures } from "./use-fee-structures-BrXYBxzF.js";
import { f as useRecordPayment, g as useCheckReceiptExists, d as usePayments, u as useCollectionSummary } from "./use-payments-9ZgJc-fZ.js";
import { a as useStudents, u as useAllBalances } from "./use-students-DOaJ0Z6A.js";
import { L as LoaderCircle } from "./loader-circle-D_lEcbKH.js";
import { T as TriangleAlert } from "./triangle-alert-DUFo1xgG.js";
import { C as CurrencyDisplay, D as DataTable, E as EmptyState } from "./EmptyState-CA2NJPcu.js";
import { S as StatusBadge } from "./StatusBadge-CM3TyK-N.js";
import { u as useWaiveFee } from "./use-assignments-DnGPXMwb.js";
import { C as Card, c as CardContent } from "./card-Qs2UClye.js";
import { D as Download } from "./download-ChpOcbOK.js";
import { P as Plus } from "./index-CKCQw2RY.js";
import { S as Search } from "./search-DRGzNiPY.js";
import { T as TrendingDown } from "./trending-down-ZNKMG5l1.js";
import { C as CircleAlert } from "./circle-alert-Cp9yoInL.js";
import "./Combination-BTsKCupS.js";
import "./index-BaoaRZan.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
      key: "1jlk70"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
      key: "18rp1v"
    }
  ]
];
const ShieldOff = createLucideIcon("shield-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
function generateReceiptNumber() {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9e3) + 1e3;
  return `RCP-${year}${month}${day}-${rand}`;
}
function RecordPaymentModal({
  open,
  onOpenChange,
  prefillStudentId,
  prefillFeeStructureId
}) {
  const { data: students } = useStudents();
  const { data: feeStructures } = useFeeStructures();
  const { mutateAsync: recordPayment, isPending } = useRecordPayment();
  const checkReceiptExists = useCheckReceiptExists();
  const [studentSearch, setStudentSearch] = reactExports.useState("");
  const [studentId, setStudentId] = reactExports.useState(
    prefillStudentId ? prefillStudentId.toString() : ""
  );
  const [feeStructureId, setFeeStructureId] = reactExports.useState(
    prefillFeeStructureId ? prefillFeeStructureId.toString() : ""
  );
  const [amount, setAmount] = reactExports.useState("");
  const [method, setMethod] = reactExports.useState(PaymentMethod.cash);
  const [date, setDate] = reactExports.useState(
    () => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  );
  const [notes, setNotes] = reactExports.useState("");
  const [receiptNumber, setReceiptNumber] = reactExports.useState(generateReceiptNumber);
  const [errors, setErrors] = reactExports.useState({});
  const [receiptDuplicate, setReceiptDuplicate] = reactExports.useState(false);
  const [receiptChecking, setReceiptChecking] = reactExports.useState(false);
  const receiptCheckTimer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (open) {
      setStudentId(prefillStudentId ? prefillStudentId.toString() : "");
      setFeeStructureId(
        prefillFeeStructureId ? prefillFeeStructureId.toString() : ""
      );
      setAmount("");
      setMethod(PaymentMethod.cash);
      setDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
      setNotes("");
      setReceiptNumber(generateReceiptNumber());
      setErrors({});
      setStudentSearch("");
      setReceiptDuplicate(false);
      setReceiptChecking(false);
    }
  }, [open, prefillStudentId, prefillFeeStructureId]);
  function handleReceiptChange(value) {
    setReceiptNumber(value);
    setErrors((errs) => ({ ...errs, receiptNumber: "" }));
    setReceiptDuplicate(false);
    if (receiptCheckTimer.current) clearTimeout(receiptCheckTimer.current);
    if (!value.trim()) return;
    setReceiptChecking(true);
    receiptCheckTimer.current = setTimeout(async () => {
      try {
        const exists = await checkReceiptExists(value.trim());
        setReceiptDuplicate(exists);
      } finally {
        setReceiptChecking(false);
      }
    }, 500);
  }
  async function handleReceiptBlur() {
    if (!receiptNumber.trim()) return;
    if (receiptCheckTimer.current) {
      clearTimeout(receiptCheckTimer.current);
      receiptCheckTimer.current = null;
    }
    setReceiptChecking(true);
    try {
      const exists = await checkReceiptExists(receiptNumber.trim());
      setReceiptDuplicate(exists);
    } finally {
      setReceiptChecking(false);
    }
  }
  const filteredStudents = reactExports.useMemo(() => {
    if (!students) return [];
    const q = studentSearch.toLowerCase();
    if (!q) return students.slice(0, 20);
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [students, studentSearch]);
  function validate() {
    const errs = {};
    if (!studentId) errs.studentId = "Select a student";
    if (!feeStructureId) errs.feeStructureId = "Select a fee structure";
    if (!amount || Number(amount) <= 0) errs.amount = "Enter a valid amount";
    if (!date) errs.date = "Select a date";
    if (!receiptNumber.trim()) errs.receiptNumber = "Receipt number required";
    return errs;
  }
  const isSubmitDisabled = isPending || receiptChecking || receiptDuplicate;
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (receiptDuplicate) return;
    try {
      const dateTs = BigInt(new Date(date).getTime()) * 1000000n;
      const amountCents = BigInt(Math.round(Number(amount) * 100));
      await recordPayment({
        studentId: BigInt(studentId),
        feeStructureId: BigInt(feeStructureId),
        amount: amountCents,
        method,
        date: dateTs,
        notes,
        receiptNumber: receiptNumber.trim()
      });
      ue.success("Payment recorded successfully", {
        description: `Receipt ${receiptNumber} issued`
      });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again.";
      ue.error("Failed to record payment", { description: message });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", "data-ocid": "record-payment-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 font-display", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-4 h-4 text-primary" }),
      "Record Payment"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "student-search", className: "text-xs font-semibold", children: "Student" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "student-search",
            placeholder: "Search by name or student ID…",
            value: studentSearch,
            onChange: (e) => {
              setStudentSearch(e.target.value);
              setStudentId("");
            },
            className: "text-sm",
            "data-ocid": "student-search-input",
            "aria-invalid": !!errors.studentId
          }
        ),
        studentSearch && !studentId && filteredStudents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg bg-card shadow-elevated max-h-44 overflow-y-auto mt-1", children: filteredStudents.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center justify-between",
            onClick: () => {
              setStudentId(s.id.toString());
              setStudentSearch(s.name);
              setErrors((e) => ({ ...e, studentId: "" }));
            },
            "data-ocid": "student-option",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: s.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: s.studentId })
            ]
          },
          s.id.toString()
        )) }),
        errors.studentId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.studentId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fee-structure", className: "text-xs font-semibold", children: "Fee Structure" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: feeStructureId,
            onValueChange: (v) => {
              setFeeStructureId(v);
              setErrors((e) => ({ ...e, feeStructureId: "" }));
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "fee-structure",
                  className: "text-sm",
                  "aria-invalid": !!errors.feeStructureId,
                  "data-ocid": "fee-structure-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select fee structure" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (feeStructures ?? []).map((fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: fs.id.toString(), children: fs.name }, fs.id.toString())) })
            ]
          }
        ),
        errors.feeStructureId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.feeStructureId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", className: "text-xs font-semibold", children: "Amount (USD)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "amount",
              type: "number",
              min: "0.01",
              step: "0.01",
              placeholder: "0.00",
              value: amount,
              onChange: (e) => {
                setAmount(e.target.value);
                setErrors((errs) => ({ ...errs, amount: "" }));
              },
              className: "text-sm font-mono",
              "aria-invalid": !!errors.amount,
              "data-ocid": "amount-input"
            }
          ),
          errors.amount && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.amount })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payment-method", className: "text-xs font-semibold", children: "Payment Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: method,
              onValueChange: (v) => setMethod(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    id: "payment-method",
                    className: "text-sm",
                    "data-ocid": "method-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.cash, children: "Cash" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.check, children: "Check" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.transfer, children: "Bank Transfer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.online, children: "Online" })
                ] })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "payment-date", className: "text-xs font-semibold", children: "Payment Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "payment-date",
              type: "date",
              value: date,
              onChange: (e) => {
                setDate(e.target.value);
                setErrors((errs) => ({ ...errs, date: "" }));
              },
              className: "text-sm",
              "aria-invalid": !!errors.date,
              "data-ocid": "payment-date-input"
            }
          ),
          errors.date && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.date })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "receipt-number", className: "text-xs font-semibold", children: "Receipt Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "receipt-number",
                value: receiptNumber,
                onChange: (e) => handleReceiptChange(e.target.value),
                onBlur: handleReceiptBlur,
                className: `text-sm font-mono pr-7 ${receiptDuplicate ? "border-amber-400 focus-visible:ring-amber-300" : ""}`,
                "aria-invalid": !!errors.receiptNumber || receiptDuplicate,
                "data-ocid": "receipt-number-input"
              }
            ),
            receiptChecking && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" }),
            !receiptChecking && receiptDuplicate && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" })
          ] }),
          errors.receiptNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.receiptNumber }),
          receiptDuplicate && !errors.receiptNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-1.5 mt-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-2",
              role: "alert",
              "data-ocid": "receipt-duplicate-warning",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800 leading-snug", children: "This receipt number has already been used. Please enter a unique receipt number." })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "payment-notes", className: "text-xs font-semibold", children: [
          "Notes",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "payment-notes",
            placeholder: "Add any relevant notes about this payment…",
            value: notes,
            onChange: (e) => setNotes(e.target.value),
            className: "text-sm resize-none",
            rows: 2,
            "data-ocid": "payment-notes-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => onOpenChange(false),
            "data-ocid": "cancel-payment-btn",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isSubmitDisabled,
            className: "gap-1.5",
            "data-ocid": "submit-payment-btn",
            children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Recording…"
            ] }) : receiptChecking ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
              "Checking…"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "w-4 h-4" }),
              "Record Payment"
            ] })
          }
        )
      ] })
    ] })
  ] }) });
}
const WAIVE_REASONS = [
  "Financial hardship",
  "Scholarship or bursary",
  "Administrative correction",
  "Duplicate charge",
  "Institutional discount",
  "Family bereavement",
  "Medical emergency",
  "Other"
];
function WaiveFeeModal({
  open,
  onOpenChange,
  balance
}) {
  const { mutateAsync: waiveFee, isPending } = useWaiveFee();
  const [reason, setReason] = reactExports.useState("");
  const [customReason, setCustomReason] = reactExports.useState("");
  const [errors, setErrors] = reactExports.useState({});
  const finalReason = reason === "Other" ? customReason.trim() : reason;
  function validate() {
    const errs = {};
    if (!reason) errs.reason = "Select a reason";
    if (reason === "Other" && !customReason.trim())
      errs.customReason = "Provide a custom reason";
    return errs;
  }
  async function handleConfirm() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await waiveFee({
        studentId: balance.studentId,
        feeStructureId: balance.feeStructureId,
        reason: finalReason
      });
      ue.success("Fee waived successfully", {
        description: `${balance.feeStructureName} for ${balance.studentName} has been waived.`
      });
      onOpenChange(false);
    } catch {
      ue.error("Failed to waive fee", {
        description: "Please try again."
      });
    }
  }
  function handleClose() {
    if (!isPending) {
      setReason("");
      setCustomReason("");
      setErrors({});
      onOpenChange(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", "data-ocid": "waive-fee-modal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 font-display", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-4 h-4 text-muted-foreground" }),
      "Waive Fee"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-amber-600 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-800 leading-relaxed", children: "Waiving a fee marks it as permanently forgiven. This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-secondary/40 p-4 space-y-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: balance.studentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: balance.feeStructureName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: balance.status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 pt-1 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Total Due" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: balance.totalAmount,
                size: "sm",
                className: "font-semibold"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Paid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: balance.paidAmount,
                size: "sm",
                className: "text-emerald-600 font-semibold"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: "Outstanding" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CurrencyDisplay,
              {
                amount: balance.outstandingAmount,
                size: "sm",
                className: "text-amber-600 font-semibold"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "waive-reason", className: "text-xs font-semibold", children: "Reason for Waiver" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: reason,
            onValueChange: (v) => {
              setReason(v);
              setErrors((e) => ({ ...e, reason: "" }));
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "waive-reason",
                  className: "text-sm",
                  "aria-invalid": !!errors.reason,
                  "data-ocid": "waive-reason-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a reason…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: WAIVE_REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
            ]
          }
        ),
        errors.reason && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.reason })
      ] }),
      reason === "Other" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "custom-reason", className: "text-xs font-semibold", children: "Describe the reason" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "custom-reason",
            placeholder: "Explain why this fee is being waived…",
            value: customReason,
            onChange: (e) => {
              setCustomReason(e.target.value);
              setErrors((errs) => ({ ...errs, customReason: "" }));
            },
            className: "text-sm resize-none",
            rows: 3,
            "aria-invalid": !!errors.customReason,
            "data-ocid": "waive-custom-reason"
          }
        ),
        errors.customReason && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.customReason })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: handleClose,
          disabled: isPending,
          "data-ocid": "waive-cancel-btn",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          onClick: handleConfirm,
          disabled: isPending || !reason,
          className: "gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-amber-600 hover:border-amber-700",
          "data-ocid": "waive-confirm-btn",
          children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
            "Waiving…"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "w-4 h-4" }),
            "Confirm Waiver"
          ] })
        }
      )
    ] })
  ] }) });
}
const PAYMENT_METHOD_LABELS = {
  [PaymentMethod.cash]: "Cash",
  [PaymentMethod.check]: "Check",
  [PaymentMethod.transfer]: "Bank Transfer",
  [PaymentMethod.online]: "Online"
};
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function OutstandingBanner({ isLoading }) {
  const { data: summary } = useCollectionSummary();
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-xl mb-4" });
  if (!summary) return null;
  const outstanding = summary.totalOutstanding;
  if (outstanding === 0n) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-4 h-4 text-amber-600" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-amber-800", children: "Outstanding Balance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CurrencyDisplay,
          {
            amount: outstanding,
            size: "sm",
            className: "text-amber-800 font-semibold"
          }
        ),
        " ",
        "remaining across all student-fee pairs"
      ] })
    ] })
  ] });
}
function SummaryStrip({ isLoading }) {
  const { data: summary } = useCollectionSummary();
  const items = [
    {
      label: "Collected",
      amount: (summary == null ? void 0 : summary.totalCollected) ?? 0n,
      color: "text-emerald-600"
    },
    {
      label: "Outstanding",
      amount: (summary == null ? void 0 : summary.totalOutstanding) ?? 0n,
      color: "text-amber-600"
    },
    {
      label: "Overdue",
      amount: (summary == null ? void 0 : summary.totalOverdue) ?? 0n,
      color: "text-destructive"
    },
    {
      label: "Waived",
      amount: (summary == null ? void 0 : summary.totalWaived) ?? 0n,
      color: "text-muted-foreground"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5", children: items.map(({ label, amount, color }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1", children: label }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount, size: "lg", className: color })
  ] }) }, label)) });
}
function PaymentsPage() {
  const [tab, setTab] = reactExports.useState("balances");
  const [recordOpen, setRecordOpen] = reactExports.useState(false);
  const [recordTarget, setRecordTarget] = reactExports.useState(null);
  const [waiveTarget, setWaiveTarget] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [methodFilter, setMethodFilter] = reactExports.useState("all");
  const [feeTypeFilter, setFeeTypeFilter] = reactExports.useState("all");
  const now = BigInt(Date.now()) * 1000000n;
  const ninetyDaysAgo = now - BigInt(90 * 24 * 60 * 60) * 1000000000n;
  const [fromDate] = reactExports.useState(ninetyDaysAgo);
  const [toDate] = reactExports.useState(now);
  const { data: payments, isLoading: paymentsLoading } = usePayments(
    fromDate,
    toDate
  );
  const { data: balances, isLoading: balancesLoading } = useAllBalances();
  const { isLoading: summaryLoading } = useCollectionSummary();
  const uniqueFeeNames = reactExports.useMemo(() => {
    const names = /* @__PURE__ */ new Set();
    for (const b of balances ?? []) {
      names.add(b.feeStructureName);
    }
    return Array.from(names).sort();
  }, [balances]);
  const filteredPayments = reactExports.useMemo(() => {
    return (payments ?? []).filter((p) => {
      const matchSearch = !searchQuery || p.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) || p.notes.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMethod = methodFilter === "all" || p.method === methodFilter;
      return matchSearch && matchMethod;
    });
  }, [payments, searchQuery, methodFilter]);
  const filteredBalances = reactExports.useMemo(() => {
    return (balances ?? []).filter((b) => {
      const matchSearch = !searchQuery || b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || b.feeStructureName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || b.status === statusFilter;
      const matchFeeType = feeTypeFilter === "all" || b.feeStructureName === feeTypeFilter;
      return matchSearch && matchStatus && matchFeeType;
    });
  }, [balances, searchQuery, statusFilter, feeTypeFilter]);
  const totalOutstanding = reactExports.useMemo(() => {
    return filteredBalances.reduce((sum, b) => sum + b.outstandingAmount, 0n);
  }, [filteredBalances]);
  const hasFilters = searchQuery || statusFilter !== "all" || methodFilter !== "all" || feeTypeFilter !== "all";
  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setMethodFilter("all");
    setFeeTypeFilter("all");
  }
  const paymentColumns = [
    {
      key: "receipt",
      header: "Receipt #",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold text-primary", children: row.receiptNumber })
    },
    {
      key: "date",
      header: "Date",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: formatDate(row.date) })
    },
    {
      key: "amount",
      header: "Amount",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: row.amount,
          size: "sm",
          className: "font-semibold"
        }
      ),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "method",
      header: "Method",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-foreground border border-border", children: PAYMENT_METHOD_LABELS[row.method] ?? row.method })
    },
    {
      key: "notes",
      header: "Notes",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs truncate max-w-[160px] block", children: row.notes || "—" })
    }
  ];
  const balanceColumns = [
    {
      key: "student",
      header: "Student Name",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: row.studentName })
    },
    {
      key: "feeStructure",
      header: "Fee Structure",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm", children: row.feeStructureName })
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: formatDate(row.dueDate) })
    },
    {
      key: "total",
      header: "Total Due",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(CurrencyDisplay, { amount: row.totalAmount, size: "sm" }),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "paid",
      header: "Paid",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: row.paidAmount,
          size: "sm",
          className: "text-emerald-600"
        }
      ),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "outstanding",
      header: "Balance",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        CurrencyDisplay,
        {
          amount: row.outstandingAmount,
          size: "sm",
          className: row.outstandingAmount > 0n ? "text-amber-600 font-semibold" : "text-muted-foreground"
        }
      ),
      headerClassName: "text-right",
      className: "text-right"
    },
    {
      key: "status",
      header: "Status",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: row.status })
    },
    {
      key: "actions",
      header: "",
      render: (row) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 justify-end", children: row.status !== PaymentStatus.waived && row.status !== PaymentStatus.paid && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "default",
            className: "h-7 px-2.5 text-xs",
            "data-ocid": "record-payment-btn",
            onClick: (e) => {
              e.stopPropagation();
              setRecordTarget(row);
              setRecordOpen(true);
            },
            children: "Record Payment"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "ghost",
            className: "h-7 px-2 text-xs text-muted-foreground hover:text-foreground",
            "data-ocid": "waive-fee-btn",
            onClick: (e) => {
              e.stopPropagation();
              setWaiveTarget(row);
            },
            children: "Waive"
          }
        )
      ] }) }),
      headerClassName: "text-right"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PageHeader,
      {
        title: "Payments",
        description: "Track fee collections and manage payment records",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              className: "gap-1.5",
              "data-ocid": "export-payments-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                "Export"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              className: "gap-1.5",
              onClick: () => {
                setRecordTarget(null);
                setRecordOpen(true);
              },
              "data-ocid": "record-payment-cta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Record Payment"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryStrip, { isLoading: summaryLoading }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OutstandingBanner, { isLoading: balancesLoading }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-1 bg-secondary rounded-lg p-1 w-fit mb-5",
        "data-ocid": "payments-tab",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setTab("balances"),
              className: `px-4 py-1.5 rounded-md text-sm font-medium transition-smooth ${tab === "balances" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`,
              "data-ocid": "tab-balances",
              children: "Fee Balances"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setTab("payments"),
              className: `px-4 py-1.5 rounded-md text-sm font-medium transition-smooth ${tab === "payments" ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"}`,
              "data-ocid": "tab-payments",
              children: "Payment History"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-muted-foreground shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: tab === "balances" ? "Search students or fee structures…" : "Search receipts or notes…",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "h-8 border-0 shadow-none bg-transparent focus-visible:ring-0 p-0 text-sm",
            "data-ocid": "payments-search"
          }
        )
      ] }),
      tab === "balances" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: statusFilter,
              onValueChange: setStatusFilter,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs w-[130px]",
                    "data-ocid": "filter-status",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All statuses" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.pending, children: "Pending" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.partial, children: "Partial" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.paid, children: "Paid" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.overdue, children: "Overdue" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentStatus.waived, children: "Waived" })
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: feeTypeFilter,
            onValueChange: setFeeTypeFilter,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs w-[160px]",
                  "data-ocid": "filter-fee-type",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All fee types" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All fee types" }),
                uniqueFeeNames.map((name) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: name, children: name }, name))
              ] })
            ]
          }
        )
      ] }),
      tab === "payments" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: methodFilter, onValueChange: setMethodFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "h-8 text-xs w-[140px]",
            "data-ocid": "filter-method",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All methods" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All methods" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.cash, children: "Cash" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.check, children: "Check" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.transfer, children: "Bank Transfer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: PaymentMethod.online, children: "Online" })
        ] })
      ] }),
      hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "ghost",
          size: "sm",
          className: "h-8 px-2 gap-1 text-xs text-muted-foreground",
          onClick: clearFilters,
          "data-ocid": "clear-filters-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }),
            "Clear"
          ]
        }
      )
    ] }) }) }),
    tab === "balances" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      filteredBalances.length > 0 && !balancesLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          filteredBalances.length,
          " record",
          filteredBalances.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-3.5 h-3.5" }),
          "Running outstanding:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CurrencyDisplay,
            {
              amount: totalOutstanding,
              size: "sm",
              className: "font-semibold text-foreground"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns: balanceColumns,
          data: filteredBalances,
          keyExtractor: (row) => `${row.studentId}-${row.feeStructureId}`,
          isLoading: balancesLoading,
          emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Wallet,
              title: "No fee balances found",
              description: hasFilters ? "Try adjusting your filters to see more results." : "Assign fees to students to start tracking balances.",
              action: hasFilters ? { label: "Clear filters", onClick: clearFilters } : void 0
            }
          ),
          className: "border-0 rounded-none"
        }
      ) }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      filteredPayments.length > 0 && !paymentsLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          filteredPayments.length,
          " payment",
          filteredPayments.length !== 1 ? "s" : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          "Total:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CurrencyDisplay,
            {
              amount: filteredPayments.reduce((s, p) => s + p.amount, 0n),
              size: "sm",
              className: "font-semibold text-foreground"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        DataTable,
        {
          columns: paymentColumns,
          data: filteredPayments,
          keyExtractor: (row) => row.id.toString(),
          isLoading: paymentsLoading,
          emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Receipt,
              title: "No payments recorded",
              description: hasFilters ? "No payments match your filters. Try adjusting the date range or method filter." : "Record the first payment to get started.",
              action: !hasFilters ? {
                label: "Record Payment",
                onClick: () => {
                  setRecordTarget(null);
                  setRecordOpen(true);
                }
              } : { label: "Clear filters", onClick: clearFilters }
            }
          ),
          className: "border-0 rounded-none"
        }
      ) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RecordPaymentModal,
      {
        open: recordOpen,
        onOpenChange: (open) => {
          setRecordOpen(open);
          if (!open) setRecordTarget(null);
        },
        prefillStudentId: recordTarget == null ? void 0 : recordTarget.studentId,
        prefillFeeStructureId: recordTarget == null ? void 0 : recordTarget.feeStructureId
      }
    ),
    waiveTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      WaiveFeeModal,
      {
        open: !!waiveTarget,
        onOpenChange: (open) => {
          if (!open) setWaiveTarget(null);
        },
        balance: waiveTarget
      }
    )
  ] }) });
}
export {
  PaymentsPage as default
};
