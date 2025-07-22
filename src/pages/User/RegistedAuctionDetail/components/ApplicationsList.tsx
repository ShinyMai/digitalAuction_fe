import React, { useState } from "react";
import {
  Card,
  Empty,
  Table,
  Tag,
  Typography,
  Tooltip,
  Button,
  Space,
  Row,
  Col,
  Descriptions,
} from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import type { AuctionDocument, DepositStatus, TicketStatus } from "../types";

const { Text } = Typography;

interface ApplicationsListProps {
  filteredDocuments: AuctionDocument[];
  documents: AuctionDocument[];
}

const ApplicationsList: React.FC<ApplicationsListProps> = ({ filteredDocuments, documents }) => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

  // Status mapping functions
  const getDepositStatus = (status: DepositStatus) => {
    switch (status) {
      case 0:
        return { color: "orange", text: "Chờ xác nhận", icon: <ClockCircleOutlined /> };
      case 1:
        return { color: "green", text: "Xác nhận thanh toán", icon: <CheckCircleOutlined /> };
      case 2:
        return { color: "blue", text: "Đã hoàn trả", icon: <DollarOutlined /> };
      default:
        return { color: "gray", text: "Không xác định", icon: <ClockCircleOutlined /> };
    }
  };

  const getTicketStatus = (status: TicketStatus) => {
    switch (status) {
      case 0:
        return { color: "orange", text: "Chưa nhận đơn", icon: <ClockCircleOutlined /> };
      case 1:
        return { color: "green", text: "Đã nhận", icon: <CheckCircleOutlined /> };
      default:
        return { color: "gray", text: "Không xác định", icon: <ClockCircleOutlined /> };
    }
  };

  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {filteredDocuments.map((document) => {
        const depositStatus = getDepositStatus(document.statusDeposit as DepositStatus);
        const ticketStatus = getTicketStatus(document.statusTicket as TicketStatus);

        return (
          <Col xs={24} lg={12} xl={8} key={document.auctionDocumentsId}>
            <Card
              size="small"
              hoverable
              title={
                <Space>
                  <span style={{ fontWeight: "bold" }}>
                    Số TT Điểm Danh: {document.numericalOrder}
                  </span>
                </Space>
              }
              extra={
                <Space direction="vertical" size={4}>
                  <Tag
                    color={depositStatus.color}
                    icon={depositStatus.icon}
                    style={{ margin: "0" }}
                  >
                    {depositStatus.text}
                  </Tag>
                  <Tag color={ticketStatus.color} icon={ticketStatus.icon} style={{ margin: "0" }}>
                    {ticketStatus.text}
                  </Tag>
                </Space>
              }
              headStyle={{ backgroundColor: "#fafafa" }}
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item
                  label={
                    <>
                      <FileTextOutlined /> Tài sản đấu giá
                    </>
                  }
                >
                  <Text strong style={{ color: "#1890ff" }}>
                    {document.tagName}
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <>
                      <DollarOutlined /> Tiền đặt cọc
                    </>
                  }
                >
                  <Text
                    strong
                    style={{
                      color: depositStatus.color === "green" ? "#52c41a" : "#fa8c16",
                    }}
                  >
                    {formatNumber(document.deposit)} VNĐ
                  </Text>
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <>
                      <DollarOutlined /> Phí đăng ký
                    </>
                  }
                >
                  <Text>{formatNumber(document.registrationFee)} VNĐ</Text>
                </Descriptions.Item>

                {document.note && (
                  <Descriptions.Item
                    label={
                      <>
                        <EditOutlined /> Ghi chú
                      </>
                    }
                  >
                    <Text italic style={{ color: "#666" }}>
                      {document.note}
                    </Text>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        );
      })}
    </Row>
  );

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
      columns={[
        {
          title: "STT Điểm Danh",
          dataIndex: "numericalOrder",
          key: "numericalOrder",
          width: 120,
          align: "center",
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
          title: (
            <>
              <FileTextOutlined /> Tài sản đấu giá
            </>
          ),
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
          title: (
            <>
              <DollarOutlined /> Tiền đặt cọc
            </>
          ),
          dataIndex: "deposit",
          key: "deposit",
          width: 150,
          align: "right",
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
          title: (
            <>
              <DollarOutlined /> Phí đăng ký
            </>
          ),
          dataIndex: "registrationFee",
          key: "registrationFee",
          width: 150,
          align: "right",
          render: (value: number) => <Text>{formatNumber(value)} VNĐ</Text>,
        },
        {
          title: "Trạng thái cọc",
          dataIndex: "statusDeposit",
          key: "statusDeposit",
          width: 150,
          align: "center",
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
          align: "center",
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
              <EditOutlined /> Ghi chú
            </>
          ),
          dataIndex: "note",
          key: "note",
          width: 200,
          render: (text: string) =>
            text ? (
              <Tooltip title={text} placement="topLeft">
                <Text
                  italic
                  style={{
                    color: "#666",
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "180px",
                  }}
                >
                  {text}
                </Text>
              </Tooltip>
            ) : (
              <Text type="secondary">--</Text>
            ),
        },
      ]}
    />
  );
  return (
    <Card
      title="Danh sách đăng ký tham gia đấu giá"
      style={{ marginBottom: "24px " }}
      extra={
        <Space>
          <Button
            type={viewMode === "table" ? "primary" : "default"}
            icon={<TableOutlined />}
            onClick={() => setViewMode("table")}
            size="small"
          >
            Bảng
          </Button>
          <Button
            type={viewMode === "card" ? "primary" : "default"}
            icon={<AppstoreOutlined />}
            onClick={() => setViewMode("card")}
            size="small"
          >
            Thẻ
          </Button>
        </Space>
      }
    >
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
        <>{viewMode === "table" ? renderTableView() : renderCardView()}</>
      )}
    </Card>
  );
};

export default ApplicationsList;
