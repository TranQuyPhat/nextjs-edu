"use client";

import type React from "react";

import {
  CheckCircle,
  Clock,
  User,
  GraduationCap,
  BookOpen,
  Timer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface QuizResultData {
  studentName: string;
  className: string;
  subject: string;
  duration: string;
  startTime: string;
  endTime: string;
  score: number;
  totalQuestions: number;
}
interface QuizResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: QuizResultData;
}

export function QuizResultDialog({
  open,
  onOpenChange,
  data,
}: QuizResultDialogProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const scorePercentage = Math.round((data.score / 10) * 100);
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-emerald-200 bg-emerald-500/15";
    if (percentage >= 60) return "text-amber-200 bg-amber-500/15";
    return "text-rose-200 bg-rose-500/15";
  };
  const examDate = data.startTime
    ? new Date(data.startTime).toLocaleDateString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-3xl overflow-hidden border border-white/10 bg-slate-950/85 p-0 text-white backdrop-blur-2xl"
        style={
          {
            "--backdrop-opacity": "0.8",
            "--backdrop-blur": "4px",
          } as React.CSSProperties
        }
      >
        <DialogHeader className="bg-gradient-to-r from-blue-600/80 via-indigo-600/80 to-purple-600/80 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/15 p-2">
              <CheckCircle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-2xl font-bold">
              Kết quả bài kiểm tra
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4 bg-gradient-to-b from-white/5 via-white/0 to-white/5 p-6">
          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="grid gap-4 p-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <User className="h-4 w-4 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Học sinh</p>
                  <p className="font-semibold text-white">{data.studentName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <GraduationCap className="h-4 w-4 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Lớp</p>
                  <p className="font-semibold text-white">{data.className}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <BookOpen className="h-4 w-4 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Môn học</p>
                  <p className="font-semibold text-white">{data.subject}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <Timer className="h-4 w-4 text-emerald-200" />
                </div>
                <div>
                  <p className="text-sm text-slate-300">Thời gian làm bài</p>
                  <p className="font-semibold text-white">{data.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-gradient-to-br from-emerald-500/15 via-white/5 to-indigo-500/10 text-white">
            <CardContent className="space-y-3 p-5 text-center">
              <div>
                <div
                  className={`mx-auto inline-flex rounded-2xl px-4 py-2 text-4xl font-bold ${getScoreColor(
                    scorePercentage
                  )}`}
                >
                  {data.score}/10
                </div>
                <Badge
                  variant="outline"
                  className={`mt-2 border-none px-4 py-1 text-base font-semibold ${getScoreColor(
                    scorePercentage
                  )}`}
                >
                  {scorePercentage}%
                </Badge>
              </div>
              <p className="text-slate-200">
                {scorePercentage >= 80
                  ? "Xuất sắc! Bạn đã làm rất tốt."
                  : scorePercentage >= 60
                  ? "Tốt! Hãy tiếp tục cố gắng."
                  : "Cần cải thiện. Hãy ôn tập thêm nhé!"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-200" />
                  <span className="text-sm text-slate-300">Ngày làm bài</span>
                </div>
                <span className="font-medium text-white">{examDate}</span>
              </div>

              <Separator className="border-white/10" />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-200" />
                  <div>
                    <p className="text-sm text-slate-300">Bắt đầu</p>
                    <p className="font-medium text-white">{data.startTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-emerald-200" />
                  <div>
                    <p className="text-sm text-slate-300">Kết thúc</p>
                    <p className="font-medium text-white">{data.endTime}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-white/30 text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
            <Button className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600">
              Xem chi tiết
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
