"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"


export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    studentId: "",
    teacherId: "",
    subject: "",
  })
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate registration
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...formData,
        id: Date.now(),
      }),
    )
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={100}
            height={100}
            priority 
            className="mx-auto mb-4 object-contain"
          />
          <CardTitle className="text-2xl text-center">Đăng ký tài khoản</CardTitle>
          <CardDescription className="text-center">Tạo tài khoản mới để sử dụng hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 ">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Vai trò</Label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="mt-1 p-2 w-full border rounded-md"
              >
                <option value="" disabled>Chọn vai trò</option>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
              </select>
            </div>

            {formData.role === "student" && (
              <div className="space-y-2">
                <Label htmlFor="studentId">Mã số học sinh</Label>
                <Input
                  id="studentId"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  required
                />
              </div>
            )}

            {formData.role === "teacher" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="teacherId">Mã số giáo viên</Label>
                  <Input
                    id="teacherId"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Môn giảng dạy</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn học" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Toán học</SelectItem>
                      <SelectItem value="physics">Vật lý</SelectItem>
                      <SelectItem value="chemistry">Hóa học</SelectItem>
                      <SelectItem value="biology">Sinh học</SelectItem>
                      <SelectItem value="literature">Ngữ văn</SelectItem>
                      <SelectItem value="english">Tiếng Anh</SelectItem>
                      <SelectItem value="history">Lịch sử</SelectItem>
                      <SelectItem value="geography">Địa lý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 cursor-pointer">
              Đăng ký
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="underline text-green-800">
              Đăng nhập
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
