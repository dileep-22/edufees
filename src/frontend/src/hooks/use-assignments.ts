import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { FeeAssignment, StudentBalance } from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useAssignments() {
  // Assignments are derived from balances — getAllBalances covers assignment data
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentBalance[]>({
    queryKey: ["allBalances"],
    queryFn: async () => {
      return actor!.getAllBalances();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useFeeStructureBalances(feeStructureId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentBalance[]>({
    queryKey: ["feeStructureBalances", feeStructureId.toString()],
    queryFn: async () => {
      return actor!.getFeeStructureBalances(feeStructureId);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useAssignFeeToStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
    }: { studentId: bigint; feeStructureId: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignFeeToStudent(studentId, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}

export function useAssignFeeToGroup() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      group,
      feeStructureId,
    }: { group: string; feeStructureId: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.assignFeeToGroup(group, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}

export function useUnenrollStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
    }: {
      studentId: bigint;
      feeStructureId: bigint;
    }): Promise<boolean> => {
      if (!actor) throw new Error("Actor not available");
      return actor.unenrollStudent(studentId, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}

export function useWaiveFee() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
      reason,
    }: {
      studentId: bigint;
      feeStructureId: bigint;
      reason: string;
    }): Promise<FeeAssignment | null> => {
      if (!actor) throw new Error("Actor not available");
      return actor.waiveFee(studentId, feeStructureId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}
