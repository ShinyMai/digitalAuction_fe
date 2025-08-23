/* eslint-disable @typescript-eslint/no-explicit-any */
import { Col, Form, Input } from "antd";
import { useEffect, useState } from "react";
import CustomModal from "../../../../components/Common/CustomModal";
import AuthServices from "../../../../services/AuthServices";
import {
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";

interface EditAccountProps {
  open: boolean;
  onCancel: () => void;
}

const EditAccount = ({ open, onCancel }: EditAccountProps) => {
  const [formEdit] = Form.useForm();
  const [formOTP] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isSendOTP, setIsSendOTP] = useState(false);

  useEffect(() => {
    if (!open) {
      formEdit.resetFields();
      formOTP.resetFields();
      setIsSendOTP(false);
    }
  }, [open, formEdit, formOTP]);

  const handleCancel = () => {
    formEdit.resetFields();
    formOTP.resetFields();
    setIsSendOTP(false);
    onCancel();
  };
  const updateAccount = async (values: any) => {
    try {
      setLoading(true);
      const res = await AuthServices.updateAccount({
        ...values,
      });

      if (res.code === 200) {
        setIsSendOTP(true);
        toast.success("Đã gửi mã OTP đến email của bạn!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(res.message || "Cập nhật thất bại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating account:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitOTP = async (values: { otpCode: string }) => {
    try {
      setLoading(true);
      const res = await AuthServices.verifyUpdateAccountOTP({
        otpCode: values.otpCode,
      });

      if (res.code === 200) {
        toast.success("Cập nhật thông tin thành công!", {
          position: "top-right",
          autoClose: 3000,
        });
        handleCancel();
        // Reload the page to reflect changes
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        console.error("Error verifying OTP:", res.message);
        toast.error(res.message || "Xác minh OTP thất bại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <CustomModal
      open={open}
      onCancel={handleCancel}
      width={580}
      footer={null}
      title={
        <div className="text-xl font-bold text-white bg-clip-text text-left">
          {isSendOTP ? "Xác minh OTP" : "Chỉnh sửa thông tin liên lạc"}
        </div>
      }
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -bottom-4 -left-4 w-24 h-24 bg-purple-300/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-blue-600 font-semibold">
                {isSendOTP ? "Đang xác minh..." : "Đang cập nhật..."}
              </div>
            </div>
          </div>
        )}

        <div className=" rounded-2xl border border-white/20 shadow-2xl">
          {isSendOTP ? (
            // OTP Form
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 animate-pulse-glow">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>

              <div className="text-2xl font-bold text-gray-800 mb-2">
                Xác minh OTP
              </div>
              <div className="text-gray-600 pb-4">
                Chúng tôi đã gửi mã xác minh đến email của bạn. Vui lòng nhập mã
                để hoàn tất việc cập nhật.
              </div>

              <Form
                form={formOTP}
                onFinish={handleSubmitOTP}
                className="!max-w-md !mx-auto"
              >
                <Form.Item
                  name="otpCode"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mã OTP!",
                    },
                    {
                      len: 6,
                      message: "Mã OTP phải có 6 số!",
                    },
                  ]}
                >
                  <Input
                    placeholder="Nhập mã OTP (6 số)"
                    className="h-14 text-center text-lg font-bold rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                    maxLength={6}
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      w-full h-12 rounded-xl font-bold text-lg transition-all duration-300 transform
                      ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 hover:shadow-xl glow-button"
                      }
                      text-white shadow-lg flex items-center justify-center space-x-2
                    `}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xác minh...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircleOutlined />
                        <span>Xác nhận</span>
                      </>
                    )}
                  </button>
                </Form.Item>
              </Form>
            </div>
          ) : (
            // Edit Form
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse-glow">
                  <LockOutlined className="text-2xl text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  Cập nhật thông tin liên lạc
                </div>
                <div className="text-gray-600">
                  Thay đổi số điện thoại hoặc email để bảo mật tài khoản tốt hơn
                </div>
              </div>

              <Form
                form={formEdit}
                layout="vertical"
                onFinish={updateAccount}
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <PhoneOutlined className="text-white text-xs" />
                    </div>
                    Thông tin liên lạc
                  </div>

                  <div className="space-y-4">
                    <Col span={24}>
                      <Form.Item
                        name="phoneNumber"
                        label={
                          <span className="font-semibold text-gray-700">
                            Số điện thoại
                          </span>
                        }
                        rules={[
                          {
                            pattern:
                              /^0(3[2-9]|5[6|8|9]|7[06-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
                            message: "Số điện thoại không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          prefix={<PhoneOutlined className="text-blue-500" />}
                          placeholder="Nhập số điện thoại mới"
                          className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="email"
                        label={
                          <span className="font-semibold text-gray-700">
                            Email
                          </span>
                        }
                        rules={[
                          {
                            type: "email",
                            message: "Email không hợp lệ",
                          },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined className="text-blue-500" />}
                          placeholder="Nhập email mới"
                          className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                        />
                      </Form.Item>
                    </Col>
                  </div>
                </div>

                <Form.Item className="mb-0">
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={loading}
                      className="!text-white shadow-lg mx-auto space-x-2 w-1/3 h-12 rounded-xl font-bold text-lg transition-all duration-300 transform bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl"
                    >
                      <span> 💾Lưu thay đổi</span>
                    </button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default EditAccount;
