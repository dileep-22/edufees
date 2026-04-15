// API service for Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Types matching Spring Boot DTOs
export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  group: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: number;
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  period: 'MONTHLY' | 'TERM' | 'SEMESTER' | 'ANNUAL';
  latePenalty?: {
    type: 'FIXED' | 'PERCENTAGE';
    value: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: number;
  amount: number;
  date: string;
  receiptNumber: string;
  method: 'CASH' | 'CHECK' | 'TRANSFER' | 'ONLINE';
  notes: string;
  studentId: number;
  feeStructureId: number;
  createdAt: string;
}

export interface StudentBalance {
  studentId: number;
  studentName: string;
  feeStructureId: number;
  feeStructureName: string;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  penaltyAmount: number;
  totalWithPenalty: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL' | 'WAIVED';
}

export interface CollectionSummary {
  totalCollected: number;
  totalOutstanding: number;
  totalOverdue: number;
  totalWaived: number;
  totalOutstandingWithPenalty: number;
  paymentCount: number;
}

export interface AgingBucket {
  bucket: string;
  count: number;
  totalAmount: number;
}

export interface AgingBucketDetail {
  studentId: string;
  studentName: string;
  feeStructureName: string;
  daysOverdue: number;
  amountDue: number;
  amountPaid: number;
}

export interface PaymentMethodBreakdown {
  cash: number;
  check: number;
  transfer: number;
  online: number;
}

export interface CollectionTrends {
  currentPeriodTotal: number;
  previousPeriodTotal: number;
  currentPeriodCount: number;
  previousPeriodCount: number;
}

// Input DTOs
export interface CreateStudentInput {
  studentId: string;
  name: string;
  email: string;
  group: string;
}

export interface UpdateStudentInput {
  id: number;
  studentId: string;
  name: string;
  email: string;
  group: string;
}

export interface CreateFeeStructureInput {
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  period: 'MONTHLY' | 'TERM' | 'SEMESTER' | 'ANNUAL';
  latePenalty?: {
    type: 'FIXED' | 'PERCENTAGE';
    value: number;
  };
}

export interface UpdateFeeStructureInput {
  id: number;
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  dueDate: string;
  period: 'MONTHLY' | 'TERM' | 'SEMESTER' | 'ANNUAL';
  latePenalty?: {
    type: 'FIXED' | 'PERCENTAGE';
    value: number;
  };
}

export interface RecordPaymentInput {
  studentId: number;
  feeStructureId: number;
  amount: number;
  date: string;
  receiptNumber: string;
  method: 'CASH' | 'CHECK' | 'TRANSFER' | 'ONLINE';
  notes: string;
}

export interface CsvStudentRow {
  studentId: string;
  name: string;
  email: string;
  group: string;
}

export interface ImportResult {
  imported: number;
  errors: ImportRowError[];
}

export interface ImportRowError {
  row: number;
  field: string;
  value: string;
  message: string;
}

// Helper function for API calls
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

// Student APIs
export const studentApi = {
  list: () => apiRequest<Student[]>('/students'),
  
  getById: (id: number) => apiRequest<Student>(`/students/${id}`),
  
  create: (input: CreateStudentInput) => 
    apiRequest<Student>('/students', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  
  update: (input: UpdateStudentInput) => 
    apiRequest<Student>(`/students/${input.id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  
  delete: (id: number) => 
    apiRequest<void>(`/students/${id}`, {
      method: 'DELETE',
    }),
  
  bulkImport: (rows: CsvStudentRow[]) => 
    apiRequest<ImportResult>('/students/import', {
      method: 'POST',
      body: JSON.stringify(rows),
    }),
};

// Fee Structure APIs
export const feeStructureApi = {
  list: () => apiRequest<FeeStructure[]>('/fee-structures'),
  
  getById: (id: number) => apiRequest<FeeStructure>(`/fee-structures/${id}`),
  
  create: (input: CreateFeeStructureInput) => 
    apiRequest<FeeStructure>('/fee-structures', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  
  update: (input: UpdateFeeStructureInput) => 
    apiRequest<FeeStructure>(`/fee-structures/${input.id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    }),
  
  delete: (id: number) => 
    apiRequest<void>(`/fee-structures/${id}`, {
      method: 'DELETE',
    }),
  
  duplicate: (id: number) => 
    apiRequest<FeeStructure>(`/fee-structures/${id}/duplicate`, {
      method: 'POST',
    }),
};

// Payment APIs
export const paymentApi = {
  list: (fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    const queryString = params.toString();
    return apiRequest<Payment[]>(`/payments${queryString ? `?${queryString}` : ''}`);
  },
  
  record: (input: RecordPaymentInput) => 
    apiRequest<Payment>('/payments', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  
  checkReceiptExists: (receiptNumber: string) => 
    apiRequest<boolean>(`/payments/check-receipt/${encodeURIComponent(receiptNumber)}`),
};

// Balance & Report APIs
export const balanceApi = {
  getAllBalances: () => apiRequest<StudentBalance[]>('/balances'),
  
  getStudentBalances: (studentId: number) => 
    apiRequest<StudentBalance[]>(`/balances/student/${studentId}`),
  
  getFeeStructureBalances: (feeStructureId: number) => 
    apiRequest<StudentBalance[]>(`/balances/fee-structure/${feeStructureId}`),
};

export const reportApi = {
  getCollectionSummary: () => apiRequest<CollectionSummary>('/reports/collection-summary'),
  
  getCollectionTrends: () => apiRequest<CollectionTrends>('/reports/collection-trends'),
  
  getPaymentMethodBreakdown: () => apiRequest<PaymentMethodBreakdown>('/reports/payment-method-breakdown'),
  
  getAgingReport: () => apiRequest<AgingBucket[]>('/reports/aging'),
  
  getAgingReportDetail: (bucketIndex: number) => 
    apiRequest<AgingBucketDetail[]>(`/reports/aging/${bucketIndex}/detail`),
};

// Assignment APIs
export const assignmentApi = {
  assignToStudent: (studentId: number, feeStructureId: number) => 
    apiRequest<void>(`/assignments/student/${studentId}/fee/${feeStructureId}`, {
      method: 'POST',
    }),
  
  assignToGroup: (group: string, feeStructureId: number) => 
    apiRequest<void>(`/assignments/group/${encodeURIComponent(group)}/fee/${feeStructureId}`, {
      method: 'POST',
    }),
  
  unenroll: (studentId: number, feeStructureId: number) => 
    apiRequest<void>(`/assignments/student/${studentId}/fee/${feeStructureId}`, {
      method: 'DELETE',
    }),
  
  waive: (studentId: number, feeStructureId: number, reason: string) => 
    apiRequest<void>(`/assignments/student/${studentId}/fee/${feeStructureId}/waive`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
};
