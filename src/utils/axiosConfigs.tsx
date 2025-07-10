import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL = import.meta.env.VITE_BE_URL;
const API_BASE_URL_NODE = import.meta.env.VITE_BE_URL_NODE;

function createHttpClient(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response?.data,
    async (error) => {
      const originalRequest = error.config;
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.response?.data?.Message;

      if (!status || status !== 401) {
        return Promise.reject(error);
      }

      if (
        message === "Mật khẩu không chính xác" ||
        message === "Người dùng không tồn tại"
      ) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      return Promise.reject(error);
    }
  );

  return instance;
}

// Tạo 2 client dùng cùng 1 cấu hình
const http = createHttpClient(API_BASE_URL);
const httpNode = createHttpClient(API_BASE_URL_NODE);

export { http, httpNode };
