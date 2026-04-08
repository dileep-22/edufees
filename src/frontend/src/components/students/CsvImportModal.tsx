import type { Column } from "@/components/ui/DataTable";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBulkImportStudents } from "@/hooks/use-students";
import type { CsvStudentRow, ImportRowError } from "@/types";
import { AlertCircle, CheckCircle2, Upload, XCircle } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

type ParsedRow = CsvStudentRow & { _rowNum: number; _errors: string[] };

type ImportOutcome = {
  imported: number;
  errors: ImportRowError[];
};

function parseCsv(raw: string): { rows: ParsedRow[]; parseErrors: string[] } {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return { rows: [], parseErrors: [] };

  // Detect header row
  const firstLine = lines[0].toLowerCase();
  const hasHeader =
    firstLine.includes("name") ||
    firstLine.includes("studentid") ||
    firstLine.includes("student_id") ||
    firstLine.includes("email");
  const dataLines = hasHeader ? lines.slice(1) : lines;

  const rows: ParsedRow[] = [];
  const parseErrors: string[] = [];

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];
    const cols = line
      .split(",")
      .map((c) => c.trim().replace(/^["']|["']$/g, ""));
    const errors: string[] = [];

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
        _errors: errors,
      });
    } else {
      parseErrors.push(`Row ${i + 1}: ${errors.join(", ")}`);
    }
  }

  return { rows, parseErrors };
}

const previewColumns: Column<ParsedRow>[] = [
  {
    key: "row",
    header: "#",
    className: "w-10 text-right text-muted-foreground text-xs",
    render: (r) => r._rowNum,
  },
  {
    key: "name",
    header: "Name",
    render: (r) => (
      <span
        className={
          r._errors.some((e) => e.includes("Name")) ? "text-destructive" : ""
        }
      >
        {r.name || "—"}
      </span>
    ),
  },
  {
    key: "studentId",
    header: "Student ID",
    render: (r) => (
      <span
        className={`font-mono text-xs ${r._errors.some((e) => e.includes("Student ID")) ? "text-destructive" : "text-muted-foreground"}`}
      >
        {r.studentId || "—"}
      </span>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (r) => (
      <span
        className={
          r._errors.some((e) => e.includes("email"))
            ? "text-destructive"
            : "text-muted-foreground"
        }
      >
        {r.email || "—"}
      </span>
    ),
  },
  {
    key: "group",
    header: "Group",
    render: (r) => (
      <span className="text-muted-foreground">{r.group || "—"}</span>
    ),
  },
  {
    key: "status",
    header: "",
    render: (r) =>
      r._errors.length > 0 ? (
        <span className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5" />
          {r._errors[0]}
        </span>
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      ),
  },
];

const SAMPLE_CSV = `name,studentId,email,group
Alice Johnson,STU-001,alice@school.edu,Year 1
Bob Smith,STU-002,bob@school.edu,Year 1
Carol White,STU-003,carol@school.edu,Year 2`;

function ImportResultView({
  outcome,
  onClose,
}: { outcome: ImportOutcome; onClose: () => void }) {
  const hasErrors = outcome.errors.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary banner */}
      <div
        className={`flex items-start gap-3 rounded-lg p-4 ${
          hasErrors
            ? "bg-amber-50 border border-amber-200"
            : "bg-emerald-50 border border-emerald-200"
        }`}
        data-ocid="import-result-banner"
      >
        {hasErrors ? (
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div>
          <p
            className={`font-semibold text-sm ${hasErrors ? "text-amber-800" : "text-emerald-800"}`}
          >
            {hasErrors
              ? `${outcome.imported} row${outcome.imported !== 1 ? "s" : ""} imported successfully, ${outcome.errors.length} row${outcome.errors.length !== 1 ? "s" : ""} had errors`
              : `All ${outcome.imported} student${outcome.imported !== 1 ? "s" : ""} imported successfully`}
          </p>
          {hasErrors && (
            <p className="text-xs text-amber-700 mt-0.5">
              Valid rows were imported. The rows below were rejected by the
              server.
            </p>
          )}
        </div>
      </div>

      {/* Error table */}
      {hasErrors && (
        <div className="rounded-lg border border-destructive/20 overflow-hidden">
          <div className="bg-destructive/5 px-3 py-2 border-b border-destructive/20 flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-xs font-semibold text-destructive uppercase tracking-wide">
              Import Errors ({outcome.errors.length})
            </span>
          </div>
          <div className="overflow-x-auto max-h-56 overflow-y-auto">
            <table className="w-full text-xs" data-ocid="import-error-table">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-14">
                    Row #
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground w-24">
                    Field
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                    Value
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                    Error
                  </th>
                </tr>
              </thead>
              <tbody>
                {outcome.errors.map((err) => (
                  <tr
                    key={`${Number(err.row)}-${err.field}`}
                    className="border-b border-destructive/10 bg-destructive/5 hover:bg-destructive/10 transition-colors"
                    data-ocid="import-error-row"
                  >
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-destructive/15 text-destructive font-bold">
                        {Number(err.row)}
                      </span>
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {err.field || "—"}
                    </td>
                    <td className="px-3 py-2 font-mono text-foreground max-w-[120px] truncate">
                      {err.value || "—"}
                    </td>
                    <td className="px-3 py-2 text-destructive">
                      {err.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" onClick={onClose} data-ocid="import-done-btn">
          Done
        </Button>
      </div>
    </div>
  );
}

export function CsvImportModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [csvText, setCsvText] = useState("");
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [importOutcome, setImportOutcome] = useState<ImportOutcome | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkImport = useBulkImportStudents();

  const handleParse = () => {
    const { rows, parseErrors: errs } = parseCsv(csvText);
    setPreview(rows);
    setParseErrors(errs);
    setImportOutcome(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setCsvText(text);
      const { rows, parseErrors: errs } = parseCsv(text);
      setPreview(rows);
      setParseErrors(errs);
      setImportOutcome(null);
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
      group,
    }));
    bulkImport.mutate(payload, {
      onSuccess: (result) => {
        const count = Number(result.imported);
        const errors = result.errors ?? [];
        setImportOutcome({ imported: count, errors });
        setPreview([]);
        setParseErrors([]);
        setCsvText("");
        if (errors.length === 0) {
          toast.success(`${count} student${count !== 1 ? "s" : ""} imported`);
        } else {
          toast.warning(`${count} imported, ${errors.length} had errors`);
        }
      },
      onError: () => toast.error("Import failed — please try again"),
    });
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      setCsvText("");
      setPreview([]);
      setParseErrors([]);
      setImportOutcome(null);
    }
    onOpenChange(v);
  };

  const isPreviewing = preview.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[700px] max-h-[90vh] flex flex-col"
        data-ocid="csv-import-dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import Students via CSV
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-2">
          {importOutcome !== null ? (
            <ImportResultView
              outcome={importOutcome}
              onClose={() => handleClose(false)}
            />
          ) : !isPreviewing ? (
            <>
              <div className="rounded-lg border border-dashed border-border p-4 bg-secondary/40">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Expected format
                </p>
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {SAMPLE_CSV}
                </pre>
              </div>

              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                  data-ocid="csv-file-input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="csv-upload-btn"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload file
                </Button>
                <span className="text-xs text-muted-foreground">
                  or paste CSV below
                </span>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="csv-textarea">CSV Data</Label>
                <Textarea
                  id="csv-textarea"
                  placeholder="Paste CSV data here…"
                  className="font-mono text-xs h-36 resize-none"
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  data-ocid="csv-textarea"
                />
              </div>

              {parseErrors.length > 0 && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 space-y-1">
                  {parseErrors.map((err) => (
                    <p key={err} className="text-xs text-destructive">
                      {err}
                    </p>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {validRows.length}
                  </span>{" "}
                  valid row{validRows.length !== 1 ? "s" : ""}
                  {preview.length - validRows.length > 0 && (
                    <span className="text-destructive">
                      {" "}
                      · {preview.length - validRows.length} with errors (will be
                      skipped)
                    </span>
                  )}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPreview([]);
                    setParseErrors([]);
                  }}
                  data-ocid="csv-back-btn"
                >
                  Edit CSV
                </Button>
              </div>
              <DataTable
                columns={previewColumns}
                data={preview}
                keyExtractor={(r) => `${r._rowNum}-${r.studentId}`}
                className="max-h-72 overflow-y-auto"
              />
            </>
          )}
        </div>

        {importOutcome === null && (
          <DialogFooter className="border-t border-border pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Close
            </Button>
            {!isPreviewing ? (
              <Button
                type="button"
                disabled={!csvText.trim()}
                onClick={handleParse}
                data-ocid="csv-preview-btn"
              >
                Preview import
              </Button>
            ) : (
              <Button
                type="button"
                disabled={bulkImport.isPending || validRows.length === 0}
                onClick={handleImport}
                data-ocid="csv-confirm-import-btn"
              >
                {bulkImport.isPending
                  ? "Importing…"
                  : `Import ${validRows.length} student${validRows.length !== 1 ? "s" : ""}`}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
