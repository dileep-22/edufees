import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateStudentInput,
  CsvStudentRow,
  ImportResult,
  Student,
  StudentBalance,
  UpdateStudentInput,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

export function useStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      return actor!.listStudents();
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useStudent(id: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student | null>({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      return actor!.getStudent(id);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useStudentBalances(studentId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentBalance[]>({
    queryKey: ["studentBalances", studentId.toString()],
    queryFn: async () => {
      return actor!.getStudentBalances(studentId);
    },
    enabled: !!actor && !isFetching,
    retry: 1,
  });
}

export function useAllBalances() {
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

export function useCreateStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateStudentInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createStudent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateStudentInput) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateStudent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    },
  });
}

export function useBulkImportStudents() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation<ImportResult, Error, CsvStudentRow[]>({
    mutationFn: async (rows: CsvStudentRow[]) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.bulkImportStudents(rows);
      // Surface row-level errors as a structured error if any failed
      if (result.errors.length > 0 && result.imported === 0n) {
        const summary = result.errors
          .slice(0, 3)
          .map((e) => `Row ${e.row}: ${e.message}`)
          .join("; ");
        throw new Error(
          `Import failed: ${summary}${result.errors.length > 3 ? ` and ${result.errors.length - 3} more` : ""}`,
        );
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    },
  });
}
