export type {
  Student,
  FeeStructure,
  Payment,
  StudentBalance,
  CollectionSummary,
  AgingBucket,
  AgingBucketDetail,
  PaymentMethodBreakdown,
  CreateStudentInput,
  UpdateStudentInput,
  CreateFeeStructureInput,
  UpdateFeeStructureInput,
  RecordPaymentInput,
  CsvStudentRow,
  ImportResult,
  ImportRowError,
  CollectionTrends,
} from "../api";

// Re-export enums with string values matching Spring Boot
export const FeePeriod = {
  MONTHLY: "MONTHLY",
  TERM: "TERM",
  SEMESTER: "SEMESTER",
  ANNUAL: "ANNUAL",
} as const;

export const PaymentMethod = {
  CASH: "CASH",
  CHECK: "CHECK",
  TRANSFER: "TRANSFER",
  ONLINE: "ONLINE",
} as const;

export const PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  PARTIAL: "PARTIAL",
  WAIVED: "WAIVED",
} as const;

// Frontend-specific convenience types derived from backend types
export type CsvImportError = {
  row: number;
  field: string;
  value: string;
  message: string;
};

export type CsvImportResult = {
  imported: number;
  errors: CsvImportError[];
};

export type AgingDetailItem = {
  studentName: string;
  studentId: string;
  feeStructureName: string;
  daysOverdue: number;
  amountDue: number;
  amountPaid: number;
};

export type CollectionTrend = {
  currentPeriodTotal: number;
  previousPeriodTotal: number;
  currentPeriodCount: number;
  previousPeriodCount: number;
};
