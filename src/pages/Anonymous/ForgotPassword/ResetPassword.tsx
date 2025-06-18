/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useState } from "react";
import { toast } from "react-toastify";
import CustomModal from "../../../components/Common/CustomModal";
import AuthServices from "../../../services/AuthServices";

interface ResetPasswordProps {
  open?: boolean;
  onCancel: () => void;
  email: string;
  resetGuid: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  open,
  onCancel,
  email,
  resetGuid,
}) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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
        resetGuid,
      });

      if (res.code === 200) {
        toast.success("Đặt lại mật khẩu thành công!");
        form.resetFields();
        onCancel();
      } else {
        toast.error(
          res.message || "Có lỗi xảy ra, vui lòng thử lại!"
        );
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
      title="Nhập mật khẩu mới"
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          name="reset_password"
          layout="vertical"
          style={{ width: "70%", margin: "auto" }}
        >
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
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
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message:
                  "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            name="re-newPassword"
            label="Xác nhận mật khẩu"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  return !value ||
                    getFieldValue("newPassword") === value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error("Mật khẩu không khớp!")
                      );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu mới"
            />
          </Form.Item>

          <Form.Item
            style={{ textAlign: "center", marginTop: 24 }}
          >
            <Button
              type="primary"
              onClick={resetPassword}
              style={{
                backgroundColor: "#3e70a7",
                borderColor: "#3e70a7",
                minWidth: 120,
              }}
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </CustomModal>
  );
};

export default ResetPassword;
