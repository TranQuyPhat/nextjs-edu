"use client";

import { useState } from "react";
import { useQuizQuestionsPage } from "../quizzes/hook/useQuizQuestionsPage";

export default function QuizQuestionsTest({ quizId }: { quizId: number }) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error, isFetching } = useQuizQuestionsPage(
    quizId,
    page,
    10
  );

  // Log ra console để kiểm tra
  console.log("Quiz Questions Page Data:", data);

  if (isLoading) return <p>Đang tải...</p>;
  if (isError) return <p>Lỗi: {(error as Error).message}</p>;

  return (
    <div>
      <h2>
        Trang {page} {isFetching && "...đang tải"}
      </h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
        Trang trước
      </button>
      <button
        disabled={data && page * 10 >= data.total}
        onClick={() => setPage((p) => p + 1)}
      >
        Trang sau
      </button>
    </div>
  );
}
