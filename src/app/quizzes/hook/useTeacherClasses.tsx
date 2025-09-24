import { apiClient } from "@/lib/api";
import { ClassEntity } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";

export function useTeacherClasses(teacherId: number | null) {
  return useQuery({
    queryKey: ["teacher-classes", teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      const res = await apiClient<ClassEntity[]>(
        `api/auth/classes/teachers/${teacherId}`
      );

      return res.data;
    },
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
}
