import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AgingBucketDetail,
  CollectionSummary,
  CollectionTrends,
  Payment,
  PaymentMethodBreakdown,
  RecordPaymentInput,
} from "../types";
import { RecordPaymentError } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function usePayments(fromDate: bigint, toDate: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Payment[]>({
    queryKey: ["payments", fromDate.toString(), toDate.toString()],
    queryFn: async () => {
      // actor is guaranteed non-null here because enabled gate below prevents
      // the queryFn from running when actor is null/isFetching.
      return actor!.getPaymentsByDateRange(fromDate, toDate);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useCollectionSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CollectionSummary>({
    queryKey: ["collectionSummary"],
    queryFn: async () => {
      // Let errors propagate so React Query captures isError=true.
      // The enabled gate below prevents this from running when actor is null.
      return actor!.getCollectionSummary();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useCollectionTrends() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CollectionTrends>({
    queryKey: ["collectionTrends"],
    queryFn: async () => {
      return actor!.getCollectionTrends();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function usePaymentMethodBreakdown() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PaymentMethodBreakdown>({
    queryKey: ["paymentMethodBreakdown"],
    queryFn: async () => {
      return actor!.getPaymentMethodBreakdown();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useAgingReport() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["agingReport"],
    queryFn: async () => {
      return actor!.getAgingReport();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useAgingReportDetail(bucketIndex: number, enabled = false) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AgingBucketDetail[]>({
    queryKey: ["agingReportDetail", bucketIndex],
    queryFn: async () => {
      return actor!.getAgingReportDetail(BigInt(bucketIndex));
    },
    enabled: enabled && !!actor && !isFetching,
    retry: 1,
  });
}

export function useCheckReceiptExists() {
  const { actor } = useBackendActor();
  return async (receiptNumber: string): Promise<boolean> => {
    if (!actor) return false;
    return actor.checkReceiptExists(receiptNumber);
  };
}

export function useRecordPayment() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecordPaymentInput) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.recordPayment(input);
      if (result.__kind__ === "err") {
        if (result.err === RecordPaymentError.DuplicateReceipt) {
          throw new Error("A payment with this receipt number already exists.");
        }
        throw new Error("Failed to record payment. Please try again.");
      }
      return result.ok;
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
