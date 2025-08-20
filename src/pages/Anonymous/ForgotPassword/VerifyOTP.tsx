/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Typography } from "antd";
import {
  MailOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../../components/Common/CustomModal";
import AuthServices from "../../../services/AuthServices";
import ResetPassword from "./ResetPassword";

const { Title, Text } = Typography;

interface VerifyOTPProps {
  open?: boolean;
  onCancel: () => void;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ open, onCancel }) => {
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
        setResetGuid(res?.data?.resetToken || "");
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
    const interval = setInterval(() => setSeconds((prev) => prev - 1), 1000);
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
        open={open && !isOTPVerified}
        onCancel={onCancel}
        footer={null}
        width={700}
        className="verify-otp-modal"
        styles={{
          body: {
            padding: 0,
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            marginTop: "50px",
          },
        }}
      >
        <div className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-6 right-6 w-32 h-32 bg-green-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-6 left-6 w-24 h-24 bg-blue-100/30 rounded-full blur-2xl"></div>
          </div>

          <div className="relative z-10 p-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                  <SafetyOutlined className="text-white text-3xl" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl opacity-20 blur animate-pulse"></div>
              </div>

              <Title level={3} className="!mb-2 !text-slate-800 font-bold">
                Xác thực OTP
              </Title>

              <Text className="text-slate-600 text-base leading-relaxed block max-w-md mx-auto">
                {!sendOTP
                  ? "Nhập email của bạn để nhận mã xác thực OTP"
                  : "Nhập mã OTP đã được gửi đến email của bạn"}
              </Text>
            </div>
            {/* Timer Section */}
            {sendOTP && seconds > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border border-amber-200">
                <div className="flex items-center justify-center gap-2">
                  <ClockCircleOutlined className="text-amber-600 text-lg" />
                  <Text className="text-amber-700 font-semibold">
                    Gửi lại mã OTP sau{" "}
                    <span className="text-orange-600 font-bold">{seconds}</span>{" "}
                    giây
                  </Text>
                </div>
              </div>
            )}
            {/* Form Section */}
            <Form
              form={form}
              name="verify_otp"
              layout="vertical"
              className="space-y-6"
            >
              {/* Combined Email and OTP Section */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg space-y-6">
                {/* Email Input Section */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                      <MailOutlined className="text-white text-sm" />
                    </div>
                    <Text className="font-semibold text-slate-700 text-lg">
                      Địa chỉ Email
                    </Text>
                  </div>

                  <div className="flex flex-col gap-3">
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
                      className="flex-1 mb-0"
                    >
                      <Input
                        size="large"
                        className="!rounded-xl !border-slate-200 !hover:border-blue-400 !focus:border-blue-500"
                        placeholder="Nhập địa chỉ email của bạn"
                        value={emailValue || undefined}
                        onChange={(e) => {
                          setEmailValue(e.target.value);
                          form.setFieldsValue({
                            email: e.target.value,
                          });
                        }}
                      />
                    </Form.Item>

                    <Button
                      size="large"
                      onClick={handleSendOTP}
                      disabled={seconds > 0 || loading}
                      loading={loading && !sendOTP}
                      className={`!rounded-xl !font-semibold !transition-all !duration-300 mx-auto  ${
                        seconds > 0
                          ? "!bg-slate-200 !text-slate-500 !border-slate-300"
                          : "!bg-gradient-to-r !from-blue-500 !to-green-500 !hover:from-blue-600 !hover:to-green-600 !text-white !border-0 !shadow-lg !hover:shadow-xl !transform !hover:scale-105"
                      }`}
                      icon={<SendOutlined />}
                    >
                      {sendOTP ? "Gửi lại" : "Gửi OTP"}
                    </Button>
                  </div>
                </div>

                {/* Divider */}
                {sendOTP && <div className="border-t border-slate-200"></div>}

                {/* OTP Input Section */}
                {sendOTP && (
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <SafetyOutlined className="text-white text-sm" />
                      </div>
                      <Text className="font-semibold text-slate-700 text-lg">
                        Mã OTP
                      </Text>
                    </div>

                    <Form.Item
                      name="otp"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã OTP!",
                        },
                        {
                          len: 6,
                          message: "Mã OTP phải có 6 ký tự!",
                        },
                      ]}
                      className="mb-4"
                    >
                      <Input
                        size="large"
                        className="rounded-xl border-slate-200 hover:border-purple-400 focus:border-purple-500 text-center text-lg font-mono tracking-widest"
                        placeholder="Nhập mã OTP 6 ký tự"
                        maxLength={6}
                      />
                    </Form.Item>

                    <div className="text-center">
                      <Text className="text-slate-500 text-sm">
                        Không nhận được mã?
                        {seconds > 0 ? (
                          `Thử lại sau ${seconds}s`
                        ) : (
                          <Button
                            type="link"
                            onClick={handleSendOTP}
                            className="!p-0 !h-auto !text-blue-600 !hover:text-blue-700"
                          >
                            Gửi lại OTP
                          </Button>
                        )}
                      </Text>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 pt-4">
                {sendOTP && (
                  <Button
                    onClick={verifyOTP}
                    type="primary"
                    loading={loading && sendOTP}
                    size="large"
                    className="!bg-gradient-to-r !from-green-500 !via-blue-500 !to-purple-500 !hover:from-green-600 !hover:via-blue-600 !hover:to-purple-600 !text-white !border-0 !rounded-xl !px-8 !py-3 !h-auto !font-semibold !shadow-lg !hover:shadow-xl !transition-all !duration-300 !transform !hover:scale-105"
                  >
                    <CheckCircleOutlined className="mr-2" />
                    Xác nhận OTP
                  </Button>
                )}
              </div>
            </Form>
          </div>
        </div>
      </CustomModal>
      <ResetPassword
        open={isOTPVerified}
        onCancel={() => {
          setIsOTPVerified(false);
        }}
        email={email}
        resetGuid={resetGuid}
      />
    </>
  );
};

export default VerifyOTP;
