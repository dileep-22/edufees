import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Calendar, DollarSign, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Layout } from "../components/layout/Layout";
import {
  useCreateFeeStructure,
  useFeeStructure,
  useUpdateFeeStructure,
} from "../hooks/use-fee-structures";
import { FeePeriod } from "../types";

interface FormValues {
  name: string;
  description: string;
  amount: string;
  period: FeePeriod;
  startDate: string;
  endDate: string;
  dueDate: string;
  hasLatePenalty: boolean;
  latePenaltyType: "fixed" | "percentage";
  latePenaltyValue: string;
}

interface FormErrors {
  name?: string;
  amount?: string;
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  latePenaltyValue?: string;
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  description: "",
  amount: "",
  period: FeePeriod.annual,
  startDate: "",
  endDate: "",
  dueDate: "",
  hasLatePenalty: false,
  latePenaltyType: "fixed",
  latePenaltyValue: "",
};

function timestampToDateString(ts: string): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function dateStringToTimestamp(dateStr: string): string {
  return new Date(dateStr).toISOString();
}

function dollarsToCents(value: string): number {
  const num = Math.round(Number.parseFloat(value) * 100);
  return num;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!values.amount) {
    errors.amount = "Amount is required";
  } else if (Number.isNaN(Number(values.amount)) || Number(values.amount) < 0) {
    errors.amount = "Must be a valid non-negative amount";
  }
  if (!values.startDate) errors.startDate = "Start date is required";
  if (!values.endDate) {
    errors.endDate = "End date is required";
  } else if (
    values.startDate &&
    new Date(values.endDate) < new Date(values.startDate)
  ) {
    errors.endDate = "End date must be on or after start date";
  }
  if (!values.dueDate) errors.dueDate = "Due date is required";
  if (values.hasLatePenalty && !values.latePenaltyValue) {
    errors.latePenaltyValue = "Penalty value is required";
  } else if (
    values.hasLatePenalty &&
    (Number.isNaN(Number(values.latePenaltyValue)) ||
      Number(values.latePenaltyValue) < 0)
  ) {
    errors.latePenaltyValue = "Must be a valid non-negative value";
  }
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

export default function FeeStructureFormPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { id?: string };
  const isEditing = !!params.id && params.id !== "new";
  const feeId = isEditing ? BigInt(params.id!) : null;

  const { data: existing, isLoading: loadingExisting } = useFeeStructure(
    feeId ?? 0n,
  );
  const createMutation = useCreateFeeStructure();
  const updateMutation = useUpdateFeeStructure();

  const [values, setValues] = useState<FormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
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
        latePenaltyType:
          existing.latePenalty?.__kind__ === "percentage"
            ? "percentage"
            : "fixed",
        latePenaltyValue: existing.latePenalty
          ? (
              Number(
                existing.latePenalty.__kind__ === "fixed"
                  ? existing.latePenalty.fixed
                  : existing.latePenalty.percentage,
              ) / 100
            ).toFixed(2)
          : "",
      });
    }
  }, [existing, isEditing]);

  function setField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    try {
      const latePenalty =
        values.hasLatePenalty && values.latePenaltyValue
          ? values.latePenaltyType === "fixed"
            ? {
                __kind__: "fixed" as const,
                fixed: dollarsToCents(values.latePenaltyValue),
              }
            : {
                __kind__: "percentage" as const,
                percentage: BigInt(
                  Math.round(Number.parseFloat(values.latePenaltyValue) * 100),
                ),
              }
          : undefined;

      const base = {
        name: values.name,
        description: values.description,
        amount: dollarsToCents(values.amount),
        period: values.period,
        startDate: dateStringToTimestamp(values.startDate),
        endDate: dateStringToTimestamp(values.endDate),
        dueDate: dateStringToTimestamp(values.dueDate),
        latePenalty,
      };

      if (isEditing && feeId !== null) {
        await updateMutation.mutateAsync({ id: feeId, ...base });
        toast.success("Fee structure updated");
      } else {
        await createMutation.mutateAsync(base);
        toast.success("Fee structure created");
      }
      navigate({ to: "/fee-structures" });
    } catch {
      toast.error(
        isEditing
          ? "Failed to update fee structure"
          : "Failed to create fee structure",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEditing && loadingExisting) {
    return (
      <Layout>
        <div className="p-6 flex items-center justify-center min-h-64">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/fee-structures" })}
            data-ocid="back-button"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <PageHeader
            title={isEditing ? "Edit Fee Structure" : "New Fee Structure"}
            description={
              isEditing
                ? "Update the details for this fee structure"
                : "Define a new fee structure for your institution"
            }
            className="mb-0 flex-1"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Basic Info */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Annual Tuition Fee 2025"
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value)}
                  data-ocid="field-name"
                />
                <FieldError message={errors.name} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Optional description..."
                  rows={3}
                  value={values.description}
                  onChange={(e) => setField("description", e.target.value)}
                  data-ocid="field-description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <Input
                      id="amount"
                      placeholder="0.00"
                      className="pl-8"
                      type="number"
                      step="0.01"
                      min="0"
                      value={values.amount}
                      onChange={(e) => setField("amount", e.target.value)}
                      data-ocid="field-amount"
                    />
                  </div>
                  <FieldError message={errors.amount} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="period">Period</Label>
                  <Select
                    value={values.period}
                    onValueChange={(v) => setField("period", v as FeePeriod)}
                  >
                    <SelectTrigger id="period" data-ocid="field-period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={FeePeriod.annual}>Annual</SelectItem>
                      <SelectItem value={FeePeriod.semester}>
                        Semester
                      </SelectItem>
                      <SelectItem value={FeePeriod.term}>Term</SelectItem>
                      <SelectItem value={FeePeriod.monthly}>Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={values.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    data-ocid="field-start-date"
                  />
                  <FieldError message={errors.startDate} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={values.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    data-ocid="field-end-date"
                  />
                  <FieldError message={errors.endDate} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={values.dueDate}
                  onChange={(e) => setField("dueDate", e.target.value)}
                  data-ocid="field-due-date"
                />
                <p className="text-xs text-muted-foreground">
                  The date by which payment must be received
                </p>
                <FieldError message={errors.dueDate} />
              </div>
            </CardContent>
          </Card>

          {/* Late Penalty */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Late Penalty
                </CardTitle>
                <Switch
                  checked={values.hasLatePenalty}
                  onCheckedChange={(v) => setField("hasLatePenalty", v)}
                  data-ocid="toggle-late-penalty"
                />
              </div>
            </CardHeader>
            {values.hasLatePenalty ? (
              <CardContent className="space-y-4 border-t border-border pt-4">
                <div className="space-y-1.5">
                  <Label>Penalty Type</Label>
                  <div className="flex gap-2">
                    {(["fixed", "percentage"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setField("latePenaltyType", type)}
                        data-ocid={`penalty-type-${type}`}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium border transition-colors ${
                          values.latePenaltyType === type
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-foreground border-border hover:bg-secondary"
                        }`}
                      >
                        {type === "fixed" ? "Fixed Amount" : "Percentage"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="latePenaltyValue">
                    {values.latePenaltyType === "fixed"
                      ? "Penalty Amount"
                      : "Penalty Percentage"}
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                      {values.latePenaltyType === "fixed" ? "$" : "%"}
                    </span>
                    <Input
                      id="latePenaltyValue"
                      placeholder="0.00"
                      className="pl-7"
                      type="number"
                      step="0.01"
                      min="0"
                      value={values.latePenaltyValue}
                      onChange={(e) =>
                        setField("latePenaltyValue", e.target.value)
                      }
                      data-ocid="field-penalty-value"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {values.latePenaltyType === "fixed"
                      ? "Fixed dollar amount added when payment is late"
                      : "Percentage of the fee amount charged when payment is late"}
                  </p>
                  <FieldError message={errors.latePenaltyValue} />
                </div>
              </CardContent>
            ) : (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  No late penalty applied. Enable the toggle to add one.
                </p>
              </CardContent>
            )}
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/fee-structures" })}
              data-ocid="cancel-button"
            >
              Cancel
            </Button>
            <div className="flex items-center gap-2">
              {isEditing && (
                <Badge variant="secondary" className="text-xs">
                  Editing existing structure
                </Badge>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                data-ocid="submit-button"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditing ? "Save Changes" : "Create Fee Structure"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
