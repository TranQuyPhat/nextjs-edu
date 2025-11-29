import { apiClient } from "@/lib/api";
import { ClassEntity } from "@/lib/type";
import { useQuery } from "@tanstack/react-query";

export function useTeacherClasses(teacherId: number | null) {
  return useQuery({
    queryKey: ["teacher-classes", teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      
      try {
        // apiClient interceptor đã trả về res.data, nên res chính là data
        const res = await apiClient<ClassEntity[] | { data: ClassEntity[] }>(
          `api/auth/classes/teachers/${teacherId}`
        );
        
        console.log("🔍 API Response raw:", res);
        console.log("🔍 Response type:", typeof res);
        console.log("🔍 Is array:", Array.isArray(res));
        
        // Kiểm tra nếu res là object có property data (wrapped response)
        if (res && typeof res === 'object' && !Array.isArray(res) && 'data' in res) {
          const data = (res as { data: ClassEntity[] }).data;
          console.log("🔍 Extracted data from wrapper:", data);
          return Array.isArray(data) ? data : [];
        }
        
        // Nếu res đã là array thì trả về trực tiếp
        if (Array.isArray(res)) {
          console.log("🔍 Response is array, length:", res.length);
          return res;
        }
        
        // Fallback: trả về empty array
        console.warn("⚠️ Unexpected response format:", res);
        return [];
      } catch (error) {
        console.error("❌ Error fetching teacher classes:", error);
        return [];
      }
    },
    enabled: !!teacherId,
    staleTime: 5 * 60 * 1000,
  });
}
