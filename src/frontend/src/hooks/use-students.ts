import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  CreateStudentInput,
  CsvStudentRow,
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
      if (!actor) return [];
      return actor.listStudents();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudent(id: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<Student | null>({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStudentBalances(studentId: bigint) {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentBalance[]>({
    queryKey: ["studentBalances", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentBalances(studentId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBalances() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<StudentBalance[]>({
    queryKey: ["allBalances"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBalances();
    },
    enabled: !!actor && !isFetching,
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
  return useMutation({
    mutationFn: async (rows: CsvStudentRow[]) => {
      if (!actor) throw new Error("Actor not available");
      return actor.bulkImportStudents(rows);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}
