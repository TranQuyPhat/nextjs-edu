import {
    useQuery,
    keepPreviousData,
    useInfiniteQuery,
    InfiniteData,
    UseInfiniteQueryOptions,
} from "@tanstack/react-query";
import {
    fetchGroupedQuizzes,
    fetchQuizzesByClass,
    fetchQuizzesByTeacher,
    QuizDTO,
    toQuizCard,
} from "./api";
import { QuizCard } from "@/types/quiz.type";

export function useQuizzesQuery() {
    return useQuery({
        queryKey: ["quizzes"],
        queryFn: () => {
            return fetchQuizzesByTeacher();
        },
        select: (rows) => rows.map(toQuizCard),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,
        retry: 3,
    });
}
export function useGroupedQuizzes(status: "UPCOMING" | "OPEN" | "CLOSED") {
    return useQuery({
        queryKey: ["teacher-quizzes", "group-by-class", status],
        queryFn: () =>
            fetchGroupedQuizzes({
                status,
                classPage: 0,
                classSize: 5,
                quizPageSize: 3,
            }),
        staleTime: 5 * 60 * 1000,
        retry: 3,
    });
}

export function useQuizzesByClassInfinite(
    classId: number,
    status: "UPCOMING" | "OPEN" | "CLOSED",
    options?: Omit<
        UseInfiniteQueryOptions<
            QuizPage,
            Error,
            InfiniteData<QuizPage>,
            ["teacher-quizzes", "class", number, "UPCOMING" | "OPEN" | "CLOSED"],
            number
        >,
        "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam"
    >
) {
    return useInfiniteQuery({
        queryKey: ["teacher-quizzes", "class", classId, status] as const,
        queryFn: ({ pageParam }) =>
            fetchQuizzesByClass({ classId, status, page: pageParam, size: 6 }), // 6 card/lần
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const { number, totalPages } = lastPage;
            return number + 1 < totalPages ? number + 1 : undefined;
        },
        staleTime: 5 * 60 * 1000,
        enabled: false,
        ...options,
    });
}
type QuizPage = {
    content: QuizDTO[];
    number: number;       // page hiện tại
    totalPages: number;
    totalElements: number;
    size: number;
};