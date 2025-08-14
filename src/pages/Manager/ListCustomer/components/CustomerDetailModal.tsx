import React from "react";
import { Descriptions, Tag, Divider } from "antd";
import { UserOutlined, PhoneOutlined, IdcardOutlined } from "@ant-design/icons";
import type { AccountData } from "../types";
import CustomModal from "../../../../components/Common/CustomModal";

interface EmployeeDetailModalProps {
  open: boolean;
  onClose: () => void;
  selectedEmployee: AccountData | null;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  open,
  onClose,
  selectedEmployee,
}) => {
  if (!selectedEmployee) return null;

  const getRoleColor = (roleName: string) => {
    const roleColors: { [key: string]: string } = {
      Director: "purple",
      Manager: "blue",
      Staff: "green",
      Auctioneer: "orange",
    };
    return roleColors[roleName] || "default";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Không có thông tin";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <CustomModal
      title="Thông tin khách hàng"
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="employee-detail-modal"
      style={{ top: 20 }}
    >
      <div>
        {/* Thông tin cá nhân */}
        <div className="mb-6">
          <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            Thông tin cá nhân
          </h4>

          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Họ và tên" span={2}>
              <span className="font-semibold text-gray-800">
                {selectedEmployee.name}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Số CCCD">
              <span className="font-mono">
                {selectedEmployee.citizenIdentification}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày sinh">
              {formatDate(selectedEmployee.birthDay)}
            </Descriptions.Item>

            <Descriptions.Item label="Giới tính">
              {selectedEmployee.gender ? "Nam" : "Nữ"}
            </Descriptions.Item>

            <Descriptions.Item label="Quốc tịch">
              {selectedEmployee.nationality || "Không có thông tin"}
            </Descriptions.Item>

            <Descriptions.Item label="Nơi cấp CCCD" span={2}>
              {selectedEmployee.issueBy || "Không có thông tin"}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày cấp">
              {formatDate(selectedEmployee.issueDate)}
            </Descriptions.Item>

            <Descriptions.Item label="Ngày hết hạn">
              {formatDate(selectedEmployee.validDate)}
            </Descriptions.Item>

            <Descriptions.Item label="Nơi thường trú" span={2}>
              {selectedEmployee.recentLocation || "Không có thông tin"}
            </Descriptions.Item>

            <Descriptions.Item label="Nơi sinh" span={2}>
              {selectedEmployee.originLocation || "Không có thông tin"}
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider />
        {/* Thông tin liên hệ */}
        <div className="mb-6">
          <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PhoneOutlined className="text-green-500" />
            Thông tin liên hệ
          </h4>

          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Số điện thoại">
              <span className="font-mono text-blue-600">
                {selectedEmployee.phoneNumber}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Email">
              <span className="text-blue-600">{selectedEmployee.email}</span>
            </Descriptions.Item>
          </Descriptions>
        </div>
        <Divider />
        {/* Thông tin công việc */}
        <div className="mb-6">
          <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <IdcardOutlined className="text-purple-500" />
            Thông tin công việc
          </h4>

          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="Chức vụ">
              <Tag
                color={getRoleColor(selectedEmployee.roleName)}
                className="font-medium"
              >
                {selectedEmployee.roleName}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
              <Tag
                color={selectedEmployee.isActive ? "success" : "error"}
                className="font-medium"
              >
                {selectedEmployee.isActive
                  ? "Đang hoạt động"
                  : "Không hoạt động"}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày tạo tài khoản">
              {formatDate(selectedEmployee.createdAt)}
            </Descriptions.Item>

            <Descriptions.Item label="Cập nhật lần cuối">
              {formatDate(selectedEmployee.updatedAt)}
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>

      <style>{`
        .employee-detail-modal .ant-descriptions-item-label {
          background: #f8fafc;
          font-weight: 500;
          color: #374151;
        }
        
        .employee-detail-modal .ant-descriptions-item-content {
          background: white;
        }
      `}</style>
    </CustomModal>
  );
};

export default EmployeeDetailModal;
