import { Button, Form, Input, Spin } from "antd";
import {
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import AuthServices from "../../../services/AuthServices";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/authReduxs/authSlice";
import CustomModal from "../../../components/Common/CustomModal";
import VerifyOTP from "../ForgotPassword/VerifyOTP";

interface LoginProps {
  onCancel: () => void;
  open: boolean;
}

const Login: React.FC<LoginProps> = ({
  onCancel,
  open,
}) => {
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] =
    useState(false);
  const [formLogin] = Form.useForm();
  const dispatch = useDispatch();

  console.log(forgotPassword);

  const loginAccout = async () => {
    const values = await formLogin.validateFields();
    try {
      setLoading(true);
      const res = await AuthServices.login(values);
      console.log("Login Response:", res);
      if (res.code === 200) {
        dispatch(setUser(res.data));
        onCancel();
        toast.success(
          res.message || "Đăng nhập thành công!"
        );
      } else {
        setLoginError(true);
        toast.error(
          res.message || "Đăng nhập không thành công!"
        );
      }
    } catch (error) {
      setLoginError(true);
      toast.error("Email hoặc mật khẩu không đúng!");
      console.log("Login Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <CustomModal
        title={"Đăng nhập"}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        <div className="text-center">
          {loginError ? (
            <div className="text-red-500 mb-2">
              Email Hoặc Mật Khẩu không đúng!
            </div>
          ) : null}
          <Form
            form={formLogin}
            name="normal_login"
            className="sm:w-3/4"
            style={{ margin: "auto" }}
          >
            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập Email!",
                },
                {
                  type: "email",
                  message: "Email không hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={
                  <UserOutlined
                    className="site-form-item-icon"
                    style={{ paddingRight: "10px" }}
                  />
                }
                placeholder="Vui lòng nhập Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password
                prefix={
                  <LockOutlined
                    className="site-form-item-icon"
                    style={{ paddingRight: "10px" }}
                  />
                }
                placeholder="Mật khẩu"
                onPressEnter={loginAccout}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    loginAccout();
                  }
                }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="login-form-button"
                onClick={loginAccout}
                style={{
                  backgroundColor: "#3e70a7",
                  color: "white",
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <div
            style={{
              cursor: "pointer",
              color: "#3e70a7",
              marginTop: "-18px",
            }}
            onClick={() => setForgotPassword(true)}
          >
            Quên mật khẩu?
          </div>
        </div>
      </CustomModal>
      {forgotPassword && (
        <VerifyOTP
          open={forgotPassword}
          onCancel={() => setForgotPassword(false)}
        />
      )}
    </Spin>
  );
};

export default Login;
