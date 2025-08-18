import { Option, Question } from "@/types/quiz.type";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit3, Plus, Save, Trash2, X } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

export default function QuestionCard({
  index,
  question,
  onUpdate,
  onDelete,
}: {
  index: number;
  question: Question;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);
  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);
  const handleSave = () => {
    onUpdate(editedQuestion);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuestion(question);
    setIsEditing(false);
  };

  const updateOption = (optionIndex: number, newText: string) => {
    const updatedOptions = editedQuestion.options.map((opt, i) =>
      i === optionIndex ? { ...opt, optionText: newText } : opt
    );
    setEditedQuestion({ ...editedQuestion, options: updatedOptions });
  };

  const addOption = () => {
    const nextLabel = String.fromCharCode(65 + editedQuestion.options.length);
    const newOption: Option = {
      optionLabel: nextLabel,
      optionText: `Đáp án ${nextLabel}`,
    };
    setEditedQuestion({
      ...editedQuestion,
      options: [...editedQuestion.options, newOption],
    });
  };

  const deleteOption = (optionIndex: number) => {
    if (editedQuestion.options.length <= 2) return; // Minimum 2 options

    const currentAnswerLabel = editedQuestion.answer; // "A" | "B" | ...
    const currentAnswerIndex = editedQuestion.options.findIndex(
      (opt) => opt.optionLabel === currentAnswerLabel
    );

    // Xoá option
    const updatedOptions = editedQuestion.options.filter(
      (_, i) => i !== optionIndex
    );

    // Re-label A, B, C...
    const relabeledOptions = updatedOptions.map((opt, i) => ({
      ...opt,
      optionLabel: String.fromCharCode(65 + i),
    }));
    let newAnswerLabel: string;

    if (currentAnswerIndex === optionIndex) {
      // Xoá chính đáp án đúng -> fallback "A" nếu còn, ngược lại rỗng
      newAnswerLabel = relabeledOptions[0]?.optionLabel || "";
    } else {
      const newIndex =
        currentAnswerIndex > optionIndex
          ? currentAnswerIndex - 1
          : currentAnswerIndex;

      newAnswerLabel =
        relabeledOptions[newIndex]?.optionLabel ||
        relabeledOptions[0]?.optionLabel ||
        "";
    }

    setEditedQuestion({
      ...editedQuestion,
      options: relabeledOptions,
      answer: newAnswerLabel,
    });
  };

  const setCorrectAnswer = (optionLabel: string) => {
    setEditedQuestion({ ...editedQuestion, answer: optionLabel });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="font-mono">
              Câu {index + 1}
            </Badge>
            {question.difficulty && (
              <Badge
                variant={
                  question.difficulty === "easy"
                    ? "secondary"
                    : question.difficulty === "medium"
                    ? "default"
                    : "destructive"
                }
              >
                {question.difficulty === "easy"
                  ? "Dễ"
                  : question.difficulty === "medium"
                  ? "Trung bình"
                  : "Khó"}
              </Badge>
            )}
            {question.topic && (
              <Badge variant="outline">{question.topic}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} className="gap-2">
                  <Save className="h-4 w-4" />
                  Lưu
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-2 bg-transparent"
                >
                  <X className="h-4 w-4" />
                  Hủy
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onDelete}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="pb-2 ">
          {isEditing ? (
            <Textarea
              value={editedQuestion.question}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  question: e.target.value,
                })
              }
              className="min-h-[80px] resize-none"
              placeholder="Nhập nội dung câu hỏi..."
            />
          ) : (
            <div className="p-3 bg-muted/50 rounded-md border">
              <p className="text-sm leading-relaxed">{question.question}</p>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            {isEditing && (
              <Button
                size="sm"
                variant="outline"
                onClick={addOption}
                className="gap-2 bg-transparent"
              >
                <Plus className="h-3 w-3" />
                Thêm đáp án
              </Button>
            )}
          </div>

          {isEditing ? (
            <RadioGroup
              value={editedQuestion.answer}
              onValueChange={setCorrectAnswer}
              className="space-y-3"
            >
              {editedQuestion.options.map((option, optionIndex) => (
                <div
                  key={option.optionLabel}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <RadioGroupItem
                    value={option.optionLabel}
                    id={`q${index}-option${optionIndex}`}
                    className="mt-0.5"
                  />
                  <div className="flex-1 flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {option.optionLabel}
                    </Badge>
                    <Input
                      value={option.optionText}
                      onChange={(e) =>
                        updateOption(optionIndex, e.target.value)
                      }
                      className="flex-1"
                      placeholder="Nhập nội dung đáp án..."
                    />
                  </div>
                  {editedQuestion.options.length > 2 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteOption(optionIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-2">
              {question.options.map((option) => (
                <div
                  key={option.optionLabel}
                  className={`flex items-center gap-3 p-3 border rounded-lg transition-colors ${
                    option.optionLabel === question.answer
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                      : "bg-background"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      option.optionLabel === question.answer
                        ? "border-green-500 bg-green-500"
                        : "border-muted-foreground"
                    }`}
                  >
                    {option.optionLabel === question.answer && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {option.optionLabel}
                  </Badge>
                  <span className="text-sm">{option.optionText}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 mt-2">
          <Label className="text-sm font-medium">Giải thích (tùy chọn)</Label>
          {isEditing ? (
            <Textarea
              value={editedQuestion.explanation || ""}
              onChange={(e) =>
                setEditedQuestion({
                  ...editedQuestion,
                  explanation: e.target.value,
                })
              }
              className="min-h-[60px] resize-none mt-2"
              placeholder="Thêm giải thích cho đáp án..."
            />
          ) : (
            <div className="p-3 bg-muted/30 rounded-md border my-2">
              <p className="text-sm text-muted-foreground">
                {question.explanation || "Chưa có giải thích"}
              </p>
            </div>
          )}
        </div>

        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Chủ đề</Label>
              <Input
                value={editedQuestion.topic || ""}
                onChange={(e) =>
                  setEditedQuestion({
                    ...editedQuestion,
                    topic: e.target.value,
                  })
                }
                placeholder="Nhập chủ đề..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Độ khó</Label>
              <Select
                value={editedQuestion.difficulty || "medium"}
                onValueChange={(value: "easy" | "medium" | "hard") =>
                  setEditedQuestion({ ...editedQuestion, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
