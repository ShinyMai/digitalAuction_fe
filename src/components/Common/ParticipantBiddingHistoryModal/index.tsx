import React, { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Table,
  Card,
  Statistic,
  Row,
  Col,
  Spin,
  Typography,
  Tag,
  Button,
  message,
  Empty,
} from "antd";
import {
  UserOutlined,
  TrophyOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import AuctionServices from "../../../services/AuctionServices";

const { Text } = Typography;

// Types
interface ParticipantInfo {
  name: string;
  citizenIdentification: string;
  auctionId?: string;
  userId?: string;
}

interface RegisteredAuction {
  auctionId: string;
  auctionName: string;
  categoryName: string;
  auctionDescription: string;
  registerOpenDate: string;
  registerEndDate: string;
  auctionStartDate: string;
  auctionEndDate: string;
  status: number;
  totalAssets: number;
  totalDeposit: number;
  totalRegistrationFee: number;
}

interface AuctionDocument {
  auctionDocumentsId: string;
  citizenIdentification: string;
  deposit: number;
  name: string;
  note: string | null;
  numericalOrder: number;
  registrationFee: number;
  statusDeposit: number;
  statusTicket: number;
  tagName: string;
  bankAccount?: string;
  bankAccountNumber?: string;
  bankBranch?: string;
}

interface Statistics {
  totalRegistrations: number;
  totalDeposit: number;
  totalRegistrationFee: number;
  approvedTickets: number;
  pendingTickets: number;
  paidDeposits: number;
  pendingDeposits: number;
  refundedDeposits: number;
}

interface ParticipantBiddingHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  participantInfo: ParticipantInfo | null;
}

const ParticipantBiddingHistoryModal: React.FC<
  ParticipantBiddingHistoryModalProps
> = ({ visible, onClose, participantInfo }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [registeredAuctions, setRegisteredAuctions] = useState<
    RegisteredAuction[]
  >([]);
  const [documents, setDocuments] = useState<AuctionDocument[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    totalRegistrations: 0,
    totalDeposit: 0,
    totalRegistrationFee: 0,
    approvedTickets: 0,
    pendingTickets: 0,
    paidDeposits: 0,
    pendingDeposits: 0,
    refundedDeposits: 0,
  });
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const fetchRegisteredAuctions = async () => {
    if (!participantInfo?.citizenIdentification) return;

    try {
      setLoading(true);

      const requestBody = {
        userId: participantInfo?.userId,
        pageNumber: 1,
        pageSize: 100,
        search: {
          auctionName: null,
          auctionStartDate: null,
          auctionEndDate: null,
        },
      };

      const response = await AuctionServices.getListAuctionRegisted(
        requestBody
      );

      if (response?.code === 200) {
        const auctionData = response.data?.auctionResponse || [];
        setRegisteredAuctions(Array.isArray(auctionData) ? auctionData : []);
      } else {
        message.warning("Không tìm thấy phiên đấu giá đã đăng ký nào");
        setRegisteredAuctions([]);
      }
    } catch (error) {
      console.error("Error fetching registered auctions:", error);
      message.error("Không thể tải danh sách phiên đấu giá đã đăng ký");
      setRegisteredAuctions([]);
    } finally {
      setLoading(false);
    }
  };
  // Fetch participant's auction registration data
  const fetchParticipantData = async () => {
    if (!selectedAuctionId || !participantInfo?.citizenIdentification) return;

    try {
      setLoading(true);
      const userId = participantInfo.userId;

      const response = await AuctionServices.getListAuctionDocumentRegisted({
        auctionId: selectedAuctionId,
        userId: userId,
      });

      if (response.code === 200 && response.data) {
        const participantDocuments = response.data.filter(
          (doc: AuctionDocument) =>
            doc.citizenIdentification === participantInfo.citizenIdentification
        );

        setDocuments(participantDocuments);
        calculateStatistics(participantDocuments);
      } else {
        message.warning(
          "Không tìm thấy dữ liệu đăng ký cho người tham gia này"
        );
        setDocuments([]);
        setStatistics({
          totalRegistrations: 0,
          totalDeposit: 0,
          totalRegistrationFee: 0,
          approvedTickets: 0,
          pendingTickets: 0,
          paidDeposits: 0,
          pendingDeposits: 0,
          refundedDeposits: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching participant data:", error);
      message.error("Không thể tải thông tin đăng ký của người tham gia");
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from registration documents
  const calculateStatistics = (docs: AuctionDocument[]) => {
    const stats: Statistics = {
      totalRegistrations: docs.length,
      totalDeposit: docs.reduce((sum, doc) => sum + (doc.deposit || 0), 0),
      totalRegistrationFee: docs.reduce(
        (sum, doc) => sum + (doc.registrationFee || 0),
        0
      ),
      approvedTickets: docs.filter((doc) => doc.statusTicket === 1).length,
      pendingTickets: docs.filter((doc) => doc.statusTicket === 0).length,
      paidDeposits: docs.filter((doc) => doc.statusDeposit === 1).length,
      pendingDeposits: docs.filter((doc) => doc.statusDeposit === 0).length,
      refundedDeposits: docs.filter((doc) => doc.statusDeposit === 2).length,
    };
    setStatistics(stats);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get auction status
  const getAuctionStatus = (auction: RegisteredAuction) => {
    const now = new Date();
    const registerEnd = new Date(auction.registerEndDate);
    const auctionStart = new Date(auction.auctionStartDate);
    const auctionEnd = new Date(auction.auctionEndDate);

    if (now < registerEnd) {
      return <Tag color="blue">Đang đăng ký</Tag>;
    } else if (now >= registerEnd && now < auctionStart) {
      return <Tag color="orange">Chờ đấu giá</Tag>;
    } else if (now >= auctionStart && now < auctionEnd) {
      return <Tag color="green">Đang đấu giá</Tag>;
    } else {
      return <Tag color="gray">Đã kết thúc</Tag>;
    }
  };

  // Handle auction selection
  const handleSelectAuction = (auctionId: string) => {
    setSelectedAuctionId(auctionId);
    setViewMode("detail");
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedAuctionId(null);
    setDocuments([]);
    setStatistics({
      totalRegistrations: 0,
      totalDeposit: 0,
      totalRegistrationFee: 0,
      approvedTickets: 0,
      pendingTickets: 0,
      paidDeposits: 0,
      pendingDeposits: 0,
      refundedDeposits: 0,
    });
  };

  // Table columns for registered auctions
  const auctionsColumns = [
    {
      title: "Tên phiên đấu giá",
      dataIndex: "auctionName",
      key: "auctionName",
      width: 250,
      render: (name: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {name}
        </Text>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      width: 150,
    },
    {
      title: "Ngày đăng ký",
      key: "registerDate",
      width: 200,
      render: (_: string, record: RegisteredAuction) => (
        <div>
          <div>Từ: {formatDate(record.registerOpenDate)}</div>
          <div>Đến: {formatDate(record.registerEndDate)}</div>
        </div>
      ),
    },
    {
      title: "Ngày đấu giá",
      key: "auctionDate",
      width: 200,
      render: (_: string, record: RegisteredAuction) => (
        <div>
          <div>Từ: {formatDate(record.auctionStartDate)}</div>
          <div>Đến: {formatDate(record.auctionEndDate)}</div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_: string, record: RegisteredAuction) =>
        getAuctionStatus(record),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: string, record: RegisteredAuction) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleSelectAuction(record.auctionId)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];
  useEffect(() => {
    if (visible && participantInfo) {
      if (viewMode === "list") {
        fetchRegisteredAuctions();
      } else if (viewMode === "detail" && selectedAuctionId) {
        fetchParticipantData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    visible,
    participantInfo?.citizenIdentification,
    viewMode,
    selectedAuctionId,
  ]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get deposit status tag
  const getDepositStatusTag = (status: number) => {
    switch (status) {
      case 1:
        return <Tag color="green">Đã thanh toán</Tag>;
      case 2:
        return <Tag color="orange">Đã hoàn trả</Tag>;
      case 0:
      default:
        return <Tag color="red">Chưa thanh toán</Tag>;
    }
  };

  // Get ticket status tag
  const getTicketStatusTag = (status: number) => {
    switch (status) {
      case 1:
        return <Tag color="green">Đã duyệt</Tag>;
      case 2:
        return <Tag color="red">Từ chối</Tag>;
      case 0:
      default:
        return <Tag color="blue">Chờ duyệt</Tag>;
    }
  };

  // Table columns for registration documents
  const documentsColumns = [
    {
      title: "STT",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 60,
      render: (order: number) => <Text strong>{order || "-"}</Text>,
    },
    {
      title: "Tài sản",
      dataIndex: "tagName",
      key: "tagName",
      width: 200,
      render: (tagName: string) => (
        <Text strong style={{ color: "#1890ff" }}>
          {tagName}
        </Text>
      ),
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "deposit",
      key: "deposit",
      width: 120,
      render: (amount: number) => (
        <Text strong style={{ color: "#f5222d" }}>
          {formatCurrency(amount || 0)}
        </Text>
      ),
    },
    {
      title: "Phí đăng ký",
      dataIndex: "registrationFee",
      key: "registrationFee",
      width: 120,
      render: (fee: number) => <Text>{formatCurrency(fee || 0)}</Text>,
    },
    {
      title: "Trạng thái cọc",
      dataIndex: "statusDeposit",
      key: "statusDeposit",
      width: 130,
      render: (status: number) => getDepositStatusTag(status),
    },
    {
      title: "Trạng thái phiếu",
      dataIndex: "statusTicket",
      key: "statusTicket",
      width: 130,
      render: (status: number) => getTicketStatusTag(status),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 150,
      render: (note: string) => note || "-",
    },
  ];
  const tabItems = [
    {
      key: "1",
      label: (
        <span>
          <HistoryOutlined />
          {viewMode === "list"
            ? "Danh sách phiên đấu giá"
            : "Thông tin đăng ký"}
        </span>
      ),
      children: (
        <div>
          {viewMode === "list" ? (
            // Hiển thị danh sách phiên đấu giá đã đăng ký
            <div>
              {registeredAuctions.length > 0 ? (
                <Table
                  columns={auctionsColumns}
                  dataSource={registeredAuctions}
                  rowKey="auctionId"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} phiên đấu giá`,
                  }}
                  scroll={{ x: 1000 }}
                  locale={{
                    emptyText: "Không có phiên đấu giá nào đã đăng ký",
                  }}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Người tham gia này chưa đăng ký phiên đấu giá nào"
                />
              )}
            </div>
          ) : (
            // Hiển thị thông tin đăng ký trong phiên đấu giá cụ thể
            <div>
              {/* Nút quay lại */}
              <div className="mb-4">
                <Button
                  icon={<HistoryOutlined />}
                  onClick={handleBackToList}
                  className="mb-2"
                >
                  Quay lại danh sách
                </Button>
              </div>

              {documents.length > 0 ? (
                <Table
                  columns={documentsColumns}
                  dataSource={documents}
                  rowKey="auctionDocumentsId"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} của ${total} đăng ký`,
                  }}
                  scroll={{ x: 900 }}
                  locale={{
                    emptyText: "Không có thông tin đăng ký nào",
                  }}
                />
              ) : (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Người tham gia này chưa có thông tin đăng ký nào trong phiên đấu giá này"
                />
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span>
          <FileTextOutlined />
          Thống kê
        </span>
      ),
      children: (
        <div>
          {viewMode === "detail" ? (
            // Hiển thị thống kê khi ở chế độ chi tiết
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Tổng số đăng ký"
                    value={statistics.totalRegistrations}
                    prefix={<FileTextOutlined style={{ color: "#1890ff" }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Phiếu đã duyệt"
                    value={statistics.approvedTickets}
                    prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Phiếu chờ duyệt"
                    value={statistics.pendingTickets}
                    prefix={
                      <ClockCircleOutlined style={{ color: "#faad14" }} />
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Tổng tiền cọc"
                    value={statistics.totalDeposit}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<DollarOutlined style={{ color: "#f5222d" }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Tổng phí đăng ký"
                    value={statistics.totalRegistrationFee}
                    formatter={(value) => formatCurrency(Number(value))}
                    prefix={<DollarOutlined style={{ color: "#722ed1" }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Cọc đã thanh toán"
                    value={statistics.paidDeposits}
                    prefix={<TrophyOutlined style={{ color: "#52c41a" }} />}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Cọc chưa thanh toán"
                    value={statistics.pendingDeposits}
                    prefix={
                      <ExclamationCircleOutlined style={{ color: "#f5222d" }} />
                    }
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card>
                  <Statistic
                    title="Cọc đã hoàn trả"
                    value={statistics.refundedDeposits}
                    prefix={<DollarOutlined style={{ color: "#faad14" }} />}
                  />
                </Card>
              </Col>
            </Row>
          ) : (
            // Hiển thị thông báo khi ở chế độ danh sách
            <div className="text-center py-8">
              <Text type="secondary">
                Vui lòng chọn một phiên đấu giá để xem thống kê chi tiết
              </Text>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 p-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <UserOutlined className="text-blue-600 text-lg" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800">
              Thông tin đăng ký của {participantInfo?.name}
            </div>
            <div className="text-sm text-gray-500">
              CMND/CCCD: {participantInfo?.citizenIdentification}
            </div>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose} size="large">
          Đóng
        </Button>,
      ]}
      className="participant-bidding-history-modal"
      styles={{
        header: {
          borderBottom: "1px solid #f0f0f0",
          paddingBottom: "16px",
          marginBottom: "0",
        },
        body: {
          paddingTop: "16px",
        },
      }}
    >
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1" items={tabItems} className="custom-tabs" />
      </Spin>
    </Modal>
  );
};

export default ParticipantBiddingHistoryModal;
