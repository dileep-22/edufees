import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  paymentApi,
  balanceApi,
  reportApi,
  type Payment,
  type AgingBucketDetail,
  type CollectionSummary,
  type CollectionTrends,
  type PaymentMethodBreakdown,
  type RecordPaymentInput,
} from "../api";

export function usePayments(fromDate?: string, toDate?: string) {
  return useQuery<Payment[]>({
    queryKey: ["payments", fromDate, toDate],
    queryFn: async () => {
      return paymentApi.list(fromDate, toDate);
    },
    retry: 1,
  });
}

export function useCollectionSummary() {
  return useQuery<CollectionSummary>({
    queryKey: ["collectionSummary"],
    queryFn: async () => {
      return reportApi.getCollectionSummary();
    },
    retry: 1,
  });
}

export function useCollectionTrends() {
  return useQuery<CollectionTrends>({
    queryKey: ["collectionTrends"],
    queryFn: async () => {
      return reportApi.getCollectionTrends();
    },
    retry: 1,
  });
}

export function usePaymentMethodBreakdown() {
  return useQuery<PaymentMethodBreakdown>({
    queryKey: ["paymentMethodBreakdown"],
    queryFn: async () => {
      return reportApi.getPaymentMethodBreakdown();
    },
    retry: 1,
  });
}

export function useAgingReport() {
  return useQuery({
    queryKey: ["agingReport"],
    queryFn: async () => {
      return reportApi.getAgingReport();
    },
    retry: 1,
  });
}

export function useAgingReportDetail(bucketIndex: number, enabled = false) {
  return useQuery<AgingBucketDetail[]>({
    queryKey: ["agingReportDetail", bucketIndex],
    queryFn: async () => {
      return reportApi.getAgingReportDetail(bucketIndex);
    },
    enabled: enabled,
    retry: 1,
  });
}

export function useCheckReceiptExists() {
  return async (receiptNumber: string): Promise<boolean> => {
    return paymentApi.checkReceiptExists(receiptNumber);
  };
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecordPaymentInput) => {
      return paymentApi.record(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["collectionSummary"] });
      queryClient.invalidateQueries({ queryKey: ["collectionTrends"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethodBreakdown"] });
      queryClient.invalidateQueries({ queryKey: ["agingReport"] });
    },
  });
}
