import { b as useQueryClient } from "./index-JaIj-DYW.js";
import { d as useQuery, u as useActor, a as createActor } from "./backend-BHrL9w1d.js";
import { a as useMutation } from "./badge-Cou7lT_t.js";
function useBackendActor() {
  return useActor(createActor);
}
function useFeeStructures() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["feeStructures"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listFeeStructures();
    },
    enabled: !!actor && !isFetching
  });
}
function useFeeStructure(id) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["feeStructure", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getFeeStructure(id);
    },
    enabled: !!actor && !isFetching
  });
}
function useCreateFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createFeeStructure(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    }
  });
}
function useUpdateFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFeeStructure(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    }
  });
}
function useDeleteFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFeeStructure(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    }
  });
}
function useDuplicateFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.duplicateFeeStructure(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    }
  });
}
export {
  useDeleteFeeStructure as a,
  useDuplicateFeeStructure as b,
  useFeeStructure as c,
  useCreateFeeStructure as d,
  useUpdateFeeStructure as e,
  useFeeStructures as u
};
