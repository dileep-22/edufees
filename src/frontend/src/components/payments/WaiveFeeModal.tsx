import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useWaiveFee } from "@/hooks/use-assignments";
import type { StudentBalance } from "@/types";
import { AlertTriangle, Loader2, ShieldOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const WAIVE_REASONS = [
  "Financial hardship",
  "Scholarship or bursary",
  "Administrative correction",
  "Duplicate charge",
  "Institutional discount",
  "Family bereavement",
  "Medical emergency",
  "Other",
];

interface WaiveFeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  balance: StudentBalance;
}

export function WaiveFeeModal({
  open,
  onOpenChange,
  balance,
}: WaiveFeeModalProps) {
  const { mutateAsync: waiveFee, isPending } = useWaiveFee();
  const [reason, setReason] = useState<string>("");
  const [customReason, setCustomReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const finalReason = reason === "Other" ? customReason.trim() : reason;

  function validate() {
    const errs: Record<string, string> = {};
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
        reason: finalReason,
      });
      toast.success("Fee waived successfully", {
        description: `${balance.feeStructureName} for ${balance.studentName} has been waived.`,
      });
      onOpenChange(false);
    } catch {
      toast.error("Failed to waive fee", {
        description: "Please try again.",
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md" data-ocid="waive-fee-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <ShieldOff className="w-4 h-4 text-muted-foreground" />
            Waive Fee
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Warning banner */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Waiving a fee marks it as permanently forgiven. This action cannot
              be undone.
            </p>
          </div>

          {/* Fee details */}
          <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground truncate">
                  {balance.studentName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {balance.feeStructureName}
                </p>
              </div>
              <StatusBadge status={balance.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Total Due
                </p>
                <CurrencyDisplay
                  amount={balance.totalAmount}
                  size="sm"
                  className="font-semibold"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Paid</p>
                <CurrencyDisplay
                  amount={balance.paidAmount}
                  size="sm"
                  className="text-emerald-600 font-semibold"
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Outstanding
                </p>
                <CurrencyDisplay
                  amount={balance.outstandingAmount}
                  size="sm"
                  className="text-amber-600 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Reason select */}
          <div className="space-y-1.5">
            <Label htmlFor="waive-reason" className="text-xs font-semibold">
              Reason for Waiver
            </Label>
            <Select
              value={reason}
              onValueChange={(v) => {
                setReason(v);
                setErrors((e) => ({ ...e, reason: "" }));
              }}
            >
              <SelectTrigger
                id="waive-reason"
                className="text-sm"
                aria-invalid={!!errors.reason}
                data-ocid="waive-reason-select"
              >
                <SelectValue placeholder="Select a reason…" />
              </SelectTrigger>
              <SelectContent>
                {WAIVE_REASONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.reason && (
              <p className="text-xs text-destructive">{errors.reason}</p>
            )}
          </div>

          {/* Custom reason */}
          {reason === "Other" && (
            <div className="space-y-1.5">
              <Label htmlFor="custom-reason" className="text-xs font-semibold">
                Describe the reason
              </Label>
              <Textarea
                id="custom-reason"
                placeholder="Explain why this fee is being waived…"
                value={customReason}
                onChange={(e) => {
                  setCustomReason(e.target.value);
                  setErrors((errs) => ({ ...errs, customReason: "" }));
                }}
                className="text-sm resize-none"
                rows={3}
                aria-invalid={!!errors.customReason}
                data-ocid="waive-custom-reason"
              />
              {errors.customReason && (
                <p className="text-xs text-destructive">
                  {errors.customReason}
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            data-ocid="waive-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending || !reason}
            className="gap-1.5 bg-amber-600 hover:bg-amber-700 text-white border-amber-600 hover:border-amber-700"
            data-ocid="waive-confirm-btn"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiving…
              </>
            ) : (
              <>
                <ShieldOff className="w-4 h-4" />
                Confirm Waiver
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
