import React from "react";
import { Table, Card, Tag, Tooltip, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { AccountData } from "../types";

interface EmployeeTableProps {
  listAccount: AccountData[];
  loading: boolean;
  onRowClick: (record: AccountData) => void;
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number, size: number) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
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
      title: "STT",
      key: "index",
      render: (_: unknown, __: unknown, index: number) => (
        <span className="font-medium text-gray-700">
          {(pageNumber - 1) * pageSize + index + 1}
        </span>
      ),
      width: 60,
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span className="font-semibold text-gray-800">{text}</span>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) => <span className="text-blue-600">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Chức vụ",
      dataIndex: "roleName",
      key: "roleName",
      render: (roleName: string) => {
        const roleColors: { [key: string]: string } = {
          Director: "purple",
          Manager: "blue",
          Staff: "green",
          Auctioneer: "orange",
        };

        const roleLabels: { [key: string]: string } = {
          Director: "Giám đốc",
          Manager: "Quản lý",
          Staff: "Nhân viên",
          Auctioneer: "Đấu giá viên",
        };

        return (
          <Tag
            color={roleColors[roleName] || "default"}
            className="font-medium"
          >
            {roleLabels[roleName] || roleName}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"} className="font-medium">
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (record: AccountData) => (
        <Tooltip title="Xem chi tiết thông tin nhân viên">
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick(record);
            }}
            className="!hover:bg-blue-50 !text-white"
          >
            Xem chi tiết
          </Button>
        </Tooltip>
      ),
      width: 130,
    },
  ];
  return (
    <Card className="shadow-lg border-0 rounded-xl">
      <Table
        columns={columns}
        dataSource={listAccount}
        rowKey="accountId"
        loading={loading}
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: totalCount,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} nhân viên`,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          className: "px-6 pb-4",
        }}
        className="employee-table"
        scroll={{ x: 800 }}
        rowClassName="hover:bg-blue-50 cursor-pointer"
        onRow={(record) => ({
          onClick: () => onRowClick(record),
        })}
      />
      <style>{`
        .employee-table .ant-table-thead > tr > th {
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
        
        .employee-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
          padding: 16px;
        }
        
        .employee-table .ant-table-tbody > tr:hover > td {
          background: #eff6ff !important;
        }
      `}</style>
    </Card>
  );
};

export default EmployeeTable;
