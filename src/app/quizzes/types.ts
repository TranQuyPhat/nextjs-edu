export interface QuizCard {
    id: number;
    title: string;
    className: string;
    description: string;
    duration: number;
    totalQuestions: number;
    totalStudents: number;
    status: string;
    dueDate: string;
    grade?: string;
    createBy?: number;
    classID?: number;
    subject: string;
    studentsSubmitted: number;
    createdAt?: string;
}