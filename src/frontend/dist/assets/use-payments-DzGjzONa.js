import { b as useQueryClient } from "./index-JaIj-DYW.js";
import { d as useQuery, u as useActor, a as createActor } from "./backend-BHrL9w1d.js";
import { a as useMutation } from "./badge-Cou7lT_t.js";
function useBackendActor() {
  return useActor(createActor);
}
function usePayments(fromDate, toDate) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["payments", fromDate.toString(), toDate.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPaymentsByDateRange(fromDate, toDate);
    },
    enabled: !!actor && !isFetching
  });
}
function useCollectionSummary() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["collectionSummary"],
    queryFn: async () => {
      if (!actor) {
        return {
          totalOverdue: 0n,
          totalCollected: 0n,
          totalOutstanding: 0n,
          totalWaived: 0n,
          paymentCount: 0n
        };
      }
      return actor.getCollectionSummary();
    },
    enabled: !!actor && !isFetching
  });
}
function usePaymentMethodBreakdown() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["paymentMethodBreakdown"],
    queryFn: async () => {
      if (!actor) {
        return { cash: 0n, check: 0n, transfer: 0n, online: 0n };
      }
      return actor.getPaymentMethodBreakdown();
    },
    enabled: !!actor && !isFetching
  });
}
function useAgingReport() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["agingReport"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAgingReport();
    },
    enabled: !!actor && !isFetching
  });
}
function useRecordPayment() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.recordPayment(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["collectionSummary"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMethodBreakdown"] });
    }
  });
}
export {
  useAgingReport as a,
  usePayments as b,
  usePaymentMethodBreakdown as c,
  useRecordPayment as d,
  useCollectionSummary as u
};
