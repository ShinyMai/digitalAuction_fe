import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Spin,
} from "antd";
import React, { useEffect, useState } from "react";
import AuthServices from "../../../../services/AuthServices";
import { toast } from "react-toastify";

interface Account {
  email?: string;
  password?: string;
  citizenIdentification?: string;
  phoneNumber?: string;
  birthDay?: Date;
  issueDate?: Date;
  validDate?: Date;
  nationality?: string;
  gender?: boolean;
  originLocation?: string;
  recentLocation?: string;
  issueBy?: string;
  roleId?: string;
}

interface RegisterAccountFormProps {
  account: Account;
  user: boolean;
}

interface Role {
  roleId: number;
  roleName: string;
}

const RegisterAccountForm: React.FC<
  RegisterAccountFormProps
> = ({ account, user }) => {
  const [formRegister] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const getRoles = async () => {
    try {
      setLoading(true);
      const res = await AuthServices.getRole();
      if (res.code === 200) {
        setRoles(res?.data);
      } else {
        throw new Error("Không thể lấy danh sách chức vụ");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (account) {
      formRegister.setFieldsValue(account);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const signUpAccount = async (values: object) => {
    try {
      setLoading(true);
      const res = await AuthServices.register({
        ...(user ? { roleId: "2" } : {}),
        ...values,
      });
      if (res.code === 200) {
        formRegister.resetFields();
        toast.success("Đăng ký thành công");
        setLoading(false);
      } else {
        throw new Error("Đăng ký không thành công");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    formRegister
      .validateFields()
      .then((values) => {
        console.log("Form Values:", values);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ["re-password"]: _, ...filterData } =
          values;

        signUpAccount(filterData);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <Spin spinning={loading} tip="Đang xử lý...">
      <div
        className="flex flex-col px-12 py-6 mx-8 mt-4 bg-white rounded-lg"
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Thông tin tài khoản
        </h1>

        <Form layout="vertical" form={formRegister}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email hợp lệ",
                  },
                  {
                    type: "email",
                    message: "Định dạng email không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="example@example.com" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu",
                  },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                    message:
                      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và ký tự đặc biệt",
                  },
                ]}
              >
                <Input.Password placeholder="Mật khẩu" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              {user ? (
                <Form.Item
                  name="re-password"
                  label="Nhập lại Mật khẩu"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue("password") ===
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
                  <Input.Password placeholder="Nhập lại Mật khẩu" />
                </Form.Item>
              ) : (
                <Form.Item name="roleId" label="Chức vụ">
                  <Select
                    placeholder="Chọn chức vụ"
                    allowClear
                  >
                    {roles.map((role) => (
                      <Select.Option
                        key={role.roleId}
                        value={role.roleId}
                      >
                        {role.roleName}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="phoneNumber"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại",
                  },
                  {
                    pattern:
                      /^0(3[2-9]|5[6|8|9]|7[06-9]|8[1-6|8|9]|9[0-9])[0-9]{7}$/,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input placeholder="Số điện thoại" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="gender"
                label="Giới tính"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value={true}>
                    Nam
                  </Select.Option>
                  <Select.Option value={false}>
                    Nữ
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="birthDay"
                label="Ngày sinh"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format="YYYY/MM/DD"
                  placeholder="Chọn ngày sinh"
                  allowClear={false}
                  readOnly
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập họ và tên",
                  },
                ]}
              >
                <Input placeholder="Họ và tên" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="citizenIdentification"
                label="Số CCCD"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số CCCD",
                  },
                ]}
              >
                <Input placeholder="Số CCCD" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="nationality"
                label="Quốc tịch"
                rules={[{ required: true }]}
              >
                <Input placeholder="Quốc tịch" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24}>
              <Form.Item
                name="issueBy"
                label="Nơi cấp"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nơi cấp" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={16}>
              <Form.Item
                name="originLocation"
                label="Nguyên quán"
                rules={[{ required: true }]}
              >
                <Input placeholder="Nguyên quán" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="issueDate"
                label="Ngày cấp CCCD"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format="YYYY/MM/DD"
                  placeholder="Ngày cấp CCCD"
                  allowClear={false}
                  readOnly
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={16}>
              <Form.Item
                name="recentLocation"
                label="Hộ Khẩu Thường trú"
                rules={[{ required: true }]}
              >
                <Input placeholder="Thường trú" readOnly />
              </Form.Item>
            </Col>

            <Col xs={24} sm={8}>
              <Form.Item
                name="validDate"
                label="Ngày hết hạn CCCD"
                rules={[{ required: true }]}
              >
                <DatePicker
                  format="YYYY/MM/DD"
                  placeholder="Ngày hết hạn CCCD"
                  allowClear={false}
                  readOnly
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              className="booking-btn"
              htmlType="submit"
              onClick={onSubmit}
            >
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default RegisterAccountForm;
