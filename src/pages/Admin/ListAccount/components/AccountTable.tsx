import React from "react";
import { Table, Card, Button, Tag, Pagination } from "antd";
import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import type { AccountData } from "../types";

interface AccountTableProps {
  listAccount: AccountData[];
  loading: boolean;
  onRowClick: (record: AccountData) => void;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number, size: number) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({
  listAccount,
  loading,
  onRowClick,
  pageNumber,
  pageSize,
  totalCount,
  onPageChange,
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
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          className="bg-blue-500 hover:bg-blue-600"
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(record);
          }}
        >
          Chi tiết
        </Button>
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
