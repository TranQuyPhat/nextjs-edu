export interface Assignment {
  id: number
  title: string
  description: string
  className: string
  dueDate: string
  status: "pending" | "submitted" | "graded"
  grade?: number | null
  feedback?: string | null
  gradedAt?: string | null
  submittedAt?: string | null
  fileName?: string | null
  submissions?: number
  totalStudents?: number
}

export interface Submission {
  id: number
  assignmentId: number
  studentId: number
  studentName: string
  studentEmail: string
  submittedAt: string
  fileName: string
  fileSize: string
  status: "submitted" | "graded"
  grade?: number | null
  feedback?: string
  gradedAt?: string | null
  gradedBy?: string | null
}

export interface Comment {
  id: number
  assignmentId: number
  userId: number
  userName: string
  userRole: "student" | "teacher"
  content: string
  createdAt: string
  replies: Reply[]
}

export interface Reply {
  id: number
  userId: number
  userName: string
  userRole: "student" | "teacher"
  content: string
  createdAt: string
  isNew?: boolean
}

export interface Notification {
  id: number
  message: string
  isRead: boolean
  createdAt: string
}
