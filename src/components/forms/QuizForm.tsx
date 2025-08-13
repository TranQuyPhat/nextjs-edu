"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { QuizzFormData } from "@/types/quiz.type";

export interface QuizFormDataExtended extends QuizzFormData {
  files: File[];
  classId: number;
  createdBy: number;
}

interface QuizFormProps {
  defaultValues: QuizFormDataExtended;
  schema: any;
  onSubmit: (data: QuizFormDataExtended) => Promise<void> | void;
  subjectOptions: { label: string; value: string }[];
}

export function QuizForm({
  defaultValues,
  schema,
  onSubmit,
  subjectOptions,
}: QuizFormProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<QuizFormDataExtended>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setValue("files", selected);
    setSelectedFiles(selected);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Tiêu đề" {...register("title")} />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}

      <Input placeholder="Khối lớp" {...register("grade")} />
      {errors.grade && (
        <p className="text-red-500 text-sm">{errors.grade.message}</p>
      )}

      <Controller
        control={control}
        name="subject"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn môn học" />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.subject && (
        <p className="text-red-500 text-sm">{errors.subject.message}</p>
      )}

      <Input type="date" {...register("startDate")} />
      {errors.startDate && (
        <p className="text-red-500 text-sm">{errors.startDate.message}</p>
      )}

      <Input type="date" {...register("endDate")} />
      {errors.endDate && (
        <p className="text-red-500 text-sm">{errors.endDate.message}</p>
      )}

      <Input
        type="number"
        placeholder="Thời gian làm bài (phút)"
        {...register("time")}
      />
      {errors.time && (
        <p className="text-red-500 text-sm">{errors.time.message}</p>
      )}

      <Textarea placeholder="Mô tả đề" {...register("description")} />
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description.message}</p>
      )}

      <Input type="file" multiple accept=".docx" onChange={handleFileChange} />
      {errors.files && (
        <p className="text-red-500 text-sm">{(errors.files as any)?.message}</p>
      )}

      {selectedFiles.length > 0 && (
        <ul className="text-sm text-gray-600">
          {selectedFiles.map((file, idx) => (
            <li key={idx}>📄 {file.name}</li>
          ))}
        </ul>
      )}

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Tiếp tục
      </Button>
    </form>
  );
}
