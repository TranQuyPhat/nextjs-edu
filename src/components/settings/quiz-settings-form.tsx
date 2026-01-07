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

  const languages = useMemo(() => ["Tiếng Việt", "English", "Auto"], []);

  const totalQuestions =
    (settings.numOneChoice || 0) +
    (settings.numTrueFalse || 0) +
    (settings.numFillBlank || 0);

  return (
    <div className="space-y-5" data-tour="ai-config">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-green-800">Ngôn ngữ</Label>
          <Select
            value={settings.language || "Tiếng Việt"}
            onValueChange={(v) => updateSettings({ language: v })}
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
          <Label className="text-green-800">Độ khó</Label>
          <Select
            value={settings.difficulty || "medium"}
            onValueChange={(v) => updateSettings({ difficulty: v })}
          >
            <SelectTrigger className="border-green-500/30 focus:ring-green-500">
              <SelectValue placeholder="Chọn độ khó" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Dễ</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="hard">Khó</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-green-500/20">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-green-800">Tiêu đề quiz (tùy chọn)</Label>
              <Input
                placeholder="VD: Ôn tập chương 1 - Đại số"
                className="border-green-500/30 focus-visible:ring-green-500"
                value={settings.quizTitle ?? ""}
                onChange={(e) => updateSettings({ quizTitle: e.target.value })}
              />
            </div>

            <div className="space-y-3 rounded-lg border border-green-500/20 bg-green-50/30 p-4">
              <div className="flex items-center justify-between">
                <Label className="text-green-800 font-semibold">
                  Số lượng câu hỏi
                </Label>
                <span className="text-sm font-medium text-green-700">
                  Tổng: {totalQuestions} câu
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Trắc nghiệm (ONE_CHOICE)
                  </Label>
                  <span className="text-sm font-medium">
                    {settings.numOneChoice || 0}
                  </span>
                </div>
                <Slider
                  value={[settings.numOneChoice || 0]}
                  min={0}
                  max={30}
                  step={1}
                  onValueChange={(v) => updateSettings({ numOneChoice: v[0] })}
                  className="[&_.range]:bg-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Đúng/Sai (TRUE_FALSE)
                  </Label>
                  <span className="text-sm font-medium">
                    {settings.numTrueFalse || 0}
                  </span>
                </div>
                <Slider
                  value={[settings.numTrueFalse || 0]}
                  min={0}
                  max={20}
                  step={1}
                  onValueChange={(v) => updateSettings({ numTrueFalse: v[0] })}
                  className="[&_.range]:bg-green-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">
                    Điền chỗ trống (FILL_BLANK)
                  </Label>
                  <span className="text-sm font-medium">
                    {settings.numFillBlank || 0}
                  </span>
                </div>
                <Slider
                  value={[settings.numFillBlank || 0]}
                  min={0}
                  max={15}
                  step={1}
                  onValueChange={(v) => updateSettings({ numFillBlank: v[0] })}
                  className="[&_.range]:bg-green-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
