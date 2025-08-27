import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionDocument, AuctionDateModal } from "../../Modals";
import {
  Table,
  Input,
  Tag,
  Select,
  Button,
  Card,
  Modal,
  Divider,
  Space,
} from "antd";
import {
  HistoryOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  SearchOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import ParticipantBiddingHistoryModal from "../../../../components/Common/ParticipantBiddingHistoryModal/ParticipantBiddingHistoryModal";
import CustomModal from "../../../../components/Common/CustomModal";

// Interface cho dữ liệu đã nhóm theo người
interface GroupedParticipant {
  participantId: string;
  name: string;
  citizenIdentification: string;
  numericalOrder?: number;
  userId?: string;
  totalRegistrationFee: number;
  assets: AuctionDocument[];
  isAttended?: boolean; // Trạng thái tham gia đấu giá
}

interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
}

interface Props {
  auctionId: string;
  auctionDateModals?: AuctionDateModal;
  auctionAssets: AuctionAsset[];
}

interface SearchParams {
  Name?: string;
  PageNumber?: number;
  PageSize?: number;
  CitizenIdentification?: string;
  TagName?: string;
  SortBy?: string;
  IsAscending?: boolean;
  StatusTicket?: number;
  StatusDeposit?: number
}

interface Props {
  auctionId: string;
  auctionDateModals?: AuctionDateModal;
}

const ListAuctionDocument = ({ auctionId, auctionAssets }: Props) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 100,
    SortBy: "numericalOrder",
    IsAscending: true,
  });
  const [auctionDocuments, setAuctionDocuments] = useState<AuctionDocument[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [searchValues, setSearchValues] = useState<{
    name?: string;
    CitizenIdentification?: string;
    TagName?: string;
  }>({});

  // State cho modal hiển thị danh sách tài sản
  const [isAssetsModalVisible, setIsAssetsModalVisible] =
    useState<boolean>(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<GroupedParticipant | null>(null);

  // State cho modal lịch sử đấu giá
  const [isBiddingHistoryModalVisible, setIsBiddingHistoryModalVisible] =
    useState<boolean>(false);
  const [selectedParticipantForHistory, setSelectedParticipantForHistory] =
    useState<{
      name: string;
      citizenIdentification: string;
      auctionId?: string;
      userId?: string;
    } | null>(null);

  // State cho modal xác nhận không tham gia
  const [isConfirmModalVisible, setIsConfirmModalVisible] =
    useState<boolean>(false);
  const [selectedParticipantToConfirm, setSelectedParticipantToConfirm] =
    useState<GroupedParticipant | null>(null);

  // State cho tải danh sách hoàn tiền
  const [downloadingRefund, setDownloadingRefund] = useState<boolean>(false);

  // State để kiểm soát hiển thị danh sách nào
  const [showEligibleList, setShowEligibleList] = useState<boolean>(true);

  // Helper function để kiểm tra điều kiện đủ tư cách tham gia đấu giá
  const isEligibleForAuction = (doc: AuctionDocument): boolean => {
    return (
      doc.statusTicket === 2 &&
      doc.statusDeposit === 1 &&
      (doc.statusRefund === 3 || doc.statusRefund === 0)
    );
  };

  // Tách auctionDocuments thành 2 danh sách
  const { eligibleDocuments, ineligibleDocuments } = useMemo(() => {
    const eligible: AuctionDocument[] = [];
    const ineligible: AuctionDocument[] = [];

    auctionDocuments.forEach((doc) => {
      if (isEligibleForAuction(doc)) {
        eligible.push(doc);
      } else {
        ineligible.push(doc);
      }
    });

    return {
      eligibleDocuments: eligible,
      ineligibleDocuments: ineligible
    };
  }, [auctionDocuments]);

  // Nhóm dữ liệu theo CMND/CCCD cho từng danh sách
  const eligibleGroupedParticipants = useMemo(() => {
    const grouped = new Map<string, GroupedParticipant>();

    eligibleDocuments.forEach((doc) => {
      const key = doc.citizenIdentification;

      if (grouped.has(key)) {
        const existing = grouped.get(key)!;
        existing.assets.push(doc);
        existing.totalRegistrationFee += doc.registrationFee;
      } else {
        grouped.set(key, {
          participantId: doc.citizenIdentification,
          name: doc.name,
          citizenIdentification: doc.citizenIdentification,
          userId: doc.userId,
          numericalOrder: doc.numericalOrder,
          totalRegistrationFee: doc.registrationFee,
          assets: [doc],
          isAttended: doc.isAttended !== false,
        });
      }
    });

    return Array.from(grouped.values());
  }, [eligibleDocuments]);

  const ineligibleGroupedParticipants = useMemo(() => {
    const grouped = new Map<string, GroupedParticipant>();

    ineligibleDocuments.forEach((doc) => {
      const key = doc.citizenIdentification;

      if (grouped.has(key)) {
        const existing = grouped.get(key)!;
        existing.assets.push(doc);
        existing.totalRegistrationFee += doc.registrationFee;
      } else {
        grouped.set(key, {
          participantId: doc.citizenIdentification,
          name: doc.name,
          numericalOrder: doc.numericalOrder,
          citizenIdentification: doc.citizenIdentification,
          userId: doc.userId,
          totalRegistrationFee: doc.registrationFee,
          assets: [doc],
          isAttended: doc.isAttended !== false,
        });
      }
    });

    return Array.from(grouped.values());
  }, [ineligibleDocuments]);

  useEffect(() => {
    getListAuctionDocument();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, auctionId]);

  const getListAuctionDocument = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 8,
        Name: searchParams.Name,
        CitizenIdentification: searchParams.CitizenIdentification,
        TagName: searchParams.TagName,
        SortBy: searchParams.SortBy,
        IsAscending: searchParams.IsAscending,
      };
      const response = await AuctionServices.getListAuctionDocument(
        params,
        auctionId
      );
      setAuctionDocuments(response.data.auctionDocuments);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tài liệu đấu giá!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: keyof SearchParams, value: string) => {
    const newValue = value || undefined;
    setSearchValues((prev) => ({
      ...prev,
      [key]: newValue,
    }));
    setSearchParams((prev) => ({
      ...prev,
      [key]: newValue,
      PageNumber: 1,
    }));
  };

  // Xử lý mở modal danh sách tài sản
  const handleShowAssetsModal = (participant: GroupedParticipant) => {
    setSelectedParticipant(participant);
    setIsAssetsModalVisible(true);
  };

  // Xử lý đóng modal danh sách tài sản
  const handleCloseAssetsModal = () => {
    setIsAssetsModalVisible(false);
    setSelectedParticipant(null);
  };

  // Xử lý mở modal lịch sử đấu giá
  const handleShowBiddingHistory = (participant: GroupedParticipant) => {
    setSelectedParticipantForHistory({
      name: participant.name,
      citizenIdentification: participant.citizenIdentification,
      auctionId: auctionId,
      userId: participant.userId,
    });
    setIsBiddingHistoryModalVisible(true);
  };

  // Xử lý đóng modal lịch sử đấu giá
  const handleCloseBiddingHistoryModal = () => {
    setIsBiddingHistoryModalVisible(false);
    setSelectedParticipantForHistory(null);
  };

  // Xử lý đánh dấu không tham gia đấu giá
  const handleMarkNotParticipating = async (
    participant: GroupedParticipant
  ) => {
    const auctionDocumentIds = participant.assets.map(
      (asset) => asset.auctionDocumentsId
    );
    const dataSubmit = {
      auctionDocumentIds: auctionDocumentIds,
      isAttended: false,
    };
    try {
      const response = await AuctionServices.confirmAttendance(dataSubmit);
      if (response.code === 200) {
        toast.success(
          `Đã đánh dấu ${participant.name} không tham gia đấu giá cho ${auctionDocumentIds.length} tài sản`
        );
        // Reload dữ liệu để cập nhật trạng thái
        getListAuctionDocument();
      } else {
        toast.warning(
          `Không thể đánh dấu ${participant.name} không tham gia đấu giá cho ${auctionDocumentIds.length} tài sản`
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái tham gia!");
    }
  };

  // Xử lý hiển thị modal xác nhận không tham gia
  const showNotParticipatingConfirm = (participant: GroupedParticipant) => {
    setSelectedParticipantToConfirm(participant);
    setIsConfirmModalVisible(true);
  };

  // Xử lý xác nhận không tham gia
  const handleConfirmNotParticipating = async () => {
    if (!selectedParticipantToConfirm) return;

    console.log("handleConfirmNotParticipating called");
    await handleMarkNotParticipating(selectedParticipantToConfirm);
    setIsConfirmModalVisible(false);
    setSelectedParticipantToConfirm(null);
  };

  // Xử lý hủy modal xác nhận
  const handleCancelConfirm = () => {
    console.log("handleCancelConfirm called");
    setIsConfirmModalVisible(false);
    setSelectedParticipantToConfirm(null);
  };

  // Function to handle download refund list
  const handleDownloadRefundList = async () => {
    setDownloadingRefund(true);
    try {
      const response = await AuctionServices.exportRefundList({
        auctionId: auctionId,
      });
      if (response && response.data) {
        // Check if response contains base64 data
        if (
          response.data.base64 &&
          response.data.fileName &&
          response.data.contentType
        ) {
          // Convert base64 to blob
          const base64Data = response.data.base64;
          const byteCharacters = atob(base64Data);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: response.data.contentType,
          });

          // Create download link
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = response.data.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);

          toast.success("Tải danh sách hoàn tiền thành công!");
        } else {
          toast.success(
            response.message || "Xuất file danh sách hoàn tiền thành công!"
          );
        }
      }
    } catch (error: unknown) {
      toast.error("Lỗi khi tải danh sách hoàn tiền!");
      console.error(error);
    } finally {
      setDownloadingRefund(false);
    }
  };

  const columns = [
    {
      title: "Số báo danh",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 120,
      render: (numericalOrder: number | null) => (
        <div className="flex justify-center items-center">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-400 font-semibold text-white">
            {numericalOrder}
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin người tham gia",
      key: "participantInfo",
      width: 250,
      render: (record: GroupedParticipant) => (
        <div className="space-y-1">
          <div className="font-semibold text-gray-800 flex items-center gap-2">
            <UserOutlined className="text-blue-500" />
            {record.name}
          </div>
          <div className="text-sm text-gray-600">
            CMND/CCCD: {record.citizenIdentification}
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng tài sản",
      key: "assetCount",
      width: 200,
      render: (record: GroupedParticipant) => (
        <div className="text-center">
          <Button
            type="link"
            onClick={() => handleShowAssetsModal(record)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-base"
          >
            <ShoppingOutlined className="mr-2" />
            {record.assets.length} tài sản
          </Button>
          <div className="text-xs text-gray-500 mt-1">
            Click để xem chi tiết
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái tổng quan",
      key: "overallStatus",
      width: 300,
      render: (record: GroupedParticipant) => {
        const statusCounts = record.assets.reduce((acc, asset) => {
          const statusKey = asset.statusTicket;
          acc[statusKey] = (acc[statusKey] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const depositCounts = record.assets.reduce((acc, asset) => {
          const depositKey = asset.statusDeposit;
          acc[depositKey] = (acc[depositKey] || 0) + 1;
          return acc;
        }, {} as Record<number, number>);

        const refundCounts = record.assets.reduce((acc, asset) => {
          if (asset.statusRefund !== null && asset.statusRefund !== undefined) {
            const refundKey = asset.statusRefund.toString();
            acc[refundKey] = (acc[refundKey] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        return (
          <div className="space-y-2">
            {/* Status Ticket */}
            <div className="flex flex-wrap gap-1">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Tag
                  key={status}
                  color={
                    parseInt(status) === 0
                      ? "gray"
                      : parseInt(status) === 1
                        ? "blue"
                        : parseInt(status) === 2
                          ? "green"
                          : parseInt(status) === 3
                            ? "red"
                            : parseInt(status) === 4
                              ? "volcano"
                              : "orange"
                  }
                  className="text-xs"
                >
                  {parseInt(status) === 0
                    ? `${count} chưa chuyển tiền`
                    : parseInt(status) === 1
                      ? `${count} đã chuyển tiền`
                      : parseInt(status) === 2
                        ? `${count} đã nhận phiếu`
                        : parseInt(status) === 3
                          ? `${count} không hoàn tiền`
                          : parseInt(status) === 4
                            ? `${count} không hợp lệ`
                            : `${count} đã hoàn tiền`}
                </Tag>
              ))}
            </div>

            {/* Status Deposit */}
            <div className="flex flex-wrap gap-1">
              {Object.entries(depositCounts).map(([status, count]) => (
                <Tag
                  key={`deposit-${status}`}
                  color={
                    parseInt(status) === 0
                      ? "gray"
                      : parseInt(status) === 1
                        ? "green"
                        : "orange"
                  }
                  className="text-xs"
                >
                  {parseInt(status) === 0
                    ? `${count} chưa cọc`
                    : parseInt(status) === 1
                      ? `${count} đã cọc`
                      : `${count} đã hoàn cọc`}
                </Tag>
              ))}
            </div>

            {/* Status Refund */}
            {Object.keys(refundCounts).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {Object.entries(refundCounts).map(([status, count]) => (
                  <Tag
                    key={`refund-${status}`}
                    color={
                      parseInt(status) === 1
                        ? "blue"
                        : parseInt(status) === 2
                          ? "green"
                          : "orange"
                    }
                    className="text-xs"
                  >
                    {parseInt(status) === 0 ? <></> :
                      parseInt(status) === 1
                        ? `${count} đang xử lý hoàn cọc`
                        : parseInt(status) === 2
                          ? `${count} xác nhận đồng ý hoàn cọc`
                          : `${count} từ chối hoàn cọc`}
                  </Tag>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Tổng phí đăng ký",
      dataIndex: "totalRegistrationFee",
      key: "totalRegistrationFee",
      width: 150,
      render: (totalFee: number) => (
        <div className="text-left">
          <div className="font-bold text-lg text-green-600">
            <DollarOutlined className="mr-1" />
            {totalFee.toLocaleString("vi-VN")}
          </div>
          <div className="text-xs text-gray-500">VND</div>
        </div>
      ),
    },
    {
      title: "Trạng thái tham gia",
      key: "attendanceStatus",
      width: 150,
      render: (record: GroupedParticipant) => {
        const isAttended = record.isAttended !== false; // Mặc định true nếu undefined
        return (
          <div className="text-left">
            {isAttended ? (
              <Tag
                color="green"
                icon={<CheckCircleOutlined />}
                className="text-sm px-3 py-1"
              >
                Tham gia
              </Tag>
            ) : (
              <Tag
                color="red"
                icon={<CloseCircleOutlined />}
                className="text-sm px-3 py-1"
              >
                Không tham gia
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      align: "center" as const,
      render: (record: GroupedParticipant) => {
        const isAttended = record.isAttended !== false; // Mặc định true nếu undefined
        return (
          <Space direction="vertical" size="small" className="w-full">
            <Button
              type="primary"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleShowBiddingHistory(record)}
              className="bg-blue-500 hover:bg-blue-600 w-full"
              title="Xem lịch sử đấu giá"
            >
              Lịch sử đấu giá
            </Button>
            {isAttended && (
              <Button
                type="primary"
                danger
                size="small"
                icon={<StopOutlined />}
                onClick={() => showNotParticipatingConfirm(record)}
                className="w-full"
                title="Đánh dấu không tham gia đấu giá"
              >
                Không tham gia
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <section className="w-full h-fit bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto bg-white rounded-xl">
        {/* Thống kê tổng quan */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
              <UserOutlined className="text-emerald-600" />
              Tổng quan danh sách đăng ký
            </div>
            <div className="flex gap-3">
              <Space>
                <Button
                  type={showEligibleList ? "primary" : "default"}
                  onClick={() => setShowEligibleList(true)}
                  className={showEligibleList ? "!bg-green-500 hover:!bg-green-600" : ""}
                >
                  Đủ điều kiện ({eligibleDocuments.length} đơn)
                </Button>
                <Button
                  type={!showEligibleList ? "primary" : "default"}
                  onClick={() => setShowEligibleList(false)}
                  className={!showEligibleList ? "!bg-red-500 hover:!bg-red-600" : ""}
                >
                  Không đủ điều kiện ({ineligibleDocuments.length} đơn)
                </Button>
              </Space>
              <Button
                type="default"
                size="large"
                icon={<DownloadOutlined />}
                onClick={handleDownloadRefundList}
                loading={downloadingRefund}
                className="!bg-white !border-orange-500 !text-orange-600 hover:!bg-orange-50 hover:!border-orange-600 !shadow-md hover:!shadow-lg !transition-all !duration-300"
              >
                {downloadingRefund ? "Đang tải..." : "Tải danh sách hoàn tiền"}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Đã bỏ thống kê số người đủ điều kiện/không đủ điều kiện */}
            <Card className="text-center bg-white border-l-4 border-l-green-500">
              <div className="text-2xl font-bold text-green-600">
                {showEligibleList ? eligibleDocuments.length : ineligibleDocuments.length}
              </div>
              <div className="text-sm text-gray-600">
                {showEligibleList ? "Đơn đủ điều kiện" : "Đơn không đủ điều kiện"}
              </div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-orange-500">
              <div className="text-2xl font-bold text-orange-600">
                {showEligibleList
                  ? eligibleDocuments.filter((doc) => doc.statusDeposit === 1).length
                  : ineligibleDocuments.filter((doc) => doc.statusDeposit === 1).length
                }
              </div>
              <div className="text-sm text-gray-600">Đã cọc</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-purple-500">
              <div className="text-2xl font-bold text-purple-600">
                {(showEligibleList ? eligibleGroupedParticipants : ineligibleGroupedParticipants)
                  .reduce((sum, p) => sum + p.totalRegistrationFee, 0)
                  .toLocaleString("vi-VN")}
              </div>
              <div className="text-sm text-gray-600">
                Tổng phí đăng ký (VND)
              </div>
            </Card>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="text-lg font-semibold text-gray-800">
                Tìm kiếm hồ sơ đấu giá
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Điều kiện tham gia đấu giá
                  </label>
                  <Select
                    placeholder="Chọn điều kiện..."
                    allowClear
                    value={showEligibleList ? "eligible" : "ineligible"}
                    onChange={(value) => {
                      if (value === "eligible") {
                        setShowEligibleList(true);
                      } else if (value === "ineligible") {
                        setShowEligibleList(false);
                      }
                      // Reset về trang 1 khi thay đổi filter
                      setSearchParams((prev) => ({
                        ...prev,
                        PageNumber: 1,
                      }));
                    }}
                    options={[
                      { value: "eligible", label: "Đủ điều kiện" },
                      { value: "ineligible", label: "Không đủ điều kiện" },
                    ]}
                    className="w-full [&>.ant-select-selector]:!rounded-md [&>.ant-select-selector]:!h-[40px] [&>.ant-select-selector]:!py-1 [&>.ant-select-selector]:!px-3 [&>.ant-select-selector]:!border-gray-300 [&>.ant-select-selector]:!hover:border-teal-500 [&>.ant-select-selector]:!focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên người đăng ký
                  </label>
                  <Input
                    placeholder="Nhập tên người đăng ký..."
                    prefix={<SearchOutlined />}
                    allowClear
                    value={searchValues.name}
                    onChange={(e) => handleInputChange("Name", e.target.value)}
                    className="w-full !rounded-md [&>input]:!py-2 [&>input]:!px-3 [&>input]:!border-gray-300 [&>input]:!hover:border-teal-500 [&>input]:!focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    CMND/CCCD
                  </label>
                  <Input
                    placeholder="Nhập số CMND/CCCD..."
                    prefix={<SearchOutlined />}
                    allowClear
                    value={searchValues.CitizenIdentification}
                    onChange={(e) =>
                      handleInputChange("CitizenIdentification", e.target.value)
                    }
                    className="w-full !rounded-md [&>input]:!py-2 [&>input]:!px-3 [&>input]:!border-gray-300 [&>input]:!hover:border-teal-500 [&>input]:!focus:border-teal-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tài sản đấu giá
                  </label>
                  <Select
                    placeholder="Chọn tài sản đấu giá..."
                    allowClear
                    showSearch
                    value={searchValues.TagName}
                    onChange={(value) => handleInputChange("TagName", value)}
                    filterOption={(input, option) =>
                      (option?.label ?? "")
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                    options={auctionAssets.map((asset) => ({
                      value: asset.tagName,
                      label: asset.tagName,
                    }))}
                    className="w-full [&>.ant-select-selector]:!rounded-md [&>.ant-select-selector]:!h-[40px] [&>.ant-select-selector]:!py-1 [&>.ant-select-selector]:!px-3 [&>.ant-select-selector]:!border-gray-300 [&>.ant-select-selector]:!hover:border-teal-500 [&>.ant-select-selector]:!focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={showEligibleList ? eligibleGroupedParticipants : ineligibleGroupedParticipants}
          rowKey="participantId"
          loading={loading}
          pagination={{
            current: searchParams.PageNumber,
            pageSize: 8,
            total: showEligibleList ? eligibleGroupedParticipants.length : ineligibleGroupedParticipants.length,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người ${showEligibleList ? 'đủ điều kiện' : 'không đủ điều kiện'}`,
            onChange: (page) =>
              setSearchParams((prev) => ({
                ...prev,
                PageNumber: page,
                PageSize: 8,
              })),
          }}
          scroll={{ x: "max-content" }}
          size="middle"
          rowClassName="hover:bg-blue-50"
        />
      </div>

      {/* Modal hiển thị danh sách tài sản chi tiết */}
      <CustomModal
        title="Danh sách tài sản đã đăng ký"
        open={isAssetsModalVisible}
        onCancel={handleCloseAssetsModal}
        width={700}
        footer={null}
        className="assets-modal"
        styles={{
          header: {
            borderBottom: "1px solid #f0f0f0",
            paddingBottom: "12px",
            marginBottom: "16px",
          },
        }}
      >
        {selectedParticipant && (
          <div className="space-y-4">
            {/* Thông tin tổng quan */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-blue-600 text-xs" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        Họ tên
                      </div>
                      <div className="font-medium text-gray-800 text-sm">
                        {selectedParticipant.name}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xs font-bold">
                        ID
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        CMND/CCCD
                      </div>
                      <div className="font-medium text-gray-800 text-sm">
                        {selectedParticipant.citizenIdentification}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <ShoppingOutlined className="text-purple-600 text-xs" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        Số tài sản
                      </div>
                      <div className="font-medium text-purple-600">
                        {selectedParticipant.assets.length}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <DollarOutlined className="text-yellow-600 text-xs" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase">
                        Tổng phí
                      </div>
                      <div className="font-medium text-green-600 text-sm">
                        {selectedParticipant.totalRegistrationFee.toLocaleString(
                          "vi-VN"
                        )}{" "}
                        VND
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Divider orientation="left" className="text-gray-600 text-sm my-3">
              Danh sách tài sản ({selectedParticipant.assets.length})
            </Divider>

            {/* Danh sách tài sản compact */}
            <div className="max-h-80 overflow-y-auto space-y-3">
              {selectedParticipant.assets.map((asset, index) => (
                <div
                  key={asset.auctionDocumentsId}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 relative"
                >
                  {/* Compact header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <h4 className="font-medium text-gray-800 text-sm leading-tight">
                          {asset.tagName}
                        </h4>
                      </div>
                      <div className="text-xs text-gray-600">
                        💰 {asset.registrationFee.toLocaleString("vi-VN")} VND
                      </div>
                      {asset.numericalOrder && (
                        <div className="text-xs text-blue-600">
                          Số báo danh: {asset.numericalOrder}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Actions compact */}
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag
                        color={
                          asset.statusTicket === 0
                            ? "gray"
                            : asset.statusTicket === 1
                              ? "blue"
                              : asset.statusTicket === 2
                                ? "green"
                                : asset.statusTicket === 3
                                  ? "red"
                                  : asset.statusTicket === 4
                                    ? "volcano"
                                    : "orange"
                        }
                        className="text-xs"
                      >
                        {asset.statusTicket === 0
                          ? "Chưa chuyển tiền"
                          : asset.statusTicket === 1
                            ? "Đã chuyển tiền"
                            : asset.statusTicket === 2
                              ? "Đã nhận phiếu"
                              : asset.statusTicket === 3
                                ? "Không hoàn tiền"
                                : asset.statusTicket === 4
                                  ? "Không hợp lệ"
                                  : "Đã hoàn tiền"}
                      </Tag>

                      <Tag
                        color={
                          asset.statusDeposit === 0
                            ? "gray"
                            : asset.statusDeposit === 1
                              ? "green"
                              : "orange"
                        }
                        className="text-xs"
                      >
                        {asset.statusDeposit === 0
                          ? "Chưa cọc"
                          : asset.statusDeposit === 1
                            ? "Đã cọc"
                            : "Đã hoàn cọc"}
                      </Tag>

                      {asset.statusRefund !== null && asset.statusRefund !== 0 && (
                        <Tag
                          color={
                            asset.statusRefund === 1
                              ? "blue"
                              : asset.statusRefund === 2
                                ? "green"
                                : asset.statusRefund === 3
                                  ? "red"
                                  : "orange"
                          }
                          className="text-xs"
                        >
                          {asset.statusRefund === 1
                            ? "Đã yêu cầu hoàn tiền cọc"
                            : asset.statusRefund === 2
                              ? "Xác nhận hoàn cọc"
                              : asset.statusRefund === 3
                                ? "Từ chối hoàn cọc"
                                : ""}
                        </Tag>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer compact */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-600">
                  <strong>{selectedParticipant.assets.length}</strong> tài sản •
                  Tổng:{" "}
                  <strong className="text-green-600">
                    {selectedParticipant.totalRegistrationFee.toLocaleString(
                      "vi-VN"
                    )}{" "}
                    VND
                  </strong>
                </span>
                <Button
                  size="small"
                  onClick={handleCloseAssetsModal}
                  className="text-xs"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Modal lịch sử đấu giá */}
      <ParticipantBiddingHistoryModal
        visible={isBiddingHistoryModalVisible}
        onClose={handleCloseBiddingHistoryModal}
        participantInfo={selectedParticipantForHistory}
      />

      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <StopOutlined className="text-red-600 text-lg" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 m-0">
                Xác nhận đánh dấu không tham gia
              </h3>
              <p className="text-sm text-gray-500 m-0">
                Hành động này sẽ thay đổi trạng thái khách hàng
              </p>
            </div>
          </div>
        }
        open={isConfirmModalVisible}
        onCancel={handleCancelConfirm}
        width={600}
        footer={[
          <Button key="cancel" onClick={handleCancelConfirm} size="large">
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleConfirmNotParticipating}
            size="large"
            icon={<StopOutlined />}
          >
            Xác nhận
          </Button>,
        ]}
        className="confirm-modal"
      >
        {selectedParticipantToConfirm && (
          <div className="py-4">
            {/* Cảnh báo chính */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex items-start">
                <div className="ml-3">
                  <h4 className="text-yellow-800 font-semibold text-base mb-2">
                    ⚠️ Lưu ý quan trọng
                  </h4>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    <strong>
                      Hãy kiểm tra lại trong danh sách ký tham gia để chắc chắn
                      khách hàng không tham gia.
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Thông tin khách hàng */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                <UserOutlined className="text-blue-500" />
                Thông tin khách hàng
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <p className="font-medium text-gray-800">
                    {selectedParticipantToConfirm.name}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">CMND/CCCD:</span>
                  <p className="font-medium text-gray-800">
                    {selectedParticipantToConfirm.citizenIdentification}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Số tài sản đăng ký:</span>
                  <p className="font-medium text-blue-600">
                    {selectedParticipantToConfirm.assets.length} tài sản
                  </p>
                </div>
              </div>
            </div>

            {/* Thông báo kết quả */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm mb-2">
                <strong>Sau khi xác nhận:</strong>
              </p>
              <ul className="text-blue-700 text-sm space-y-1 ml-4">
                <li>
                  • Khách hàng sẽ được đánh dấu là{" "}
                  <strong>"Không tham gia"</strong>
                </li>
                <li>• Trạng thái sẽ được cập nhật trong hệ thống</li>
                <li>• Không thể hoàn tác hành động này từ giao diện này</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default ListAuctionDocument;
