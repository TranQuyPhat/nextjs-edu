"use client";

import {
  useGroupedQuizzes,
  useQuizzesByClassInfinite,
} from "@/app/quizzes/hooks";
import { useState } from "react";

type QuizStatus = "UPCOMING" | "OPEN" | "CLOSED";

export default function TeacherQuizzesPage() {
  const [status] = useState<QuizStatus>("OPEN");

  const { data: grouped, isLoading, isError } = useGroupedQuizzes(status);

  if (isLoading) return <p>Đang tải...</p>;
  if (isError || !grouped) return <p>Có lỗi xảy ra</p>;

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl font-bold">Danh sách quiz theo lớp ({status})</h1>

      {grouped.classes.map((c) => (
        <ClassSection
          key={c.id}
          classId={c.id}
          className={c.className}
          status={status}
          quizzes={c.quizzes}
        />
      ))}
    </div>
  );
}

/**
 * Component hiển thị quiz của từng class
 * Gọi useQuizzesByClassInfinite để load-more quiz
 */
function ClassSection({
  classId,
  className,
  status,
  quizzes,
}: {
  classId: number;
  className: string;
  status: QuizStatus;
  quizzes: any[];
}) {
  return (
    <div className="border rounded p-4">
      <h2 className="text-lg font-semibold mb-2">{className}</h2>

      {quizzes.length === 0 && <p>Chưa có quiz</p>}

      <ul className="list-disc pl-5">
        {quizzes.map((q) => (
          <li key={q.id}>{q.title}</li>
        ))}
      </ul>
    </div>
  );
}
