"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Loader2, FileText } from "lucide-react";
import type { QuizzFormData } from "@/types/quiz.type";
import { QuizUploadGuide } from "@/app/quizzes/components/QuizUploadGuide";

export interface QuizFormDataExtended extends QuizzFormData {
  files: File[];
  classId: number;
  createdBy: number;
}

interface QuizFormProps {
  defaultValues: QuizFormDataExtended;
  schema: any;
  onSubmit: (data: QuizFormDataExtended) => Promise<void> | void;
  classOptions: {
    id: number;
    className: string;
    subject: { id: number; name: string };
  }[];
  isLoading?: boolean;
}

export function QuizFormm({
  defaultValues,
  schema,
  onSubmit,
  classOptions,
  isLoading = false,
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

  useEffect(() => {
    console.log("❗ Form Errors:", errors);
    console.log("❗ classOptions received:", classOptions);
    console.log("❗ classOptions length:", classOptions?.length);
    console.log("❗ classOptions is array:", Array.isArray(classOptions));
  }, [errors, classOptions]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setValue("files", selected);
    setSelectedFiles(selected);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white">Tiêu đề</Label>
        <Input
          id="title"
          placeholder="Nhập tiêu đề đề thi"
          {...register("title")}
          disabled={isLoading}
          className="bg-white/5 text-white placeholder:text-slate-500 border-white/10 focus:border-emerald-500/50"
        />
        {errors.title && (
          <p className="text-red-400 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="classId" className="text-white">Khối lớp</Label>
          <Controller
            control={control}
            name="classId"
            render={({ field }) => (
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(val) => {
                  const selectedClass = classOptions.find(
                    (c) => c.id.toString() === val
                  );
                  field.onChange(Number(val));
                  if (selectedClass) {
                    setValue("subject", selectedClass.subject?.name || "");
                  }
                }}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-white/5 text-white border-white/10">
                  <SelectValue placeholder="Chọn lớp học" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-white/10 text-white z-50 max-h-[300px]">
                  {Array.isArray(classOptions) && classOptions.length > 0 ? (
                    classOptions.map((cls) => (
                      <SelectItem 
                        key={cls.id} 
                        value={cls.id.toString()}
                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                      >
                        {cls.className}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-center text-slate-400 text-sm">
                      Không có lớp học nào
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.classId && (
            <p className="text-red-400 text-sm">{errors.classId.message}</p>
          )}
        </div>
        <div className="space-y-2 w-full">
          <Label className="text-white">Môn học</Label>
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Input 
                {...field} 
                disabled 
                className="bg-white/5 text-white border-white/10 opacity-60"
              />
            )}
          />
          {errors.subject && (
            <p className="text-red-400 text-sm">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-white">Ngày bắt đầu</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register("startDate")}
            disabled={isLoading}
            className="bg-white/5 text-white border-white/10 focus:border-emerald-500/50"
          />
          {errors.startDate && (
            <p className="text-red-400 text-sm">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-white">Ngày kết thúc</Label>
          <Input
            id="endDate"
            type="datetime-local"
            {...register("endDate")}
            disabled={isLoading}
            className="bg-white/5 text-white border-white/10 focus:border-emerald-500/50"
          />
          {errors.endDate && (
            <p className="text-red-400 text-sm">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeLimit" className="text-white">Thời lượng (phút)</Label>
        <Input
          id="timeLimit"
          type="number"
          placeholder="VD: 40"
          min={1}
          step={1}
          inputMode="numeric"
          {...register("timeLimit")}
          disabled={isLoading}
          className="bg-white/5 text-white placeholder:text-slate-500 border-white/10 focus:border-emerald-500/50"
        />
        {errors.timeLimit && (
          <p className="text-red-400 text-sm">{errors.timeLimit.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-white">Mô tả đề</Label>
        <Textarea
          id="description"
          placeholder="Nhập mô tả cho đề thi"
          {...register("description")}
          disabled={isLoading}
          className="bg-white/5 text-white placeholder:text-slate-500 border-white/10 focus:border-emerald-500/50 min-h-[100px]"
        />
        {errors.description && (
          <p className="text-red-400 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* File PDF */}
      <div className="space-y-2">
        <Label htmlFor="files" className="text-white">Tệp PDF</Label>
        <div className="relative">
          <Input
            id="files"
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="bg-white/5 text-white border-white/10 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/20 file:text-emerald-200 file:cursor-pointer hover:file:bg-emerald-500/30"
          />
        </div>
        {errors.files && (
          <p className="text-red-400 text-sm">
            {(errors.files as any)?.message}
          </p>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-300 mb-2">Đã chọn {selectedFiles.length} file:</p>
          <ul className="text-sm text-slate-400 space-y-1">
            {selectedFiles.map((file, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-200" />
                {file.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-6 text-base font-semibold shadow-emerald-500/40 hover:from-emerald-600 hover:to-teal-600 transition-all"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Đang xử lý...
          </>
        ) : (
          "Tiếp tục"
        )}
      </Button>
    </form>
  );
}
