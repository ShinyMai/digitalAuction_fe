import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  Typography,
  Card,
  Tag,
  Row,
  Col,
  Alert,
  Divider,
} from "antd";
import {
  UserSwitchOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import type { AccountData, Role } from "../types";
import CustomModal from "../../../../components/Common/CustomModal";

const { Title, Text } = Typography;
const { Option } = Select;

interface AssignRoleModalProps {
  open: boolean;
  onClose: () => void;
  selectedAccount: AccountData | null;
  roles: Role[];
  onAssign: (accountId: string, newRoleId: number) => Promise<void>;
}

const AssignRoleModal: React.FC<AssignRoleModalProps> = ({
  open,
  onClose,
  selectedAccount,
  roles,
  onAssign,
}) => {
  const [form] = Form.useForm();
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && selectedAccount) {
      form.resetFields();
      setSelectedRoleId(null);
      setShowConfirmation(false);
    }
  }, [open, selectedAccount, form]);

  const selectedRole = roles.find((role) => role.roleId === selectedRoleId);
  const currentRole = roles.find(
    (role) => role.roleName === selectedAccount?.roleName
  );

  const handleRoleChange = (value: number) => {
    setSelectedRoleId(value);
    setShowConfirmation(false);
  };

  const handlePreview = () => {
    if (!selectedRoleId) return;
    setShowConfirmation(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedAccount || !selectedRoleId) return;

    setConfirmLoading(true);
    try {
      await onAssign(selectedAccount.accountId, selectedRoleId);
      onClose();
    } catch (error) {
      console.error("Failed to assign role:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRoleId(null);
    setShowConfirmation(false);
    onClose();
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case "director":
        return <CrownOutlined className="text-purple-500" />;
      case "manager":
        return <UserSwitchOutlined className="text-blue-500" />;
      case "staff":
        return <UserOutlined className="text-green-500" />;
      case "auctioneer":
        return <UserOutlined className="text-orange-500" />;
      default:
        return <UserOutlined className="text-gray-500" />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName?.toLowerCase()) {
      case "director":
        return "purple";
      case "manager":
        return "blue";
      case "staff":
        return "green";
      case "auctioneer":
        return "orange";
      default:
        return "default";
    }
  };

  if (!selectedAccount) return null;

  return (
    <CustomModal
      title="Phân quyền tài khoản"
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={700}
      style={{ top: 20 }}
    >
      <div className="space-y-6">
        <Card className="!bg-blue-50 !border-blue-200 !border-l-4">
          <Title
            level={5}
            className="!mb-4 !text-blue-800 flex items-center gap-2"
          >
            <UserOutlined />
            Thông tin tài khoản
          </Title>
          <Row gutter={16}>
            <Col span={12}>
              <div className="mb-3">
                <Text className="!font-medium !text-gray-600">Họ và tên:</Text>
                <div className="text-gray-800 font-semibold">
                  {selectedAccount.name}
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-3">
                <Text className="!font-medium !text-gray-600">Email:</Text>
                <div className="!text-blue-600">{selectedAccount.email}</div>
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-3">
                <Text className="!font-medium !text-gray-600">
                  Chức vụ hiện tại:
                </Text>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(selectedAccount.roleName)}
                  <Tag
                    color={getRoleColor(selectedAccount.roleName)}
                    className="!px-3 !py-1 !rounded-full !font-medium"
                  >
                    {selectedAccount.roleName}
                  </Tag>
                </div>
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-3">
                <Text className="font-medium text-gray-600">Trạng thái:</Text>
                <div className="mt-1">
                  <Tag
                    color={selectedAccount.isActive ? "green" : "red"}
                    className="!px-3 !py-1 !rounded-full"
                  >
                    {selectedAccount.isActive ? "Hoạt động" : "Không hoạt động"}
                  </Tag>
                </div>
              </div>
            </Col>
          </Row>
        </Card>

        <Divider />

        {/* Role Selection */}
        <div className="rounded-lg p-4 bg-blue-50 shadow-sm">
          <Title
            level={5}
            className="!mb-4 !text-gray-800 flex items-center gap-2"
          >
            <UserSwitchOutlined />
            Chọn chức vụ mới
          </Title>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Chức vụ"
              name="roleId"
              rules={[
                { required: true, message: "Vui lòng chọn chức vụ mới!" },
              ]}
            >
              <Select
                placeholder="Chọn chức vụ mới"
                size="large"
                value={selectedRoleId}
                onChange={handleRoleChange}
                className="w-full"
              >
                {roles.map((role) => (
                  <Option
                    key={role.roleId}
                    value={role.roleId}
                    disabled={role.roleName === selectedAccount.roleName}
                  >
                    <div className="flex items-center gap-2">
                      {getRoleIcon(role.roleName)}
                      <span>{role.roleName}</span>{" "}
                      {role.roleName === selectedAccount.roleName && (
                        <Tag color="blue">Hiện tại</Tag>
                      )}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>

          {selectedRole && (
            <Alert
              message="Thông tin chức vụ được chọn"
              description={
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedRole.roleName)}
                    <Text strong>{selectedRole.roleName}</Text>
                  </div>
                </div>
              }
              type="info"
              showIcon
              className="mt-4"
            />
          )}
        </div>

        {/* Confirmation Section */}
        {showConfirmation && selectedRole && currentRole && (
          <Card className="!border-orange-200 !bg-orange-50 !mb-4">
            <Title
              level={5}
              className="!mb-4 !text-orange-800 flex items-center gap-2"
            >
              <ExclamationCircleOutlined />
              Xác nhận thay đổi
            </Title>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="text-center">
                  <Text className="!block !text-gray-600 !mb-2">Từ</Text>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(currentRole.roleName)}
                    <Tag
                      color={getRoleColor(currentRole.roleName)}
                      className="!px-3 !py-1"
                    >
                      {currentRole.roleName}
                    </Tag>
                  </div>
                </div>

                <div className="mx-4">
                  <UserSwitchOutlined className="text-2xl text-blue-500" />
                </div>

                <div className="text-center">
                  <Text className="block text-gray-600 mb-2">Thành</Text>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedRole.roleName)}
                    <Tag
                      color={getRoleColor(selectedRole.roleName)}
                      className="px-3 py-1"
                    >
                      {selectedRole.roleName}
                    </Tag>
                  </div>
                </div>
              </div>

              <Alert
                message="Cảnh báo"
                description={`Việc thay đổi chức vụ sẽ ảnh hưởng đến quyền truy cập của tài khoản "${selectedAccount.name}". Bạn có chắc chắn muốn thực hiện thay đổi này?`}
                type="warning"
                showIcon
              />
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button size="large" onClick={handleCancel}>
            Hủy
          </Button>

          {!showConfirmation ? (
            <Button
              type="primary"
              size="large"
              icon={<CheckCircleOutlined />}
              onClick={handlePreview}
              disabled={
                !selectedRoleId || selectedRoleId === currentRole?.roleId
              }
              className="bg-blue-500 hover:bg-blue-600"
            >
              Xem trước thay đổi
            </Button>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<UserSwitchOutlined />}
              onClick={handleConfirmAssign}
              loading={confirmLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              Xác nhận phân quyền
            </Button>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export default AssignRoleModal;
