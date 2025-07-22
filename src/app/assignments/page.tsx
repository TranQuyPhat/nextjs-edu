"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, Clock, CheckCircle, Upload, MessageCircle } from "lucide-react"

export default function AssignmentsPage() {
  const [user, setUser] = useState<any>(null)
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Bài tập Chương 3 - Hàm số",
      description: "Giải các bài tập từ 1 đến 10 trong SGK",
      className: "Toán 12A1",
      dueDate: "2024-01-25",
      status: "pending",
      submissions: 25,
      totalStudents: 35,
      grade: null,
    },
    {
      id: 2,
      title: "Tiểu luận về Truyện Kiều",
      description: "Viết tiểu luận 1000 từ về tác phẩm Truyện Kiều",
      className: "Văn 12A1",
      dueDate: "2024-01-20",
      status: "submitted",
      submissions: 30,
      totalStudents: 35,
      grade: 8.5,
    },
  ])

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    className: "",
    dueDate: "",
    attachments: [],
  })

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUser(user)
      if (user.role === "teacher") {
        router.push("/assignments/teacher")
      } else {
        router.push("/assignments/student")
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleCreateAssignment = () => {
    const assignmentData = {
      id: Date.now(),
      ...newAssignment,
      status: "pending",
      submissions: 0,
      totalStudents: 35,
      grade: null,
    }
    setAssignments([...assignments, assignmentData])
    setNewAssignment({
      title: "",
      description: "",
      className: "",
      dueDate: "",
      attachments: [],
    })
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)

    if (status === "submitted") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã nộp
        </Badge>
      )
    }
    if (due < now) {
      return (
        <Badge variant="destructive">
          <Clock className="h-3 w-3 mr-1" />
          Quá hạn
        </Badge>
      )
    }
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Chưa nộp
      </Badge>
    )
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const TeacherAssignmentView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài tập</h1>
          <p className="text-gray-600">Tạo và theo dõi bài tập cho học sinh</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài tập mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo bài tập mới</DialogTitle>
              <DialogDescription>Nhập thông tin bài tập cho học sinh</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề bài tập</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="VD: Bài tập Chương 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Mô tả chi tiết về bài tập..."
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Lớp học</Label>
                  <Select onValueChange={(value) => setNewAssignment({ ...newAssignment, className: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toán 12A1">Toán 12A1</SelectItem>
                      <SelectItem value="Toán 11B2">Toán 11B2</SelectItem>
                      <SelectItem value="Toán 10A3">Toán 10A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn nộp</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tệp đính kèm</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Kéo thả tệp hoặc click để chọn</p>
                </div>
              </div>
              <Button onClick={handleCreateAssignment} className="w-full">
                Tạo bài tập
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Đang mở</TabsTrigger>
          <TabsTrigger value="grading">Chờ chấm</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {assignment.className} • Hạn nộp: {assignment.dueDate}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(assignment.status, assignment.dueDate)}
                    <Badge variant="outline">
                      {assignment.submissions}/{assignment.totalStudents} nộp bài
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{assignment.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Xem bài nộp
                  </Button>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Bình luận ({Math.floor(Math.random() * 10)})
                  </Button>
                  <Button size="sm" variant="outline">
                    Chỉnh sửa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )

  const StudentAssignmentView = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bài tập của tôi</h1>
        <p className="text-gray-600">Theo dõi và nộp bài tập</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Chưa nộp</TabsTrigger>
          <TabsTrigger value="submitted">Đã nộp</TabsTrigger>
          <TabsTrigger value="graded">Đã chấm điểm</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {assignments
            .filter((a) => a.status === "pending")
            .map((assignment) => (
              <Card key={assignment.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {assignment.className} • Hạn nộp: {assignment.dueDate}
                      </CardDescription>
                    </div>
                    {getStatusBadge(assignment.status, assignment.dueDate)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Upload className="h-4 w-4 mr-1" />
                          Nộp bài
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nộp bài tập</DialogTitle>
                          <DialogDescription>{assignment.title}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Tải lên tệp bài làm</Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-600">Chọn tệp để tải lên</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="comment">Ghi chú (tùy chọn)</Label>
                            <Textarea id="comment" placeholder="Thêm ghi chú cho bài làm..." rows={3} />
                          </div>
                          <Button className="w-full">Nộp bài</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Hỏi bài
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {assignments
            .filter((a) => a.status === "submitted")
            .map((assignment) => (
              <Card key={assignment.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription className="mt-1">{assignment.className} • Đã nộp</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {getStatusBadge(assignment.status, assignment.dueDate)}
                      {assignment.grade && <Badge className="bg-green-500">Điểm: {assignment.grade}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{assignment.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Xem bài đã nộp
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Xem nhận xét
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user.role === "teacher" ? <TeacherAssignmentView /> : <StudentAssignmentView />}
      </div>
    </div>
  )
}
