"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { AiQuizSettings, Question, Quiz } from "@/types/quiz.type";
type FileItem = {
    id: string;
    file: File;
    name: string;
    size: number;
    type: string;
};
type State = {
    files: FileItem[];
    settings: AiQuizSettings;
    isGenerating: boolean;
    quiz: Quiz | null;
    hasUnsavedChanges: boolean;
};

type Actions = {
    addFiles: (files: File[]) => void;
    removeFile: (id: string) => void;
    clearFiles: () => void;

    updateSettings: (patch: Partial<AiQuizSettings>) => void;

    setGenerating: (v: boolean) => void;
    setQuiz: (quiz: Quiz) => void;

    markDirty: () => void;
    markSaved: () => void;

    updateQuestion: (qid: string, patch: Partial<Question>) => void;
    removeQuestion: (qid: string) => void;


    getBackendSettings: () => AiQuizSettings;
};

const defaultSettings: AiQuizSettings = {
    language: "Tiếng Việt",
    difficulty: "medium",
    numOneChoice: 5,
    numTrueFalse: 3,
    numFillBlank: 2,
    quizTitle: "",
    userPrompt: "",
};

export const useQuizStore = create<State & Actions>((set, get) => ({
    files: [],
    settings: defaultSettings,
    isGenerating: false,
    quiz: null,
    hasUnsavedChanges: false,

    addFiles: (files) =>
        set((s) => ({
            files: [
                ...s.files,
                ...files.map((file) => ({
                    id: nanoid(),
                    file,
                    name: file.name,
                    size: file.size,
                    type: file.type || "unknown",
                })),
            ],
        })),
    removeFile: (id) =>
        set((s) => ({ files: s.files.filter((f) => f.id !== id) })),
    clearFiles: () => set({ files: [] }),

    updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

    setGenerating: (v) => set({ isGenerating: v }),
    setQuiz: (quiz) => set({ quiz, hasUnsavedChanges: false }),

    markDirty: () => set({ hasUnsavedChanges: true }),
    markSaved: () => set({ hasUnsavedChanges: false }),

    updateQuestion: (qid, patch) =>
        set((s) => {
            if (!s.quiz) return {};
            const updated = s.quiz.questions.map((q) =>
                q.id === qid ? ({ ...q, ...patch } as Question) : q
            );
            return { quiz: { ...s.quiz, questions: updated }, hasUnsavedChanges: true };
        }),

    removeQuestion: (qid) =>
        set((s) => {
            if (!s.quiz) return {};
            const updated = s.quiz.questions.filter((q) => q.id !== qid);
            return { quiz: { ...s.quiz, questions: updated }, hasUnsavedChanges: true };
        }),


    getBackendSettings: (): AiQuizSettings => {
        const s = get().settings;
        return {
            quizTitle: s.quizTitle || "",
            language: s.language || "Tiếng Việt",
            difficulty: s.difficulty || "medium",
            numOneChoice: s.numOneChoice || 0,
            numTrueFalse: s.numTrueFalse || 0,
            numFillBlank: s.numFillBlank || 0,
            userPrompt: s.userPrompt || "",
        };
    },
}));
