import { r as reactExports, j as jsxRuntimeExports, c as cn, b as useNavigate, e as useParams } from "./index-Bb6f_FCk.js";
import { L as Layout, P as PageHeader, d as Badge, u as ue } from "./badge-BagwGDur.js";
import { c as createLucideIcon, e as useComposedRefs, F as FeePeriod, B as Button } from "./backend-CvGl-pMz.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Qs2UClye.js";
import { I as Input } from "./input-ZgbirZVl.js";
import { L as Label } from "./label-Cpv5MIfx.js";
import { u as usePrevious, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ds_eZocB.js";
import { a as useControllableState, P as Primitive, c as composeEventHandlers, r as useSize, d as createContextScope } from "./Combination-BTsKCupS.js";
import { T as Textarea } from "./textarea-DRJ5mr63.js";
import { c as useFeeStructure, d as useCreateFeeStructure, e as useUpdateFeeStructure } from "./use-fee-structures-BrXYBxzF.js";
import { L as LoaderCircle } from "./loader-circle-D_lEcbKH.js";
import { A as ArrowLeft } from "./arrow-left-50EjHvfm.js";
import { D as DollarSign } from "./dollar-sign-BmdwyjNJ.js";
import { C as Calendar } from "./calendar-DPhCqocg.js";
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
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const DEFAULT_VALUES = {
  name: "",
  description: "",
  amount: "",
  period: FeePeriod.annual,
  startDate: "",
  endDate: "",
  dueDate: "",
  hasLatePenalty: false,
  latePenaltyType: "fixed",
  latePenaltyValue: ""
};
function timestampToDateString(ts) {
  const ms = Number(ts / 1000000n);
  return new Date(ms).toISOString().slice(0, 10);
}
function dateStringToTimestamp(dateStr) {
  return BigInt(new Date(dateStr).getTime()) * 1000000n;
}
function dollarsToCents(value) {
  const num = Math.round(Number.parseFloat(value) * 100);
  return BigInt(num);
}
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.amount) {
    errors.amount = "Amount is required";
  } else if (Number.isNaN(Number(values.amount)) || Number(values.amount) < 0) {
    errors.amount = "Must be a valid non-negative amount";
  }
  if (!values.startDate) errors.startDate = "Start date is required";
  if (!values.endDate) {
    errors.endDate = "End date is required";
  } else if (values.startDate && new Date(values.endDate) < new Date(values.startDate)) {
    errors.endDate = "End date must be on or after start date";
  }
  if (!values.dueDate) errors.dueDate = "Due date is required";
  if (values.hasLatePenalty && !values.latePenaltyValue) {
    errors.latePenaltyValue = "Penalty value is required";
  } else if (values.hasLatePenalty && (Number.isNaN(Number(values.latePenaltyValue)) || Number(values.latePenaltyValue) < 0)) {
    errors.latePenaltyValue = "Must be a valid non-negative value";
  }
  return errors;
}
function FieldError({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive mt-1", children: message });
}
function FeeStructureFormPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const isEditing = !!params.id && params.id !== "new";
  const feeId = isEditing ? BigInt(params.id) : null;
  const { data: existing, isLoading: loadingExisting } = useFeeStructure(
    feeId ?? 0n
  );
  const createMutation = useCreateFeeStructure();
  const updateMutation = useUpdateFeeStructure();
  const [values, setValues] = reactExports.useState(DEFAULT_VALUES);
  const [errors, setErrors] = reactExports.useState({});
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    var _a;
    if (isEditing && existing) {
      setValues({
        name: existing.name,
        description: existing.description,
        amount: (Number(existing.amount) / 100).toFixed(2),
        period: existing.period,
        startDate: timestampToDateString(existing.startDate),
        endDate: timestampToDateString(existing.endDate),
        dueDate: timestampToDateString(existing.dueDate),
        hasLatePenalty: !!existing.latePenalty,
        latePenaltyType: ((_a = existing.latePenalty) == null ? void 0 : _a.__kind__) === "percentage" ? "percentage" : "fixed",
        latePenaltyValue: existing.latePenalty ? (Number(
          existing.latePenalty.__kind__ === "fixed" ? existing.latePenalty.fixed : existing.latePenalty.percentage
        ) / 100).toFixed(2) : ""
      });
    }
  }, [existing, isEditing]);
  function setField(key, value) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: void 0 }));
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      const latePenalty = values.hasLatePenalty && values.latePenaltyValue ? values.latePenaltyType === "fixed" ? {
        __kind__: "fixed",
        fixed: dollarsToCents(values.latePenaltyValue)
      } : {
        __kind__: "percentage",
        percentage: BigInt(
          Math.round(Number.parseFloat(values.latePenaltyValue) * 100)
        )
      } : void 0;
      const base = {
        name: values.name,
        description: values.description,
        amount: dollarsToCents(values.amount),
        period: values.period,
        startDate: dateStringToTimestamp(values.startDate),
        endDate: dateStringToTimestamp(values.endDate),
        dueDate: dateStringToTimestamp(values.dueDate),
        latePenalty
      };
      if (isEditing && feeId !== null) {
        await updateMutation.mutateAsync({ id: feeId, ...base });
        ue.success("Fee structure updated");
      } else {
        await createMutation.mutateAsync(base);
        ue.success("Fee structure created");
      }
      navigate({ to: "/fee-structures" });
    } catch {
      ue.error(
        isEditing ? "Failed to update fee structure" : "Failed to create fee structure"
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  if (isEditing && loadingExisting) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 flex items-center justify-center min-h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-muted-foreground" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        PageHeader,
        {
          title: isEditing ? "Edit Fee Structure" : "New Fee Structure",
          description: isEditing ? "Update the details for this fee structure" : "Define a new fee structure for your institution",
          className: "mb-0 flex-1"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", noValidate: true, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Basic Information" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "name",
                placeholder: "e.g. Annual Tuition Fee 2025",
                value: values.name,
                onChange: (e) => setField("name", e.target.value),
                "data-ocid": "field-name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "description",
                placeholder: "Optional description...",
                rows: 3,
                value: values.description,
                onChange: (e) => setField("description", e.target.value),
                "data-ocid": "field-description"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", children: "Amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "amount",
                    placeholder: "0.00",
                    className: "pl-8",
                    type: "number",
                    step: "0.01",
                    min: "0",
                    value: values.amount,
                    onChange: (e) => setField("amount", e.target.value),
                    "data-ocid": "field-amount"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.amount })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "period", children: "Period" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: values.period,
                  onValueChange: (v) => setField("period", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "period", "data-ocid": "field-period", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select period" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FeePeriod.annual, children: "Annual" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FeePeriod.semester, children: "Semester" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FeePeriod.term, children: "Term" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: FeePeriod.monthly, children: "Monthly" })
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-4 h-4" }),
          "Dates"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "startDate", children: "Start Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "startDate",
                  type: "date",
                  value: values.startDate,
                  onChange: (e) => setField("startDate", e.target.value),
                  "data-ocid": "field-start-date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.startDate })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "endDate", children: "End Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "endDate",
                  type: "date",
                  value: values.endDate,
                  onChange: (e) => setField("endDate", e.target.value),
                  "data-ocid": "field-end-date"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.endDate })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dueDate", children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "dueDate",
                type: "date",
                value: values.dueDate,
                onChange: (e) => setField("dueDate", e.target.value),
                "data-ocid": "field-due-date"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "The date by which payment must be received" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.dueDate })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Late Penalty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              checked: values.hasLatePenalty,
              onCheckedChange: (v) => setField("hasLatePenalty", v),
              "data-ocid": "toggle-late-penalty"
            }
          )
        ] }) }),
        values.hasLatePenalty ? /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 border-t border-border pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Penalty Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["fixed", "percentage"].map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setField("latePenaltyType", type),
                "data-ocid": `penalty-type-${type}`,
                className: `flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors ${values.latePenaltyType === type ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground border-border hover:bg-secondary"}`,
                children: type === "fixed" ? "Fixed Amount" : "Percentage"
              },
              type
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "latePenaltyValue", children: values.latePenaltyType === "fixed" ? "Penalty Amount" : "Penalty Percentage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none", children: values.latePenaltyType === "fixed" ? "$" : "%" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "latePenaltyValue",
                  placeholder: "0.00",
                  className: "pl-7",
                  type: "number",
                  step: "0.01",
                  min: "0",
                  value: values.latePenaltyValue,
                  onChange: (e) => setField("latePenaltyValue", e.target.value),
                  "data-ocid": "field-penalty-value"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: values.latePenaltyType === "fixed" ? "Fixed dollar amount added when payment is late" : "Percentage of the fee amount charged when payment is late" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FieldError, { message: errors.latePenaltyValue })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No late penalty applied. Enable the toggle to add one." }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: () => navigate({ to: "/fee-structures" }),
            "data-ocid": "cancel-button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          isEditing && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: "Editing existing structure" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: isSubmitting,
              "data-ocid": "submit-button",
              children: [
                isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2" }),
                isEditing ? "Save Changes" : "Create Fee Structure"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  FeeStructureFormPage as default
};
