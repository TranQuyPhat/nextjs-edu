import apiClient from "@/lib/axios";

interface AttendanceRecord {
    sessionId: number;
  studentId: number;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note?: string;
}

interface AttendanceData {
  sessionId: number;
  attendance: AttendanceRecord[];
  sessionNote: string;
}

  interface SaveAttendanceResponse {
    success: boolean;
    message?: string;
  }

export const  attendanceService = {
  async getAttendanceBySession(sessionId: number): Promise<AttendanceRecord[]> {

      const response = await apiClient(`/attendance/${sessionId}`);
    return response.data;
  },



  async saveAttendance(attendanceData: AttendanceData): Promise<SaveAttendanceResponse> {
    try {
        console.log ("sessionID", attendanceData.sessionId);
        console.log ("mảng attendance", attendanceData.attendance);

      await apiClient.post(`/attendance/${attendanceData.sessionId}`, attendanceData.attendance);
      return { success: true };
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Không thể lưu điểm danh'
      };
    }
  }
};