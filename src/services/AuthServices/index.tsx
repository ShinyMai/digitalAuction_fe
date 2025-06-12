import http from "../../utils/axiosConfigs";
import { AccountAPI } from "./urls";
import type { RegisterAccount } from "../../types/auth.ts";

interface LoginBody {
  email: string;
  password: string;
}

const login = (body: LoginBody) =>
  http.post(AccountAPI.login, body);

const register = (body: RegisterAccount) =>
  http.post(AccountAPI.register, body);

const AuthServices = {
  login,
  register,
};

export default AuthServices;
