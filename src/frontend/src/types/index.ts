export type {
  FeeStructure,
  FeeStructureId,
  Student,
  StudentId,
  Payment,
  PaymentId,
  FeeAssignment,
  AssignmentId,
  CollectionSummary,
  StudentBalance,
  AgingBucket,
  AgingBucketDetail,
  PaymentMethodBreakdown,
  CreateFeeStructureInput,
  UpdateFeeStructureInput,
  CreateStudentInput,
  UpdateStudentInput,
  RecordPaymentInput,
  CsvStudentRow,
  LatePenalty,
  Timestamp,
  CollectionTrends,
  ImportResult,
  ImportRowError,
} from "../backend";
export {
  FeePeriod,
  PaymentMethod,
  PaymentStatus,
  RecordPaymentError,
} from "../backend";

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
  amountDue: bigint;
  amountPaid: bigint;
};

export type CollectionTrend = {
  currentPeriodTotal: bigint;
  previousPeriodTotal: bigint;
  currentPeriodCount: number;
  previousPeriodCount: number;
};
