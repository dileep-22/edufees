import { d as useQueryClient } from "./index-Bb6f_FCk.js";
import { d as useQuery, u as useActor, R as RecordPaymentError, a as createActor } from "./backend-CvGl-pMz.js";
import { c as useMutation } from "./badge-BagwGDur.js";
function useBackendActor() {
  return useActor(createActor);
}
function usePayments(fromDate, toDate) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["payments", fromDate.toString(), toDate.toString()],
    queryFn: async () => {
      return actor.getPaymentsByDateRange(fromDate, toDate);
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useCollectionSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["collectionSummary"],
    queryFn: async () => {
      return actor.getCollectionSummary();
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useCollectionTrends() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["collectionTrends"],
    queryFn: async () => {
      return actor.getCollectionTrends();
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function usePaymentMethodBreakdown() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["paymentMethodBreakdown"],
    queryFn: async () => {
      return actor.getPaymentMethodBreakdown();
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useAgingReport() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["agingReport"],
    queryFn: async () => {
      return actor.getAgingReport();
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useAgingReportDetail(bucketIndex, enabled = false) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["agingReportDetail", bucketIndex],
    queryFn: async () => {
      return actor.getAgingReportDetail(BigInt(bucketIndex));
    },
    enabled: enabled && !!actor && !isFetching,
    retry: 1
  });
}
function useCheckReceiptExists() {
  const { actor } = useBackendActor();
  return async (receiptNumber) => {
    if (!actor) return false;
    return actor.checkReceiptExists(receiptNumber);
  };
}
function useRecordPayment() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
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
    }
  });
}
export {
  useCollectionTrends as a,
  useAgingReport as b,
  useAgingReportDetail as c,
  usePayments as d,
  usePaymentMethodBreakdown as e,
  useRecordPayment as f,
  useCheckReceiptExists as g,
  useCollectionSummary as u
};
