"use client"

import { useState, useEffect } from "react"
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
import { Users, Plus, Copy, Eye, Settings } from "lucide-react"
import Link from "next/link"

export default function TeacherClassesPage() {
  const [user, setUser] = useState<any>(null)
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Toán 12A1",
      description: "Lớp toán nâng cao cho học sinh khá giỏi",
      code: "MATH12A1",
      studentCount: 35,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Toán 11B2",
      description: "Lớp toán cơ bản",
      code: "MATH11B2",
      studentCount: 28,
      createdAt: "2024-01-20",
    },
  ])
  const [newClass, setNewClass] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const generateClassCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const handleCreateClass = () => {
    const classCode = generateClassCode()
    const newClassData = {
      id: Date.now(),
      name: newClass.name,
      description: newClass.description,
      code: classCode,
      studentCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setClasses([...classes, newClassData])
    setNewClass({ name: "", description: "" })
  }

  const copyClassCode = (code: string) => {
    navigator.clipboard.writeText(code)
    alert("Đã sao chép mã lớp!")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <TeacherClassView classes={classes} newClass={newClass} setNewClass={setNewClass} handleCreateClass={handleCreateClass} copyClassCode={copyClassCode} />
      </div>
    </div>
  )
}

const TeacherClassView = (
  {
    classes,
    newClass,
    setNewClass,
    handleCreateClass,
    copyClassCode,
  }: any
) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
        <p className="text-gray-600">Tạo và quản lý các lớp học của bạn</p>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Tạo lớp mới
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo lớp học mới</DialogTitle>
            <DialogDescription>Nhập thông tin để tạo lớp học mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Tên lớp</Label>
              <Input
                id="className"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                placeholder="VD: Toán 12A1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classDescription">Mô tả</Label>
              <Textarea
                id="classDescription"
                value={newClass.description}
                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
                placeholder="Mô tả về lớp học..."
              />
            </div>
            <Button onClick={handleCreateClass} className="w-full">
              Tạo lớp
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{classItem.name}</CardTitle>
                <CardDescription className="mt-1">{classItem.description}</CardDescription>
              </div>
              <Badge variant="secondary">
                <Users className="h-3 w-3 mr-1" />
                {classItem.studentCount}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-mono">{classItem.code}</span>
                <Button size="sm" variant="ghost" onClick={() => copyClassCode(classItem.code)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Link href={`/classes/${classItem.id}`}>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-1" />
                    Xem lớp
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
)