/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form, Input, Button, Select, DatePicker, Col, Row } from "antd";
import React, { useState } from "react";
import CustomModal from "../../../../components/Common/CustomModal";
import { toast } from "react-toastify";
import AuthServices from "../../../../services/AuthServices";
import UserServices from "../../../../services/UserServices";

interface FormRegisterUserProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FormRegisterUser: React.FC<FormRegisterUserProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formRegister] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const signUpAccount = async (values: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await AuthServices.register({ roleId: "2", ...values });
      if (res.code === 200) {
        formRegister.resetFields();
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.",
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
        onSuccess();
        await sendPasswordToUser({
          contact: values.email,
          message: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #222;">
                <p>Kính gửi Quý khách,</p>
                <p>Tài khoản của Quý khách đã được <b>tạo thành công</b> trên hệ thống Đấu giá Minh Pháp.</p>
                <p><b>Thông tin đăng nhập:</b></p>
                <ul style="list-style: none; padding-left: 0;">
                    <li><b>Email:</b> ${values.email}</li>
                    <li><b>Mật khẩu:</b> ${values.password}</li>
                </ul>
                <p>
                    Vui lòng sử dụng thông tin trên để đăng nhập và <b>đổi mật khẩu</b> sau khi đăng nhập lần đầu để đảm bảo an toàn.
                </p>
                <p>
                    Nếu Quý khách có bất kỳ thắc mắc nào, xin vui lòng liên hệ bộ phận hỗ trợ của chúng tôi.
                </p>
                <p>Trân trọng,<br /><b>Đấu giá Minh Pháp</b></p>
            </div>
        `,
          channel: 0,
        });
      } else {
        toast.error("Đăng ký không thành công");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Đăng ký không thành công. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordToUser = async (values: object) => {
    try {
      const res = await UserServices.sendPasswordToUser(values);
      if (res.code === 200) {
        toast.success("Gửi mật khẩu thành công!");
      } else {
        toast.error("Gửi mật khẩu không thành công");
      }
    } catch (error) {
      console.error("Error sending password:", error);
    }
  };

  function generateStrongPassword(length = 10) {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const all = lower + upper + special;
    let password = "";
    password += lower[Math.floor(Math.random() * lower.length)];
    password += upper[Math.floor(Math.random() * upper.length)];
    password += special[Math.floor(Math.random() * special.length)];
    for (let i = 3; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
  }

  const onSubmit = () => {
    formRegister
      .validateFields()
      .then((values) => {
        const randomPassword = generateStrongPassword();
        formRegister.setFieldsValue({ password: randomPassword });
        const submitValues = {
          ...values,
          password: randomPassword,
        };
        signUpAccount(submitValues);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        toast.error("Vui lòng kiểm tra lại thông tin!");
      });
  };

  return (
    <CustomModal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title="Tạo tài khoản khách hàng mới"
      style={{ top: 20 }}
    >
      <Form layout="vertical" form={formRegister} className="space-y-3">
        <Row gutter={8}>
          <Col md={8} xs={24}>
            <Form.Item
              name="name"
              label={
                <span className="font-semibold text-gray-700">Họ và tên</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input size="large" placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="email"
              label={<span className="font-semibold text-gray-700">Email</span>}
              rules={[
                { required: true, message: "Vui lòng nhập email hợp lệ" },
                { type: "email", message: "Định dạng email không hợp lệ" },
              ]}
            >
              <Input size="large" placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="phoneNumber"
              label={
                <span className="font-semibold text-gray-700">
                  Số điện thoại
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern:
                    /^0(3[2-9]|5[6|8|9]|7[06-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input size="large" placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col md={8} xs={24}>
            <Form.Item
              name="citizenIdentification"
              label={
                <span className="font-semibold text-gray-700">Số CCCD</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập số CCCD" }]}
            >
              <Input size="large" placeholder="Nhập số CCCD" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="gender"
              label={
                <span className="font-semibold text-gray-700">Giới tính</span>
              }
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select size="large" placeholder="Chọn giới tính">
                <Select.Option value={true}>Nam</Select.Option>
                <Select.Option value={false}>Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="birthDay"
              label={
                <span className="font-semibold text-gray-700">Ngày sinh</span>
              }
              rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày sinh"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col md={8} xs={24}>
            <Form.Item
              name="nationality"
              label={
                <span className="font-semibold text-gray-700">Quốc tịch</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập quốc tịch" }]}
            >
              <Input size="large" placeholder="Nhập quốc tịch" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="issueBy"
              label={
                <span className="font-semibold text-gray-700">Nơi cấp</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập nơi cấp" }]}
            >
              <Input size="large" placeholder="Nhập nơi cấp" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="issueDate"
              label={
                <span className="font-semibold text-gray-700">Ngày cấp</span>
              }
              rules={[{ required: true, message: "Vui lòng chọn ngày cấp" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày cấp"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={8}>
          <Col md={8} xs={24}>
            <Form.Item
              name="originLocation"
              label={
                <span className="font-semibold text-gray-700">Nguyên quán</span>
              }
              rules={[{ required: true, message: "Vui lòng nhập nguyên quán" }]}
            >
              <Input size="large" placeholder="Nhập nguyên quán" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="recentLocation"
              label={
                <span className="font-semibold text-gray-700">
                  Hộ khẩu thường trú
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng nhập hộ khẩu thường trú" },
              ]}
            >
              <Input size="large" placeholder="Nhập hộ khẩu thường trú" />
            </Form.Item>
          </Col>
          <Col md={8} xs={24}>
            <Form.Item
              name="validDate"
              label={
                <span className="font-semibold text-gray-700">
                  Ngày hết hạn CCCD
                </span>
              }
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
              ]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Chọn ngày hết hạn "
                className="w-full"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="mb-0">
          <div className="flex justify-center">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-1/3 h-12 rounded-xl"
              onClick={onSubmit}
            >
              Tạo tài khoản
            </Button>
          </div>
        </Form.Item>
      </Form>
    </CustomModal>
  );
};

export default FormRegisterUser;
