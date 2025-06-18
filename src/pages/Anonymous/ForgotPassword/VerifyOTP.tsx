/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../../components/Common/CustomModal";
import AuthServices from "../../../services/AuthServices";
import ResetPassword from "./ResetPassword";

interface VerifyOTPProps {
  open?: boolean;
  onCancel: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({
  open,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sendOTP, setSendOTP] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [resetGuid, setResetGuid] = useState("");
  const [emailValue, setEmailValue] = useState("");

  const email = Form.useWatch("email", form) || emailValue;

  const extractErrorMessage = (error: unknown): string => {
    return (
      (error as any)?.response?.data?.Message ||
      (error as any)?.response?.data?.message ||
      "Đã xảy ra lỗi."
    );
  };
  const handleSendOTP = async () => {
    if (!email) {
      toast.error("Vui lòng nhập Email!");
      return;
    }
    try {
      setLoading(true);
      const res = await AuthServices.forgotPassword({
        contact: email,
        channel: 0,
      });

      if (res.code === 200) {
        toast.success(res.message);
        setSendOTP(true);
        setSeconds(60);
        setEmailValue(email);
        form.setFieldsValue({ email: email });
      } else {
        toast.error("Vui lòng thử lại!");
      }
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      console.error("Send OTP Failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const res = await AuthServices.verifyOTP({
        contact: values.email,
        otpCode: values.otp,
        channel: 0,
      });

      if (res.code === 200) {
        toast.success("Xác thực OTP thành công!");
        setIsOTPVerified(true);
        setResetGuid(res?.data?.resetGuid || "");
      } else {
        toast.error(res.message || "OTP không chính xác!");
      }
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      console.error("Verify OTP Failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(
      () => setSeconds((prev) => prev - 1),
      1000
    );
    return () => clearInterval(interval);
  }, [seconds]);

  // Reset form khi modal đóng và mở lại
  useEffect(() => {
    if (open && !isOTPVerified) {
      // Reset các state khi mở modal mới
      setSendOTP(false);
      setSeconds(0);
      setEmailValue("");
      form.resetFields();
    }
  }, [open, isOTPVerified, form]);
  return (
    <>
      <CustomModal
        title="Xác thực OTP"
        open={open && !isOTPVerified}
        onCancel={onCancel}
        footer={null}
        width={600}
      >
        <Spin spinning={loading}>
          {sendOTP && (
            <div className="text-center mb-4 text-red-500">
              Gửi lại mã OTP sau {seconds} giây
            </div>
          )}

          <Form
            form={form}
            name="verify_otp"
            className="login-form"
            style={{ width: "70%", margin: "auto" }}
          >
            {" "}
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
              <div style={{ display: "flex", gap: "8px" }}>
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Vui lòng nhập Email"
                  value={emailValue || undefined}
                  onChange={(e) => {
                    setEmailValue(e.target.value);
                    form.setFieldsValue({
                      email: e.target.value,
                    });
                  }}
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
                prefix={<LockOutlined />}
                placeholder="Nhập mã OTP"
                type="text"
              />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={verifyOTP}
                style={{
                  backgroundColor: "#3e70a7",
                  color: "white",
                  display: "block",
                  margin: "0 auto",
                }}
              >
                Xác nhận OTP
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </CustomModal>

      <ResetPassword
        open={isOTPVerified}
        onCancel={() => {
          setIsOTPVerified(false);
          onCancel();
        }}
        email={email}
        resetGuid={resetGuid}
      />
    </>
  );
};

export default VerifyOTP;
