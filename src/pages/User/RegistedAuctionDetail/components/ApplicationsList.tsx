/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Card,
  Empty,
  Table,
  Tag,
  Typography,
  Tooltip,
  Space,
  Button,
  Modal,
  Input,
  Upload,
  Form,
} from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
  FileProtectOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import type {
  AuctionDocument,
  DepositStatus,
  TicketStatus,
  AuctionStatusData,
} from "../types";
import AuctionServices from "../../../../services/AuctionServices";
import { toast } from "react-toastify";
import { exportToDocx } from "../../../../components/Common/ExportDocs/DocumentGenerator";
import UserServices from "../../../../services/UserServices";
import { useSelector } from "react-redux";
import type { RegistrationAuctionModals } from "../../../Anonymous/Modals";

const { Text } = Typography;
const { TextArea } = Input;

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
  const { user } = useSelector((state: any) => state.auth);
  const [userInfo, setUserInfo] = useState<any>();

  // Modal states
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<AuctionDocument | null>(null);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [cancelReason, setCancelReason] = useState("");
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const getUserInfo = async () => {
    try {
      const res = await UserServices.getUserInfo({
        user_id: user.id,
      });

      if (res.code === 200) {
        setUserInfo(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Handle cancel modal functions
  const handleOpenCancelModal = () => {
    // Tự động chọn tất cả tài sản có statusDeposit = 1 (đã xác nhận cọc)
    const confirmedDepositAssets = filteredDocuments
      .filter(doc => doc.statusDeposit === 1)
      .map(doc => doc.auctionDocumentsId);

    setSelectedAssets(confirmedDepositAssets);
    setIsCancelModalVisible(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalVisible(false);
    setSelectedAssets([]);
    setCancelReason("");
    setUploadedFile(null);
  };

  // Handle detail modal functions
  const handleOpenDetailModal = (record: AuctionDocument) => {
    setSelectedDocument(record);
    setIsDetailModalVisible(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalVisible(false);
    setSelectedDocument(null);
  };

  const handleFileUpload = (info: any) => {
    const { file } = info;

    // Khi beforeUpload return false, file sẽ có status undefined
    // Chúng ta cần set uploadedFile trực tiếp
    if (file) {
      setUploadedFile(file);
      toast.success(`Đã chọn file: ${file.name}`);
    }
  };

  const handleSubmitCancelRequest = async () => {
    // Kiểm tra có tài sản nào đã xác nhận cọc không
    const confirmedDepositAssets = filteredDocuments.filter(doc => doc.statusDeposit === 1);

    if (confirmedDepositAssets.length === 0) {
      toast.error("Không có tài sản nào đã xác nhận cọc để hủy tham gia!");
      return;
    }

    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy tham gia!");
      return;
    }

    if (!uploadedFile) {
      toast.error("Vui lòng tải lên tài liệu đính kèm!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Tạo FormData để gửi kèm file
      const formData = new FormData();

      // Thêm AuctionDocumentIds (array) vào FormData
      selectedAssets.forEach((assetId) => {
        formData.append(`AuctionDocumentIds`, assetId);
      });

      // Thêm RefundReason
      formData.append('RefundReason', cancelReason);

      // Thêm file nếu có
      if (uploadedFile) {
        // Khi sử dụng beforeUpload: false, file object chính là originFileObj
        const fileToUpload = uploadedFile.originFileObj || uploadedFile;
        formData.append('RefundProof', fileToUpload);
      }
      const response = await AuctionServices.userRequestRefund(formData);
      if (response.code == 200) {
        toast.success(response.message)
      } else {
        toast.error(response.message || "Có lỗi xảy ra khi gửi yêu cầu!");
      }
      handleCloseCancelModal();
    } catch (error) {
      console.error("Error submitting cancel request:", error);
      toast.error("Có lỗi xảy ra khi gửi yêu cầu!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to transform record and userInfo to match exportToDocx requirements
  const transformDataForExport = (
    record: AuctionDocument
  ): Partial<RegistrationAuctionModals> => {
    return {
      fullName: userInfo?.name || record.name || "",
      dob: userInfo?.birthDay || "",
      idNumber:
        userInfo?.citizenIdentification || record.citizenIdentification || "",
      idDate: userInfo?.issueDate || "",
      place: userInfo?.issueBy || "",
      phone: userInfo?.phoneNumber || "",
      address: userInfo?.recentLocation || "",
      auctionInfo: record.tagName || "",
      assetsInfo: record.tagName || "",
      priceStart: record.deposit?.toString() || "",
      bankAccount: record.bankAccount || "",
      bankAccountNumber: record.bankAccountNumber || "",
      bankBranch: record.bankBranch || "",
      locationDate: new Date().toISOString(),
    };
  };

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
        return {
          color: "orange",
          text: "Chờ xác nhận",
          icon: <ClockCircleOutlined />,
        };
      case 1:
        return {
          color: "green",
          text: "Xác nhận cọc",
          icon: <CheckCircleOutlined />,
        };
      default:
        return {
          color: "gray",
          text: "Không xác định",
          icon: <ClockCircleOutlined />,
        };
    }
  };

  const getTicketStatus = (status: TicketStatus) => {
    switch (status) {
      case 0:
        return {
          color: "orange",
          text: "Chưa chuyển tiền",
          icon: <ClockCircleOutlined />,
        };
      case 1:
        return {
          color: "green",
          text: "Đã chuyển tiền",
          icon: <CheckCircleOutlined />,
        };
      case 2:
        return {
          color: "green",
          text: "Đã nhận phiếu",
          icon: <CheckCircleOutlined />,
        };
      case 3:
        return {
          color: "green",
          text: "Đã hoàn cọc",
          icon: <CheckCircleOutlined />,
        };
      default:
        return {
          color: "gray",
          text: "Không xác định",
          icon: <ClockCircleOutlined />,
        };
    }
  };

  // Thêm các hàm helper cho trường mới
  const getAttendanceStatus = (isAttended?: boolean) => {
    if (isAttended === undefined || isAttended === null) {
      return {
        color: "default",
        text: "Chưa xác định",
        icon: <ClockCircleOutlined />,
      };
    }

    return isAttended ? {
      color: "green",
      text: "Đã tham dự",
      icon: <UserOutlined />,
    } : {
      color: "red",
      text: "Chưa tham dự",
      icon: <ExclamationCircleOutlined />,
    };
  };

  const getRefundStatus = (statusRefund?: number) => {
    switch (statusRefund) {
      case 0:
        return {
          color: "orange",
          text: "Chờ xử lý",
          icon: <ClockCircleOutlined />,
        };
      case 1:
        return {
          color: "green",
          text: "Đã chấp nhận",
          icon: <CheckCircleOutlined />,
        };
      case 2:
        return {
          color: "red",
          text: "Từ chối",
          icon: <CloseCircleOutlined />,
        };
      default:
        return null; // Không hiển thị gì nếu chưa có yêu cầu hoàn cọc
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
        const depositStatus = getDepositStatus(
          record.statusDeposit as DepositStatus
        );
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
          <Tag
            color={depositStatus.color}
            icon={depositStatus.icon}
            style={{ margin: "0" }}
          >
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
          <Tag
            color={ticketStatus.color}
            icon={ticketStatus.icon}
            style={{ margin: "0" }}
          >
            {ticketStatus.text}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái đấu giá",
      dataIndex: "auctionDocumentsId",
      key: "auctionStatus",
      width: 180,
      align: "center" as const,
      render: (auctionDocumentsId: string) => {
        const auctionStatus = getAuctionStatus(auctionDocumentsId);
        return (
          <Space direction="vertical" size={4}>
            <Tag
              color={auctionStatus.color}
              icon={auctionStatus.icon}
              style={{ margin: "0" }}
            >
              {auctionStatus.text}
            </Tag>
            {auctionStatus.price && (
              <Text
                style={{
                  fontSize: "12px",
                  color:
                    auctionStatus.color === "success" ? "#52c41a" : "#ff4d4f",
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
      title: "Ghi chú",
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
    {
      title: "Thao tác",
      dataIndex: "actions",
      key: "actions",
      width: 120,
      render: (_: any, record: AuctionDocument) => {
        return (
          <Space size="small">
            <Tooltip title="Xem chi tiết" placement="top">
              <Button
                type="text"
                icon={<InfoCircleOutlined />}
                className="!text-green-600 !hover:bg-green-50"
                onClick={() => handleOpenDetailModal(record)}
              />
            </Tooltip>
            <Tooltip title="Tải xuống phiếu đăng ký" placement="top">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                className="!text-blue-600 !hover:bg-blue-50"
                onClick={() => {
                  const transformedData = transformDataForExport(record);
                  exportToDocx(transformedData);
                }}
              />
            </Tooltip>
          </Space>
        );
      },
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
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} đăng ký`,
      }}
      scroll={{ x: 1000 }}
      size="middle"
      columns={getTableColumns()}
    />
  );

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Danh sách đăng ký tham gia đấu giá</span>
            {/* Chỉ hiển thị button khi có ít nhất 1 tài sản đã xác nhận cọc */}
            {filteredDocuments.some(doc => doc.statusDeposit === 1) && (
              <Button
                type="primary"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={handleOpenCancelModal}
              >
                Xin hủy tham gia đấu giá
              </Button>
            )}
          </div>
        }
        style={{ marginBottom: "24px " }}
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
          renderTableView()
        )}
      </Card>

      {/* Cancel Participation Modal */}
      <Modal
        title={
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "2px 0",
            borderBottom: "1px solid #f0f0f0",
            marginBottom: "8px"
          }}>
            <div style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(255, 77, 79, 0.3)"
            }}>
              <ExclamationCircleOutlined style={{ color: "white", fontSize: "12px" }} />
            </div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: "600", color: "#262626", lineHeight: "1.1" }}>
                Xin hủy tham gia đấu giá
              </div>
              <div style={{ fontSize: "13px", color: "#8c8c8c", marginTop: "1px" }}>
                Yêu cầu hủy tham gia các tài sản đã xác nhận cọc
              </div>
            </div>
          </div>
        }
        open={isCancelModalVisible}
        onCancel={handleCloseCancelModal}
        width={650}
        footer={null}
        destroyOnClose
        className="cancel-participation-modal"
        style={{
          top: "30px"
        }}
        bodyStyle={{
          padding: "12px 16px 16px 16px",
          background: "#fafafa"
        }}
      >
        {/* Warning Message */}
        <div
          style={{
            background: "linear-gradient(135deg, #fff2f0 0%, #fff1f0 100%)",
            border: "1px solid #ffa39e",
            borderRadius: "6px",
            padding: "8px",
            marginBottom: "12px",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "3px",
            height: "100%",
            background: "linear-gradient(180deg, #ff7875 0%, #ff4d4f 100%)"
          }} />
          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginLeft: "6px" }}>
            <div style={{
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "#fff2f0",
              border: "2px solid #ff7875",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: "1px"
            }}>
              <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "10px" }} />
            </div>
            <div>
              <Text style={{
                color: "#5c0011",
                fontSize: "14px",
                fontWeight: "600",
                display: "block",
                marginBottom: "3px"
              }}>
                Điều kiện hủy tham gia đấu giá
              </Text>
              <Text style={{ color: "#a8071a", fontSize: "13px", lineHeight: "1.4" }}>
                Việc hủy tham gia đấu giá chỉ được xem xét trong các trường hợp <strong>bất khả kháng</strong>.
                Bạn <strong>bắt buộc phải cung cấp tài liệu chứng minh</strong> lý do hủy hợp lệ.
              </Text>
            </div>
          </div>
        </div>

        <Form layout="vertical" style={{ background: "white", borderRadius: "6px", padding: "12px" }}>
          {/* Asset Selection */}
          <Form.Item
            label={
              <div style={{ marginBottom: "6px" }}>
                <Text strong style={{ fontSize: "15px", color: "#262626" }}>
                  Tài sản sẽ được hủy tham gia
                </Text>
                <div style={{
                  fontSize: "13px",
                  color: "#8c8c8c",
                  marginTop: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px"
                }}>
                  <div style={{
                    width: "3px",
                    height: "3px",
                    borderRadius: "50%",
                    background: "#52c41a"
                  }} />
                  Chỉ áp dụng cho các tài sản đã được xác nhận cọc
                </div>
              </div>
            }
          >
            <div style={{
              border: "1px solid #e8f4fd",
              borderRadius: "6px",
              background: "linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)",
              overflow: "hidden"
            }}>
              {/* Header Summary */}
              <div style={{
                background: "linear-gradient(135deg, #e6f7ff 0%, #f6ffed 100%)",
                padding: "8px 12px",
                borderBottom: "1px solid #d9f7be"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}>
                      {selectedAssets.length}
                    </div>
                    <div>
                      <Text strong style={{ fontSize: "14px", color: "#262626" }}>
                        Tài sản đã xác nhận cọc
                      </Text>
                      <div style={{ fontSize: "12px", color: "#52c41a", marginTop: "0px" }}>
                        Sẽ được gửi yêu cầu hủy tham gia
                      </div>
                    </div>
                  </div>
                  <div style={{
                    background: "#fff",
                    padding: "3px 6px",
                    borderRadius: "10px",
                    border: "1px solid #b7eb8f",
                    fontSize: "12px",
                    color: "#389e0d",
                    fontWeight: "500"
                  }}>
                    Đã chọn tự động
                  </div>
                </div>
              </div>

              {/* Assets List */}
              <div style={{ padding: "8px 12px", maxHeight: "160px", overflowY: "auto" }}>
                {filteredDocuments
                  .filter(asset => asset.statusDeposit === 1)
                  .map((asset, index) => (
                    <div
                      key={asset.auctionDocumentsId}
                      style={{
                        marginBottom: index === filteredDocuments.filter(a => a.statusDeposit === 1).length - 1 ? "0" : "6px",
                        padding: "6px",
                        background: "rgba(255, 255, 255, 0.8)",
                        borderRadius: "4px",
                        border: "1px solid #e6f7ff",
                        boxShadow: "0 1px 2px rgba(82, 196, 26, 0.08)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <div style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "2px",
                          background: "#52c41a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "1px"
                        }}>
                          <CheckCircleOutlined style={{ color: "white", fontSize: "8px" }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text strong style={{ color: "#1890ff", fontSize: "14px", display: "block", marginBottom: "2px" }}>
                            {asset.tagName}
                          </Text>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                              <strong style={{ color: "#595959" }}>STT:</strong> {asset.numericalOrder}
                            </span>
                            <span style={{ fontSize: "12px", color: "#8c8c8c" }}>
                              <strong style={{ color: "#595959" }}>Tiền cọc:</strong> {formatNumber(asset.deposit)} VNĐ
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {/* Disabled Assets Section */}
                {filteredDocuments.filter(asset => asset.statusDeposit !== 1).length > 0 && (
                  <div style={{ marginTop: "12px" }}>
                    <div style={{
                      padding: "8px 12px",
                      background: "#fafafa",
                      borderRadius: "6px",
                      border: "1px solid #f0f0f0",
                      marginBottom: "8px"
                    }}>
                      <Text style={{ fontSize: "11px", color: "#8c8c8c", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CloseCircleOutlined />
                        Tài sản chưa xác nhận cọc (không thể hủy)
                      </Text>
                    </div>
                    {filteredDocuments
                      .filter(asset => asset.statusDeposit !== 1)
                      .map((asset, index) => (
                        <div
                          key={asset.auctionDocumentsId}
                          style={{
                            marginBottom: index === filteredDocuments.filter(a => a.statusDeposit !== 1).length - 1 ? "0" : "6px",
                            padding: "8px 12px",
                            background: "#f5f5f5",
                            borderRadius: "4px",
                            border: "1px solid #e8e8e8",
                            opacity: 0.7
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <CloseCircleOutlined style={{ color: "#bfbfbf", fontSize: "12px" }} />
                            <div>
                              <Text style={{ color: "#8c8c8c", fontSize: "12px" }}>{asset.tagName}</Text>
                              <div style={{ fontSize: "10px", color: "#bfbfbf", marginTop: "1px" }}>
                                STT: {asset.numericalOrder} • Chưa xác nhận cọc
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </Form.Item>

          {/* Reason TextArea */}
          <Form.Item
            label={
              <div style={{ marginBottom: "4px" }}>
                <Text strong style={{ fontSize: "15px", color: "#262626" }}>
                  Lý do hủy tham gia
                </Text>
                <div style={{ fontSize: "13px", color: "#8c8c8c", marginTop: "1px" }}>
                  Vui lòng mô tả chi tiết lý do bất khả kháng
                </div>
              </div>
            }
            required
          >
            <TextArea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Ví dụ: Lý do sức khỏe, công việc khẩn cấp, hoàn cảnh gia đình..."
              rows={2}
              maxLength={500}
              showCount
              style={{
                borderRadius: "4px",
                fontSize: "14px",
                border: "1px solid #d9d9d9",
                background: "#fdfdfd"
              }}
            />
          </Form.Item>

          {/* File Upload */}
          <Form.Item
            label={
              <div style={{ marginBottom: "4px" }}>
                <Text strong style={{ fontSize: "15px", color: "#262626" }}>
                  Tài liệu chứng minh <span style={{ color: '#ff4d4f' }}>*</span>
                </Text>
                <div style={{ fontSize: "13px", color: "#8c8c8c", marginTop: "1px" }}>
                  Cung cấp tài liệu chứng minh lý do hủy tham gia (bắt buộc)
                </div>
              </div>
            }
            required
          >
            <Upload
              name="file"
              maxCount={1}
              beforeUpload={() => false}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              style={{ width: '100%' }}
            >
              <div style={{
                border: uploadedFile ? "1px solid #52c41a" : "1px dashed #d9d9d9",
                borderRadius: "4px",
                padding: "8px 12px",
                background: uploadedFile ? "#f6ffed" : "#fafafa",
                transition: "all 0.3s ease",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                {uploadedFile ? (
                  <>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#52c41a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                      flexShrink: 0
                    }}>
                      <CheckCircleOutlined />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: "#52c41a", fontSize: "13px", display: "block" }}>
                        Đã chọn file
                      </Text>
                      <Text style={{ color: "#8c8c8c", fontSize: "11px" }}>
                        {uploadedFile.name.length > 35 ? uploadedFile.name.substring(0, 35) + '...' : uploadedFile.name}
                      </Text>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#8c8c8c",
                      fontSize: "10px",
                      flexShrink: 0
                    }}>
                      <UploadOutlined />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Text strong style={{ color: "#262626", fontSize: "13px", display: "block" }}>
                        Chọn file tài liệu
                      </Text>
                      <Text style={{ color: "#8c8c8c", fontSize: "11px" }}>
                        Hỗ trợ PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                      </Text>
                    </div>
                  </>
                )}
              </div>
            </Upload>

            {!uploadedFile && (
              <div style={{
                marginTop: "4px",
                padding: "4px",
                background: "#fff7e6",
                border: "1px solid #ffd591",
                borderRadius: "3px",
                fontSize: "11px",
                color: "#d46b08"
              }}>
                <ExclamationCircleOutlined style={{ marginRight: "2px", fontSize: "10px" }} />
                <strong>Bắt buộc:</strong> Cung cấp tài liệu chứng minh
              </div>
            )}
          </Form.Item>

          {/* Action Buttons */}
          <Form.Item style={{ marginBottom: 0, marginTop: "12px" }}>
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              paddingTop: "12px",
              borderTop: "1px solid #f0f0f0"
            }}>
              <Button
                onClick={handleCloseCancelModal}
                style={{
                  borderRadius: "4px",
                  padding: "4px 16px",
                  height: "auto",
                  border: "1px solid #d9d9d9",
                  fontWeight: "500",
                  fontSize: "14px"
                }}
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                danger
                loading={isSubmitting}
                onClick={handleSubmitCancelRequest}
                icon={<DeleteOutlined />}
                style={{
                  borderRadius: "4px",
                  padding: "4px 16px",
                  height: "auto",
                  background: "linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(255, 77, 79, 0.3)",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                {isSubmitting ? "Đang gửi yêu cầu..." : "Xác nhận hủy tham gia"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Detail Information Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }} className="text-black">
            <InfoCircleOutlined style={{ color: "#1890ff", fontSize: "18px" }} />
            <span style={{ fontSize: "15px", fontWeight: "600" }}>
              Thông tin xin hủy
            </span>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={handleCloseDetailModal}
        width={600}
        footer={[
          <Button key="close" onClick={handleCloseDetailModal} size="small">
            Đóng
          </Button>
        ]}
        destroyOnClose
        className="detail-modal"
      >
        {selectedDocument && (
          <div style={{ padding: "16px 0" }}>
            {/* New Fields Information */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                background: "#f0f9ff",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid #bae7ff"
              }}>
                {/* Attendance Status */}
                <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>Tham dự:</Text>
                  {(() => {
                    const attendanceStatus = getAttendanceStatus(selectedDocument.isAttended);
                    return (
                      <Tag color={attendanceStatus.color} icon={attendanceStatus.icon} style={{ fontSize: "11px" }}>
                        {attendanceStatus.text}
                      </Tag>
                    );
                  })()}
                </div>

                {/* Refund Status */}
                <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Text type="secondary" style={{ fontSize: "12px" }}>Hoàn cọc:</Text>
                  {(() => {
                    const refundStatus = getRefundStatus(selectedDocument.statusRefund);
                    if (!refundStatus) {
                      return <Text type="secondary" style={{ fontSize: "11px" }}>Chưa có yêu cầu</Text>;
                    }
                    return (
                      <Tag color={refundStatus.color} icon={refundStatus.icon} style={{ fontSize: "11px" }}>
                        {refundStatus.text}
                      </Tag>
                    );
                  })()}
                </div>

                {/* Refund Reason */}
                {selectedDocument.refundReason && (
                  <div style={{ marginBottom: "12px" }}>
                    <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>
                      Lý do xin rút:
                    </Text>
                    <div style={{
                      background: "white",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #d9d9d9"
                    }}>
                      <Text style={{ fontSize: "12px" }}>{selectedDocument.refundReason}</Text>
                    </div>
                  </div>
                )}

                {/* Refund Proof */}
                {selectedDocument.refundProof && (
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px", display: "block", marginBottom: "4px" }}>
                      Minh chứng:
                    </Text>
                    <Button
                      type="primary"
                      size="small"
                      icon={<FileProtectOutlined />}
                      onClick={() => window.open(selectedDocument.refundProof, '_blank')}
                      style={{ borderRadius: "4px", fontSize: "11px" }}
                    >
                      Xem tài liệu
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default ApplicationsList;
