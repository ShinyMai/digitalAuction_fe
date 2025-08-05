import React from "react";
import { Typography, Row, Col, Tag } from "antd";
import dayjs from "dayjs";
import type { AccountData } from "../types";
import CustomModal from "../../../../components/Common/CustomModal";

const { Title } = Typography;

interface AccountDetailModalProps {
  open: boolean;
  onClose: () => void;
  selectedAccount: AccountData | null;
}

const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  open,
  onClose,
  selectedAccount,
}) => {
  return (
    <CustomModal
      title="Chi tiết tài khoản"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      {selectedAccount && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <Title level={5} className="!mb-4 !text-blue-800">
              Thông tin cơ bản
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Họ và tên:</span>
                  <div className="text-gray-800 font-semibold">
                    {selectedAccount.name}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Email:</span>
                  <div className="text-blue-600">{selectedAccount.email}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">
                    Số điện thoại:
                  </span>
                  <div className="text-gray-800">
                    {selectedAccount.phoneNumber}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Chức vụ:</span>
                  <div>
                    <Tag color="blue" className="!px-3 !py-1 !rounded-full">
                      {selectedAccount.roleName}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Trạng thái:</span>
                  <div>
                    <Tag
                      color={selectedAccount.isActive ? "green" : "red"}
                      className="!px-3 !py-1 !rounded-full"
                    >
                      {selectedAccount.isActive
                        ? "Hoạt động"
                        : "Không hoạt động"}
                    </Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Giới tính:</span>
                  <div className="text-gray-800">
                    {selectedAccount.gender ? "Nam" : "Nữ"}
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* Personal Info */}
          <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500">
            <Title level={5} className="!mb-4 !text-teal-800">
              Thông tin cá nhân
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Số CCCD:</span>
                  <div className="text-gray-800 font-mono">
                    {selectedAccount.citizenIdentification}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Ngày sinh:</span>
                  <div className="text-gray-800">
                    {dayjs(selectedAccount.birthDay).format("DD/MM/YYYY")}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Quốc tịch:</span>
                  <div className="text-gray-800">
                    {selectedAccount.nationality}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Nơi cấp:</span>
                  <div className="text-gray-800">{selectedAccount.issueBy}</div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Ngày cấp:</span>
                  <div className="text-gray-800">
                    {dayjs(selectedAccount.issueDate).format("DD/MM/YYYY")}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">
                    Ngày hết hạn:
                  </span>
                  <div className="text-gray-800">
                    {dayjs(selectedAccount.validDate).format("DD/MM/YYYY")}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">
                    Nguyên quán:
                  </span>
                  <div className="text-gray-800">
                    {selectedAccount.originLocation}
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">
                    Hộ khẩu thường trú:
                  </span>
                  <div className="text-gray-800">
                    {selectedAccount.recentLocation}
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* System Info */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
            <Title level={5} className="!mb-4 !text-gray-800">
              Thông tin hệ thống
            </Title>
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Ngày tạo:</span>
                  <div className="text-gray-800">
                    {dayjs(selectedAccount.createdAt).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">
                    Cập nhật lần cuối:
                  </span>
                  <div className="text-gray-800">
                    {dayjs(selectedAccount.updatedAt).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">Account ID:</span>
                  <div className="text-gray-600 font-mono text-sm">
                    {selectedAccount.accountId}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-3">
                  <span className="font-medium text-gray-600">User ID:</span>
                  <div className="text-gray-600 font-mono text-sm">
                    {selectedAccount.userId}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default AccountDetailModal;
