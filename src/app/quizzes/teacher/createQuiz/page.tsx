"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  UploadCloud,
  FileText,
  Edit,
  LayoutGrid,
  BookOpen,
  FileEdit,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useQuizzStorage } from "../../../../lib/store/useQuizzStorage";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Question, QuizzFormData } from "@/types/quiz.type";
import { QuizForm } from "@/components/forms/QuizForm";
import { quizFormSchema } from "@/lib/validation/quizFormSchema";
import { useTeacherClasses } from "../../hook/useTeacherClasses";
import { QuizFormm } from "./QuizForm";
import Navigation from "@/components/navigation";

interface QuizFormDataExtended extends QuizzFormData {
  files: File[];
  fileName?: string;
  classId: number;
  createdBy: number;
}
let token: string | null = null;
if (typeof window !== "undefined") {
  token = localStorage.getItem("accessToken");
}
// API response type

interface ApiResponse {
  questions: Question[];
}

// Function to call API and extract questions
const extractQuestionsFromFiles = async (
  files: File[]
): Promise<Question[]> => {
  const formData = new FormData();

  // Add all files to FormData
  files.forEach((file) => {
    formData.append("file", file);
  });
  // hoặc lấy từ context/store

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/files/extract-questions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    console.log("result :", result);

    return result.questions;
  } catch (error) {
    console.error("Error extracting questions:", error);
    throw error;
  }
};

export default function CreateQuizzPage() {
  const router = useRouter();
  const { setData } = useQuizzStorage();
  const [isLoading, setIsLoading] = useState(false);

  const userStr =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  const userId = userStr ? JSON.parse(userStr).userId : null;

  const { data: classes = [], isLoading: classesLoading } =
    useTeacherClasses(userId);
  console.log("classes :", classes);
  console.log("classes length:", classes?.length);
  console.log("classesLoading:", classesLoading);

  const defaultValues: QuizFormDataExtended = {
    title: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    timeLimit: 20,
    subject: "",
    description: "",
    files: [],
    classId: 0,
    createdBy: userId ?? 0,
    fileName: "",
    questions: [],
  };

  const onsubmit = async (data: QuizFormDataExtended) => {
    console.log("Submit data:", data);

    if (!data.files || data.files.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 file DOCX");
      return;
    }

    setIsLoading(true);

    try {
      const extractedQuestions = await extractQuestionsFromFiles(data.files);

      if (extractedQuestions.length === 0) {
        toast.error("Không tìm thấy câu hỏi hợp lệ trong file.");
        return;
      }

      setData({
        title: data.title,
        startDate: data.startDate,
        endDate: data.endDate,
        classId: data.classId,
        createdBy: data.createdBy,
        timeLimit: data.timeLimit,
        description: data.description,
        fileName: data.files.map((f) => f.name).join(", "),
        questions: extractedQuestions,
      });

      toast.success(
        `Đã trích xuất thành công ${extractedQuestions.length} câu hỏi!`
      );
      router.push("/quizzes/teacher/preview?mode=create");
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Đã xảy ra lỗi khi xử lý file. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIGen = () => {
    router.push("/quizzes/teacher/AIgenquiz");
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-emerald-600/40 via-slate-900 to-slate-950 blur-3xl" />
        <div className="absolute -right-24 top-24 h-64 w-64 rounded-full bg-teal-500/30 blur-[140px]" />
        <div className="absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-indigo-500/30 blur-[150px]" />
        <div className="absolute inset-0 opacity-30">
          {[...Array(30)].map((_, index) => (
            <span
              key={index}
              className="absolute h-1 w-1 rounded-full bg-cyan-200/40"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 21) % 100}%`,
                animation: `pulse 6s ease-in-out ${index * 0.3}s infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <Navigation />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="rounded-[32px] border border-white/5 bg-white/5 p-8 shadow-2xl backdrop-blur-3xl mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.4em] text-emerald-200">
                <Sparkles className="h-3.5 w-3.5" />
                Create Quiz
              </span>
              <h1 className="mt-4 text-4xl font-black md:text-5xl">Tạo Đề Thi Mới</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Lựa chọn phương thức tạo đề thi phù hợp với nhu cầu của bạn. Tạo từ file, AI hoặc ngân hàng đề.
              </p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="rounded-[28px] border-white/10 bg-slate-900/70 text-white shadow-xl backdrop-blur-2xl">
            <CardHeader className="border-b border-white/5 pb-5">
              <div className="flex items-center space-x-3">
                <div className="p-4 bg-emerald-500/20 rounded-2xl border border-emerald-500/30">
                  <FileEdit className="text-emerald-200 w-6 h-6" />
                </div>
                <div className="py-2">
                  <CardTitle className="text-white text-xl">
                    Thông tin đề thi
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Nhập thông tin cơ bản cho đề thi mới
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <QuizFormm
                defaultValues={defaultValues}
                schema={quizFormSchema}
                onSubmit={onsubmit}
                classOptions={classes}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <div>
            <div className="space-y-5">
              <Card className="rounded-[28px] border border-emerald-500/30 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="flex gap-4 items-start p-6">
                  <div className="bg-emerald-500/20 p-4 rounded-2xl border border-emerald-500/30 mt-1">
                    <BookOpen className="text-emerald-200 w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-2">
                      Tạo đề bằng AI
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      Sử dụng AI để tạo đề dựa vào tài liệu
                    </p>
                    <Button
                      className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2 text-sm font-semibold shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600"
                      onClick={handleAIGen}
                    >
                      Tạo đề
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border border-purple-500/30 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="flex gap-4 items-start p-6">
                  <div className="bg-purple-500/20 p-4 rounded-2xl border border-purple-500/30 mt-1">
                    <LayoutGrid className="text-purple-200 w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-2">
                      Tạo đề từ Ngân hàng đề
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      Tự động sinh đề thi dựa trên ngân hàng đề
                    </p>
                    <Button
                      className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-sm font-semibold shadow-purple-500/40 hover:from-purple-600 hover:to-pink-600"
                    >
                      Tạo đề
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border border-amber-500/30 bg-white/5 text-white shadow-xl backdrop-blur-2xl transition hover:-translate-y-1 hover:bg-white/10">
                <CardContent className="flex gap-4 items-start p-6">
                  <div className="bg-amber-500/20 p-4 rounded-2xl border border-amber-500/30 mt-1">
                    <FileText className="text-amber-200 w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white mb-2">
                      Tạo đề offline
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      Upload đề thi giấy hoặc nhập thông tin từ file có sẵn
                    </p>
                    <Button
                      className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 text-sm font-semibold shadow-amber-500/40 hover:from-amber-600 hover:to-orange-600"
                    >
                      Tải lên đề thi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
