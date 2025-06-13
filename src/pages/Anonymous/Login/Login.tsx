import { Form, Input, Button, Spin, Modal } from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import AuthServices from "../../../services/AuthServices";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/authReduxs/authSlice";

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
  const [formLogin] = Form.useForm();
  const dispatch = useDispatch();

  const loginAccout = async () => {
    const values = await formLogin.validateFields();
    try {
      setLoading(true);
      const res = await AuthServices.login(values);
      console.log("Login Response:", res.code);
      if (res.code === 200) {
        dispatch(setUser(res.data));
        onCancel();
        toast.success(
          res.message || "Đăng nhập thành công!"
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
      <Modal
        title={null}
        open={open}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">
            Đăng nhập
          </div>
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
          >
            Quên mật khẩu?
          </div>
        </div>
      </Modal>
    </Spin>
  );
};

export default Login;
