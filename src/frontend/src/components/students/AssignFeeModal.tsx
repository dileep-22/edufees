import { CurrencyDisplay } from "@/components/ui/CurrencyDisplay";
import { Badge } from "@/components/ui/badge";
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
import { useAssignFeeToStudent } from "@/hooks/use-assignments";
import { useFeeStructures } from "@/hooks/use-fee-structures";
import type { FeeStructureId } from "@/types";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AssignFeeModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  studentId: bigint;
  existingFeeIds?: FeeStructureId[];
}

export function AssignFeeModal({
  open,
  onOpenChange,
  studentId,
  existingFeeIds = [],
}: AssignFeeModalProps) {
  const [selectedId, setSelectedId] = useState("");
  const { data: feeStructures = [], isLoading } = useFeeStructures();
  const assignFee = useAssignFeeToStudent();

  const existingSet = new Set(existingFeeIds.map((id) => id.toString()));
  const available = feeStructures.filter(
    (fs) => !existingSet.has(fs.id.toString()),
  );
  const selectedFs = feeStructures.find(
    (fs) => fs.id.toString() === selectedId,
  );

  const handleSubmit = () => {
    if (!selectedId) return;
    assignFee.mutate(
      { studentId, feeStructureId: BigInt(selectedId) },
      {
        onSuccess: () => {
          toast.success(`Fee "${selectedFs?.name}" assigned`);
          setSelectedId("");
          onOpenChange(false);
        },
        onError: () => toast.error("Failed to assign fee"),
      },
    );
  };

  const handleClose = (v: boolean) => {
    if (!v) setSelectedId("");
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px]" data-ocid="assign-fee-dialog">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Assign Fee Structure
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="af-select">Fee Structure</Label>
            {isLoading ? (
              <div className="h-9 rounded-md bg-secondary animate-pulse" />
            ) : available.length === 0 ? (
              <div className="rounded-md border border-border bg-secondary/40 p-3 text-sm text-muted-foreground">
                All available fee structures are already assigned to this
                student.
              </div>
            ) : (
              <Select value={selectedId} onValueChange={setSelectedId}>
                <SelectTrigger id="af-select" data-ocid="fee-structure-select">
                  <SelectValue placeholder="Choose a fee structure…" />
                </SelectTrigger>
                <SelectContent>
                  {available.map((fs) => (
                    <SelectItem key={fs.id.toString()} value={fs.id.toString()}>
                      {fs.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {selectedFs && (
            <div className="rounded-lg border border-border bg-secondary/40 p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {selectedFs.name}
              </p>
              {selectedFs.description && (
                <p className="text-xs text-muted-foreground">
                  {selectedFs.description}
                </p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Amount
                  </p>
                  <CurrencyDisplay amount={selectedFs.amount} size="sm" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Period
                  </p>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {selectedFs.period}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                    Due
                  </p>
                  <p className="text-xs text-foreground">
                    {new Date(
                      Number(selectedFs.dueDate) / 1_000_000,
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleClose(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              assignFee.isPending || !selectedId || available.length === 0
            }
            onClick={handleSubmit}
            data-ocid="assign-fee-submit"
          >
            {assignFee.isPending ? "Assigning…" : "Assign fee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
