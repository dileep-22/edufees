import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  feeStructureApi,
  balanceApi,
  type FeeStructure,
  type StudentBalance,
  type CreateFeeStructureInput,
  type UpdateFeeStructureInput,
} from "../api";

export function useFeeStructures() {
  return useQuery<FeeStructure[]>({
    queryKey: ["feeStructures"],
    queryFn: async () => {
      return feeStructureApi.list();
    },
    retry: 1,
  });
}

export function useFeeStructure(id: number) {
  return useQuery<FeeStructure>({
    queryKey: ["feeStructure", id.toString()],
    queryFn: async () => {
      return feeStructureApi.getById(id);
    },
    retry: 1,
  });
}

export function useCreateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateFeeStructureInput) => {
      return feeStructureApi.create(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}

export function useUpdateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateFeeStructureInput) => {
      return feeStructureApi.update(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}

export function useDeleteFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return feeStructureApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}

export function useDuplicateFeeStructure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return feeStructureApi.duplicate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feeStructures"] });
    },
  });
}
