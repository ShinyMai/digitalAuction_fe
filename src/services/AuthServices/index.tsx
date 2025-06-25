import http from "../../utils/axiosConfigs";
import { AccountAPI } from "./urls";
import type { RegisterAccount } from "../../types/auth.ts";
import type { ApiResponse } from "../../types/responseAxios.ts";

interface LoginBody {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  roleName: string;
}

interface OTPVerifyResponse {
  resetGuid: string;
}

const login = (
  body: LoginBody
): Promise<ApiResponse<User>> =>
  http.post(AccountAPI.login, body);

const logout = (): Promise<ApiResponse<unknown>> =>
  http.post(AccountAPI.logout);

const register = (
  body: RegisterAccount
): Promise<ApiResponse<RegisterAccount>> =>
  http.post(AccountAPI.register, body);

const forgotPassword = (body: {
  contact: string;
  channel: number;
}): Promise<ApiResponse<unknown>> =>
  http.post(AccountAPI.forgotPassword, body);

const verifyOTP = (body: {
  contact: string;
  otpCode: string;
  channel: number;
}): Promise<ApiResponse<OTPVerifyResponse>> =>
  http.post(AccountAPI.verifyOTP, body);

const resetPassword = (body: {
  contact: string;
  channel: number;
  newPassword: string;
  resetGuid: string;
}): Promise<ApiResponse<unknown>> =>
  http.post(AccountAPI.resetPassword, body);

const getRole = (): Promise<
  ApiResponse<{ roleId: number; roleName: string }[]>
> => http.get(AccountAPI.getRole);

const AuthServices = {
  login,
  register,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getRole,
  logout,
};

export default AuthServices;
