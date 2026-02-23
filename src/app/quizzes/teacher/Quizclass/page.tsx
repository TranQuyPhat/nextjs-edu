"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchQuizzesByClass, Page, QuizDTO } from "../../api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Users, Calendar } from "lucide-react";

type QuizStatus = "OPEN" | "UPCOMING" | "CLOSED";

const statusBadge = (status: string) => {
  const normalizedStatus = status?.toUpperCase() as QuizStatus;
  switch (normalizedStatus) {
    case "UPCOMING":
      return <Badge className="rounded-full border border-amber-300/50 bg-amber-500/20 text-amber-200 px-3 py-1">Sắp diễn ra</Badge>;
    case "OPEN":
      return <Badge className="rounded-full border border-emerald-300/50 bg-emerald-500/20 text-emerald-200 px-3 py-1">Đang mở</Badge>;
    case "CLOSED":
      return <Badge className="rounded-full border border-red-300/50 bg-red-500/20 text-red-200 px-3 py-1">Đã đóng</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

function ClassQuizzesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const classIdParam = searchParams.get("classId");
  const classId = classIdParam ? Number(classIdParam) : NaN;
  const classNameParam = searchParams.get("className") ?? "Không xác định";
  const subjectNameParam = searchParams.get("subjectName") ?? "Chưa rõ môn";

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<QuizDTO[]>([]);

  useEffect(() => {
    if (!classId || Number.isNaN(classId)) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Lấy đủ cả 3 trạng thái để hiển thị tất cả bài của lớp
        const statuses: QuizStatus[] = ["OPEN", "UPCOMING", "CLOSED"];
        const responses: Array<Page<any> | null> = await Promise.all(
          statuses.map((status) =>
            fetchQuizzesByClass({ classId, status, page: 0, size: 200 }).catch((err) => {
              console.warn(`Lỗi khi tải status ${status}:`, err);
              return null;
            })
          )
        );

        const allQuizzes = responses.flatMap((res) => {
          if (!res) return [];
          if (Array.isArray(res.content)) return res.content;
          return [];
        });

        const uniqueQuizzes = allQuizzes.filter(
          (quiz, index, self) => index === self.findIndex((q) => q.id === quiz.id)
        );

        setQuizzes(uniqueQuizzes);
      } catch (err: any) {
        console.error("Lỗi hệ thống:", err);
        setError(err?.message || "Không thể tải danh sách bài kiểm tra.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [classId]);

  const filteredQuizzes = useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return [...quizzes]
      .filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(keyword) ||
          (quiz.description ?? "").toLowerCase().includes(keyword)
      )
      .sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      });
  }, [quizzes, searchTerm]);

  const formatDateTime = (dateString: string) => {
    if(!dateString) return "--:--";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const renderQuizCard = (quiz: QuizDTO) => {
    return (
      <Card key={quiz.id} className="border-white/10 bg-white/5 text-white mb-4 transition hover:bg-white/10">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{quiz.title}</h3>
              {quiz.description && (
                <p className="text-sm text-slate-300 line-clamp-2">{quiz.description}</p>
              )}
            </div>
            {statusBadge(quiz.status)}
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-300" />
              {quiz.timeLimit} phút • {quiz.totalQuestion} câu
            </span>
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-300" />
              {quiz.studentsSubmitted}/{quiz.totalStudents} học sinh
            </span>
          </div>
          <div className="flex items-center text-xs text-slate-400 gap-2">
            <Calendar className="h-3.5 w-3.5" />
            {quiz.status === "UPCOMING"
              ? `Bắt đầu: ${formatDateTime(quiz.startDate)}`
              : `Hết hạn: ${formatDateTime(quiz.endDate)}`}
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              className="flex-1 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
              onClick={() => router.push(`../quizResult/${quiz.id}`)}
            >
              Xem kết quả
            </Button>
            {quiz.status === "UPCOMING" && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl border-white/20 text-white hover:bg-white/10"
                onClick={() => router.push(`../preview?mode=edit&id=${quiz.id}`)}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!classId) return <div className="text-white p-10 text-center">Đang tải thông tin lớp...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại
        </Button>

        <div className="space-y-1">
          <p className="text-sm text-emerald-200">Lớp {classNameParam}</p>
          <h1 className="text-3xl font-bold">Bài kiểm tra của lớp</h1>
          <p className="text-slate-400">{subjectNameParam}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Tìm theo tên bài kiểm tra..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 text-white border-white/10 placeholder:text-slate-500"
          />
          <span className="text-sm text-slate-400">Tổng: {filteredQuizzes.length} bài</span>
        </div>

        {error ? (
          <div className="p-4 text-red-400 border border-red-500/20 bg-red-500/10 rounded-xl text-center">{error}</div>
        ) : isLoading ? (
          <div className="p-8 text-center text-slate-400">Đang tải dữ liệu...</div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border border-white/10 rounded-xl bg-white/5">Không có bài kiểm tra nào.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredQuizzes.map((quiz) => renderQuizCard(quiz))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ClassQuizzesPageWithSuspense() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white p-10">Đang tải...</div>}>
      <ClassQuizzesPage />
    </Suspense>
  );
}