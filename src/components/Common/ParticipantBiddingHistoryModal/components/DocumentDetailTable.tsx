import React from "react";
import { Table, Empty, Button, Typography, Space } from "antd";
import {
  FileTextOutlined,
  BankOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import {
  formatCurrency,
  getDepositStatusTag,
  getTicketStatusTag,
} from "../utils";
import type { AuctionDocument } from "../../../../pages/Staff/Modals";

const { Text } = Typography;

interface DocumentDetailTableProps {
  documents: AuctionDocument[];
  loading: boolean;
  onBackToList: () => void;
}

const DocumentDetailTable: React.FC<DocumentDetailTableProps> = ({
  documents,
  loading,
  onBackToList,
}) => {
  const columns = [
    {
      title: (
        <Space>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <span>STT</span>
        </Space>
      ),
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 80,
      align: "center" as const,
      render: (order: number) => (
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <Text strong style={{ color: "white", fontSize: "12px" }}>
              {order || "-"}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <BankOutlined style={{ color: "#52c41a" }} />
          <span>Tài sản</span>
        </Space>
      ),
      dataIndex: "tagName",
      key: "tagName",
      width: 200,
      render: (tagName: string) => (
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 bg-gradient-to-b from-green-400 to-green-600 rounded-full"></div>
          <Text strong style={{ color: "#1890ff", fontSize: "14px" }}>
            {tagName}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <DollarOutlined style={{ color: "#f5222d" }} />
          <span>Tiền đặt cọc</span>
        </Space>
      ),
      dataIndex: "deposit",
      key: "deposit",
      width: 140,
      align: "right" as const,
      render: (amount: number) => (
        <div className="bg-red-50 p-2 rounded-lg border border-red-200">
          <Text strong style={{ color: "#f5222d", fontSize: "14px" }}>
            {formatCurrency(amount || 0)}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <DollarOutlined style={{ color: "#faad14" }} />
          <span>Phí đăng ký</span>
        </Space>
      ),
      dataIndex: "registrationFee",
      key: "registrationFee",
      width: 140,
      align: "right" as const,
      render: (fee: number) => (
        <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
          <Text style={{ color: "#faad14", fontSize: "14px", fontWeight: 500 }}>
            {formatCurrency(fee || 0)}
          </Text>
        </div>
      ),
    },
    {
      title: (
        <Space>
          <CheckCircleOutlined style={{ color: "#52c41a" }} />
          <span>Trạng thái cọc</span>
        </Space>
      ),
      dataIndex: "statusDeposit",
      key: "statusDeposit",
      width: 140,
      align: "center" as const,
      render: (status: number) => (
        <div className="flex justify-center">{getDepositStatusTag(status)}</div>
      ),
    },
    {
      title: (
        <Space>
          <FileTextOutlined style={{ color: "#722ed1" }} />
          <span>Trạng thái phiếu</span>
        </Space>
      ),
      dataIndex: "statusTicket",
      key: "statusTicket",
      width: 140,
      align: "center" as const,
      render: (status: number) => (
        <div className="flex justify-center">{getTicketStatusTag(status)}</div>
      ),
    },
    {
      title: (
        <Space>
          <FileTextOutlined style={{ color: "#8c8c8c" }} />
          <span>Ghi chú</span>
        </Space>
      ),
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (note: string) => (
        <div className="text-gray-600">
          {note ? (
            <div className="bg-gray-50 p-2 rounded border-l-2 border-gray-300">
              <Text style={{ fontSize: "12px" }}>{note}</Text>
            </div>
          ) : (
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Không có ghi chú
            </Text>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
      {/* Back button */}
      <div className="mb-4">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBackToList}
          className="bg-gradient-to-r from-gray-500 to-gray-600 border-0 text-white hover:shadow-lg transition-all duration-200"
          style={{ borderRadius: "8px" }}
          size="middle"
        >
          Quay lại danh sách
        </Button>
      </div>

      {documents.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-purple-100">
          <Table
            columns={columns}
            dataSource={documents}
            rowKey="auctionDocumentsId"
            loading={loading}
            pagination={{
              pageSize: 8,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đăng ký`,
              style: { margin: "25px" },
            }}
            scroll={{ x: 1000 }}
            locale={{
              emptyText: "Không có thông tin đăng ký nào",
            }}
            rowClassName="hover:bg-purple-50 transition-colors"
            size="middle"
          />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Text type="secondary" style={{ fontSize: "16px" }}>
                  Người tham gia này chưa có thông tin đăng ký nào trong phiên
                  đấu giá này
                </Text>
                <div className="mt-2">
                  <Text type="secondary" style={{ fontSize: "14px" }}>
                    Có thể người này chưa hoàn tất quá trình đăng ký
                  </Text>
                </div>
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default DocumentDetailTable;
