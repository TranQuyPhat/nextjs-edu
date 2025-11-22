import axios from "axios";

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor gửi token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token && token !== "undefined" && token !== "") {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem("accessToken");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor xử lý response và lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log chi tiết lỗi để debug
    if (error.response) {
      // Server trả về response với status code ngoài 2xx
      console.error("API Error Response:", {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
        headers: error.response.headers,
      });
      
      // Xử lý lỗi 401 (token hết hạn hoặc invalid)
      if (error.response.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          window.location.href = "/auth/login";
        }
      }
      
      // Xử lý lỗi 500 (Internal Server Error)
      if (error.response.status === 500) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           error.response.data?.errorMessage ||
                           "Lỗi máy chủ (500). Vui lòng thử lại sau.";
        const fullUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;
        
        console.error("❌ Server Error (500):", {
          endpoint: fullUrl,
          method: error.config?.method?.toUpperCase(),
          message: errorMessage,
          details: error.response.data,
          timestamp: new Date().toISOString(),
        });
        
        // Hiển thị toast notification cho user
        if (typeof window !== "undefined") {
          // Import toast dynamically để tránh circular dependency
          import("react-toastify").then(({ toast }) => {
            toast.error(`Lỗi máy chủ: ${errorMessage}`, {
              autoClose: 5000,
            });
          }).catch(() => {
            // Fallback nếu không thể import toast
            console.error("Không thể hiển thị toast notification");
          });
        }
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error("API Error - No Response:", {
        url: error.config?.url,
        method: error.config?.method,
        message: "No response from server. Check if backend is running.",
      });
    } else {
      // Lỗi khi setup request
      console.error("API Error - Request Setup:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
