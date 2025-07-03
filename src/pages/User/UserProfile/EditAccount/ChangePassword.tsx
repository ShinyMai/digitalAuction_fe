import { useEffect, useState } from "react";
import CustomModal from "../../../../components/Common/CustomModal";
import { Col, Form, Input, Spin, Button } from "antd";
import AuthServices from "../../../../services/AuthServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ChangePasswordProps {
  open: boolean;
  onCancel: () => void;
}

const ChangePassword = ({
  open,
  onCancel,
}: ChangePasswordProps) => {
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
      } else {
        console.error(
          res.message || "Đổi mật khẩu thất bại!"
        );
      }
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (values: {
    otpCode: string;
  }) => {
    try {
      setLoading(true);
      const res = await AuthServices.verifyUpdateAccountOTP(
        {
          otpCode: values.otpCode,
        }
      );

      if (res.code === 200) {
        toast.success("Đổi mật khẩu thành công!");
        handleCancel();
        handleLogout();
      } else {
        console.error("Error verifying OTP:", res.message);
        toast.error(
          res.message || "Xác minh OTP thất bại!"
        );
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
      title="Đổi mật khẩu"
      open={open}
      onCancel={handleCancel}
      width={600}
      footer={null}
    >
      <Spin spinning={loading}>
        {isSendOTP ? (
          <Form
            form={formOTP}
            onFinish={handleSubmitOTP}
            style={{ width: "75%", margin: "auto" }}
          >
            <Form.Item
              name="otpCode"
              label="Mã OTP"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mã OTP!",
                },
              ]}
            >
              <Input placeholder="Nhập OTP" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  margin: "15px auto -15px",
                  display: "block",
                }}
              >
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
        ) : (
          <Form
            form={formChangePass}
            onFinish={handleChangePassword}
            style={{ width: "75%", margin: "auto" }}
            layout="vertical"
          >
            <Col span={24}>
              <Form.Item
                name="passwordOld"
                label="Mật khẩu cũ"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu cũ",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                    message:
                      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu cũ" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="passwordNew"
                label="Mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu mới",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                    message:
                      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu mới" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="re-password"
                label="Nhập lại mật khẩu mới"
                rules={[
                  {
                    required: true,
                    message:
                      "Vui lòng nhập lại mật khẩu mới",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (
                        !value ||
                        getFieldValue("passwordNew") ===
                          value
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
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </Col>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  margin: "15px auto -15px",
                  display: "block",
                }}
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </CustomModal>
  );
};

export default ChangePassword;
