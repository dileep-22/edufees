import { d as useQueryClient } from "./index-Bb6f_FCk.js";
import { d as useQuery, u as useActor, a as createActor } from "./backend-CvGl-pMz.js";
import { c as useMutation } from "./badge-BagwGDur.js";
function useBackendActor() {
  return useActor(createActor);
}
function useStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      return actor.listStudents();
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useStudent(id) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useStudentBalances(studentId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["studentBalances", studentId.toString()],
    queryFn: async () => {
      return actor.getStudentBalances(studentId);
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useAllBalances() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["allBalances"],
    queryFn: async () => {
      return actor.getAllBalances();
    },
    enabled: !!actor && !isFetching,
    retry: 1
  });
}
function useCreateStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createStudent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    }
  });
}
function useUpdateStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateStudent(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    }
  });
}
function useDeleteStudent() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    }
  });
}
function useBulkImportStudents() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rows) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.bulkImportStudents(rows);
      if (result.errors.length > 0 && result.imported === 0n) {
        const summary = result.errors.slice(0, 3).map((e) => `Row ${e.row}: ${e.message}`).join("; ");
        throw new Error(
          `Import failed: ${summary}${result.errors.length > 3 ? ` and ${result.errors.length - 3} more` : ""}`
        );
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["allBalances"] });
    }
  });
}
export {
  useStudents as a,
  useBulkImportStudents as b,
  useCreateStudent as c,
  useUpdateStudent as d,
  useDeleteStudent as e,
  useStudent as f,
  useStudentBalances as g,
  useAllBalances as u
};
