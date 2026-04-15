import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignmentApi,
  balanceApi,
  type StudentBalance,
} from "../api";

export function useAssignments() {
  // Assignments are derived from balances — getAllBalances covers assignment data
  return useQuery<StudentBalance[]>({
    queryKey: ["allBalances"],
    queryFn: async () => {
      return balanceApi.getAllBalances();
    },
    retry: 1,
  });
}

export function useFeeStructureBalances(feeStructureId: number) {
  return useQuery<StudentBalance[]>({
    queryKey: ["feeStructureBalances", feeStructureId.toString()],
    queryFn: async () => {
      return balanceApi.getFeeStructureBalances(feeStructureId);
    },
    retry: 1,
  });
}

export function useAssignFeeToStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
    }: { studentId: number; feeStructureId: number }) => {
      return assignmentApi.assignToStudent(studentId, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}

export function useAssignFeeToGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      group,
      feeStructureId,
    }: { group: string; feeStructureId: number }) => {
      return assignmentApi.assignToGroup(group, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}

export function useUnenrollStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
    }: {
      studentId: number;
      feeStructureId: number;
    }): Promise<void> => {
      return assignmentApi.unenroll(studentId, feeStructureId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}

export function useWaiveFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      feeStructureId,
      reason,
    }: {
      studentId: number;
      feeStructureId: number;
      reason: string;
    }): Promise<void> => {
      return assignmentApi.waive(studentId, feeStructureId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
      queryClient.invalidateQueries({ queryKey: ["studentBalances"] });
      queryClient.invalidateQueries({ queryKey: ["feeStructureBalances"] });
    },
  });
}
