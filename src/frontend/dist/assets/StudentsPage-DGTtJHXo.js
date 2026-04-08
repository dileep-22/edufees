import { r as reactExports, j as jsxRuntimeExports, d as useNavigate } from "./index-JaIj-DYW.js";
import { u as ue, L as Layout, P as PageHeader, b as Badge, U as Users } from "./badge-Cou7lT_t.js";
import { D as DataTable, C as CurrencyDisplay } from "./DataTable-DNjVnD7Z.js";
import { B as Button } from "./button-BhNjEAR1.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-uSh9PWD4.js";
import { L as Label } from "./label-CVO_xGdb.js";
import { T as Textarea } from "./textarea-DR4fva3B.js";
import { b as useBulkImportStudents, a as useStudents, u as useAllBalances, c as useCreateStudent, d as useUpdateStudent, e as useDeleteStudent } from "./use-students-Cfl-MhrV.js";
import { c as createLucideIcon } from "./backend-BHrL9w1d.js";
import { C as CircleCheck } from "./circle-check-Cbfh-3nd.js";
import { C as CircleAlert } from "./circle-alert-C_68Qos-.js";
import { C as ConfirmDialog } from "./ConfirmDialog-Ct8oKSNX.js";
import { E as EmptyState } from "./EmptyState-BnnMgztL.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-j9vFOIPS.js";
import { D as DropdownMenu, a as DropdownMenuTrigger, E as Ellipsis, b as DropdownMenuContent, c as DropdownMenuItem, d as DropdownMenuSeparator, T as Trash2 } from "./dropdown-menu-B9x0_x5p.js";
import { I as Input } from "./input-D1sNoo9F.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BDSf899r.js";
import { a as useAssignFeeToGroup } from "./use-assignments-DAVqeI1f.js";
import { u as useFeeStructures } from "./use-fee-structures-FAYFZaAD.js";
import { P as Plus } from "./index-YYemiEJn.js";
import "./Combination-99tTHa6i.js";
import "./index-CO6Xcq0I.js";
import "./index-B5VWj3Iz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$3);
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function parseCsv(raw) {
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { rows: [], parseErrors: [] };
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes("name") || firstLine.includes("studentid") || firstLine.includes("student_id") || firstLine.includes("email");
  const dataLines = hasHeader ? lines.slice(1) : lines;
  const rows = [];
  const parseErrors = [];
  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const cols = line.split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const errors = [];
    const name = cols[0] ?? "";
    const studentId = cols[1] ?? "";
    const email = cols[2] ?? "";
    const group = cols[3] ?? "";
    if (!name) errors.push("Name required");
    if (!studentId) errors.push("Student ID required");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.push("Invalid email");
    if (errors.length === 0 || name || studentId) {
      rows.push({
        name,
        studentId,
        email,
        group,
        _rowNum: i + 1 + (hasHeader ? 1 : 0),
        _errors: errors
      });
    } else {
      parseErrors.push(`Row ${i + 1}: ${errors.join(", ")}`);
    }
  }
  return { rows, parseErrors };
}
const previewColumns = [
  {
    key: "row",
    header: "#",
    className: "w-10 text-right text-muted-foreground text-xs",
    render: (r) => r._rowNum
  },
  {
    key: "name",
    header: "Name",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: r._errors.some((e) => e.includes("Name")) ? "text-destructive" : "",
        children: r.name || "—"
      }
    )
  },
  {
    key: "studentId",
    header: "Student ID",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `font-mono text-xs ${r._errors.some((e) => e.includes("Student ID")) ? "text-destructive" : "text-muted-foreground"}`,
        children: r.studentId || "—"
      }
    )
  },
  {
    key: "email",
    header: "Email",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: r._errors.some((e) => e.includes("email")) ? "text-destructive" : "text-muted-foreground",
        children: r.email || "—"
      }
    )
  },
  {
    key: "group",
    header: "Group",
    render: (r) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: r.group || "—" })
  },
  {
    key: "status",
    header: "",
    render: (r) => r._errors.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-destructive", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
      r._errors[0]
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-emerald-500" })
  }
];
const SAMPLE_CSV = `name,studentId,email,group
Alice Johnson,STU-001,alice@school.edu,Year 1
Bob Smith,STU-002,bob@school.edu,Year 1
Carol White,STU-003,carol@school.edu,Year 2`;
function CsvImportModal({
  open,
  onOpenChange
}) {
  const [csvText, setCsvText] = reactExports.useState("");
  const [preview, setPreview] = reactExports.useState([]);
  const [parseErrors, setParseErrors] = reactExports.useState([]);
  const [successCount, setSuccessCount] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const bulkImport = useBulkImportStudents();
  const handleParse = () => {
    const { rows, parseErrors: errs } = parseCsv(csvText);
    setPreview(rows);
    setParseErrors(errs);
    setSuccessCount(null);
  };
  const handleFileUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      var _a2;
      const text = (_a2 = ev.target) == null ? void 0 : _a2.result;
      setCsvText(text);
      const { rows, parseErrors: errs } = parseCsv(text);
      setPreview(rows);
      setParseErrors(errs);
      setSuccessCount(null);
    };
    reader.readAsText(file);
  };
  const validRows = preview.filter((r) => r._errors.length === 0);
  const handleImport = () => {
    if (validRows.length === 0) return;
    const payload = validRows.map(({ name, studentId, email, group }) => ({
      name,
      studentId,
      email,
      group
    }));
    bulkImport.mutate(payload, {
      onSuccess: (imported) => {
        setSuccessCount(imported.length);
        ue.success(
          `${imported.length} student${imported.length !== 1 ? "s" : ""} imported`
        );
        setCsvText("");
        setPreview([]);
        setParseErrors([]);
      },
      onError: () => ue.error("Import failed — please try again")
    });
  };
  const handleClose = (v) => {
    if (!v) {
      setCsvText("");
      setPreview([]);
      setParseErrors([]);
      setSuccessCount(null);
    }
    onOpenChange(v);
  };
  const isPreviewing = preview.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-[680px] max-h-[90vh] flex flex-col",
      "data-ocid": "csv-import-dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "font-display flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          " Import Students via CSV"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto space-y-4 py-2", children: successCount !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-10 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-12 h-12 text-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-lg font-display font-semibold text-foreground", children: [
            successCount,
            " student",
            successCount !== 1 ? "s" : "",
            " imported"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Students are now available in the student list." })
        ] }) : !isPreviewing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-dashed border-border p-4 bg-secondary/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2", children: "Expected format" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-xs font-mono text-muted-foreground whitespace-pre-wrap", children: SAMPLE_CSV })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: ".csv,.txt",
                className: "hidden",
                onChange: handleFileUpload,
                "data-ocid": "csv-file-input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                size: "sm",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                "data-ocid": "csv-upload-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5 mr-1.5" }),
                  " Upload file"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "or paste CSV below" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "csv-textarea", children: "CSV Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "csv-textarea",
                placeholder: "Paste CSV data here…",
                className: "font-mono text-xs h-36 resize-none",
                value: csvText,
                onChange: (e) => setCsvText(e.target.value),
                "data-ocid": "csv-textarea"
              }
            )
          ] }),
          parseErrors.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md bg-destructive/10 border border-destructive/20 p-3 space-y-1", children: parseErrors.map((err) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: err }, err)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: validRows.length }),
              " ",
              "valid row",
              validRows.length !== 1 ? "s" : "",
              preview.length - validRows.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive", children: [
                " ",
                "· ",
                preview.length - validRows.length,
                " with errors (will be skipped)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "ghost",
                size: "sm",
                onClick: () => {
                  setPreview([]);
                  setParseErrors([]);
                },
                "data-ocid": "csv-back-btn",
                children: "Edit CSV"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DataTable,
            {
              columns: previewColumns,
              data: preview,
              keyExtractor: (r) => `${r._rowNum}-${r.studentId}`,
              className: "max-h-72 overflow-y-auto"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "border-t border-border pt-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => handleClose(false),
              children: "Close"
            }
          ),
          successCount !== null ? null : !isPreviewing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: !csvText.trim(),
              onClick: handleParse,
              "data-ocid": "csv-preview-btn",
              children: "Preview import"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: bulkImport.isPending || validRows.length === 0,
              onClick: handleImport,
              "data-ocid": "csv-confirm-import-btn",
              children: bulkImport.isPending ? "Importing…" : `Import ${validRows.length} student${validRows.length !== 1 ? "s" : ""}`
            }
          )
        ] })
      ]
    }
  ) });
}
const emptyForm = {
  name: "",
  studentId: "",
  email: "",
  group: ""
};
function StudentFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
  isLoading,
  title
}) {
  const [form, setForm] = reactExports.useState(initial);
  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleOpenChange = (v) => {
    if (v) setForm(initial);
    onOpenChange(v);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: handleOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-[460px]",
      "data-ocid": "student-form-dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-name", children: "Full Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "sf-name",
                placeholder: "Jane Doe",
                value: form.name,
                onChange: field("name"),
                "data-ocid": "student-name-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-sid", children: "Student ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "sf-sid",
                placeholder: "STU-2024-001",
                value: form.studentId,
                onChange: field("studentId"),
                "data-ocid": "student-id-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-email", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "sf-email",
                type: "email",
                placeholder: "jane@school.edu",
                value: form.email,
                onChange: field("email"),
                "data-ocid": "student-email-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "sf-group", children: "Group / Cohort" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "sf-group",
                placeholder: "e.g. Class A, Year 2",
                value: form.group,
                onChange: field("group"),
                "data-ocid": "student-group-input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: isLoading || !form.name.trim() || !form.studentId.trim(),
              onClick: () => onSave(form),
              "data-ocid": "student-form-submit",
              children: isLoading ? "Saving…" : "Save student"
            }
          )
        ] })
      ]
    }
  ) });
}
function GroupAssignModal({
  open,
  onOpenChange
}) {
  const [group, setGroup] = reactExports.useState("");
  const [feeId, setFeeId] = reactExports.useState("");
  const { data: feeStructures = [] } = useFeeStructures();
  const assign = useAssignFeeToGroup();
  const handleSubmit = () => {
    if (!group.trim() || !feeId) return;
    assign.mutate(
      { group: group.trim(), feeStructureId: BigInt(feeId) },
      {
        onSuccess: (results) => {
          ue.success(
            `Assigned fee to ${results.length} student(s) in group "${group}"`
          );
          onOpenChange(false);
          setGroup("");
          setFeeId("");
        },
        onError: () => ue.error("Failed to assign fee to group")
      }
    );
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "sm:max-w-[420px]",
      "data-ocid": "group-assign-dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "font-display", children: "Assign Fee to Group" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ga-group", children: "Group / Cohort Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "ga-group",
                placeholder: "e.g. Year 2",
                value: group,
                onChange: (e) => setGroup(e.target.value),
                "data-ocid": "group-name-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ga-fee", children: "Fee Structure" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: feeId, onValueChange: setFeeId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "ga-fee", "data-ocid": "group-fee-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a fee structure…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: feeStructures.map((fs) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: fs.id.toString(), children: fs.name }, fs.id.toString())) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => onOpenChange(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              disabled: assign.isPending || !group.trim() || !feeId,
              onClick: handleSubmit,
              "data-ocid": "group-assign-submit",
              children: assign.isPending ? "Assigning…" : "Assign to group"
            }
          )
        ] })
      ]
    }
  ) });
}
function StudentsPage() {
  const navigate = useNavigate();
  const { data: students = [], isLoading } = useStudents();
  const { data: allBalances = [] } = useAllBalances();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const [search, setSearch] = reactExports.useState("");
  const [groupFilter, setGroupFilter] = reactExports.useState("all");
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editTarget, setEditTarget] = reactExports.useState(null);
  const [deleteTarget, setDeleteTarget] = reactExports.useState(null);
  const [csvOpen, setCsvOpen] = reactExports.useState(false);
  const [groupAssignOpen, setGroupAssignOpen] = reactExports.useState(false);
  const outstandingMap = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const b of allBalances) {
      const key = b.studentId.toString();
      map.set(key, (map.get(key) ?? 0n) + b.outstandingAmount);
    }
    return map;
  }, [allBalances]);
  const groups = reactExports.useMemo(() => {
    const set = new Set(students.map((s) => s.group).filter(Boolean));
    return Array.from(set).sort();
  }, [students]);
  const filtered = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    return students.filter((s) => {
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.group.toLowerCase().includes(q);
      const matchGroup = groupFilter === "all" || s.group === groupFilter;
      return matchSearch && matchGroup;
    });
  }, [students, search, groupFilter]);
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: s.name })
    },
    {
      key: "studentId",
      header: "Student ID",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm text-muted-foreground", children: s.studentId })
    },
    {
      key: "email",
      header: "Email",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: s.email })
    },
    {
      key: "group",
      header: "Group",
      render: (s) => s.group ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-xs", children: s.group }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" })
    },
    {
      key: "outstanding",
      header: "Outstanding",
      headerClassName: "text-right",
      className: "text-right",
      render: (s) => {
        const amt = outstandingMap.get(s.id.toString()) ?? 0n;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          CurrencyDisplay,
          {
            amount: amt,
            size: "sm",
            className: amt > 0n ? "text-destructive" : "text-muted-foreground"
          }
        );
      }
    },
    {
      key: "actions",
      header: "",
      className: "w-12 text-right",
      render: (s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8",
            "aria-label": "Student actions",
            "data-ocid": "student-row-actions",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "w-4 h-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: () => navigate({ to: `/students/${s.id}` }),
              "data-ocid": "student-view",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5 mr-2" }),
                " View details"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              onClick: () => setEditTarget(s),
              "data-ocid": "student-edit",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "w-3.5 h-3.5 mr-2" }),
                " Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            DropdownMenuItem,
            {
              className: "text-destructive focus:text-destructive",
              onClick: () => setDeleteTarget(s),
              "data-ocid": "student-delete",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5 mr-2" }),
                " Delete"
              ]
            }
          )
        ] })
      ] })
    }
  ];
  const handleAdd = (form) => {
    createStudent.mutate(form, {
      onSuccess: () => {
        ue.success("Student added");
        setAddOpen(false);
      },
      onError: () => ue.error("Failed to add student")
    });
  };
  const handleEdit = (form) => {
    if (!editTarget) return;
    updateStudent.mutate(
      { id: editTarget.id, ...form },
      {
        onSuccess: () => {
          ue.success("Student updated");
          setEditTarget(null);
        },
        onError: () => ue.error("Failed to update student")
      }
    );
  };
  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteStudent.mutate(deleteTarget.id, {
      onSuccess: () => {
        ue.success("Student deleted");
        setDeleteTarget(null);
      },
      onError: () => ue.error("Failed to delete student")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        PageHeader,
        {
          title: "Students",
          description: `${students.length} student${students.length !== 1 ? "s" : ""} enrolled`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setCsvOpen(true),
                "data-ocid": "import-csv-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                  " Import CSV"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: () => setGroupAssignOpen(true),
                "data-ocid": "group-assign-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4 mr-2" }),
                  " Assign to Group"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                onClick: () => setAddOpen(true),
                "data-ocid": "add-student-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
                  " Add Student"
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "shadow-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "All Students" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
            groups.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: groupFilter, onValueChange: setGroupFilter, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs w-36",
                  "data-ocid": "group-filter",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All groups" }),
                groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: g, children: g }, g))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                className: "h-8 text-xs pl-3 w-48",
                placeholder: "Search students…",
                value: search,
                onChange: (e) => setSearch(e.target.value),
                "data-ocid": "student-search"
              }
            ) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          DataTable,
          {
            columns,
            data: filtered,
            keyExtractor: (s) => s.id.toString(),
            isLoading,
            className: "border-0 rounded-none",
            onRowClick: (s) => navigate({ to: `/students/${s.id}` }),
            emptyState: /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmptyState,
              {
                icon: UserPlus,
                title: "No students found",
                description: search ? "Try adjusting your search query." : "Add a student or import via CSV to get started.",
                action: !search ? {
                  label: "Add student",
                  onClick: () => setAddOpen(true)
                } : void 0
              }
            )
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudentFormDialog,
      {
        open: addOpen,
        onOpenChange: setAddOpen,
        initial: emptyForm,
        onSave: handleAdd,
        isLoading: createStudent.isPending,
        title: "Add Student"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StudentFormDialog,
      {
        open: !!editTarget,
        onOpenChange: (v) => {
          if (!v) setEditTarget(null);
        },
        initial: editTarget ? {
          name: editTarget.name,
          studentId: editTarget.studentId,
          email: editTarget.email,
          group: editTarget.group
        } : emptyForm,
        onSave: handleEdit,
        isLoading: updateStudent.isPending,
        title: "Edit Student"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConfirmDialog,
      {
        open: !!deleteTarget,
        onOpenChange: (v) => {
          if (!v) setDeleteTarget(null);
        },
        title: "Delete student?",
        description: `This will permanently remove "${deleteTarget == null ? void 0 : deleteTarget.name}" and all their fee assignments. This action cannot be undone.`,
        confirmLabel: "Delete student",
        onConfirm: handleDelete,
        variant: "destructive"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CsvImportModal, { open: csvOpen, onOpenChange: setCsvOpen }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      GroupAssignModal,
      {
        open: groupAssignOpen,
        onOpenChange: setGroupAssignOpen
      }
    )
  ] });
}
export {
  StudentsPage as default
};
