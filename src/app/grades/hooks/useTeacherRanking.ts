// hooks/useTeacherRanking.ts
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface StudentRanking {
    studentId: number;
    studentName: string;
    studentEmail: string;
    className: string;
    averageScore: number;
    rank: number;
}
export interface Assignment {
    name: string;
    grade: number;
    maxGrade: number;
    type: "assignment" | "quiz";
    date: string; // ISO string format
}

export interface StudentResult {
    id: number;
    subject: string;
    className: string;
    assignments: Assignment[];
    average: number;
    trend: "up" | "down" | "stable";
}


export function useTeacherRanking() {
    return useQuery<StudentRanking[]>({
        queryKey: ["teacher-ranking"],
        queryFn: async () => {
            const res = await apiClient.get<StudentRanking[]>(`/api/stats/teacher/ranking`);
            return res;
        },
        staleTime: 1000 * 60 * 2,
    });
}

export function useStudentResult() {
    return useQuery<StudentResult[]>({
        queryKey: ["student-grades"],
        queryFn: async () => {
            const res = await apiClient.get<StudentResult[]>(`/api/student/grades`);
            return res;
        },
        staleTime: 1000 * 60 * 2,
    });
}
