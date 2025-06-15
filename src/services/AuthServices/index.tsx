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

const login = (
  body: LoginBody
): Promise<ApiResponse<User>> =>
  http.post(AccountAPI.login, body);

const register = (body: RegisterAccount) =>
  http.post<ApiResponse<RegisterAccount>>(
    AccountAPI.register,
    body
  );

const verify = () =>
  http.get<ApiResponse<unknown>>(AccountAPI.verify);

const AuthServices = {
  login,
  register,
  verify,
};

export default AuthServices;
