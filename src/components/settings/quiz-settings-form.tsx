"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useQuizStore } from "@/lib/store/quizStore";

export function QuizSettingsForm() {
  const { settings, updateSettings } = useQuizStore();

  const languages = useMemo(
    () => ["Auto", "English", "Tiếng Việt", "Spanish", "French", "German"],
    []
  );

  return (
    <div className="space-y-5" data-tour="ai-config">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-green-800">Chế độ sinh (Mode)</Label>
          <Select
            defaultValue={settings.studyMode}
            onValueChange={(v) => updateSettings({ studyMode: v as any })}
          >
            <SelectTrigger className="border-green-500/30 focus:ring-green-500">
              <SelectValue placeholder="Chọn chế độ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GENERATE">GENERATE</SelectItem>
              <SelectItem value="EXTRACT">EXTRACT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-green-800">Ngôn ngữ</Label>
          <Select
            defaultValue={settings.language}
            onValueChange={(v) => updateSettings({ language: v as any })}
          >
            <SelectTrigger className="border-green-500/30 focus:ring-green-500">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-green-800">Loại câu hỏi</Label>
          <Select
            defaultValue={settings.questionType}
            onValueChange={(v) => updateSettings({ questionType: v as any })}
          >
            <SelectTrigger className="border-green-500/30 focus:ring-green-500">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
              <SelectItem value="True/False">True/False</SelectItem>
              <SelectItem value="Free Response">Free Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-green-800">Độ khó</Label>
          <Select
            defaultValue={settings.difficulty}
            onValueChange={(v) => updateSettings({ difficulty: v as any })}
          >
            <SelectTrigger className="border-green-500/30 focus:ring-green-500">
              <SelectValue placeholder="Chọn độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-green-500/20">
        <CardContent className="pt-6">
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label className="text-green-800">
                Số lượng câu hỏi: {settings.numQuestions}
              </Label>
              <Slider
                defaultValue={[settings.numQuestions || 10]}
                min={1}
                max={50}
                step={1}
                onValueChange={(v) => updateSettings({ numQuestions: v[0] })}
                className="[&_.range]:bg-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-green-800">Tiêu đề quiz (tùy chọn)</Label>
              <Input
                placeholder="VD: Ôn tập chương 1 - Đại số"
                className="border-green-500/30 focus-visible:ring-green-500"
                value={settings.quizTitle ?? ""}
                onChange={(e) => updateSettings({ quizTitle: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
