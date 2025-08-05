import { Button, Col, DatePicker, Form, Input, Row, Select, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuthServices from "../../../../../services/AuthServices";
import type { ApiResponse } from "../../../../../types/responseAxios";

interface AccountInfo {
  citizenIdentification?: string;
  name?: string;
  birthDay?: string;
  nationality?: string;
  gender?: string;
  validDate?: string;
  originLocation?: string;
  recentLocation?: string;
  issueDate?: string;
  issueBy?: string;
}

interface EditProfileFormProps {
  account: AccountInfo | null;
  onCancel: () => void;
}

interface UpdateProfileRequest {
  citizenIdentification: string;
  name: string;
  birthDay: string;
  nationality: string;
  gender: string;
  validDate: string;
  originLocation: string;
  recentLocation: string;
  issueDate: string;
  issueBy: string;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  account,
  onCancel,
}) => {
  const [formEdit] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (account) {
      formEdit.setFieldsValue(account);
    }
  }, [account, formEdit]);

  const updateAccountInfo = async (
    values: UpdateProfileRequest
  ): Promise<void> => {
    try {
      setLoading(true);
      const res: ApiResponse<unknown> = await AuthServices.updateExpiredProfile(
        values
      );

      if (res.code === 200) {
        formEdit.resetFields();
        toast.success(res?.message || "Cập nhật thành công");
        onCancel();
      } else {
        throw new Error(res?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error instanceof Error ? error.message : "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = (): void => {
    formEdit
      .validateFields()
      .then((values: UpdateProfileRequest) => {
        updateAccountInfo(values);
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  return (
    <Spin spinning={loading}>
      <div
        className="flex flex-col px-12 py-6 mx-8 mt-4 bg-white rounded-lg"
        style={{ boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Thông tin tài khoản
        </h1>

        <Form layout="vertical" form={formEdit} onFinish={onSubmit}>
          <Row gutter={16}>
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
                name="gender"
                label="Giới tính"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn giới tính">
                  <Select.Option value={true}>Nam</Select.Option>
                  <Select.Option value={false}>Nữ</Select.Option>
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
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="w-2/4 py-4 !bg-gradient-to-r !from-blue-500 !to-purple-600 !hover:from-blue-600 !hover:to-purple-700 !text-white !font-bold "
                htmlType="submit"
                onClick={onSubmit}
              >
                Cập nhật thông tin
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default EditProfileForm;
