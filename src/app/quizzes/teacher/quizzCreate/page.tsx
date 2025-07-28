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
import { readDocxFile } from "./ReadDocxFile";
import { useRouter } from "next/navigation";
import { useQuizzStorage } from "../lib/store/useQuizzStorage";

export default function CreateQuizzPage() {
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();
  const [subject, setSubject] = useState("");

  const { setData } = useQuizzStorage();

  const [formData, setFormData] = useState({
    title: "Đề kiểm tra 15 phút Toán học - Lớp 10", // ví dụ
    grade: "10",
    subject: "math",
    startDate: new Date().toISOString().split("T")[0], // hôm nay
    endDate: new Date().toISOString().split("T")[0],
    time: "40",
    description: "Đề kiểm tra 15 phút chương I",
    files: [] as File[],
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
    setFormData({ ...formData, files: selectedFiles });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const questionsList = [];
    if (!formData.files || formData.files.length === 0) {
      alert("Vui lòng chọn ít nhất một file .docx");
      return;
    }

    const allQuestions: {
      question: string;
      options: string[];
      answer: string | null;
    }[] = [];

    for (const file of formData.files) {
      const questions = await readDocxFile(file);
      allQuestions.push(...questions);
    }

    const normalizedQuestions = allQuestions.map((q, idx) => ({
      ...q,
      question: `${idx + 1}. ${q.question}`,
    }));

    const firstFile = formData.files[0];

    setData({
      ...formData,
      fileName: firstFile.name,
      questions: normalizedQuestions,
    });

    router.push("/quizzes/teacher/quizzPreview");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800">Tạo Đề Thi Mới</h1>
        <p className="text-slate-600 mt-2">
          Lựa chọn phương thức tạo đề thi phù hợp với nhu cầu của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow">
          <CardHeader className=" rounded-t-lg p-2">
            <div className="flex items-center space-x-3">
              <div className="p-4 bg-blue-100 rounded-lg">
                <FileEdit className=" text-blue-600" />
              </div>
              <div className="py-2">
                <CardTitle className="text-slate-800">
                  Thông tin đề thi
                </CardTitle>
                <CardDescription>
                  Nhập thông tin cơ bản cho đề thi mới
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className=" space-y-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-slate-700">
                  Tên đề thi <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Ví dụ: Đề kiểm tra Toán 15 phút - Lớp 10"
                  className="py-2 border-slate-300 focus:ring-blue-500"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="grade" className="text-slate-700">
                    Khối lớp
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, subject: value })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Chọn khối lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">Lớp 10</SelectItem>
                      <SelectItem value="11">Lớp 11</SelectItem>
                      <SelectItem value="12">Lớp 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject" className="text-slate-700">
                    Môn học <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({ ...formData, subject: value })
                    }
                  >
                    <SelectTrigger className="border-slate-300">
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Toán học</SelectItem>
                      <SelectItem value="literature">Ngữ văn</SelectItem>
                      <SelectItem value="english">Tiếng Anh</SelectItem>
                      <SelectItem value="physics">Vật lý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700">Thời gian giao đề</Label>

                <div className="flex gap-4">
                  <div className="flex flex-col flex-1">
                    <Label
                      htmlFor="startDate"
                      className="text-sm text-slate-500 mb-1"
                    >
                      Từ ngày
                    </Label>
                    <input
                      type="date"
                      id="startDate"
                      className="border border-slate-300 focus:ring-blue-500 p-2 rounded"
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <Label
                      htmlFor="endDate"
                      className="text-sm text-slate-500 mb-1"
                    >
                      Đến ngày
                    </Label>
                    <input
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      type="date"
                      id="endDate"
                      className="border border-slate-300 focus:ring-blue-500 p-2 rounded"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-700">
                  Thời gian làm bài(phút)
                </Label>
                <Input
                  id="time"
                  placeholder="40"
                  className="py-2 border-slate-300 focus:ring-blue-500"
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-slate-700">
                  Mô tả đề thi
                </Label>
                <Textarea
                  id="description"
                  placeholder="Nhập mô tả chi tiết về đề thi..."
                  rows={3}
                  className="border-slate-300 focus:ring-blue-500"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-3">
                <Label className="text-slate-700">
                  Tải lên tệp đính kèm (nếu có)
                </Label>

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        <span className="font-semibold text-blue-600">
                          Click để tải lên
                        </span>{" "}
                        hoặc kéo thả file
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        PDF, DOCX, PPT (Tối đa: 10MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-slate-600 text-sm">
                      Tệp đã chọn:
                    </Label>
                    <ul className="space-y-1">
                      {files.map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between text-sm text-slate-700 bg-slate-100 px-3 py-2 rounded border border-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            <UploadCloud className="w-4 h-4 text-blue-500" />
                            <span className="truncate max-w-xs text-black">
                              {file.name}
                            </span>
                            <span className="text-black  text-xs mt-1">
                              ({(file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 text-white font-medium"
              >
                Tạo đề thi
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <div className="space-y-5">
            <Card className="hover:shadow-lg transition-shadow border border-blue-100">
              <CardContent className=" flex gap-4 items-start">
                <div className="bg-blue-100 p-3 rounded-lg mt-1">
                  <Edit className="text-blue-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-800">
                    Tự soạn đề thi / Bài tập
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Sử dụng trình soạn thảo trực quan của hệ thống để tạo đề thi
                    với đầy đủ các loại câu hỏi
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    Bắt đầu soạn đề
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-green-100">
              <CardContent className=" flex gap-4 items-start">
                <div className="bg-green-100 p-3 rounded-lg mt-1">
                  <BookOpen className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-800">
                    Đề thi đánh giá năng lực
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Sử dụng bộ đề có sẵn theo chuẩn đánh giá năng lực của Bộ
                    GD&amp;ĐT
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 text-green-600 border-green-300 hover:bg-green-50"
                  >
                    Chọn bộ đề
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-purple-100">
              <CardContent className=" flex gap-4 items-start">
                <div className="bg-purple-100 p-3 rounded-lg mt-1">
                  <LayoutGrid className="text-purple-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-800">
                    Tạo đề từ Ma trận đề
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Tự động sinh đề thi dựa trên ma trận kiến thức và cấu trúc
                    đề thi
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    Thiết lập ma trận
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border border-orange-100">
              <CardContent className=" flex gap-4 items-start">
                <div className="bg-orange-100 p-3 rounded-lg mt-1">
                  <FileText className="text-orange-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-base text-slate-800">
                    Tạo đề offline
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Upload đề thi giấy hoặc nhập thông tin từ file có sẵn
                  </p>
                  <Button
                    variant="outline"
                    className="mt-3 text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    Tải lên đề thi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
