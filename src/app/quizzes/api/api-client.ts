// src/api/api-client.ts
import axios, { AxiosRequestConfig } from "axios";
import { getAccessToken } from "@/lib/auth";

export const apiClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    withCredentials: true,
    timeout: 15000,
});

// Gắn token tự động
apiClient.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(err)
);

