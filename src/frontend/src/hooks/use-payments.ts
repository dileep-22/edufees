import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CollectionSummary,
  Payment,
  PaymentMethodBreakdown,
  RecordPaymentInput,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function usePayments(fromDate: bigint, toDate: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Payment[]>({
    queryKey: ["payments", fromDate.toString(), toDate.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentsByDateRange(fromDate, toDate);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCollectionSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<CollectionSummary>({
    queryKey: ["collectionSummary"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalOverdue: 0n,
          totalCollected: 0n,
          totalOutstanding: 0n,
          totalWaived: 0n,
          paymentCount: 0n,
        };
      }
      return actor.getCollectionSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePaymentMethodBreakdown() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<PaymentMethodBreakdown>({
    queryKey: ["paymentMethodBreakdown"],
    queryFn: async () => {
      if (!actor) {
        return { cash: 0n, check: 0n, transfer: 0n, online: 0n };
      }
      return actor.getPaymentMethodBreakdown();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAgingReport() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["agingReport"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAgingReport();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordPayment() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: RecordPaymentInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordPayment(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["collectionSummary"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethodBreakdown"] });
    },
  });
}
