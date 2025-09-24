import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface RecentScore {
    className: string,
    subjectName: string,
    score: number,
    type: string,
    title: string,
    submittedAt: string,
}

export function useRecentScoreOfStudent() {
    return useQuery<RecentScore[]>({
        queryKey: ["recent-scores"],
        queryFn: async () => {
            const res = await apiClient.get<RecentScore[]>(`/api/student/recent-scores`);
            return res.data;
        },
        staleTime: 1000 * 60 * 5,
    });
}