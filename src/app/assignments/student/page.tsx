"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Upload, MessageCircle, Clock, CheckCircle, FileText, Send, Bell } from "lucide-react"

export default function StudentAssignmentsPage() {
  const [user, setUser] = useState<any>(null)
  const [assignments] = useState([
    {
      id: 1,
      title: "Bài tập Chương 3 - Hàm số",
      description: "Giải các bài tập từ 1 đến 10 trong SGK",
      className: "Toán 12A1",
      dueDate: "2024-01-25",
      status: "submitted",
      grade: 8.5,
      feedback: "Bài làm tốt, cần chú ý thêm ở phần 3.",
      gradedAt: "2024-01-24 09:15",
      submittedAt: "2024-01-24 14:30",
      fileName: "baitap_chapter3.pdf",
    },
    {
      id: 2,
      title: "Tiểu luận về Truyện Kiều",
      description: "Viết tiểu luận 1000 từ về tác phẩm Truyện Kiều",
      className: "Văn 12A1",
      dueDate: "2024-01-20",
      status: "graded",
      grade: 9.0,
      feedback: "Bài viết hay, phân tích sâu sắc về tác phẩm. Tiếp tục phát huy!",
      gradedAt: "2024-01-20 10:30",
      submittedAt: "2024-01-19 11:20",
      fileName: "tieu_luan_truyen_kieu.pdf",
    },
    {
      id: 3,
      title: "Bài tập Hình học không gian",
      description: "Giải các bài tập về thể tích khối đa diện",
      className: "Toán 12A1",
      dueDate: "2024-01-28",
      status: "pending",
      grade: null,
      feedback: null,
      gradedAt: null,
      submittedAt: null,
      fileName: null,
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
          isNew: true,
        },
      ],
    },
    {
      id: 3,
      assignmentId: 2,
      userId: 1,
      userName: "Nguyễn Văn An",
      userRole: "student",
      content: "Em cảm ơn thầy về nhận xét. Em sẽ cố gắng phát triển thêm ý tưởng trong các bài viết tiếp theo.",
      createdAt: "2024-01-20 11:00",
      replies: [],
    },
  ])

  const [newComment, setNewComment] = useState("")
  const [newReply, setNewReply] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: "Giáo viên đã trả lời bình luận của bạn trong bài 'Bài tập Chương 3'",
      isRead: false,
      createdAt: "2024-01-24 16:15",
    },
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleAddComment = (assignmentId) => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now(),
      assignmentId,
      userId: user.id,
      userName: user.name,
      userRole: "student",
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
      userRole: "student",
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

  const getCommentsForAssignment = (assignmentId) => {
    return comments.filter((comment) => comment.assignmentId === assignmentId)
  }

  const getUnreadNotifications = () => {
    return notifications.filter((n) => !n.isRead).length
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)))
  }

  const getStatusBadge = (status: string, dueDate: string, grade: number | null) => {
    const now = new Date()
    const due = new Date(dueDate)

    if (status === "graded") {
      return (
        <Badge className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          Đã chấm điểm
        </Badge>
      )
    }
    if (status === "submitted") {
      return (
        <Badge className="bg-blue-500">
          <Clock className="h-3 w-3 mr-1" />
          Chờ chấm điểm
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

  const getGradeColor = (grade: number) => {
    if (grade >= 9) return "text-green-600"
    if (grade >= 8) return "text-blue-600"
    if (grade >= 6.5) return "text-yellow-600"
    return "text-red-600"
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
                    Trả lời
                  </Button>

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="mt-3 flex space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{user?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 flex space-x-2">
                        <Input
                          placeholder="Viết phản hồi..."
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
        </div>

        {/* Add New Comment */}
        <div className="bg-white border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Đặt câu hỏi hoặc thảo luận về bài tập..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="mb-3"
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Bạn có thể hỏi bài hoặc thảo luận với giáo viên</span>
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

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Bài tập của tôi</h1>
              <p className="text-gray-600">Theo dõi và nộp bài tập</p>
            </div>

            {/* Notification Bell */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="relative bg-transparent">
                  <Bell className="h-4 w-4" />
                  {getUnreadNotifications() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-xs">
                      {getUnreadNotifications()}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thông báo</DialogTitle>
                  <DialogDescription>Các phản hồi và cập nhật mới</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border ${
                        notification.isRead ? "bg-gray-50" : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.createdAt}</p>
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2 text-xs"
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          Đánh dấu đã đọc
                        </Button>
                      )}
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p className="text-center text-gray-500 py-4">Không có thông báo mới</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
                        {getStatusBadge(assignment.status, assignment.dueDate, assignment.grade)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{assignment.description}</p>
                      <div className="flex gap-2 mb-4">
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
                      </div>

                      <CommentSection assignment={assignment} />
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
                          <CardDescription className="mt-1">
                            {assignment.className} • Nộp lúc: {assignment.submittedAt}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(assignment.status, assignment.dueDate, assignment.grade)}
                          {assignment.grade && (
                            <Badge className={`${getGradeColor(assignment.grade)} bg-white border`}>
                              Điểm: {assignment.grade}/10
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{assignment.description}</p>
                      {assignment.feedback && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <p className="text-sm font-medium text-blue-800 mb-1">Nhận xét từ giáo viên:</p>
                          <p className="text-sm text-blue-700">{assignment.feedback}</p>
                          <p className="text-xs text-blue-600 mt-2">Chấm lúc: {assignment.gradedAt}</p>
                        </div>
                      )}
                      <div className="flex gap-2 mb-4">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Xem bài đã nộp
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Thảo luận ({getCommentsForAssignment(assignment.id).length})
                        </Button>
                      </div>

                      <CommentSection assignment={assignment} />
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="graded" className="space-y-4">
              {assignments
                .filter((a) => a.status === "graded")
                .map((assignment) => (
                  <Card key={assignment.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {assignment.className} • Chấm lúc: {assignment.gradedAt}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {getStatusBadge(assignment.status, assignment.dueDate, assignment.grade)}
                          <Badge className={`${getGradeColor(assignment.grade)} bg-white border font-bold`}>
                            {assignment.grade}/10
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{assignment.description}</p>

                      {/* Hiển thị điểm và nhận xét */}
                      <div className="bg-green-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-green-800">Kết quả chấm điểm</h4>
                          <span className={`text-2xl font-bold ${getGradeColor(assignment.grade)}`}>
                            {assignment.grade}/10
                          </span>
                        </div>
                        {assignment.feedback && (
                          <div>
                            <p className="text-sm font-medium text-green-800 mb-1">Nhận xét:</p>
                            <p className="text-sm text-green-700">{assignment.feedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mb-4">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Xem bài đã nộp
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Thảo luận ({getCommentsForAssignment(assignment.id).length})
                        </Button>
                      </div>

                      <CommentSection assignment={assignment} />
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
