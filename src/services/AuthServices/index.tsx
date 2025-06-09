import http from "../../utils/axiosConfigs";
import { AccountAPI } from "./urls";

interface LoginBody {
  email: string;
  password: string;
}

const login = (body: LoginBody) =>
  http.post(AccountAPI.login, body);

const AuthServices = {
  login,
};

export default AuthServices;
