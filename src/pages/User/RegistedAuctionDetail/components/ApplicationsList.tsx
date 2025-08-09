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
  Checkbox,
  Input,
  Upload,
  Form,
  Divider,
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

  const handleAssetSelection = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets(prev => [...prev, assetId]);
    } else {
      setSelectedAssets(prev => prev.filter(id => id !== assetId));
    }
  };

  const handleSelectAllAssets = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(filteredDocuments.map(doc => doc.auctionDocumentsId));
    } else {
      setSelectedAssets([]);
    }
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
    if (selectedAssets.length === 0) {
      toast.error("Vui lòng chọn ít nhất một tài sản để hủy tham gia!");
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
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={handleOpenCancelModal}
            >
              Xin hủy tham gia đấu giá
            </Button>
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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ExclamationCircleOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />
            <span style={{ fontSize: "16px", fontWeight: "600" }} className="text-black">
              Xin hủy tham gia đấu giá
            </span>
          </div>
        }
        open={isCancelModalVisible}
        onCancel={handleCloseCancelModal}
        width={700}
        footer={null}
        destroyOnClose
        className="cancel-participation-modal"
      >
        <div style={{ padding: "20px 0" }}>
          {/* Warning Message */}
          <div
            style={{
              background: "#fff2f0",
              border: "1px solid #ffccc7",
              borderRadius: "6px",
              padding: "12px 16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />
            <Text style={{ color: "#ff4d4f", fontSize: "14px" }}>
              Việc hủy tham gia đấu giá sẽ được xem xét trong các trường hợp bất khả kháng.
              <strong> Bắt buộc phải có tài liệu chứng minh lý do hủy.</strong> Vui lòng cân nhắc kỹ trước khi thực hiện.
            </Text>
          </div>

          <Form layout="vertical">
            {/* Asset Selection */}
            <Form.Item
              label={<Text strong style={{ fontSize: "14px" }}>Chọn tài sản muốn hủy tham gia</Text>}
              required
            >
              <div style={{
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                padding: "16px",
                background: "#fafafa"
              }}>
                <div style={{ marginBottom: "12px" }}>
                  <Checkbox
                    checked={selectedAssets.length === filteredDocuments.length && filteredDocuments.length > 0}
                    indeterminate={selectedAssets.length > 0 && selectedAssets.length < filteredDocuments.length}
                    onChange={(e) => handleSelectAllAssets(e.target.checked)}
                  >
                    <Text strong>Chọn tất cả ({filteredDocuments.length} tài sản)</Text>
                  </Checkbox>
                </div>
                <Divider style={{ margin: "12px 0" }} />
                <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                  {filteredDocuments.map((asset) => (
                    <div
                      key={asset.auctionDocumentsId}
                      style={{
                        marginBottom: "8px",
                        padding: "8px 12px",
                        background: "white",
                        borderRadius: "4px",
                        border: "1px solid #f0f0f0"
                      }}
                    >
                      <Checkbox
                        checked={selectedAssets.includes(asset.auctionDocumentsId)}
                        onChange={(e) => handleAssetSelection(asset.auctionDocumentsId, e.target.checked)}
                      >
                        <div>
                          <Text strong style={{ color: "#1890ff" }}>{asset.tagName}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            STT: {asset.numericalOrder} • Cọc: {formatNumber(asset.deposit)} VNĐ
                          </Text>
                        </div>
                      </Checkbox>
                    </div>
                  ))}
                </div>
              </div>
            </Form.Item>

            {/* Reason TextArea */}
            <Form.Item
              label={<Text strong style={{ fontSize: "14px" }}>Lý do hủy tham gia</Text>}
              required
            >
              <TextArea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Vui lòng nhập lý do chi tiết tại sao bạn muốn hủy tham gia đấu giá..."
                rows={4}
                maxLength={500}
                showCount
                style={{
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </Form.Item>

            {/* File Upload */}
            <Form.Item
              label={<Text strong style={{ fontSize: "14px" }}>Tài liệu đính kèm <span style={{ color: 'red' }}>*</span></Text>}
              required
            >
              <Upload
                name="file"
                maxCount={1}
                beforeUpload={() => false} // Prevent auto upload
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                style={{ width: '100%' }}
              >
                <Button
                  icon={<UploadOutlined />}
                  style={{
                    borderRadius: "6px",
                    border: uploadedFile ? "1px solid #52c41a" : "1px dashed #d9d9d9",
                    borderColor: uploadedFile ? "#52c41a" : "#d9d9d9",
                    color: uploadedFile ? "#52c41a" : undefined,
                    width: '100%'
                  }}
                >
                  {uploadedFile ? `Đã chọn: ${uploadedFile.name}` : "Chọn file đính kèm (Bắt buộc)"}
                </Button>
              </Upload>
              <div style={{ marginTop: "8px" }}>
                <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
                  <span style={{ color: 'red' }}>* Bắt buộc:</span> Hỗ trợ PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                </Text>
                {uploadedFile && (
                  <Text style={{ fontSize: "12px", color: "#52c41a", display: "block", marginTop: "4px" }}>
                    ✓ File đã được chọn: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </Text>
                )}
              </div>
            </Form.Item>

            {/* Action Buttons */}
            <Form.Item style={{ marginBottom: 0, marginTop: "32px" }}>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <Button
                  onClick={handleCloseCancelModal}
                  style={{ borderRadius: "6px" }}
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
                    borderRadius: "6px",
                    boxShadow: "0 2px 4px rgba(255, 77, 79, 0.3)"
                  }}
                >
                  {isSubmitting ? "Đang gửi..." : "Xác nhận hủy tham gia"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
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
                      Lý do hoàn cọc:
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
