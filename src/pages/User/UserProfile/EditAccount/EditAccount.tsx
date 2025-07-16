/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Form, Input, Spin, message } from "antd";
import { useEffect, useState } from "react";
import CustomModal from "../../../../components/Common/CustomModal";
import AuthServices from "../../../../services/AuthServices";

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
      }
    } catch (error) {
      console.error("Error updating account:", error);
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
        message.success("Thay đổi thành công!");
        handleCancel();
      } else {
        console.error("Error verifying OTP:", res.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title="Chỉnh sửa tài khoản"
      open={open}
      onCancel={handleCancel}
      width={600}
      footer={null}
      style={{ top: 80 }}
    >
      <Spin spinning={loading}>
        {isSendOTP ? (
          <Form form={formOTP} style={{ width: "75%", margin: "auto" }} onFinish={handleSubmitOTP}>
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
            form={formEdit}
            layout="vertical"
            onFinish={updateAccount}
            style={{ width: "75%", margin: "auto" }}
          >
            <Col span={24}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    pattern: /^0(3[2-9]|5[6|8|9]|7[06-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    type: "email",
                    message: "Email không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Nhập email" />
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
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </CustomModal>
  );
};

export default EditAccount;
