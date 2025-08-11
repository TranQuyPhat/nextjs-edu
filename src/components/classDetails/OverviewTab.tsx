"use client"

import { FC } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Upload, CheckCircle, BookOpen, Copy } from "lucide-react"

interface OverviewTabProps {
  classData: {
    id: number
    studentCount: number
    code: string
    createdAt: string
    teacher: {
      id: number
      fullName: string
      // có thể thêm email, avatar, v.v nếu cần
    }
  }
  assignments: {
    id: number
    status: "active" | "closed"
  }[]
  documents: any[]
  countstudents: number
  onCopyClassCode: () => void
}

export const OverviewTab: FC<OverviewTabProps> = ({ classData, assignments, documents,countstudents, onCopyClassCode }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng học sinh</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{countstudents}</div>
          <p className="text-xs text-muted-foreground">Đang hoạt động</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bài tập</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{assignments.length}</div>
          <p className="text-xs text-muted-foreground">
            {assignments.filter((a) => a.status === "active").length} đang mở
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tài liệu</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{documents.length}</div>
          <p className="text-xs text-muted-foreground">Đã tải lên</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Nguyễn Văn An đã nộp bài tập</p>
              <p className="text-xs text-muted-foreground">2 giờ trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Upload className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Đã tải lên tài liệu mới</p>
              <p className="text-xs text-muted-foreground">1 ngày trước</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Users className="h-5 w-5 text-purple-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Hoàng Văn Em đã tham gia lớp</p>
              <p className="text-xs text-muted-foreground">3 ngày trước</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin lớp học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Mã lớp:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{classData.id}</span>
              <Button size="sm" variant="ghost" onClick={onCopyClassCode}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Ngày tạo:</span>
            <span className="text-sm">{new Date(classData.createdAt).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Giáo viên:</span>
            <span className="text-sm">{classData.teacher?.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Trạng thái:</span>
            <Badge className="bg-green-500">Đang hoạt động</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)
