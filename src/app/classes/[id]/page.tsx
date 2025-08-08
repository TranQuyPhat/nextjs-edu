"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  Users,
  FileText,
  Upload,
  Download,
  Plus,
  Clock,
  CheckCircle,
  MessageCircle,
  BookOpen,
  Settings,
  Copy,
  Send,
} from "lucide-react"

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [classData, setClassData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("overview")

  
  // back button
  const [redirectPath, setRedirectPath] = useState("/classes")
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user?.role === "teacher") {
      setRedirectPath("/classes/teacher")
    } else if (user?.role === "student") {
      setRedirectPath("/classes/student")
    }
  }, [])

  // Mock data for class details
  const [students] = useState([
    { id: 1, name: "Nguyễn Văn An", email: "an@student.com", joinDate: "2024-01-15", avgGrade: 8.5 },
    { id: 2, name: "Trần Thị Bình", email: "binh@student.com", joinDate: "2024-01-16", avgGrade: 9.2 },
    { id: 3, name: "Lê Văn Cường", email: "cuong@student.com", joinDate: "2024-01-17", avgGrade: 7.8 },
    { id: 4, name: "Phạm Thị Dung", email: "dung@student.com", joinDate: "2024-01-18", avgGrade: 8.9 },
    { id: 5, name: "Hoàng Văn Em", email: "em@student.com", joinDate: "2024-01-19", avgGrade: 8.1 },
  ])

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: "Bài tập Chương 3 - Hàm số",
      description: "Giải các bài tập từ 1 đến 10 trong SGK",
      dueDate: "2024-01-25",
      status: "active",
      submissions: 3,
      totalStudents: 5,
      createdAt: "2024-01-20",
    },
    {
      id: 2,
      title: "Kiểm tra 15 phút - Đạo hàm",
      description: "Bài kiểm tra về quy tắc tính đạo hàm",
      dueDate: "2024-01-22",
      status: "completed",
      submissions: 5,
      totalStudents: 5,
      createdAt: "2024-01-18",
    },
  ])

  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      assignmentId: 1,
      studentId: 1,
      studentName: "Nguyễn Văn An",
      studentEmail: "an@student.com",
      submittedAt: "2024-01-24 14:30",
      fileName: "baitap_chapter3_an.pdf",
      fileSize: "2.1 MB",
      status: "submitted",
      grade: null,
      feedback: "",
      gradedAt: null,
      gradedBy: null,
    },
    {
      id: 2,
      assignmentId: 1,
      studentId: 2,
      studentName: "Trần Thị Bình",
      studentEmail: "binh@student.com",
      submittedAt: "2024-01-23 16:45",
      fileName: "assignment_math_binh.docx",
      fileSize: "1.8 MB",
      status: "graded",
      grade: 8.5,
      feedback: "Bài làm tốt, cần chú ý thêm ở phần 3.",
      gradedAt: "2024-01-24 09:15",
      gradedBy: "Nguyễn Thị Lan",
    },
    {
      id: 3,
      assignmentId: 2,
      studentId: 3,
      studentName: "Lê Văn Cường",
      studentEmail: "cuong@student.com",
      submittedAt: "2024-01-21 11:20",
      fileName: "kiem_tra_dao_ham.pdf",
      fileSize: "1.5 MB",
      status: "graded",
      grade: 9.0,
      feedback: "Bài làm xuất sắc, nắm vững kiến thức.",
      gradedAt: "2024-01-22 10:30",
      gradedBy: "Nguyễn Thị Lan",
    },
  ])

  const [comments, setComments] = useState([
    {
      id: 1,
      assignmentId: 1,
      userId: 1,
      userName: "Nguyễn Văn An",
      userRole: "student",
      content: "Thầy ơi, em không hiểu rõ bài 5, có thể giải thích thêm không ạ?",
      createdAt: "2024-01-24 15:30",
      replies: [
        {
          id: 2,
          userId: 2,
          userName: "Nguyễn Thị Lan",
          userRole: "teacher",
          content: "Bài 5 em cần chú ý đến điều kiện xác định của hàm số. Em xem lại phần lý thuyết ở trang 45 nhé.",
          createdAt: "2024-01-24 16:15",
          isNew: false,
        },
      ],
    },
    {
      id: 3,
      assignmentId: 2,
      userId: 4,
      userName: "Phạm Thị Dung",
      userRole: "student",
      content: "Em cảm ơn thầy về bài kiểm tra. Em đã hiểu rõ hơn về đạo hàm.",
      createdAt: "2024-01-22 11:00",
      replies: [],
    },
  ])

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Chương 3 - Hàm số.pdf",
      type: "pdf",
      size: "2.5 MB",
      uploadDate: "2024-01-15",
      downloads: 12,
    },
    {
      id: 2,
      name: "Bài giảng - Đạo hàm.pptx",
      type: "pptx",
      size: "5.1 MB",
      uploadDate: "2024-01-18",
      downloads: 8,
    },
    {
      id: 3,
      name: "Đề cương ôn tập.docx",
      type: "docx",
      size: "1.2 MB",
      uploadDate: "2024-01-20",
      downloads: 15,
    },
  ])

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
  })

  const [newDocument, setNewDocument] = useState({
    name: "",
    file: null,
  })

  const [newComment, setNewComment] = useState("")
  const [newReply, setNewReply] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [gradingData, setGradingData] = useState({
    grade: "",
    feedback: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock class data - in real app, fetch from API
    setClassData({
      id: params.id,
      name: "Toán 12A1",
      description: "Lớp toán nâng cao cho học sinh khá giỏi",
      code: "MATH12A1",
      studentCount: 5,
      createdAt: "2024-01-15",
      teacher: "Nguyễn Thị Lan",
    })
  }, [params.id])

  const handleCreateAssignment = () => {
    const assignmentData = {
      id: Date.now(),
      ...newAssignment,
      status: "active",
      submissions: 0,
      totalStudents: students.length,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setAssignments([...assignments, assignmentData])
    setNewAssignment({ title: "", description: "", dueDate: "" })
  }

  const handleUploadDocument = () => {
    const documentData = {
      id: Date.now(),
      name: newDocument.name || "Tài liệu mới.pdf",
      type: "pdf",
      size: "1.0 MB",
      uploadDate: new Date().toISOString().split("T")[0],
      downloads: 0,
    }
    setDocuments([...documents, documentData])
    setNewDocument({ name: "", file: null })
  }

  const handleAddComment = (assignmentId) => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      assignmentId,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newComment,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      replies: [],
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  const handleAddReply = (commentId) => {
    if (!newReply.trim()) return

    const reply = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newReply,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      isNew: false,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
    setNewReply("")
    setReplyingTo(null)
  }

  const handleGradeSubmission = (submissionId) => {
    setSubmissions(
      submissions.map((sub) =>
        sub.id === submissionId
          ? {
              ...sub,
              grade: Number.parseFloat(gradingData.grade),
              feedback: gradingData.feedback,
              status: "graded",
              gradedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
              gradedBy: user.name,
            }
          : sub,
      ),
    )
    setGradingData({ grade: "", feedback: "" })
  }

  const getSubmissionsByAssignment = (assignmentId) => {
    return submissions.filter((sub) => sub.assignmentId === assignmentId)
  }

  const getCommentsForAssignment = (assignmentId) => {
    return comments.filter((comment) => comment.assignmentId === assignmentId)
  }

  const getGradeColor = (grade) => {
    if (grade >= 9) return "text-green-600"
    if (grade >= 8) return "text-blue-600"
    if (grade >= 6.5) return "text-yellow-600"
    return "text-red-600"
  }

  const copyClassCode = () => {
    if (classData) {
      navigator.clipboard.writeText(classData.code)
      alert("Đã sao chép mã lớp!")
    }
  }

  const getStatusBadge = (status: string, dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)

    if (status === "completed") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Hoàn thành
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
      <Badge className="bg-blue-500">
        <Clock className="h-3 w-3 mr-1" />
        Đang mở
      </Badge>
    )
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return "📄"
      case "docx":
        return "📝"
      case "pptx":
        return "📊"
      default:
        return "📁"
    }
  }

  const CommentSection = ({ assignment }) => {
    const assignmentComments = getCommentsForAssignment(assignment.id)

    return (
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Bình luận và thảo luận</h4>
          <Badge variant="outline">{assignmentComments.length} bình luận</Badge>
        </div>

        {/* Existing Comments */}
        <div className="space-y-4 mb-6">
          {assignmentComments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{comment.userName}</span>
                    <Badge variant={comment.userRole === "teacher" ? "default" : "secondary"} className="text-xs">
                      {comment.userRole === "teacher" ? "Giáo viên" : "Học sinh"}
                    </Badge>
                    <span className="text-xs text-gray-500">{comment.createdAt}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-3 space-y-3">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="bg-white rounded-lg p-3 ml-4 border-l-2 border-blue-200">
                          <div className="flex items-start space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">{reply.userName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-xs">{reply.userName}</span>
                                <Badge
                                  variant={reply.userRole === "teacher" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {reply.userRole === "teacher" ? "Giáo viên" : "Học sinh"}
                                </Badge>
                                {reply.isNew && <Badge className="bg-red-500 text-xs">Mới</Badge>}
                                <span className="text-xs text-gray-500">{reply.createdAt}</span>
                              </div>
                              <p className="text-xs text-gray-700">{reply.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2 text-xs"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {user?.role === "teacher" ? "Trả lời học sinh" : "Trả lời"}
                  </Button>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Input
                          placeholder={user?.role === "teacher" ? "Trả lời học sinh..." : "Viết phản hồi..."}
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          className="text-sm"
                        />
                        <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!newReply.trim()}>
                          <Send className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {assignmentComments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Chưa có bình luận nào</p>
            </div>
          )}
        </div>

        {/* Add New Comment */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={
                  user?.role === "teacher"
                    ? "Thêm hướng dẫn hoặc thông báo cho bài tập..."
                    : "Đặt câu hỏi hoặc thảo luận về bài tập..."
                }
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                  {user?.role === "teacher"
                    ? "Bạn có thể thêm hướng dẫn hoặc thông báo"
                    : "Bạn có thể hỏi bài hoặc thảo luận với giáo viên"}
                </span>
                <Button size="sm" onClick={() => handleAddComment(assignment.id)} disabled={!newComment.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Gửi bình luận
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user || !classData) {
    return <div>Loading...</div>
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng học sinh</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.studentCount}</div>
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
                <span className="font-mono text-sm">{classData.code}</span>
                <Button size="sm" variant="ghost" onClick={copyClassCode}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Ngày tạo:</span>
              <span className="text-sm">{classData.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Giáo viên:</span>
              <span className="text-sm">{classData.teacher}</span>
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

  const StudentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Danh sách học sinh ({students.length})</h3>
        {user.role === "teacher" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Mời học sinh
          </Button>
        )}
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Học sinh</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ngày tham gia</TableHead>
              <TableHead>Điểm TB</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.joinDate}</TableCell>
                <TableCell>
                  <Badge variant={student.avgGrade >= 8 ? "default" : "secondary"}>{student.avgGrade}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Hoạt động</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )

  const AssignmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Bài tập lớp học</h3>
        {user.role === "teacher" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo bài tập mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tạo bài tập cho {classData.name}</DialogTitle>
                <DialogDescription>Nhập thông tin bài tập cho học sinh trong lớp này</DialogDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn nộp</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                  />
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
        )}
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{assignment.title}</CardTitle>
                  <CardDescription className="mt-1">Hạn nộp: {assignment.dueDate}</CardDescription>
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
                {user.role === "teacher" ? (
                  <>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Xem bài nộp ({getSubmissionsByAssignment(assignment.id).length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Bài nộp - {assignment.title}</DialogTitle>
                          <DialogDescription>Danh sách bài nộp và chấm điểm</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          {getSubmissionsByAssignment(assignment.id).length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>Chưa có bài nộp nào</p>
                            </div>
                          ) : (
                            getSubmissionsByAssignment(assignment.id).map((submission) => (
                              <Card key={submission.id} className="border">
                                <CardHeader className="pb-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarFallback>{submission.studentName.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h4 className="font-medium">{submission.studentName}</h4>
                                        <p className="text-sm text-gray-500">{submission.studentEmail}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      {submission.status === "graded" ? (
                                        <div>
                                          <Badge className="bg-green-500 mb-1">Đã chấm</Badge>
                                          <p className={`text-lg font-bold ${getGradeColor(submission.grade)}`}>
                                            {submission.grade}/10
                                          </p>
                                        </div>
                                      ) : (
                                        <Badge variant="secondary">Chờ chấm</Badge>
                                      )}
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">Tệp đính kèm:</span>
                                      <div className="flex items-center space-x-2">
                                        <FileText className="h-4 w-4" />
                                        <span>{submission.fileName}</span>
                                        <span className="text-gray-500">({submission.fileSize})</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">Nộp lúc:</span>
                                      <span>{submission.submittedAt}</span>
                                    </div>

                                    {submission.status === "graded" && (
                                      <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-sm font-medium mb-1">Nhận xét:</p>
                                        <p className="text-sm text-gray-700">{submission.feedback}</p>
                                        <p className="text-xs text-gray-500 mt-2">
                                          Chấm bởi {submission.gradedBy} lúc {submission.gradedAt}
                                        </p>
                                      </div>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                      <Button size="sm" variant="outline">
                                        <Download className="h-3 w-3 mr-1" />
                                        Tải về
                                      </Button>

                                      {submission.status === "submitted" ? (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button size="sm">Chấm điểm</Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Chấm điểm bài làm</DialogTitle>
                                              <DialogDescription>
                                                {submission.studentName} - {submission.fileName}
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="grade">Điểm số (0-10)</Label>
                                                <Input
                                                  id="grade"
                                                  type="number"
                                                  min="0"
                                                  max="10"
                                                  step="0.1"
                                                  value={gradingData.grade}
                                                  onChange={(e) =>
                                                    setGradingData({
                                                      ...gradingData,
                                                      grade: e.target.value,
                                                    })
                                                  }
                                                  placeholder="Nhập điểm từ 0 đến 10"
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="feedback">Nhận xét</Label>
                                                <Textarea
                                                  id="feedback"
                                                  value={gradingData.feedback}
                                                  onChange={(e) =>
                                                    setGradingData({
                                                      ...gradingData,
                                                      feedback: e.target.value,
                                                    })
                                                  }
                                                  placeholder="Nhập nhận xét cho học sinh..."
                                                  rows={4}
                                                />
                                              </div>
                                              <Button
                                                onClick={() => handleGradeSubmission(submission.id)}
                                                className="w-full"
                                                disabled={
                                                  !gradingData.grade ||
                                                  Number.parseFloat(gradingData.grade) < 0 ||
                                                  Number.parseFloat(gradingData.grade) > 10
                                                }
                                              >
                                                Lưu điểm
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      ) : (
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">
                                              Chỉnh sửa điểm
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Chỉnh sửa điểm</DialogTitle>
                                              <DialogDescription>
                                                {submission.studentName} - {submission.fileName}
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div className="space-y-2">
                                                <Label htmlFor="edit-grade">Điểm số (0-10)</Label>
                                                <Input
                                                  id="edit-grade"
                                                  type="number"
                                                  min="0"
                                                  max="10"
                                                  step="0.1"
                                                  defaultValue={submission.grade}
                                                  onChange={(e) =>
                                                    setGradingData({
                                                      ...gradingData,
                                                      grade: e.target.value,
                                                    })
                                                  }
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="edit-feedback">Nhận xét</Label>
                                                <Textarea
                                                  id="edit-feedback"
                                                  defaultValue={submission.feedback}
                                                  onChange={(e) =>
                                                    setGradingData({
                                                      ...gradingData,
                                                      feedback: e.target.value,
                                                    })
                                                  }
                                                  rows={4}
                                                />
                                              </div>
                                              <Button
                                                onClick={() => handleGradeSubmission(submission.id)}
                                                className="w-full"
                                              >
                                                Cập nhật điểm
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Bình luận ({getCommentsForAssignment(assignment.id).length})
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  </>
                ) : (
                  <>
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
                      Hỏi bài ({getCommentsForAssignment(assignment.id).length})
                    </Button>
                  </>
                )}
              </div>

              <CommentSection assignment={assignment} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const DocumentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Tài liệu lớp học</h3>
        {user.role === "teacher" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tải lên tài liệu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tải lên tài liệu cho {classData.name}</DialogTitle>
                <DialogDescription>Chọn tệp tài liệu để chia sẻ với học sinh</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="docName">Tên tài liệu</Label>
                  <Input
                    id="docName"
                    value={newDocument.name}
                    onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    placeholder="VD: Chương 1 - Giới hạn"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Chọn tệp</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">Hỗ trợ PDF, Word, PowerPoint</p>
                    <p className="text-xs text-gray-500">Tối đa 50MB</p>
                  </div>
                </div>
                <Button onClick={handleUploadDocument} className="w-full">
                  Tải lên
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getFileIcon(doc.type)}</span>
                  <div>
                    <CardTitle className="text-sm font-medium">{doc.name}</CardTitle>
                    <CardDescription className="text-xs">{doc.size}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between text-xs text-gray-500 mb-3">
                <span>Tải lên: {doc.uploadDate}</span>
                <span>{doc.downloads} lượt tải</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                  <Download className="h-3 w-3 mr-1" />
                  Tải về
                </Button>
                {user.role === "teacher" && (
                  <Button size="sm" variant="ghost">
                    <Settings className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
             <Link href={redirectPath}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{classData.name}</h1>
              <p className="text-gray-600">{classData.description}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="students">Học sinh ({students.length})</TabsTrigger>
            <TabsTrigger value="assignments">Bài tập ({assignments.length})</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu ({documents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="students">
            <StudentsTab />
          </TabsContent>

          <TabsContent value="assignments">
            <AssignmentsTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
