import { useEffect, useState } from "react";
import { Col, Form, Input } from "antd";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthServices from "../../../services/AuthServices";
import CustomModal from "../../../components/Common/CustomModal";
import {
  LockOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";

interface ChangePasswordProps {
  open: boolean;
  onCancel: () => void;
}

const ChangePassword = ({ open, onCancel }: ChangePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const [isSendOTP, setIsSendOTP] = useState(false);
  const [formChangePass] = Form.useForm();
  const [formOTP] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      formChangePass.resetFields();
      formOTP.resetFields();
      setIsSendOTP(false);
    }
  }, [open, formChangePass, formOTP]);

  const handleCancel = () => {
    formChangePass.resetFields();
    formOTP.resetFields();
    setIsSendOTP(false);
    onCancel();
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChangePassword = async (values: any) => {
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
        console.error(res.message || "Đổi mật khẩu thất bại!");
        toast.error(res.message || "Đổi mật khẩu thất bại!", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
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
        toast.success("Đổi mật khẩu thành công!");
        handleCancel();
        handleLogout();
      } else {
        console.error("Error verifying OTP:", res.message);
        toast.error(res.message || "Xác minh OTP thất bại!");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await AuthServices.logout();
      if (res?.code === 200) {
        localStorage.removeItem("user");
        window.location.reload();
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <CustomModal
      open={open}
      onCancel={handleCancel}
      width={700}
      footer={null}
      title={
        <div className="flex items-center space-x-3 pb-2 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-pulse-glow">
            {isSendOTP ? (
              <CheckCircleOutlined className="text-white text-lg" />
            ) : (
              <SecurityScanOutlined className="text-white text-lg" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {isSendOTP ? "Xác minh OTP" : "Đổi mật khẩu"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {isSendOTP
                ? "Nhập mã OTP để hoàn tất đổi mật khẩu"
                : "Tạo mật khẩu mới để bảo mật tài khoản"}
            </p>
          </div>
        </div>
      }
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-red-200/20 rounded-full blur-2xl animate-float"></div>
        <div
          className="absolute -bottom-4 -left-4 w-24 h-24 bg-pink-300/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative">
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-red-600 font-semibold">
                {isSendOTP ? "Đang xác minh..." : "Đang xử lý..."}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {isSendOTP ? (
            // OTP Form
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6 animate-pulse-glow">
                <CheckCircleOutlined className="text-3xl text-white" />
              </div>

              <h4 className="text-2xl font-bold text-gray-800 mb-2">Xác minh OTP</h4>
              <p className="text-gray-600 mb-8">
                Chúng tôi đã gửi mã xác minh đến email của bạn. Nhập mã để hoàn tất việc đổi mật
                khẩu.
              </p>

              <Form form={formOTP} onFinish={handleSubmitOTP} className="max-w-md mx-auto">
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
                    className="h-14 text-center text-lg font-bold rounded-xl border-2 hover:border-green-400 focus:border-green-500"
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
                        <span>Xác nhận và đổi mật khẩu</span>
                      </>
                    )}
                  </button>
                </Form.Item>
              </Form>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700">
                  ⚠️ <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn sẽ được đăng xuất
                  và cần đăng nhập lại.
                </p>
              </div>
            </div>
          ) : (
            // Change Password Form
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mb-4 animate-pulse-glow">
                  <SecurityScanOutlined className="text-2xl text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-800 mb-2">Đổi mật khẩu</h4>
                <p className="text-gray-600">Tạo mật khẩu mới để bảo mật tài khoản tốt hơn</p>
              </div>

              <Form
                form={formChangePass}
                onFinish={handleChangePassword}
                layout="vertical"
                className="space-y-6"
              >
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
                  <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <LockOutlined className="text-white text-xs" />
                    </div>
                    Thông tin mật khẩu
                  </h5>

                  <div className="space-y-4">
                    <Col span={24}>
                      <Form.Item
                        name="passwordOld"
                        label={<span className="font-semibold text-gray-700">Mật khẩu cũ</span>}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu cũ",
                          },
                          {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                            message:
                              "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-red-500" />}
                          placeholder="Nhập mật khẩu hiện tại"
                          className="h-12 rounded-xl border-2 hover:border-red-400 focus:border-red-500"
                          iconRender={(visible) => (visible ? <EyeOutlined /> : <LockOutlined />)}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="passwordNew"
                        label={<span className="font-semibold text-gray-700">Mật khẩu mới</span>}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập mật khẩu mới",
                          },
                          {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                            message:
                              "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-red-500" />}
                          placeholder="Nhập mật khẩu mới"
                          className="h-12 rounded-xl border-2 hover:border-red-400 focus:border-red-500"
                          iconRender={(visible) => (visible ? <EyeOutlined /> : <LockOutlined />)}
                        />
                      </Form.Item>
                    </Col>

                    <Col span={24}>
                      <Form.Item
                        name="re-password"
                        label={
                          <span className="font-semibold text-gray-700">Xác nhận mật khẩu mới</span>
                        }
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập lại mật khẩu mới",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("passwordNew") === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject("Mật khẩu không khớp");
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined className="text-red-500" />}
                          placeholder="Nhập lại mật khẩu mới"
                          className="h-12 rounded-xl border-2 hover:border-red-400 focus:border-red-500"
                          iconRender={(visible) => (visible ? <EyeOutlined /> : <LockOutlined />)}
                        />
                      </Form.Item>
                    </Col>
                  </div>
                </div>

                {/* Password Security Tips */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                  <h6 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <SecurityScanOutlined className="text-blue-500 mr-2" />
                    Mẹo tạo mật khẩu an toàn:
                  </h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Ít nhất 8 ký tự</li>
                    <li>• Bao gồm chữ hoa và chữ thường</li>
                    <li>• Có ít nhất một ký tự đặc biệt (@, #, $, %, ...)</li>
                    <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                  </ul>
                </div>

                <Form.Item className="mb-0">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`
                      w-full h-12 rounded-xl font-bold text-lg transition-all duration-300 transform
                      ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 hover:scale-105 hover:shadow-xl glow-button"
                      }
                      text-white shadow-lg flex items-center justify-center space-x-2
                    `}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <span>🔐</span>
                        <span>Đổi mật khẩu</span>
                      </>
                    )}
                  </button>
                </Form.Item>
              </Form>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default ChangePassword;
