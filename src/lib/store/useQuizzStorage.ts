import { QuizzFormData } from "@/types/quiz.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type QuizzStore = {
    data: QuizzFormData;
    setData: (data: Partial<QuizzFormData>) => void;
    reset: () => void;
};

const defaultData: QuizzFormData = {
    title: "",
    grade: "",
    subject: "",
    startDate: "",
    endDate: "",
    time: "",
    description: "",
    fileName: "",
    questions: [],
};

export const useQuizzStorage = create<QuizzStore>()(
    persist(
        (set) => ({
            data: defaultData,
            setData: (newData) =>
                set((state) => ({
                    data: { ...state.data, ...newData },
                })),
            reset: () => set({ data: defaultData }),
        }),
        {
            name: "quizz-storage",
        }
    )
);
