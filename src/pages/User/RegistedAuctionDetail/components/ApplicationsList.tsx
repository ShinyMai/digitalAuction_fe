import React, { useState, useEffect } from "react";
import { Card, Empty, Table, Tag, Typography, Tooltip, Space } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import type { AuctionDocument, DepositStatus, TicketStatus, AuctionStatusData } from "../types";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";

const { Text } = Typography;

interface ApplicationsListProps {
  filteredDocuments: AuctionDocument[];
  documents: AuctionDocument[];
  auctionId: string;
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({
  filteredDocuments,
  documents,
  auctionId,
}) => {
  const [auctionStatusData, setAuctionStatusData] = useState<{
    [key: string]: AuctionStatusData[];
  }>({});

  // Fetch auction status data for all documents
  useEffect(() => {
    const getPriceAndFlag = async () => {
      if (!auctionId || documents.length === 0) return;

      try {
        const res = await AuctionServices.findHighestPriceAndFlag(auctionId);

        if (res.code === 200 && res.data && res.data.data) {
          const apiData = res.data.data;
          setAuctionStatusData(apiData);
        } else {
          toast.error("Không thể tải trạng thái đấu giá!");
          setAuctionStatusData({});
        }
      } catch (error) {
        console.error("Error fetching auction status data:", error);
        toast.error("Lỗi khi tải trạng thái đấu giá!");
        setAuctionStatusData({});
      }
    };

    getPriceAndFlag();
  }, [auctionId, documents]);

  // Function to get auction status for a document
  const getAuctionStatus = (auctionDocumentsId: string) => {
    const statusArray = auctionStatusData[auctionDocumentsId];
    if (!statusArray || statusArray.length === 0) {
      return {
        color: "default",
        text: "Chưa có dữ liệu",
        icon: <ClockCircleOutlined />,
        price: null,
      };
    }

    const status = statusArray[0];
    if (status.flag) {
      return {
        color: "success",
        text: "Thắng đấu giá",
        icon: <TrophyOutlined />,
        price: status.price,
      };
    } else {
      return {
        color: "error",
        text: "Không thắng",
        icon: <CloseCircleOutlined />,
        price: status.price,
      };
    }
  };

  // Status mapping functions
  const getDepositStatus = (status: DepositStatus) => {
    switch (status) {
      case 0:
        return { color: "orange", text: "Chờ xác nhận", icon: <ClockCircleOutlined /> };
      case 1:
        return { color: "green", text: "Xác nhận cọc", icon: <CheckCircleOutlined /> };
      default:
        return { color: "gray", text: "Không xác định", icon: <ClockCircleOutlined /> };
    }
  };

  const getTicketStatus = (status: TicketStatus) => {
    switch (status) {
      case 0:
        return { color: "orange", text: "Chưa chuyển tiền", icon: <ClockCircleOutlined /> };
      case 1:
        return { color: "green", text: "Đã chuyển tiền", icon: <CheckCircleOutlined /> };
      case 2:
        return { color: "green", text: "Đã nhận phiếu", icon: <CheckCircleOutlined /> };
      case 3:
        return { color: "green", text: "Đã hoàn cọc", icon: <CheckCircleOutlined /> };
      default:
        return { color: "gray", text: "Không xác định", icon: <ClockCircleOutlined /> };
    }
  };

  // Define table columns
  const getTableColumns = () => [
    {
      title: "STT Điểm Danh",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 120,
      align: "center" as const,
      render: (value: number) => (
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#1890ff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "14px",
            fontWeight: "bold",
            margin: "0 auto",
          }}
        >
          {value}
        </div>
      ),
    },
    {
      title: "Tài sản đấu giá",
      dataIndex: "tagName",
      key: "tagName",
      width: 200,
      render: (text: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "deposit",
      key: "deposit",
      width: 150,
      align: "right" as const,
      render: (value: number, record: AuctionDocument) => {
        const depositStatus = getDepositStatus(record.statusDeposit as DepositStatus);
        return (
          <Text
            strong
            style={{
              color: depositStatus.color === "green" ? "#52c41a" : "#fa8c16",
            }}
          >
            {formatNumber(value)} VNĐ
          </Text>
        );
      },
    },
    {
      title: "Phí đăng ký",
      dataIndex: "registrationFee",
      key: "registrationFee",
      width: 150,
      align: "right" as const,
      render: (value: number) => <Text>{formatNumber(value)} VNĐ</Text>,
    },
    {
      title: "Trạng thái cọc",
      dataIndex: "statusDeposit",
      key: "statusDeposit",
      width: 150,
      align: "center" as const,
      render: (status: DepositStatus) => {
        const depositStatus = getDepositStatus(status);
        return (
          <Tag color={depositStatus.color} icon={depositStatus.icon} style={{ margin: "0" }}>
            {depositStatus.text}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái đơn",
      dataIndex: "statusTicket",
      key: "statusTicket",
      width: 140,
      align: "center" as const,
      render: (status: TicketStatus) => {
        const ticketStatus = getTicketStatus(status);
        return (
          <Tag color={ticketStatus.color} icon={ticketStatus.icon} style={{ margin: "0" }}>
            {ticketStatus.text}
          </Tag>
        );
      },
    },
    {
      title: (
        <>
          <TrophyOutlined /> Trạng thái đấu giá
        </>
      ),
      dataIndex: "auctionDocumentsId",
      key: "auctionStatus",
      width: 180,
      align: "center" as const,
      render: (auctionDocumentsId: string) => {
        const auctionStatus = getAuctionStatus(auctionDocumentsId);
        return (
          <Space direction="vertical" size={4}>
            <Tag color={auctionStatus.color} icon={auctionStatus.icon} style={{ margin: "0" }}>
              {auctionStatus.text}
            </Tag>
            {auctionStatus.price && (
              <Text
                style={{
                  fontSize: "12px",
                  color: auctionStatus.color === "success" ? "#52c41a" : "#ff4d4f",
                  fontWeight: "bold",
                }}
              >
                {formatNumber(auctionStatus.price)} VNĐ
              </Text>
            )}
          </Space>
        );
      },
    },
    {
      title: (
        <>
          <EditOutlined /> Ghi chú
        </>
      ),
      dataIndex: "note",
      key: "note",
      width: 200,
      render: (text: string) =>
        text ? (
          <Tooltip title={text} placement="topLeft">
            <Text italic>{text}</Text>
          </Tooltip>
        ) : (
          <Text type="secondary">--</Text>
        ),
    },
  ];

  const renderTableView = () => (
    <Table
      dataSource={filteredDocuments}
      rowKey="auctionDocumentsId"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đăng ký`,
      }}
      scroll={{ x: 800 }}
      size="middle"
      columns={getTableColumns()}
    />
  );

  return (
    <Card title="Danh sách đăng ký tham gia đấu giá" style={{ marginBottom: "24px " }}>
      {filteredDocuments.length === 0 ? (
        <Empty
          description={
            documents.length === 0
              ? "Bạn chưa đăng ký tham gia phiên đấu giá này"
              : "Không có đăng ký nào phù hợp với bộ lọc"
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        renderTableView()
      )}
    </Card>
  );
};

export default ApplicationsList;
