"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuizEditor } from "@/components/editor/quiz-editor";
import { ConfirmLeaveDialog } from "@/components/shared/confirm-leave-dialog";
import { useQuizzStorage } from "@/lib/store/useQuizzStorage";

export default function QuizEditPage() {
  const router = useRouter();
  const { data: quiz, setData, reset } = useQuizzStorage();
  const [showConfirm, setShowConfirm] = useState(false);

  const title = useMemo(() => {
    const n = quiz?.questions.length ?? 0;
    return `Chỉnh sửa quiz (${n} câu hỏi)`;
  }, [quiz]);

  function onBack() {
    setShowConfirm(true);
  }

  async function onApprove() {
    try {
      // Lấy quiz hiện tại trong store
      const { data: quizData } = useQuizzStorage.getState();

      // Map questions về dạng backend cần
      const mappedQuestions = quizData.questions.map((q) => ({
        questionText: q.question,
        correctOption: q.answer ?? "",
        score: 1,
        options: q.options.map((opt) => ({
          optionLabel: opt.optionLabel,
          optionText: opt.optionText,
        })),
      }));

      // Tạo payload gửi lên backend
      const payload = {
        ...quizData,
        questions: mappedQuestions,
      };

      const res = await fetch("http://localhost:8080/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token thì thêm:
          // "Authorization": `Bearer ${localStorage.getItem("access_token")}`
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi khi gửi quiz: ${errorText}`);
      }

      const result = await res.json();
      console.log("Duyệt quiz thành công:", result);
      router.push("quizzes/teacher"); // Điều hướng sau khi duyệt
    } catch (error) {
      console.error("Gửi quiz thất bại:", error);
    }
  }

  return (
    <main className="min-h-dvh bg-white">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-green-700 hover:bg-green-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <p className="font-semibold text-green-700">{title}</p>
              <p className="text-xs text-muted-foreground">
                Sửa thông tin quiz & câu hỏi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-green-500/30 text-green-700 hover:bg-green-50"
            >
              <Save className="mr-2 h-4 w-4" />
              Lưu tất cả
            </Button>
            <Button
              onClick={onApprove}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Duyệt quiz
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
          <div className="md:col-span-3 space-y-4">
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-700">Thông tin quiz</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Tiêu đề</Label>
                  <Input
                    value={quiz.title}
                    onChange={(e) => setData({ title: e.target.value })}
                    className="border-green-500/30 focus:ring-green-500"
                  />
                </div>
                <div>
                  <Label>Lớp</Label>
                  <Input
                    value={quiz.grade}
                    onChange={(e) => setData({ grade: e.target.value })}
                    className="border-green-500/30"
                  />
                </div>
                <div>
                  <Label>Môn học</Label>
                  <Input
                    value={quiz.subject}
                    onChange={(e) => setData({ subject: e.target.value })}
                    className="border-green-500/30"
                  />
                </div>
                <div>
                  <Label>Thời gian làm (phút)</Label>
                  <Input
                    type="number"
                    value={quiz.time}
                    onChange={(e) => setData({ time: e.target.value })}
                    className="border-green-500/30"
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    value={quiz.description}
                    onChange={(e) => setData({ description: e.target.value })}
                    className="border-green-500/30"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-7">
            <Card className="border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-700">Câu hỏi</CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-6" />
                <QuizEditor />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ConfirmLeaveDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          reset();
          router.push("/");
        }}
      />
    </main>
  );
}
