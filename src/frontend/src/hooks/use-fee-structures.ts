import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateFeeStructureInput,
  FeeStructure,
  UpdateFeeStructureInput,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useFeeStructures() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeStructure[]>({
    queryKey: ["feeStructures"],
    queryFn: async () => {
      return actor!.listFeeStructures();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useFeeStructure(id: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<FeeStructure | null>({
    queryKey: ["feeStructure", id.toString()],
    queryFn: async () => {
      return actor!.getFeeStructure(id);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useCreateFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateFeeStructureInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createFeeStructure(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}

export function useUpdateFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateFeeStructureInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateFeeStructure(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}

export function useDeleteFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteFeeStructure(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}

export function useDuplicateFeeStructure() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.duplicateFeeStructure(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}
