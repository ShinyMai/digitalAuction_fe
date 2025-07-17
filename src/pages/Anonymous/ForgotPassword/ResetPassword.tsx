/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Typography, Progress } from "antd";
import {
  LockOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../../components/Common/CustomModal";
import AuthServices from "../../../services/AuthServices";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface ResetPasswordProps {
  open?: boolean;
  onCancel: () => void;
  email: string;
  resetGuid: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ open, onCancel, email, resetGuid }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 10;
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/\d/.test(password)) strength += 15;
    if (/[@$!%*?&]/.test(password)) strength += 15;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "#ff4d4f";
    if (strength < 60) return "#faad14";
    if (strength < 80) return "#52c41a";
    return "#389e0d";
  };

  const getStrengthText = (strength: number) => {
    if (strength < 30) return "Yếu";
    if (strength < 60) return "Trung bình";
    if (strength < 80) return "Mạnh";
    return "Rất mạnh";
  };

  const extractErrorMessage = (error: unknown): string => {
    return (
      (error as any)?.response?.data?.Message ||
      (error as any)?.response?.data?.message ||
      (error instanceof Error && error.message) ||
      "Đã có lỗi xảy ra. Vui lòng thử lại."
    );
  };

  const resetPassword = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const res = await AuthServices.resetPassword({
        contact: email,
        channel: 0,
        newPassword: values.newPassword,
        resetGuid: resetGuid,
      });

      if (res.code === 200) {
        toast.success("Đặt lại mật khẩu thành công!");
        form.resetFields();
        onCancel();
        navigate("/");
      } else {
        toast.error(res.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      toast.error(errorMessage);
      console.error("Reset password failed:", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <CustomModal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="reset-password-modal"
      styles={{
        body: {
          padding: 0,
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
      style={{ top: 40 }}
    >
      <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-6 right-6 w-32 h-32 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-6 left-6 w-24 h-24 bg-purple-100/30 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <KeyOutlined className="text-white text-3xl" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl opacity-20 blur animate-pulse"></div>
            </div>

            <Title level={3} className="!mb-2 !text-slate-800 font-bold">
              Đặt lại mật khẩu
            </Title>

            <Text className="text-slate-600 text-base leading-relaxed block max-w-md mx-auto">
              Tạo mật khẩu mới mạnh và bảo mật cho tài khoản <strong>{email}</strong>
            </Text>
          </div>{" "}
          {/* Form Section */}
          <Form
            form={form}
            name="reset_password"
            layout="vertical"
            onFinish={resetPassword}
            className="space-y-6"
          >
            {/* Combined Password Fields */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg space-y-6">
              {/* New Password Field */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                    <LockOutlined className="text-white text-sm" />
                  </div>
                  <Text className="font-semibold text-slate-700 text-lg">Mật khẩu mới</Text>
                </div>

                <Form.Item
                  name="newPassword"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu mới!",
                    },
                    {
                      min: 6,
                      message: "Mật khẩu phải có ít nhất 6 ký tự!",
                    },
                    {
                      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                      message:
                        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.",
                    },
                  ]}
                  className="mb-4"
                >
                  <Input.Password
                    size="large"
                    className="rounded-xl border-slate-200 hover:border-blue-400 focus:border-blue-500"
                    placeholder="Nhập mật khẩu mới"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    onChange={(e) => setPasswordStrength(calculatePasswordStrength(e.target.value))}
                  />
                </Form.Item>

                {/* Password Strength Indicator */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Text className="text-sm text-slate-600">Độ mạnh mật khẩu:</Text>
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: getStrengthColor(passwordStrength) }}
                    >
                      {getStrengthText(passwordStrength)}
                    </Text>
                  </div>
                  <Progress
                    percent={passwordStrength}
                    strokeColor={getStrengthColor(passwordStrength)}
                    showInfo={false}
                    size="small"
                  />
                </div>

                {/* Password Requirements */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-6">
                  <div className="flex items-center gap-1">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-slate-600">Ít nhất 6 ký tự</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-slate-600">Chữ hoa & thường</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-slate-600">Có số</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircleOutlined className="text-green-500" />
                    <span className="text-slate-600">Ký tự đặc biệt</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-200"></div>

              {/* Confirm Password Field */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <CheckCircleOutlined className="text-white text-sm" />
                  </div>
                  <Text className="font-semibold text-slate-700 text-lg">Xác nhận mật khẩu</Text>
                </div>

                <Form.Item
                  name="re-newPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        return !value || getFieldValue("newPassword") === value
                          ? Promise.resolve()
                          : Promise.reject(new Error("Mật khẩu không khớp!"));
                      },
                    }),
                  ]}
                  className="mb-0"
                >
                  <Input.Password
                    size="large"
                    className="rounded-xl border-slate-200 hover:border-purple-400 focus:border-purple-500"
                    placeholder="Xác nhận mật khẩu mới"
                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={onCancel}
                size="large"
                className="!border-slate-300 !text-slate-700 !hover:bg-slate-50 !hover:border-slate-400 !rounded-xl !px-8 !py-3 !h-auto !font-semibold !transition-all !duration-300"
              >
                Hủy bỏ
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="!bg-gradient-to-r !from-blue-500 !via-purple-500 !to-pink-500 !hover:from-blue-600 !hover:via-purple-600 !hover:to-pink-600 !border-0 !rounded-xl !px-8 !py-3 !h-auto !font-semibold !shadow-lg !hover:shadow-xl !transition-all !duration-300 !transform !hover:scale-105"
              >
                <KeyOutlined className="mr-2" />
                Đặt lại mật khẩu
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </CustomModal>
  );
};

export default ResetPassword;
