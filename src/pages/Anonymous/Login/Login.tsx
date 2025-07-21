import { Form, Input, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import AuthServices from "../../../services/AuthServices";
import { useState } from "react";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../../store/authReduxs/authSlice";
import CustomModal from "../../../components/Common/CustomModal";
import VerifyOTP from "../ForgotPassword/VerifyOTP";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onCancel: () => void;
  open: boolean;
}

const Login: React.FC<LoginProps> = ({ onCancel, open }) => {
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [formLogin] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginAccout = async () => {
    const values = await formLogin.validateFields();
    try {
      setLoading(true);
      const res = await AuthServices.login(values);
      if (res.code === 200) {
        dispatch(setUser(res?.data));
        onCancel();
        toast.success(res.message || "Đăng nhập thành công!");
        navigate(`/${(res.data?.roleName || "").toLowerCase()}`);
      } else {
        setLoginError(true);
        toast.error(res.message || "Đăng nhập không thành công!");
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
    <CustomModal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={500}
      className="login-modal"
      styles={{
        body: {
          padding: 0,
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
      style={{
        top: "7%",
      }}
    >
      <div className="relative overflow-hidden">
        {/* Background Design */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 opacity-5"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full translate-y-12 -translate-x-12"></div>

        <Spin spinning={loading}>
          <div className="relative z-10 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-float">
                <UserOutlined className="text-3xl text-white" />
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
                Chào mừng trở lại!
              </h2>
              <p className="text-gray-600">Đăng nhập để tiếp tục sử dụng dịch vụ</p>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">!</span>
                  </div>
                  <span className="text-red-700 font-medium">Email hoặc mật khẩu không đúng!</span>
                </div>
              </div>
            )}

            {/* Login Form */}
            <Form form={formLogin} name="modern_login" className="space-y-6" layout="vertical">
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
                <div className="relative">
                  <Input
                    placeholder="Nhập địa chỉ email của bạn"
                    className="pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                    size="large"
                  />
                </div>
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
                <div className="relative">
                  <Input.Password
                    placeholder="Nhập mật khẩu của bạn"
                    size="large"
                    onPressEnter={loginAccout}
                  />
                </div>
              </Form.Item>
              <Form.Item className="mb-4">
                <button
                  type="button"
                  onClick={loginAccout}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 glow-button text-lg"
                >
                  Đăng nhập
                </button>
              </Form.Item>
            </Form>

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setForgotPassword(true)}
                className="text-blue-600 hover:text-purple-600 font-medium transition-colors duration-300 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-300"></div>
              <span className="text-gray-500 text-sm">hoặc</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <span className="text-gray-600">Chưa có tài khoản? </span>
              <button
                type="button"
                onClick={() => {
                  onCancel();
                  navigate("/register");
                }}
                className="text-blue-600 hover:text-purple-600 font-semibold transition-colors duration-300 hover:underline"
              >
                Đăng ký ngay
              </button>
            </div>
          </div>
        </Spin>

        {forgotPassword && (
          <VerifyOTP open={forgotPassword} onCancel={() => setForgotPassword(false)} />
        )}
      </div>
    </CustomModal>
  );
};

export default Login;
