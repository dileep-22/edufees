import { b as useQueryClient } from "./index-JaIj-DYW.js";
import { d as useQuery, u as useActor, a as createActor } from "./backend-BHrL9w1d.js";
import { a as useMutation } from "./badge-Cou7lT_t.js";
function useBackendActor() {
  return useActor(createActor);
}
function useFeeStructureBalances(feeStructureId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["feeStructureBalances", feeStructureId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeeStructureBalances(feeStructureId);
    },
    enabled: !!actor && !isFetching
  });
}
function useAssignFeeToStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignFeeToStudent(studentId, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    }
  });
}
function useAssignFeeToGroup() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      group,
      feeStructureId
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignFeeToGroup(group, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    }
  });
}
function useUnenrollStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.unenrollStudent(studentId, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    }
  });
}
function useWaiveFee() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
      reason
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.waiveFee(studentId, feeStructureId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    }
  });
}
export {
  useAssignFeeToGroup as a,
  useAssignFeeToStudent as b,
  useUnenrollStudent as c,
  useFeeStructureBalances as d,
  useWaiveFee as u
};
