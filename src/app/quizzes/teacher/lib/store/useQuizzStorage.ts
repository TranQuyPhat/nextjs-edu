import { create } from "zustand";

export type Question = {
    question: string;
    options: string[];
    answer: string | null;
};

export type QuizzFormData = {
    title: string;
    grade: string;
    subject: string;
    startDate: string;
    endDate: string;
    time: string;
    description: string;
    fileName: string;
    questions: Question[];
    filename: string;
};

type QuizzStore = {
    data: QuizzFormData;
    setData: (data: Partial<QuizzFormData>) => void;
    reset: () => void;
};

export const useQuizzStorage = create<QuizzStore>((set) => ({
    data: {
        title: "",
        grade: "",
        subject: "",
        startDate: "",
        endDate: "",
        time: "",
        description: "",
        fileName: "",
        questions: [],
    },
    setData: (newData) =>
        set((state) => ({
            data: { ...state.data, ...newData },
        })),
    reset: () =>
        set({
            data: {
                title: "",
                grade: "",
                subject: "",
                startDate: "",
                endDate: "",
                time: "",
                description: "",
                fileName: "",
                questions: [],
            },
        }),
}));
