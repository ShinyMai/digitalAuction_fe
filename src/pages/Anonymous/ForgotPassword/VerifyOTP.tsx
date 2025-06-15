import { Form, Input, Button, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../../components/Common/CustomModal";

interface VerifyOTPProps {
  open?: boolean;
  onCancel: () => void;
}

interface FormValues {
  email: string;
  otp: string;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
  open,
  onCancel,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sendOTP, setSendOTP] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(true);

  const [formLogin] = Form.useForm<FormValues>();
  const handleSendOTP = async () => {
    if (email === "") {
      toast.error("Vui lòng nhập Email!");
      return;
    }
    try {
      setLoading(true);
      //   const res = await AuthServices.sendOTP({ email });
      //   if (res.success) {
      //     toast.success("Gửi mã OTP thành công!");
      //     setSendOTP(true);
      //     setSeconds(60);
      //   } else {
      //     toast.error("Vui lòng thử lại!");
      //   }
    } catch (error) {
      console.error("Send OTP Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const values = await formLogin.validateFields();
    try {
      setLoading(true);
      // const res = await AuthServices.verifyOTP(values);
      // if (res.success) {
      //   setIsOTPVerified(true);
      // }
    } catch (error: any) {
      console.error("Verify OTP Failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Đã có lỗi xảy ra. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (seconds <= 0) return;
    const intervalId = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [seconds]);

  return (
    <Spin spinning={loading}>
      <CustomModal
        title={
          isOTPVerified
            ? "Nhập mật khẩu mới"
            : "Xác thực OTP"
        }
        open={open}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        {sendOTP && (
          <div className="error">
            Gửi lại mã OTP sau {seconds} giây
          </div>
        )}
        {isOTPVerified ? (
          <Form
            form={formLogin}
            name="normal_login"
            className="login-form"
            style={{ width: "70%", margin: "auto" }}
          >
            <Form.Item
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới!",
                },
                {
                  min: 6,
                  message:
                    "Mật khẩu phải có ít nhất 6 ký tự!",
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
                placeholder="Vui lòng nhập mật khẩu mới"
              />
            </Form.Item>
            <Form.Item
              name="re-newPassword"
              rules={[
                {
                  required: true,
                  message: "Nhập lại mật khẩu!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      getFieldValue("newPassword") === value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      "Mật khẩu không khớp"
                    );
                  },
                }),
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
                // onPressEnter={loginAccout}
                // onKeyDown={(e) => {
                //   if (e.key === "Enter") {
                //     loginAccout();
                //   }
                // }}
              />
            </Form.Item>
            <Form.Item>
              <Button
                className="login-form-button"
                // onClick={loginAccout}
                style={{
                  backgroundColor: "#3e70a7",
                  color: "white",
                  transform: "translateX(150px)",
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={formLogin}
            name="patient_login"
            className="login-form"
            style={{ width: "70%", margin: "auto" }}
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
              <div
                className="otp"
                style={{ display: "flex" }}
              >
                <Input
                  prefix={
                    <UserOutlined className="site-form-item-icon" />
                  }
                  placeholder="Vui lòng nhập Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button
                  style={{
                    backgroundColor: "#3e70a7",
                    color: "white",
                  }}
                  onClick={handleSendOTP}
                  disabled={seconds > 0}
                >
                  Gửi OTP
                </Button>
              </div>
            </Form.Item>

            <Form.Item
              name="otp"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã OTP!",
                },
              ]}
            >
              <Input
                prefix={
                  <LockOutlined className="site-form-item-icon" />
                }
                placeholder="Nhập mã OTP"
                type="text" // ✅ dùng "text" thay vì "otp"
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="login-form-button"
                onClick={verifyOTP}
                style={{
                  backgroundColor: "#3e70a7",
                  color: "white",
                  transform: "translateX(150px)",
                }}
              >
                Xác nhận OTP
              </Button>
            </Form.Item>
          </Form>
        )}
      </CustomModal>
    </Spin>
  );
};

export default VerifyOTP;
