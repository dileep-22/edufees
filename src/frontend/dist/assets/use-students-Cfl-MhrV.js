import { b as useQueryClient } from "./index-JaIj-DYW.js";
import { d as useQuery, u as useActor, a as createActor } from "./backend-BHrL9w1d.js";
import { a as useMutation } from "./badge-Cou7lT_t.js";
function useBackendActor() {
  return useActor(createActor);
}
function useStudents() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listStudents();
    },
    enabled: !!actor && !isFetching
  });
}
function useStudent(id) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["student", id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching
  });
}
function useStudentBalances(studentId) {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["studentBalances", studentId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentBalances(studentId);
    },
    enabled: !!actor && !isFetching
  });
}
function useAllBalances() {
  const { actor, isFetching } = useBackendActor();
  return useQuery({
    queryKey: ["allBalances"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBalances();
    },
    enabled: !!actor && !isFetching
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
      return actor.bulkImportStudents(rows);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
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
