import React from "react";
import { Table, Card, Button, Tag, Pagination, Space, Popconfirm } from "antd";
import {
  UserOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import type { AccountData } from "../types";

interface AccountTableProps {
  listAccount: AccountData[];
  loading: boolean;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number, size: number) => void;
  onRowClick: (record: AccountData) => void;
  onAssignRole: (record: AccountData) => void;
  onToggleStatus: (record: AccountData) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({
  listAccount,
  loading,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
  onRowClick,
  onAssignRole,
  onToggleStatus,
}) => {
  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-blue-500" />
          <span className="font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) => (
        <span className="font-mono text-gray-700">{text}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag
          color={isActive ? "green" : "red"}
          className="!px-3 !py-1 !rounded-full"
        >
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Chức vụ",
      dataIndex: "roleName",
      key: "roleName",
      render: (text: string) => (
        <Tag color="blue" className="!px-3 !py-1 !rounded-full !font-medium">
          {text}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: AccountData) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<UserSwitchOutlined />}
            size="small"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onAssignRole(record);
            }}
            title="Phân quyền"
            disabled={!record.isActive}
          >
            Phân quyền
          </Button>
          <div onClick={(e) => e.stopPropagation()}>
            <Popconfirm
              title="Xác nhận thay đổi trạng thái"
              description={`Bạn có chắc chắn muốn ${
                record.isActive ? "vô hiệu hóa" : "kích hoạt"
              } tài khoản "${record.name}"?`}
              onConfirm={() => onToggleStatus(record)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button
                type={record.isActive ? "default" : "primary"}
                icon={
                  record.isActive ? <StopOutlined /> : <CheckCircleOutlined />
                }
                size="small"
                className={
                  record.isActive
                    ? "border-red-500 text-red-500 hover:bg-red-50"
                    : "bg-green-500 hover:bg-green-600 text-white border-green-500"
                }
                title={record.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
              >
                {record.isActive ? "Vô hiệu" : "Kích hoạt"}
              </Button>
            </Popconfirm>
          </div>
        </Space>
      ),
    },
  ];

  return (
    <Card className="shadow-lg rounded-xl border-0">
      <Table
        columns={columns}
        dataSource={listAccount}
        rowKey="accountId"
        loading={loading}
        pagination={false}
        onRow={(record) => ({
          onClick: () => onRowClick(record),
          className:
            "cursor-pointer hover:bg-blue-50 transition-colors duration-200",
        })}
        className="rounded-lg overflow-hidden"
        scroll={{ x: 800 }}
      />
      {/* Pagination */}
      <div className="flex justify-end mt-6">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={totalCount}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} tài khoản`
          }
          showSizeChanger
          pageSizeOptions={["10", "20", "50", "100"]}
          onChange={onPageChange}
          className="mt-4"
        />
      </div>
    </Card>
  );
};

export default AccountTable;
