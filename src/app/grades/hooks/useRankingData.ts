import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface StudentInfo {
    studentId: number;
    studentName: string;
    studentEmail: string;
    averageScore: number;
}

export interface ClassRanking {
    classId: number;
    className: string;
    subjectName: string;
    students: StudentInfo[];
}

export interface TopStudent {
    studentId: number;
    studentName: string;
    studentEmail: string;
    bestScore: number;
    classId: number;
    className: string;
    subjectName: string;
}

export function useRankingByClass() {
    return useQuery<ClassRanking[]>({
        queryKey: ["ranking-by-class"],
        queryFn: async () => {
            const res = await apiClient.get<ClassRanking[]>(
                `/api/stats/teacher/ranking-by-class`
            );
            return res.data;
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useTopStudents(limit: number = 10) {
    return useQuery<TopStudent[]>({
        queryKey: ["top-students", limit],
        queryFn: async () => {
            const res = await apiClient.get<TopStudent[]>(
                `/api/stats/teacher/top-students?limit=${limit}`
            );
            return res.data;
        },
        staleTime: 1000 * 60 * 2,
    });
}
