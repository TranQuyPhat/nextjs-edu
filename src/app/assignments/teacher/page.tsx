// "use client"

// import { useState, useEffect } from "react"
// import Navigation from "@/components/navigation"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Badge } from "@/components/ui/badge"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Plus, FileText, Clock, CheckCircle, Upload, MessageCircle, Download, Send } from "lucide-react"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// export default function TeacherAssignmentsPage() {
//   const [user, setUser] = useState<any>(null)
//   const [assignments, setAssignments] = useState([
//     {
//       id: 1,
//       title: "Bài tập Chương 3 - Hàm số",
//       description: "Giải các bài tập từ 1 đến 10 trong SGK",
//       className: "Toán 12A1",
//       dueDate: "2024-01-25",
//       status: "pending",
//       submissions: 25,
//       totalStudents: 35,
//       grade: null,
//     },
//     {
//       id: 2,
//       title: "Tiểu luận về Truyện Kiều",
//       description: "Viết tiểu luận 1000 từ về tác phẩm Truyện Kiều",
//       className: "Văn 12A1",
//       dueDate: "2024-01-20",
//       status: "submitted",
//       submissions: 30,
//       totalStudents: 35,
//       grade: 8.5,
//     },
//   ])

//   const [newAssignment, setNewAssignment] = useState({
//     title: "",
//     description: "",
//     className: "",
//     dueDate: "",
//     attachments: [],
//   })

//   const [submissions, setSubmissions] = useState([
//     {
//       id: 1,
//       assignmentId: 1,
//       studentId: 1,
//       studentName: "Nguyễn Văn An",
//       studentEmail: "an@student.com",
//       submittedAt: "2024-01-24 14:30",
//       fileName: "baitap_chapter3_an.pdf",
//       fileSize: "2.1 MB",
//       status: "submitted",
//       grade: null,
//       feedback: "",
//       gradedAt: null,
//       gradedBy: null,
//     },
//     {
//       id: 2,
//       assignmentId: 1,
//       studentId: 2,
//       studentName: "Trần Thị Bình",
//       studentEmail: "binh@student.com",
//       submittedAt: "2024-01-23 16:45",
//       fileName: "assignment_math_binh.docx",
//       fileSize: "1.8 MB",
//       status: "graded",
//       grade: 8.5,
//       feedback: "Bài làm tốt, cần chú ý thêm ở phần 3.",
//       gradedAt: "2024-01-24 09:15",
//       gradedBy: "Nguyễn Thị Lan",
//     },
//     {
//       id: 3,
//       assignmentId: 2,
//       studentId: 3,
//       studentName: "Lê Văn Cường",
//       studentEmail: "cuong@student.com",
//       submittedAt: "2024-01-19 11:20",
//       fileName: "tieu_luan_truyen_kieu.pdf",
//       fileSize: "3.2 MB",
//       status: "graded",
//       grade: 9.0,
//       feedback: "Bài viết hay, phân tích sâu sắc về tác phẩm.",
//       gradedAt: "2024-01-20 10:30",
//       gradedBy: "Nguyễn Thị Lan",
//     },
//   ])

//   const [comments, setComments] = useState([
//     {
//       id: 1,
//       assignmentId: 1,
//       userId: 1,
//       userName: "Nguyễn Văn An",
//       userRole: "student",
//       content: "Thầy ơi, em không hiểu rõ bài 5, có thể giải thích thêm không ạ?",
//       createdAt: "2024-01-24 15:30",
//       replies: [
//         {
//           id: 2,
//           userId: 2,
//           userName: "Nguyễn Thị Lan",
//           userRole: "teacher",
//           content: "Bài 5 em cần chú ý đến điều kiện xác định của hàm số. Em xem lại phần lý thuyết ở trang 45 nhé.",
//           createdAt: "2024-01-24 16:15",
//           isNew: false,
//         },
//       ],
//     },
//     {
//       id: 3,
//       assignmentId: 2,
//       userId: 1,
//       userName: "Nguyễn Văn An",
//       userRole: "student",
//       content: "Em cảm ơn thầy về nhận xét. Em sẽ cố gắng phát triển thêm ý tưởng trong các bài viết tiếp theo.",
//       createdAt: "2024-01-20 11:00",
//       replies: [],
//     },
//   ])

//   const [selectedSubmission, setSelectedSubmission] = useState(null)
//   const [gradingData, setGradingData] = useState({
//     grade: "",
//     feedback: "",
//   })
//   const [newReply, setNewReply] = useState("")
//   const [replyingTo, setReplyingTo] = useState(null)

//   useEffect(() => {
//     const userData = localStorage.getItem("user")
//     if (userData) {
//       setUser(JSON.parse(userData))
//     }
//   }, [])

//   const handleCreateAssignment = () => {
//     const assignmentData = {
//       id: Date.now(),
//       ...newAssignment,
//       status: "pending",
//       submissions: 0,
//       totalStudents: 35,
//       grade: null,
//     }
//     setAssignments([...assignments, assignmentData])
//     setNewAssignment({
//       title: "",
//       description: "",
//       className: "",
//       dueDate: "",
//       attachments: [],
//     })
//   }

//   const handleGradeSubmission = (submissionId) => {
//     setSubmissions(
//       submissions.map((sub) =>
//         sub.id === submissionId
//           ? {
//               ...sub,
//               grade: Number.parseFloat(gradingData.grade),
//               feedback: gradingData.feedback,
//               status: "graded",
//               gradedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
//               gradedBy: user.name,
//             }
//           : sub,
//       ),
//     )
//     setSelectedSubmission(null)
//     setGradingData({ grade: "", feedback: "" })
//   }

//   const handleAddReply = (commentId) => {
//     if (!newReply.trim()) return

//     const reply = {
//       id: Date.now(),
//       userId: user.id,
//       userName: user.name,
//       userRole: "teacher",
//       content: newReply,
//       createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
//       isNew: false,
//     }

//     setComments(
//       comments.map((comment) =>
//         comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
//       ),
//     )
//     setNewReply("")
//     setReplyingTo(null)
//   }

//   const getSubmissionsByAssignment = (assignmentId) => {
//     return submissions.filter((sub) => sub.assignmentId === assignmentId)
//   }

//   const getCommentsForAssignment = (assignmentId) => {
//     return comments.filter((comment) => comment.assignmentId === assignmentId)
//   }

//   const getGradeColor = (grade) => {
//     if (grade >= 9) return "text-green-600"
//     if (grade >= 8) return "text-blue-600"
//     if (grade >= 6.5) return "text-yellow-600"
//     return "text-red-600"
//   }

//   const getStatusBadge = (status: string, dueDate: string) => {
//     const now = new Date()
//     const due = new Date(dueDate)

//     if (status === "submitted") {
//       return (
//         <Badge className="bg-green-500">
//           <CheckCircle className="h-3 w-3 mr-1" />
//           Đã nộp
//         </Badge>
//       )
//     }
//     if (due < now) {
//       return (
//         <Badge variant="destructive">
//           <Clock className="h-3 w-3 mr-1" />
//           Quá hạn
//         </Badge>
//       )
//     }
//     return (
//       <Badge variant="secondary">
//         <Clock className="h-3 w-3 mr-1" />
//         Chưa nộp
//       </Badge>
//     )
//   }

//   const CommentSection = ({ assignment }) => {
//     const assignmentComments = getCommentsForAssignment(assignment.id)

//     return (
//       <div className="mt-6 border-t pt-6">
//         <div className="flex items-center justify-between mb-4">
//           <h4 className="font-medium text-gray-900">Bình luận và thảo luận</h4>
//           <Badge variant="outline">{assignmentComments.length} bình luận</Badge>
//         </div>

//         {/* Existing Comments */}
//         <div className="space-y-4">
//           {assignmentComments.map((comment) => (
//             <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
//               <div className="flex items-start space-x-3">
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
//                 </Avatar>
//                 <div className="flex-1">
//                   <div className="flex items-center space-x-2 mb-1">
//                     <span className="font-medium text-sm">{comment.userName}</span>
//                     <Badge variant={comment.userRole === "teacher" ? "default" : "secondary"} className="text-xs">
//                       {comment.userRole === "teacher" ? "Giáo viên" : "Học sinh"}
//                     </Badge>
//                     <span className="text-xs text-gray-500">{comment.createdAt}</span>
//                   </div>
//                   <p className="text-sm text-gray-700">{comment.content}</p>

//                   {/* Replies */}
//                   {comment.replies.length > 0 && (
//                     <div className="mt-3 space-y-3">
//                       {comment.replies.map((reply) => (
//                         <div key={reply.id} className="bg-white rounded-lg p-3 ml-4 border-l-2 border-blue-200">
//                           <div className="flex items-start space-x-2">
//                             <Avatar className="h-6 w-6">
//                               <AvatarFallback className="text-xs">{reply.userName.charAt(0)}</AvatarFallback>
//                             </Avatar>
//                             <div className="flex-1">
//                               <div className="flex items-center space-x-2 mb-1">
//                                 <span className="font-medium text-xs">{reply.userName}</span>
//                                 <Badge
//                                   variant={reply.userRole === "teacher" ? "default" : "secondary"}
//                                   className="text-xs"
//                                 >
//                                   {reply.userRole === "teacher" ? "Giáo viên" : "Học sinh"}
//                                 </Badge>
//                                 <span className="text-xs text-gray-500">{reply.createdAt}</span>
//                               </div>
//                               <p className="text-xs text-gray-700">{reply.content}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Reply Button and Input */}
//                   <div className="mt-3">
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       className="text-xs mb-2"
//                       onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
//                     >
//                       <MessageCircle className="h-3 w-3 mr-1" />
//                       Trả lời học sinh
//                     </Button>

//                     {replyingTo === comment.id && (
//                       <div className="flex space-x-2">
//                         <Avatar className="h-6 w-6">
//                           <AvatarFallback className="text-xs">{user?.name?.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1 flex space-x-2">
//                           <Input
//                             placeholder="Trả lời học sinh..."
//                             value={newReply}
//                             onChange={(e) => setNewReply(e.target.value)}
//                             className="text-sm"
//                           />
//                           <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!newReply.trim()}>
//                             <Send className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}

//           {assignmentComments.length === 0 && (
//             <div className="text-center py-6 text-gray-500">
//               <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
//               <p>Chưa có bình luận nào</p>
//             </div>
//           )}
//         </div>
//       </div>
//     )
//   }

//   if (!user) {
//     return <div>Loading...</div>
//   }

//   const TeacherAssignmentView = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Quản lý bài tập</h1>
//           <p className="text-gray-600">Tạo và theo dõi bài tập cho học sinh</p>
//         </div>
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="h-4 w-4 mr-2" />
//               Tạo bài tập mới
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-2xl">
//             <DialogHeader>
//               <DialogTitle>Tạo bài tập mới</DialogTitle>
//               <DialogDescription>Nhập thông tin bài tập cho học sinh</DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="title">Tiêu đề bài tập</Label>
//                 <Input
//                   id="title"
//                   value={newAssignment.title}
//                   onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
//                   placeholder="VD: Bài tập Chương 1"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="description">Mô tả</Label>
//                 <Textarea
//                   id="description"
//                   value={newAssignment.description}
//                   onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
//                   placeholder="Mô tả chi tiết về bài tập..."
//                   rows={4}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="className">Lớp học</Label>
//                   <Select onValueChange={(value) => setNewAssignment({ ...newAssignment, className: value })}>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Chọn lớp" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Toán 12A1">Toán 12A1</SelectItem>
//                       <SelectItem value="Toán 11B2">Toán 11B2</SelectItem>
//                       <SelectItem value="Toán 10A3">Toán 10A3</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="dueDate">Hạn nộp</Label>
//                   <Input
//                     id="dueDate"
//                     type="date"
//                     value={newAssignment.dueDate}
//                     onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-2">
//                 <Label>Tệp đính kèm</Label>
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//                   <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//                   <p className="text-sm text-gray-600">Kéo thả tệp hoặc click để chọn</p>
//                 </div>
//               </div>
//               <Button onClick={handleCreateAssignment} className="w-full">
//                 Tạo bài tập
//               </Button>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <Tabs defaultValue="all" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="all">Tất cả</TabsTrigger>
//           <TabsTrigger value="pending">Đang mở</TabsTrigger>
//           <TabsTrigger value="grading">Chờ chấm</TabsTrigger>
//           <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
//         </TabsList>

//         <TabsContent value="all" className="space-y-4">
//           {assignments.map((assignment) => (
//             <Card key={assignment.id}>
//               <CardHeader>
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <CardTitle className="text-lg">{assignment.title}</CardTitle>
//                     <CardDescription className="mt-1">
//                       {assignment.className} • Hạn nộp: {assignment.dueDate}
//                     </CardDescription>
//                   </div>
//                   <div className="flex gap-2">
//                     {getStatusBadge(assignment.status, assignment.dueDate)}
//                     <Badge variant="outline">
//                       {assignment.submissions}/{assignment.totalStudents} nộp bài
//                     </Badge>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-600 mb-4">{assignment.description}</p>
//                 <div className="flex gap-2">
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Button size="sm" variant="outline">
//                         <FileText className="h-4 w-4 mr-1" />
//                         Xem bài nộp ({getSubmissionsByAssignment(assignment.id).length})
//                       </Button>
//                     </DialogTrigger>
//                     <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
//                       <DialogHeader>
//                         <DialogTitle>Bài nộp - {assignment.title}</DialogTitle>
//                         <DialogDescription>Danh sách bài nộp và chấm điểm</DialogDescription>
//                       </DialogHeader>

//                       <div className="space-y-4">
//                         {getSubmissionsByAssignment(assignment.id).length === 0 ? (
//                           <div className="text-center py-8 text-gray-500">
//                             <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                             <p>Chưa có bài nộp nào</p>
//                           </div>
//                         ) : (
//                           getSubmissionsByAssignment(assignment.id).map((submission) => (
//                             <Card key={submission.id} className="border">
//                               <CardHeader className="pb-3">
//                                 <div className="flex justify-between items-start">
//                                   <div className="flex items-center space-x-3">
//                                     <Avatar className="h-10 w-10">
//                                       <AvatarFallback>{submission.studentName.charAt(0)}</AvatarFallback>
//                                     </Avatar>
//                                     <div>
//                                       <h4 className="font-medium">{submission.studentName}</h4>
//                                       <p className="text-sm text-gray-500">{submission.studentEmail}</p>
//                                     </div>
//                                   </div>
//                                   <div className="text-right">
//                                     {submission.status === "graded" ? (
//                                       <div>
//                                         <Badge className="bg-green-500 mb-1">Đã chấm</Badge>
//                                         <p className={`text-lg font-bold ${getGradeColor(submission.grade)}`}>
//                                           {submission.grade}/10
//                                         </p>
//                                       </div>
//                                     ) : (
//                                       <Badge variant="secondary">Chờ chấm</Badge>
//                                     )}
//                                   </div>
//                                 </div>
//                               </CardHeader>
//                               <CardContent className="pt-0">
//                                 <div className="space-y-3">
//                                   <div className="flex items-center justify-between text-sm">
//                                     <span className="text-gray-600">Tệp đính kèm:</span>
//                                     <div className="flex items-center space-x-2">
//                                       <FileText className="h-4 w-4" />
//                                       <span>{submission.fileName}</span>
//                                       <span className="text-gray-500">({submission.fileSize})</span>
//                                     </div>
//                                   </div>
//                                   <div className="flex items-center justify-between text-sm">
//                                     <span className="text-gray-600">Nộp lúc:</span>
//                                     <span>{submission.submittedAt}</span>
//                                   </div>

//                                   {submission.status === "graded" && (
//                                     <div className="bg-gray-50 p-3 rounded-lg">
//                                       <p className="text-sm font-medium mb-1">Nhận xét:</p>
//                                       <p className="text-sm text-gray-700">{submission.feedback}</p>
//                                       <p className="text-xs text-gray-500 mt-2">
//                                         Chấm bởi {submission.gradedBy} lúc {submission.gradedAt}
//                                       </p>
//                                     </div>
//                                   )}

//                                   <div className="flex gap-2 pt-2">
//                                     <Button size="sm" variant="outline">
//                                       <Download className="h-3 w-3 mr-1" />
//                                       Tải về
//                                     </Button>

//                                     {submission.status === "submitted" ? (
//                                       <Dialog>
//                                         <DialogTrigger asChild>
//                                           <Button
//                                             size="sm"
//                                             onClick={() => {
//                                               setSelectedSubmission(submission)
//                                               setGradingData({ grade: "", feedback: "" })
//                                             }}
//                                           >
//                                             Chấm điểm
//                                           </Button>
//                                         </DialogTrigger>
//                                         <DialogContent>
//                                           <DialogHeader>
//                                             <DialogTitle>Chấm điểm bài làm</DialogTitle>
//                                             <DialogDescription>
//                                               {submission.studentName} - {submission.fileName}
//                                             </DialogDescription>
//                                           </DialogHeader>
//                                           <div className="space-y-4">
//                                             <div className="space-y-2">
//                                               <Label htmlFor="grade">Điểm số (0-10)</Label>
//                                               <Input
//                                                 id="grade"
//                                                 type="number"
//                                                 min="0"
//                                                 max="10"
//                                                 step="0.1"
//                                                 value={gradingData.grade}
//                                                 onChange={(e) =>
//                                                   setGradingData({
//                                                     ...gradingData,
//                                                     grade: e.target.value,
//                                                   })
//                                                 }
//                                                 placeholder="Nhập điểm từ 0 đến 10"
//                                               />
//                                             </div>
//                                             <div className="space-y-2">
//                                               <Label htmlFor="feedback">Nhận xét</Label>
//                                               <Textarea
//                                                 id="feedback"
//                                                 value={gradingData.feedback}
//                                                 onChange={(e) =>
//                                                   setGradingData({
//                                                     ...gradingData,
//                                                     feedback: e.target.value,
//                                                   })
//                                                 }
//                                                 placeholder="Nhập nhận xét cho học sinh..."
//                                                 rows={4}
//                                               />
//                                             </div>
//                                             <Button
//                                               onClick={() => handleGradeSubmission(submission.id)}
//                                               className="w-full"
//                                               disabled={
//                                                 !gradingData.grade ||
//                                                 Number.parseFloat(gradingData.grade) < 0 ||
//                                                 Number.parseFloat(gradingData.grade) > 10
//                                               }
//                                             >
//                                               Lưu điểm
//                                             </Button>
//                                           </div>
//                                         </DialogContent>
//                                       </Dialog>
//                                     ) : (
//                                       <Dialog>
//                                         <DialogTrigger asChild>
//                                           <Button
//                                             size="sm"
//                                             variant="outline"
//                                             onClick={() => {
//                                               setSelectedSubmission(submission)
//                                               setGradingData({
//                                                 grade: submission.grade.toString(),
//                                                 feedback: submission.feedback,
//                                               })
//                                             }}
//                                           >
//                                             Chỉnh sửa điểm
//                                           </Button>
//                                         </DialogTrigger>
//                                         <DialogContent>
//                                           <DialogHeader>
//                                             <DialogTitle>Chỉnh sửa điểm</DialogTitle>
//                                             <DialogDescription>
//                                               {submission.studentName} - {submission.fileName}
//                                             </DialogDescription>
//                                           </DialogHeader>
//                                           <div className="space-y-4">
//                                             <div className="space-y-2">
//                                               <Label htmlFor="edit-grade">Điểm số (0-10)</Label>
//                                               <Input
//                                                 id="edit-grade"
//                                                 type="number"
//                                                 min="0"
//                                                 max="10"
//                                                 step="0.1"
//                                                 value={gradingData.grade}
//                                                 onChange={(e) =>
//                                                   setGradingData({
//                                                     ...gradingData,
//                                                     grade: e.target.value,
//                                                   })
//                                                 }
//                                               />
//                                             </div>
//                                             <div className="space-y-2">
//                                               <Label htmlFor="edit-feedback">Nhận xét</Label>
//                                               <Textarea
//                                                 id="edit-feedback"
//                                                 value={gradingData.feedback}
//                                                 onChange={(e) =>
//                                                   setGradingData({
//                                                     ...gradingData,
//                                                     feedback: e.target.value,
//                                                   })
//                                                 }
//                                                 rows={4}
//                                               />
//                                             </div>
//                                             <Button
//                                               onClick={() => handleGradeSubmission(submission.id)}
//                                               className="w-full"
//                                               disabled={
//                                                 !gradingData.grade ||
//                                                 Number.parseFloat(gradingData.grade) < 0 ||
//                                                 Number.parseFloat(gradingData.grade) > 10
//                                               }
//                                             >
//                                               Cập nhật điểm
//                                             </Button>
//                                           </div>
//                                         </DialogContent>
//                                       </Dialog>
//                                     )}
//                                   </div>
//                                 </div>
//                               </CardContent>
//                             </Card>
//                           ))
//                         )}
//                       </div>
//                     </DialogContent>
//                   </Dialog>
//                   <Button size="sm" variant="outline">
//                     <MessageCircle className="h-4 w-4 mr-1" />
//                     Bình luận ({getCommentsForAssignment(assignment.id).length})
//                   </Button>
//                   <Button size="sm" variant="outline">
//                     Chỉnh sửa
//                   </Button>
//                 </div>

//                 <CommentSection assignment={assignment} />
//               </CardContent>
//             </Card>
//           ))}
//         </TabsContent>
//       </Tabs>
//     </div>
//   )

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navigation />
//       <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//         <TeacherAssignmentView />
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AssignmentTabs } from "@/components/assignment/assignment-tabs"
import type { Assignment, Comment } from "@/types/assignment"

export default function TeacherAssignmentsPage() {
  const [user, setUser] = useState<any>(null)
  const [assignments, setAssignments] = useState<Assignment[]>([
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

  const [comments, setComments] = useState<Comment[]>([
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
  ])

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleAddReply = (commentId: number, content: string) => {
    const reply = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userRole: "teacher" as const,
      content,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      isNew: false,
    }

    setComments(
      comments.map((comment) =>
        comment.id === commentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
      ),
    )
  }

  const handleViewSubmissions = (assignmentId: number) => {
    // Handle view submissions logic
    console.log("View submissions for assignment:", assignmentId)
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
              <h1 className="text-3xl font-bold text-gray-900">Quản lý bài tập</h1>
              <p className="text-gray-600">Tạo và theo dõi bài tập cho học sinh</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo bài tập mới
            </Button>
          </div>

          <AssignmentTabs
            assignments={assignments}
            comments={comments}
            user={user}
            onAddComment={() => {}} // Teachers don't add comments, only reply
            onAddReply={handleAddReply}
            onViewSubmissions={handleViewSubmissions}
            userRole="teacher"
          />
        </div>
      </div>
    </div>
  )
}
