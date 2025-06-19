import axios, {
  type InternalAxiosRequestConfig,
} from "axios";
import { logout } from "../store/authReduxs/authSlice";
import store from "../store/store";

const API_BASE_URL = import.meta.env.VITE_BE_URL;

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
});

http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
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

    // store.dispatch(logout());
    // window.location.href = "/login";

    return Promise.reject(error);
  }
);

export default http;
