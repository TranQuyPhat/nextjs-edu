"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Save, Edit3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QuizEditor } from "@/components/editor/quiz-editor";
import { ConfirmLeaveDialog } from "@/components/shared/confirm-leave-dialog";
import { useQuizzStorage } from "@/lib/store/useQuizzStorage";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useUpdateQuizMeta,
  useCreateQuiz,
  useQuiz,
  useReplaceQuizContent,
} from "../../hook/quiz-hooks";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Question } from "@/types/quiz.type";

export default function QuizEditPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: quiz, setData, reset } = useQuizzStorage();

  const mode = searchParams.get("mode") || "create"; // default to create
  const quizId = searchParams.get("id");

  const { data: quizData, isLoading } = useQuiz(
    mode === "edit" ? quizId : undefined
  );
  console.log("quizData :", quizData);
  console.log("quiz :", quiz);

  useEffect(() => {
    if (mode === "edit" && quizData) {
      setData(quizData);
    }
  }, [mode, quizData, setData]);
  const queryClient = useQueryClient();
  const createMutation = useCreateQuiz();
  const updateMetaMutation = useUpdateQuizMeta(Number(quizId));
  const replaceContentMutation = useReplaceQuizContent(Number(quizId));

  const [editedQuestions, setEditedQuestions] = useState<Question[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleQuestionEdit = (updatedQuestion: Question) => {
    setEditedQuestions((prev: Question[]) => {
      const exists = prev.find((q) => q.id === updatedQuestion.id);
      if (exists) {
        return prev.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        );
      }
      return [...prev, updatedQuestion];
    });
  };

  const currentMutation = useMemo(() => {
    switch (mode) {
      case "edit":
        return {
          mutate: async (data: any) => {
            const {
              title,
              classId,
              timeLimit,
              description,
              // questions,
              ...rest
            } = data;

            await updateMetaMutation.mutateAsync({
              title,
              classId,
              timeLimit: Number(timeLimit),
              description,
            });

            // Chỉ gửi các câu hỏi đã chỉnh sửa
            if (editedQuestions.length > 0) {
              await replaceContentMutation.mutateAsync({
                questions: editedQuestions,
                replaceAll: false,
              });
            }
          },
          isPending:
            updateMetaMutation.isPending || replaceContentMutation.isPending,
        };
      case "create":
        return createMutation;
      default:
        return createMutation;
    }
  }, [
    mode,
    createMutation,
    updateMetaMutation,
    replaceContentMutation,
    editedQuestions,
  ]);

  const title = useMemo(() => {
    const n = quiz?.questions.length ?? 0;
    switch (mode) {
      case "edit":
        return `Chỉnh sửa quiz (${n} câu hỏi)`;
      case "create":
        return `Tạo quiz mới (${n} câu hỏi)`;
      default:
        return `Duyệt quiz (${n} câu hỏi)`;
    }
  }, [quiz, mode]);

  const subtitle = useMemo(() => {
    switch (mode) {
      case "edit":
        return "Cập nhật thông tin quiz & câu hỏi";
      case "create":
        return "Tạo quiz mới với câu hỏi";
      default:
        return "Sửa thông tin quiz & câu hỏi";
    }
  }, [mode]);

  function onBack() {
    setShowConfirm(true);
  }

  async function onPrimaryAction() {
    if (mode === "edit") {
      try {
        await updateMetaMutation.mutateAsync({
          title: quiz.title,
          classId: quiz.classId,
          timeLimit: Number(quiz.timeLimit),
          description: quiz.description,
        });
        if (editedQuestions.length > 0) {
          await replaceContentMutation.mutateAsync({
            questions: editedQuestions,
            replaceAll: false,
          });
        }
        toast("Cập nhật quiz thành công");
        router.push("/quizzes/teacher");
      } catch (error) {
        console.error("Cập nhật quiz thất bại:", error);
        toast.error("Cập nhật quiz thất bại");
      }
    } else {
      const mutation = currentMutation;
      const payload = quiz;
      mutation.mutate(payload, {
        onSuccess: (result) => {
          switch (mode) {
            case "create":
              toast("Tạo quiz thành công");
              break;
            default:
              toast("Duyệt quiz thành công");
          }
          queryClient.invalidateQueries({ queryKey: ["quizzes", "teacher"] });
          router.push("/quizzes/teacher");
        },
        onError: (error) => {
          switch (mode) {
            case "create":
              console.error("Tạo quiz thất bại:", error);
              toast.error("Tạo quiz thất bại");
              break;
            default:
              console.error("Gửi quiz thất bại:", error);
              toast.error("Gửi quiz thất bại");
          }
        },
      });
    }
  }

  const primaryButtonConfig = useMemo(() => {
    switch (mode) {
      case "edit":
        return {
          icon: Edit3,
          text: currentMutation.isPending
            ? "Đang cập nhật..."
            : "Cập nhật quiz",
          className: "bg-blue-500 text-white hover:bg-blue-600",
        };
      case "create":
        return {
          icon: Plus,
          text: currentMutation.isPending ? "Đang tạo..." : "Tạo quiz",
          className: "bg-green-500 text-white hover:bg-green-600",
        };
      default:
        return {
          icon: CheckCircle2,
          text: currentMutation.isPending ? "Đang gửi..." : "Duyệt quiz",
          className: "bg-green-500 text-white hover:bg-green-600",
        };
    }
  }, [mode, currentMutation.isPending]);

  const cardTitleConfig = useMemo(() => {
    switch (mode) {
      case "edit":
        return {
          info: "Thông tin quiz",
          questions: "Câu hỏi",
          className: "text-blue-700",
        };
      case "create":
        return {
          info: "Thông tin quiz mới",
          questions: "Câu hỏi",
          className: "text-green-700",
        };
      default:
        return {
          info: "Thông tin quiz",
          questions: "Câu hỏi",
          className: "text-green-700",
        };
    }
  }, [mode]);

  const borderColorClass = useMemo(() => {
    switch (mode) {
      case "edit":
        return "border-blue-500/20";
      case "create":
        return "border-green-500/20";
      default:
        return "border-green-500/20";
    }
  }, [mode]);

  const inputColorClass = useMemo(() => {
    switch (mode) {
      case "edit":
        return "border-blue-500/30 focus:ring-blue-500";
      case "create":
        return "border-green-500/30 focus:ring-green-500";
      default:
        return "border-green-500/30 focus:ring-green-500";
    }
  }, [mode]);

  const backButtonConfig = useMemo(() => {
    switch (mode) {
      case "edit":
        return {
          className: "text-blue-700 hover:bg-blue-50",
        };
      case "create":
        return {
          className: "text-green-700 hover:bg-green-50",
        };
      default:
        return {
          className: "text-green-700 hover:bg-green-50",
        };
    }
  }, [mode]);

  const saveButtonConfig = useMemo(() => {
    switch (mode) {
      case "edit":
        return {
          className: "border-blue-500/30 text-blue-700 hover:bg-blue-50",
        };
      case "create":
        return {
          className: "border-green-500/30 text-green-700 hover:bg-green-50",
        };
      default:
        return {
          className: "border-green-500/30 text-green-700 hover:bg-green-50",
        };
    }
  }, [mode]);

  return (
    <main className="min-h-dvh bg-white">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={onBack}
              className={backButtonConfig.className}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
            <div>
              <p className={`font-semibold ${cardTitleConfig.className}`}>
                {title}
              </p>
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className={saveButtonConfig.className}>
              <Save className="mr-2 h-4 w-4" />
              Lưu tất cả
            </Button>
            <Button
              onClick={onPrimaryAction}
              className={primaryButtonConfig.className}
            >
              <primaryButtonConfig.icon className="mr-2 h-4 w-4" />
              {primaryButtonConfig.text}
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-10">
          <div className="md:col-span-3 space-y-4">
            <Card className={borderColorClass}>
              <CardHeader>
                <CardTitle className={cardTitleConfig.className}>
                  {cardTitleConfig.info}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Tiêu đề</Label>
                  <Input
                    value={quiz?.title || ""}
                    onChange={(e) => setData({ title: e.target.value })}
                    className={`${inputColorClass} mt-2`}
                  />
                </div>
                <div>
                  <Label>ID lớp</Label>
                  <Input
                    value={quiz?.classId || ""}
                    onChange={(e) =>
                      setData({ classId: Number(e.target.value) })
                    }
                    className={`${inputColorClass} mt-2`}
                    disabled={mode === "edit"} // Disable class ID editing in edit mode
                  />
                </div>

                <div>
                  <Label>Thời gian làm (phút)</Label>
                  <Input
                    type="number"
                    value={quiz?.timeLimit || 0}
                    onChange={(e) =>
                      setData({ timeLimit: Number(e.target.value) })
                    }
                    className={`${inputColorClass} mt-2`}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    value={quiz?.description || ""}
                    onChange={(e) => setData({ description: e.target.value })}
                    className={`${inputColorClass} mt-2`}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-7">
            <Card className={borderColorClass}>
              <CardHeader>
                <CardTitle className={cardTitleConfig.className}>
                  {cardTitleConfig.questions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Separator className="mb-6" />
                {mode === "edit" ? (
                  <QuizEditor onQuestionEdit={handleQuestionEdit} />
                ) : (
                  <QuizEditor />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ConfirmLeaveDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
      />
    </main>
  );
}
