import axios, {
  type InternalAxiosRequestConfig,
} from "axios";
import store from "../store/store";

const API_BASE_URL = import.meta.env.VITE_BE_URL as string;

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // Gửi cookie HTTP-Only
});

// ✅ Request interceptor: thêm token vào headers
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = store.getState().auth;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
