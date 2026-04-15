import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  studentApi,
  type Student,
  type StudentBalance,
  type CreateStudentInput,
  type UpdateStudentInput,
  type CsvStudentRow,
  type ImportResult,
} from "../api";

export function useStudents() {
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      return studentApi.list();
    },
    retry: 1,
  });
}

export function useStudent(id: number) {
  return useQuery<Student>({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      return studentApi.getById(id);
    },
    retry: 1,
  });
}

export function useStudentBalances(studentId: number) {
  return useQuery<StudentBalance[]>({
    queryKey: ["studentBalances", studentId.toString()],
    queryFn: async () => {
      return balanceApi.getStudentBalances(studentId);
    },
    retry: 1,
  });
}

export function useAllBalances() {
  return useQuery<StudentBalance[]>({
    queryKey: ["allBalances"],
    queryFn: async () => {
      return balanceApi.getAllBalances();
    },
    retry: 1,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateStudentInput) => {
      return studentApi.create(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateStudentInput) => {
      return studentApi.update(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return studentApi.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    },
  });
}

export function useBulkImportStudents() {
  const queryClient = useQueryClient();
  return useMutation<ImportResult, Error, CsvStudentRow[]>({
    mutationFn: async (rows: CsvStudentRow[]) => {
      const result = await studentApi.bulkImport(rows);
      // Surface row-level errors as a structured error if any failed
      if (result.errors.length > 0 && result.imported === 0) {
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
