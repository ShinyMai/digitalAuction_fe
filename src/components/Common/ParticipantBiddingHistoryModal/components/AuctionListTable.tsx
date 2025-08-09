import React from "react";
import { Table, Empty, Button, Typography, Space } from "antd";
import {
  TrophyOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { formatDate, getAuctionStatus } from "../utils";
import type { RegisteredAuction } from "../types";

const { Text } = Typography;

interface AuctionListTableProps {
  auctions: RegisteredAuction[];
  loading: boolean;
  onSelectAuction: (auctionId: string) => void;
}

const AuctionListTable: React.FC<AuctionListTableProps> = ({
  auctions,
  loading,
  onSelectAuction,
}) => {
  const columns = [
    {
      title: (
        <Space>
          <TrophyOutlined style={{ color: "#1890ff" }} />
          <span>Tên phiên đấu giá</span>
        </Space>
      ),
      dataIndex: "auctionName",
      key: "auctionName",
      width: 280,
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
          <Text strong style={{ color: "#1890ff", fontSize: "14px" }}>
            {name}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <FileTextOutlined style={{ color: "#52c41a" }} />
          <span>Danh mục</span>
        </Space>
      ),
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
      render: (category: string) => (
        <div
          className="px-3 py-1 rounded-full text-center"
          style={{
            backgroundColor: "#f0f9ff",
            color: "#0369a1",
            border: "1px solid #bae6fd",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {category}
        </div>
      ),
    },
    {
      title: (
        <Space>
          <CalendarOutlined style={{ color: "#faad14" }} />
          <span>Thời gian đăng ký</span>
        </Space>
      ),
      key: "registerDate",
      width: 220,
      render: (_: string, record: RegisteredAuction) => (
        <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-800">
            <CalendarOutlined />
            <span>Bắt đầu:</span>
          </div>
          <div className="text-xs text-gray-600 ml-5 mb-2">
            {formatDate(record.registerOpenDate)}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-orange-800">
            <ClockCircleOutlined />
            <span>Kết thúc:</span>
          </div>
          <div className="text-xs text-gray-600 ml-5">
            {formatDate(record.registerEndDate)}
          </div>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <TrophyOutlined style={{ color: "#f5222d" }} />
          <span>Thời gian đấu giá</span>
        </Space>
      ),
      key: "auctionDate",
      width: 220,
      render: (_: string, record: RegisteredAuction) => (
        <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
          <div className="flex items-center gap-2 text-sm font-medium text-red-800">
            <CalendarOutlined />
            <span>Bắt đầu:</span>
          </div>
          <div className="text-xs text-gray-600 ml-5 mb-2">
            {formatDate(record.auctionStartDate)}
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-red-800">
            <ClockCircleOutlined />
            <span>Kết thúc:</span>
          </div>
          <div className="text-xs text-gray-600 ml-5">
            {formatDate(record.auctionEndDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 140,
      align: "center" as const,
      render: (_: string, record: RegisteredAuction) => (
        <div className="flex justify-center">{getAuctionStatus(record)}</div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 130,
      align: "center" as const,
      render: (_: string, record: RegisteredAuction) => (
        <Button
          type="primary"
          size="small"
          onClick={() => onSelectAuction(record.auctionId)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ borderRadius: "8px" }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  if (auctions.length === 0 && !loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Người tham gia này chưa đăng ký phiên đấu giá nào
              </Text>
              <div className="mt-2">
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Vui lòng kiểm tra lại thông tin hoặc liên hệ bộ phận hỗ trợ
                </Text>
              </div>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-blue-100">
      <Table
        columns={columns}
        dataSource={auctions}
        rowKey="auctionId"
        loading={loading}
        pagination={{
          pageSize: 8,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} phiên đấu giá`,
          style: { margin: "25px" },
        }}
        scroll={{ x: 1100 }}
        locale={{
          emptyText: "Không có phiên đấu giá nào đã đăng ký",
        }}
        rowClassName="hover:bg-blue-50 transition-colors"
        size="middle"
      />
    </div>
  );
};

export default AuctionListTable;
