"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Eye } from "lucide-react"
import Link from "next/link"

export default function StudentClassesPage() {
  const [user, setUser] = useState<any>(null)
  const [classes] = useState([
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
  const [joinCode, setJoinCode] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleJoinClass = () => {
    // Simulate joining a class
    alert(`Đã tham gia lớp với mã: ${joinCode}`)
    setJoinCode("")
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
              <h1 className="text-3xl font-bold text-gray-900">Lớp học của tôi</h1>
              <p className="text-gray-600">Các lớp học bạn đã tham gia</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Tham gia lớp
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tham gia lớp học</DialogTitle>
                  <DialogDescription>Nhập mã lớp để tham gia</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinCode">Mã lớp</Label>
                    <Input
                      id="joinCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      placeholder="Nhập mã lớp (VD: MATH12A1)"
                    />
                  </div>
                  <Button onClick={handleJoinClass} className="w-full">
                    Tham gia
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{classItem.name}</CardTitle>
                  <CardDescription>Giáo viên: Thầy/Cô {user.fullName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Số học sinh:</span>
                      <span>{classItem.studentCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Ngày tham gia:</span>
                      <span>{classItem.createdAt}</span>
                    </div>
                    <Link href={`/classes/${classItem.id}`}>
                      <Button size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        Vào lớp học
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
