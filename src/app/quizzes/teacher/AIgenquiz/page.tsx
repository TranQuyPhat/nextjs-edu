"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { FileUploadArea } from "@/components/uploader/file-upload-area";
import { FileList } from "@/components/uploader/file-list";
import { QuizSettingsForm } from "@/components/settings/quiz-settings-form";
import { GenerateActions } from "@/components/action/generate-actions";
import { ProcessingScreen } from "@/components/processing/processing-screen";
import { Leaf, Sparkles } from "lucide-react";
import { useQuizStore } from "@/lib/store/quizStore";

export default function HomePage() {
  const { isGenerating } = useQuizStore();

  useEffect(() => {
    // Example welcome toast (once per visit)
    // eslint-disable-next-line no-undef
    if (typeof window !== "undefined" && !sessionStorage.getItem("welcomed")) {
      toast({
        title: "Chào mừng 👋",
        description: "Tạo quiz từ tài liệu của bạn chỉ với vài bước.",
      });
      sessionStorage.setItem("welcomed", "1");
    }
  }, [toast]);

  return (
    <main className="min-h-dvh bg-white">
      <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-500 text-white shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold leading-none">EduQuiz AI</p>
              <p className="text-xs text-muted-foreground">AI Quiz Generator</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              className="border-green-500/30 text-green-700 hover:bg-green-50"
            >
              Hướng dẫn nhanh
            </Button>
            <Button className="bg-green-500 text-white hover:bg-green-600">
              <Sparkles className="mr-2 h-4 w-4" />
              Bắt đầu ngay
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-5">
        <div className="md:col-span-3">
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-700">1) Tải tài liệu</CardTitle>
              <CardDescription>
                Kéo & thả file hoặc chọn từ máy. Hỗ trợ PDF, DOCX, TXT, MD...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploadArea />
              <Separator />
              <FileList />
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="border-green-500/20">
            <CardHeader>
              <CardTitle className="text-green-700">2) Cấu hình AI</CardTitle>
              <CardDescription>
                Tuỳ chỉnh cách sinh câu hỏi và đầu ra mong muốn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <QuizSettingsForm />
              <GenerateActions />
            </CardContent>
          </Card>
          <p className="mt-4 text-xs text-muted-foreground">
            Mẹo: Chọn {/* eslint-disable-next-line react/jsx-no-literals */}
            {'"EXTRACT"'} nếu tài liệu đã có câu hỏi; chọn{" "}
            {/* eslint-disable-next-line react/jsx-no-literals */}
            {'"GENERATE"'} để AI tự tạo từ nội dung.
          </p>
        </div>
      </section>

      {isGenerating ? <ProcessingScreen /> : null}
    </main>
  );
}
