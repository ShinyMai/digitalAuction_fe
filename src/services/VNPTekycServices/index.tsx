import http from "../../utils/axiosConfigs";
import { VNPTAPI } from "./urls";

interface LoginBody {
  email: string;
  password: string;
}

const login = (body: LoginBody) =>
  http.post(VNPTAPI.uploadImage, body);

const AuthServices = {
  login,
};

export default AuthServices;
