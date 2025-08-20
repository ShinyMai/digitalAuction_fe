import { Col, DatePicker, Form, Input, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import AuthServices from "../../../../services/AuthServices";
import { toast } from "react-toastify";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

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

const RegisterAccountForm: React.FC<RegisterAccountFormProps> = ({
  account,
  user,
}) => {
  const [formRegister] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const navigate = useNavigate();

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
        toast.success("Đăng ký thành công!", {
          position: "top-right",
          autoClose: 5000,
        });
        setLoading(false);
        navigate("/", { replace: true });
      } else {
        throw new Error("Đăng ký không thành công");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      toast.error("Đăng ký không thành công. Vui lòng thử lại!", {
        position: "top-right",
        autoClose: 3000,
      });
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = () => {
    formRegister
      .validateFields()
      .then((values) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ["re-password"]: _, ...filterData } = values;
        signUpAccount(filterData);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
        toast.error("Vui lòng kiểm tra lại thông tin!");
      });
  };

  return (
    <div className="relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-600 font-semibold">Đang xử lý đăng ký...</p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 animate-pulse-glow">
            <UserOutlined className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Thông tin tài khoản
          </h2>
          <p className="text-gray-600">
            Vui lòng hoàn tất thông tin để tạo tài khoản
          </p>
        </div>

        <Form layout="vertical" form={formRegister} className="space-y-6">
          {/* Account Credentials Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                <LockOutlined className="text-white text-xs" />
              </div>
              Thông tin đăng nhập
            </h3>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="email"
                  label={
                    <span className="font-semibold text-gray-700">Email</span>
                  }
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
                  <Input
                    prefix={<MailOutlined className="text-blue-500" />}
                    placeholder="example@example.com"
                    className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="phoneNumber"
                  label={
                    <span className="font-semibold text-gray-700">
                      Số điện thoại
                    </span>
                  }
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
                  <Input
                    prefix={<PhoneOutlined className="text-blue-500" />}
                    placeholder="Số điện thoại"
                    className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="password"
                  label={
                    <span className="font-semibold text-gray-700">
                      Mật khẩu
                    </span>
                  }
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
                  <Input.Password
                    prefix={<LockOutlined className="text-blue-500" />}
                    placeholder="Mật khẩu"
                    className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                {user ? (
                  <Form.Item
                    name="re-password"
                    label={
                      <span className="font-semibold text-gray-700">
                        Nhập lại mật khẩu
                      </span>
                    }
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập lại mật khẩu",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject("Mật khẩu không khớp");
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-blue-500" />}
                      placeholder="Nhập lại mật khẩu"
                      className="h-12 rounded-xl border-2 hover:border-blue-400 focus:border-blue-500"
                    />
                  </Form.Item>
                ) : (
                  <Form.Item
                    name="roleId"
                    label={
                      <span className="font-semibold text-gray-700">
                        Chức vụ
                      </span>
                    }
                  >
                    <Select
                      placeholder="Chọn chức vụ"
                      allowClear
                      className="h-12"
                      style={{ borderRadius: "12px" }}
                    >
                      {roles.map((role) => (
                        <Select.Option key={role.roleId} value={role.roleId}>
                          {role.roleName}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>
            </Row>
          </div>

          {/* Personal Information Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <UserOutlined className="text-white text-xs" />
              </div>
              Thông tin cá nhân
            </h3>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label={
                    <span className="font-semibold text-gray-700">
                      Họ và tên
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ và tên",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-purple-500" />}
                    placeholder="Họ và tên"
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="citizenIdentification"
                  label={
                    <span className="font-semibold text-gray-700">Số CCCD</span>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số CCCD",
                    },
                  ]}
                >
                  <Input
                    prefix={<IdcardOutlined className="text-purple-500" />}
                    placeholder="Số CCCD"
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label={
                    <span className="font-semibold text-gray-700">
                      Giới tính
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Chọn giới tính"
                    className="h-12"
                    style={{ borderRadius: "12px" }}
                  >
                    <Select.Option value={true}>Nam</Select.Option>
                    <Select.Option value={false}>Nữ</Select.Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="birthDay"
                  label={
                    <span className="font-semibold text-gray-700">
                      Ngày sinh
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày sinh"
                    allowClear={false}
                    readOnly
                    suffixIcon={
                      <CalendarOutlined className="text-purple-500" />
                    }
                    className="h-12 w-full rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="nationality"
                  label={
                    <span className="font-semibold text-gray-700">
                      Quốc tịch
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Quốc tịch"
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="issueBy"
                  label={
                    <span className="font-semibold text-gray-700">Nơi cấp</span>
                  }
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Nơi cấp"
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Address Information Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs">📍</span>
              </div>
              Thông tin địa chỉ
            </h3>

            <Row gutter={[24, 16]}>
              <Col xs={24}>
                <Form.Item
                  name="originLocation"
                  label={
                    <span className="font-semibold text-gray-700">
                      Nguyên quán
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Nguyên quán"
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="recentLocation"
                  label={
                    <span className="font-semibold text-gray-700">
                      Hộ khẩu thường trú
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Thường trú"
                    readOnly
                    className="h-12 rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Document Dates Section */}
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <CalendarOutlined className="text-white text-xs" />
              </div>
              Thông tin CCCD
            </h3>

            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="issueDate"
                  label={
                    <span className="font-semibold text-gray-700">
                      Ngày cấp CCCD
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Ngày cấp CCCD"
                    allowClear={false}
                    readOnly
                    suffixIcon={
                      <CalendarOutlined className="text-orange-500" />
                    }
                    className="h-12 w-full rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="validDate"
                  label={
                    <span className="font-semibold text-gray-700">
                      Ngày hết hạn CCCD
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    format="DD/MM/YYYY"
                    placeholder="Ngày hết hạn CCCD"
                    allowClear={false}
                    readOnly
                    suffixIcon={
                      <CalendarOutlined className="text-orange-500" />
                    }
                    className="h-12 w-full rounded-xl border-2 bg-gray-50 cursor-not-allowed"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <Form.Item className="mb-0">
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading}
                className={`
                  w-full h-14 rounded-2xl font-bold text-lg transition-all duration-300 transform
                  ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl glow-button"
                  }
                  text-white shadow-lg flex items-center justify-center space-x-3
                `}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <span>🎉</span>
                    <span>Tạo tài khoản</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterAccountForm;
