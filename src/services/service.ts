// services/classService.ts
import apiClient from '@/lib/axios';
import { ClassItem } from '@/types/classes';



// Lấy danh sách lớp
export const getClasses = async (): Promise<ClassItem[]> => {
  const response = await apiClient.get<ClassItem[]>('/classes');
  return response.data;
};

// Lấy chi tiết 1 lớp
export const getClassById = async (id: number): Promise<ClassItem> => {
  const response = await apiClient.get<ClassItem>(`/classes/${id}`);
  return response.data;
};

// Tạo lớp mới
export const createClass = async (data: Partial<ClassItem>): Promise<ClassItem> => {
  const response = await apiClient.post<ClassItem>('/classes', data);
  return response.data;
};

