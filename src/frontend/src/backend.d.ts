import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface StudentBalance {
    status: PaymentStatus;
    feeStructureName: string;
    studentId: StudentId;
    feeStructureId: FeeStructureId;
    studentName: string;
    penaltyAmount: bigint;
    dueDate: Timestamp;
    totalAmount: bigint;
    outstandingAmount: bigint;
    totalWithPenalty: bigint;
    paidAmount: bigint;
}
export interface CsvStudentRow {
    studentId: string;
    name: string;
    email: string;
    group: string;
}
export interface UpdateFeeStructureInput {
    id: FeeStructureId;
    endDate: Timestamp;
    period: FeePeriod;
    name: string;
    latePenalty?: LatePenalty;
    dueDate: Timestamp;
    description: string;
    amount: bigint;
    startDate: Timestamp;
}
export interface AgingBucket {
    count: bigint;
    totalAmount: bigint;
    bucket: string;
}
export interface ImportResult {
    imported: bigint;
    errors: Array<ImportRowError>;
}
export interface UpdateStudentInput {
    id: StudentId;
    studentId: string;
    name: string;
    email: string;
    group: string;
}
export interface FeeStructure {
    id: FeeStructureId;
    endDate: Timestamp;
    period: FeePeriod;
    name: string;
    createdAt: Timestamp;
    latePenalty?: LatePenalty;
    dueDate: Timestamp;
    description: string;
    updatedAt: Timestamp;
    amount: bigint;
    startDate: Timestamp;
}
export interface ImportRowError {
    row: bigint;
    field: string;
    value: string;
    message: string;
}
export type AssignmentId = bigint;
export interface CollectionTrends {
    previousPeriodTotal: bigint;
    previousPeriodCount: bigint;
    currentPeriodTotal: bigint;
    currentPeriodCount: bigint;
}
export interface CreateFeeStructureInput {
    endDate: Timestamp;
    period: FeePeriod;
    name: string;
    latePenalty?: LatePenalty;
    dueDate: Timestamp;
    description: string;
    amount: bigint;
    startDate: Timestamp;
}
export interface Student {
    id: StudentId;
    studentId: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    updatedAt: Timestamp;
    group: string;
}
export interface RecordPaymentInput {
    method: PaymentMethod;
    studentId: StudentId;
    feeStructureId: FeeStructureId;
    date: Timestamp;
    notes: string;
    amount: bigint;
    receiptNumber: string;
}
export interface PaymentMethodBreakdown {
    cash: bigint;
    check: bigint;
    transfer: bigint;
    online: bigint;
}
export interface CreateStudentInput {
    studentId: string;
    name: string;
    email: string;
    group: string;
}
export interface CollectionSummary {
    totalOverdue: bigint;
    totalCollected: bigint;
    totalOutstanding: bigint;
    totalWaived: bigint;
    totalOutstandingWithPenalty: bigint;
    paymentCount: bigint;
}
export type FeeStructureId = bigint;
export interface Payment {
    id: PaymentId;
    method: PaymentMethod;
    studentId: StudentId;
    feeStructureId: FeeStructureId;
    date: Timestamp;
    createdAt: Timestamp;
    notes: string;
    amount: bigint;
    receiptNumber: string;
}
export interface AgingBucketDetail {
    daysOverdue: bigint;
    feeStructureName: string;
    studentId: string;
    studentName: string;
    amountPaid: bigint;
    amountDue: bigint;
}
export type StudentId = bigint;
export type LatePenalty = {
    __kind__: "fixed";
    fixed: bigint;
} | {
    __kind__: "percentage";
    percentage: bigint;
};
export type PaymentId = bigint;
export interface FeeAssignment {
    id: AssignmentId;
    status: PaymentStatus;
    studentId: StudentId;
    feeStructureId: FeeStructureId;
    assignedAt: Timestamp;
    waivedReason?: string;
    updatedAt: Timestamp;
}
export enum FeePeriod {
    semester = "semester",
    term = "term",
    annual = "annual",
    monthly = "monthly"
}
export enum PaymentMethod {
    cash = "cash",
    check = "check",
    transfer = "transfer",
    online = "online"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    overdue = "overdue",
    waived = "waived",
    partial = "partial"
}
export enum RecordPaymentError {
    DuplicateReceipt = "DuplicateReceipt",
    NotFound = "NotFound"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignFeeToGroup(group: string, feeStructureId: FeeStructureId): Promise<Array<FeeAssignment>>;
    assignFeeToStudent(studentId: StudentId, feeStructureId: FeeStructureId): Promise<FeeAssignment>;
    bulkImportStudents(rows: Array<CsvStudentRow>): Promise<ImportResult>;
    checkReceiptExists(receiptNumber: string): Promise<boolean>;
    createFeeStructure(input: CreateFeeStructureInput): Promise<FeeStructure>;
    createStudent(input: CreateStudentInput): Promise<Student>;
    deleteFeeStructure(id: FeeStructureId): Promise<boolean>;
    deleteStudent(id: StudentId): Promise<boolean>;
    duplicateFeeStructure(id: FeeStructureId): Promise<FeeStructure | null>;
    getAgingReport(): Promise<Array<AgingBucket>>;
    getAgingReportDetail(bucketIndex: bigint): Promise<Array<AgingBucketDetail>>;
    getAllBalances(): Promise<Array<StudentBalance>>;
    getCallerUserRole(): Promise<UserRole>;
    getCollectionSummary(): Promise<CollectionSummary>;
    getCollectionTrends(): Promise<CollectionTrends>;
    getFeeStructure(id: FeeStructureId): Promise<FeeStructure | null>;
    getFeeStructureBalances(feeStructureId: FeeStructureId): Promise<Array<StudentBalance>>;
    getPaymentMethodBreakdown(): Promise<PaymentMethodBreakdown>;
    getPaymentsByDateRange(fromDate: Timestamp, toDate: Timestamp): Promise<Array<Payment>>;
    getStudent(id: StudentId): Promise<Student | null>;
    getStudentBalances(studentId: StudentId): Promise<Array<StudentBalance>>;
    isCallerAdmin(): Promise<boolean>;
    listFeeStructures(): Promise<Array<FeeStructure>>;
    listStudents(): Promise<Array<Student>>;
    listStudentsByGroup(group: string): Promise<Array<Student>>;
    recordPayment(input: RecordPaymentInput): Promise<{
        __kind__: "ok";
        ok: Payment;
    } | {
        __kind__: "err";
        err: RecordPaymentError;
    }>;
    unenrollStudent(studentId: StudentId, feeStructureId: FeeStructureId): Promise<boolean>;
    updateFeeStructure(input: UpdateFeeStructureInput): Promise<FeeStructure | null>;
    updateOverdueStatuses(): Promise<void>;
    updateStudent(input: UpdateStudentInput): Promise<Student | null>;
    waiveFee(studentId: StudentId, feeStructureId: FeeStructureId, reason: string): Promise<FeeAssignment | null>;
}
