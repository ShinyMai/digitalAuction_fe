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
  isExpired: boolean;
}

interface OTPVerifyResponse {
  resetToken: string;
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

const updateAccount = (body: {
  email: string;
  phoneNumber: string;
  passwordOld: string;
  passwordNew: string;
}): Promise<ApiResponse<unknown>> =>
  http.post(AccountAPI.updateAccount, body);

const verifyUpdateAccountOTP = (body: {
  otpCode: string;
}): Promise<ApiResponse<unknown>> =>
  http.post(AccountAPI.verifyUpdateAccountOTP, body);

const updateExpiredProfile = (body: {
  citizenIdentification: string;
  name: string;
  birthDay: string;
  nationality: string;
  gender: string;
  validDate: string;
  originLocation: string;
  recentLocation: string;
  issueDate: string;
  issueBy: string;
}): Promise<ApiResponse<unknown>> =>
  http.post(AccountAPI.updateExpiredProfile, body);

const AuthServices = {
  login,
  register,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getRole,
  logout,
  updateAccount,
  verifyUpdateAccountOTP,
  updateExpiredProfile,
};

export default AuthServices;
