import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFeeStructures } from "@/hooks/use-fee-structures";
import { useCheckReceiptExists, useRecordPayment } from "@/hooks/use-payments";
import { useStudents } from "@/hooks/use-students";
import { PaymentMethod } from "@/types";
import { AlertTriangle, Loader2, Receipt } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface RecordPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillStudentId?: bigint;
  prefillFeeStructureId?: bigint;
}

function generateReceiptNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `RCP-${year}${month}${day}-${rand}`;
}

export function RecordPaymentModal({
  open,
  onOpenChange,
  prefillStudentId,
  prefillFeeStructureId,
}: RecordPaymentModalProps) {
  const { data: students } = useStudents();
  const { data: feeStructures } = useFeeStructures();
  const { mutateAsync: recordPayment, isPending } = useRecordPayment();
  const checkReceiptExists = useCheckReceiptExists();

  const [studentSearch, setStudentSearch] = useState("");
  const [studentId, setStudentId] = useState<string>(
    prefillStudentId ? prefillStudentId.toString() : "",
  );
  const [feeStructureId, setFeeStructureId] = useState<string>(
    prefillFeeStructureId ? prefillFeeStructureId.toString() : "",
  );
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.cash);
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0],
  );
  const [notes, setNotes] = useState("");
  const [receiptNumber, setReceiptNumber] = useState(generateReceiptNumber);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receiptDuplicate, setReceiptDuplicate] = useState(false);
  const [receiptChecking, setReceiptChecking] = useState(false);

  // Debounce timer ref for receipt check
  const receiptCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setStudentId(prefillStudentId ? prefillStudentId.toString() : "");
      setFeeStructureId(
        prefillFeeStructureId ? prefillFeeStructureId.toString() : "",
      );
      setAmount("");
      setMethod(PaymentMethod.cash);
      setDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      setReceiptNumber(generateReceiptNumber());
      setErrors({});
      setStudentSearch("");
      setReceiptDuplicate(false);
      setReceiptChecking(false);
    }
  }, [open, prefillStudentId, prefillFeeStructureId]);

  // Debounced receipt check on value change
  function handleReceiptChange(value: string) {
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

  // Also check on blur for immediate feedback
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

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    const q = studentSearch.toLowerCase();
    if (!q) return students.slice(0, 20);
    return students
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q),
      )
      .slice(0, 20);
  }, [students, studentSearch]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!studentId) errs.studentId = "Select a student";
    if (!feeStructureId) errs.feeStructureId = "Select a fee structure";
    if (!amount || Number(amount) <= 0) errs.amount = "Enter a valid amount";
    if (!date) errs.date = "Select a date";
    if (!receiptNumber.trim()) errs.receiptNumber = "Receipt number required";
    return errs;
  }

  const isSubmitDisabled = isPending || receiptChecking || receiptDuplicate;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (receiptDuplicate) return;

    try {
      const dateTs = BigInt(new Date(date).getTime()) * 1_000_000n;
      const amountCents = BigInt(Math.round(Number(amount) * 100));
      await recordPayment({
        studentId: BigInt(studentId),
        feeStructureId: BigInt(feeStructureId),
        amount: amountCents,
        method,
        date: dateTs,
        notes,
        receiptNumber: receiptNumber.trim(),
      });
      toast.success("Payment recorded successfully", {
        description: `Receipt ${receiptNumber} issued`,
      });
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast.error("Failed to record payment", { description: message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" data-ocid="record-payment-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Receipt className="w-4 h-4 text-primary" />
            Record Payment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          {/* Student */}
          <div className="space-y-1.5">
            <Label htmlFor="student-search" className="text-xs font-semibold">
              Student
            </Label>
            <Input
              id="student-search"
              placeholder="Search by name or student ID…"
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setStudentId("");
              }}
              className="text-sm"
              data-ocid="student-search-input"
              aria-invalid={!!errors.studentId}
            />
            {studentSearch && !studentId && filteredStudents.length > 0 && (
              <div className="border border-border rounded-lg bg-card shadow-elevated max-h-44 overflow-y-auto mt-1">
                {filteredStudents.map((s) => (
                  <button
                    type="button"
                    key={s.id.toString()}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center justify-between"
                    onClick={() => {
                      setStudentId(s.id.toString());
                      setStudentSearch(s.name);
                      setErrors((e) => ({ ...e, studentId: "" }));
                    }}
                    data-ocid="student-option"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {s.studentId}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {errors.studentId && (
              <p className="text-xs text-destructive">{errors.studentId}</p>
            )}
          </div>

          {/* Fee Structure */}
          <div className="space-y-1.5">
            <Label htmlFor="fee-structure" className="text-xs font-semibold">
              Fee Structure
            </Label>
            <Select
              value={feeStructureId}
              onValueChange={(v) => {
                setFeeStructureId(v);
                setErrors((e) => ({ ...e, feeStructureId: "" }));
              }}
            >
              <SelectTrigger
                id="fee-structure"
                className="text-sm"
                aria-invalid={!!errors.feeStructureId}
                data-ocid="fee-structure-select"
              >
                <SelectValue placeholder="Select fee structure" />
              </SelectTrigger>
              <SelectContent>
                {(feeStructures ?? []).map((fs) => (
                  <SelectItem key={fs.id.toString()} value={fs.id.toString()}>
                    {fs.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.feeStructureId && (
              <p className="text-xs text-destructive">
                {errors.feeStructureId}
              </p>
            )}
          </div>

          {/* Amount + Method row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs font-semibold">
                Amount (USD)
              </Label>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors((errs) => ({ ...errs, amount: "" }));
                }}
                className="text-sm font-mono"
                aria-invalid={!!errors.amount}
                data-ocid="amount-input"
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="payment-method" className="text-xs font-semibold">
                Payment Method
              </Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
              >
                <SelectTrigger
                  id="payment-method"
                  className="text-sm"
                  data-ocid="method-select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.cash}>Cash</SelectItem>
                  <SelectItem value={PaymentMethod.check}>Check</SelectItem>
                  <SelectItem value={PaymentMethod.transfer}>
                    Bank Transfer
                  </SelectItem>
                  <SelectItem value={PaymentMethod.online}>Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date + Receipt row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="payment-date" className="text-xs font-semibold">
                Payment Date
              </Label>
              <Input
                id="payment-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setErrors((errs) => ({ ...errs, date: "" }));
                }}
                className="text-sm"
                aria-invalid={!!errors.date}
                data-ocid="payment-date-input"
              />
              {errors.date && (
                <p className="text-xs text-destructive">{errors.date}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="receipt-number" className="text-xs font-semibold">
                Receipt Number
              </Label>
              <div className="relative">
                <Input
                  id="receipt-number"
                  value={receiptNumber}
                  onChange={(e) => handleReceiptChange(e.target.value)}
                  onBlur={handleReceiptBlur}
                  className={`text-sm font-mono pr-7 ${receiptDuplicate ? "border-amber-400 focus-visible:ring-amber-300" : ""}`}
                  aria-invalid={!!errors.receiptNumber || receiptDuplicate}
                  data-ocid="receipt-number-input"
                />
                {receiptChecking && (
                  <Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
                )}
                {!receiptChecking && receiptDuplicate && (
                  <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
              {errors.receiptNumber && (
                <p className="text-xs text-destructive">
                  {errors.receiptNumber}
                </p>
              )}
              {receiptDuplicate && !errors.receiptNumber && (
                <div
                  className="flex items-start gap-1.5 mt-1 rounded-md bg-amber-50 border border-amber-200 px-2.5 py-2"
                  role="alert"
                  data-ocid="receipt-duplicate-warning"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-snug">
                    This receipt number has already been used. Please enter a
                    unique receipt number.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="payment-notes" className="text-xs font-semibold">
              Notes{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Textarea
              id="payment-notes"
              placeholder="Add any relevant notes about this payment…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-sm resize-none"
              rows={2}
              data-ocid="payment-notes-input"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              data-ocid="cancel-payment-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="gap-1.5"
              data-ocid="submit-payment-btn"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording…
                </>
              ) : receiptChecking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Checking…
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4" />
                  Record Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
