"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2 } from "lucide-react";
import { useQuizzStorage } from "@/lib/store/useQuizzStorage";
import { Question } from "@/types/quiz.type";
import QuestionCard from "./question-card";

export function QuizEditor() {
  const { data, setData } = useQuizzStorage();

  const items = data?.questions ?? [];

  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Không có câu hỏi để hiển thị.
      </p>
    );
  }

  const deleteQuestion = (index: number) => {
    const updatedQuestions = items.filter((_, i) => i !== index);
    setData({ questions: updatedQuestions });
  };

  const updateQuestion = (index: number, updatedQuestion: Question) => {
    const updatedQuestions = items.map((q, i) =>
      i === index ? updatedQuestion : q
    );
    setData({ questions: updatedQuestions });
  };
  return (
    <div className="space-y-6">
      {items.map((q, idx) => (
        <QuestionCard
          key={idx}
          index={idx}
          question={q}
          onUpdate={(updatedQuestion) => updateQuestion(idx, updatedQuestion)}
          onDelete={() => deleteQuestion(idx)}
        />
      ))}
    </div>
  );
}

// function QuestionCard({
//   index,
//   question,
// }: {
//   index: number;
//   question: Question;
// }) {
//   const difficultyOptions = useMemo(() => ["easy", "medium", "hard"], []);

//   return (
//     <Card className="border-green-500/20">
//       <CardContent className="space-y-4 pt-6">
//         <div className="flex flex-wrap items-center justify-between gap-2">
//           <div className="text-sm font-medium text-green-700">Câu {index}</div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="text-red-600 hover:bg-red-50 hover:text-red-700"
//           >
//             <Trash2 className="mr-2 h-4 w-4" />
//             Xoá câu hỏi
//           </Button>
//         </div>

//         <div className="space-y-2">
//           <Textarea
//             value={question.question}
//             className="min-h-[40px] border-green-500/30 focus-visible:ring-green-500"
//             placeholder="Nhập nội dung câu hỏi..."
//           />
//         </div>

//         <div className="space-y-3">
//           <Label className="text-green-800">Phương án trả lời</Label>
//           <div className="space-y-2">
//             {question.options?.map((opt) => {
//               const isCorrect =
//                 opt.optionText.trim() === question.answer?.trim();

//               return (
//                 <div
//                   key={opt.optionLabel}
//                   className="flex items-center gap-2 rounded-md border p-2"
//                 >
//                   <Input
//                     value={opt.optionText}
//                     placeholder="Nội dung phương án"
//                     className={`${
//                       isCorrect
//                         ? "bg-green-50 border-green-500/50 text-green-700"
//                         : "border-gray-300"
//                     } focus-visible:ring-green-500`}
//                     onClick={() => {
//                       // Cho phép set lại đáp án đúng khi review
//                       question.answer = opt.optionText;
//                     }}
//                     readOnly
//                   />
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="text-red-600 hover:bg-red-50 hover:text-red-700"
//                     aria-label="Xoá phương án"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               );
//             })}
//           </div>
//           <Button
//             variant="outline"
//             className="border-green-500/30 text-green-700 hover:bg-green-50"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             Thêm phương án
//           </Button>
//         </div>

//         {/* {question.type === "true_false" && (
//           <div className="space-y-2">
//             <Label className="text-green-800">Đáp án</Label>
//             <RadioGroup
//               value={(question as any).answer ? "true" : "false"}
//               className="flex items-center gap-6"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="true" id={`tf-true-${question.id}`} />
//                 <Label htmlFor={`tf-true-${question.id}`}>Đúng</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="false" id={`tf-false-${question.id}`} />
//                 <Label htmlFor={`tf-false-${question.id}`}>Sai</Label>
//               </div>
//             </RadioGroup>
//           </div>
//         )}

//         {question.type === "free_response" && (
//           <div className="space-y-2">
//             <Label className="text-green-800">
//               Gợi ý/Đáp án mẫu (tuỳ chọn)
//             </Label>
//             <Input
//               value={(question as any).answer ?? ""}
//               placeholder="Nhập đáp án mẫu hoặc để trống"
//               className="border-green-500/30 focus-visible:ring-green-500"
//             />
//           </div>
//         )} */}

//         <div className="space-y-2">
//           <Label className="text-green-800">Giải thích</Label>
//           <Textarea
//             value={question.explanation ?? ""}
//             className="min-h-[60px] border-green-500/30 focus-visible:ring-green-500"
//             placeholder="Thêm giải thích, lý do chọn đáp án..."
//           />
//         </div>

//         <Separator className="!my-4" />
//       </CardContent>
//     </Card>
//   );
// }
