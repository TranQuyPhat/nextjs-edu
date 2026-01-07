import apiClient from "@/lib/axios";

interface AttendanceRecord {
  sessionId: number;
  studentId: number;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  note?: string;
}

interface BulkAttendanceRequestDTO {
  noteSession: string;
  records: AttendanceRecord[];
}

interface SaveAttendanceResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp?: number;
}

export const attendanceService = {
  async getAttendanceBySession(sessionId: number): Promise<AttendanceRecord[]> {
    const response = await apiClient(`/attendance/${sessionId}`);
    return response.data;
  },

  async saveAttendance(
    sessionId: number,
    data: BulkAttendanceRequestDTO
  ): Promise<SaveAttendanceResponse> {
    console.log("[attendanceService] Sending request - sessionId:", sessionId);
    console.log("[attendanceService] Payload:", data);

    const response = await apiClient.post(`/attendance/${sessionId}`, data);

    console.log("[attendanceService] Response received:", response.data);

    return response.data; // Backend trả về APIResponse<Void>
  },
};