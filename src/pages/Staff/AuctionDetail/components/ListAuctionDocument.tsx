import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import AuctionServices from "../../../../services/AuctionServices";
import type {
  AuctionDocument,
  AuctionDateModal,
  AuctionDataDetail,
} from "../../Modals";
import { Table, Input, Tag, Button, Card, Modal, Space, Divider } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
import DepositConfirmationPopup from "./DepositConfirmationPopup";
import ParticipantBiddingHistoryModal from "../../../../components/Common/ParticipantBiddingHistoryModal/ParticipantBiddingHistoryModal";
// Interface cho dữ liệu đã nhóm theo người
interface GroupedParticipant {
  participantId: string;
  name: string;
  citizenIdentification: string;
  userId?: string;
  totalRegistrationFee: number;
  assets: AuctionDocument[];
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
  StatusDeposit?: number;
}

interface DocumentAssetStatistic {
  assetId: string;
  quantity: number;
}

interface Props {
  auctionId?: string;
  auctionDateModals?: AuctionDateModal;
  auctionDetailData?: AuctionDataDetail;
  onDataChange?: () => void;
}

const ListAuctionDocument = ({
  auctionId,
  auctionDetailData,
  onDataChange,
}: Props) => {
  const { user } = useSelector(
    (state: { auth: { user: { roleName: string } } }) => state.auth
  );
  const userRole = user?.roleName?.toLowerCase();

  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 15,
    StatusDeposit: 0,
    SortBy: "numericalOrder",
    IsAscending: true,
  });
  const [auctionDocuments, setAuctionDocuments] = useState<AuctionDocument[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<AuctionDocument | null>(
    null
  );
  const [documentAssetStatistics, setDocumentAssetStatistics] = useState<
    DocumentAssetStatistic[]
  >([]);

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

  // State cho modal từ chối nhận phiếu
  const [isRejectModalVisible, setIsRejectModalVisible] =
    useState<boolean>(false);
  const [selectedAssetForReject, setSelectedAssetForReject] =
    useState<AuctionDocument | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  // Loading states cho các button
  const [isConfirmingDeposit, setIsConfirmingDeposit] =
    useState<boolean>(false);
  const [isRejectingTicket, setIsRejectingTicket] = useState<boolean>(false);
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Function để lấy tên tài sản từ assetId
  const getAssetName = useCallback(
    (assetId: string) => {
      const asset = auctionDetailData?.listAuctionAssets?.find(
        (asset) => asset.auctionAssetsId === assetId
      );
      return asset?.tagName || `Tài sản ID: ${assetId.substring(0, 8)}...`;
    },
    [auctionDetailData]
  );

  // Nhóm dữ liệu theo CMND/CCCD
  const groupedParticipants = useMemo(() => {
    const grouped = new Map<string, GroupedParticipant>();

    auctionDocuments.forEach((doc) => {
      const key = doc.citizenIdentification; // Dùng CMND/CCCD làm key

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
          totalRegistrationFee: doc.registrationFee,
          assets: [doc],
        });
      }
    });

    return Array.from(grouped.values());
  }, [auctionDocuments]);

  const getListAuctionDocument = useCallback(async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 8,
        SortBy: searchParams.SortBy,
        Name: searchParams.Name,
        CitizenIdentification: searchParams.CitizenIdentification,
        TagName: searchParams.TagName,
        IsAscending: searchParams.IsAscending,
        StatusDeposit: searchParams.StatusDeposit,
      };
      const response = await AuctionServices.getListAuctionDocument(
        params,
        auctionId
      );
      setAuctionDocuments(response.data.auctionDocuments);
      setDocumentAssetStatistics(response.data.documentsAssetList || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách tài liệu đấu giá!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [searchParams, auctionId]);

  useEffect(() => {
    getListAuctionDocument();
  }, [getListAuctionDocument]);

  // Effect để tự động cập nhật selectedParticipant khi data thay đổi
  useEffect(() => {
    if (isAssetsModalVisible && selectedParticipant) {
      const updatedParticipant = groupedParticipants.find(
        (p) =>
          p.citizenIdentification === selectedParticipant.citizenIdentification
      );
      if (
        updatedParticipant &&
        JSON.stringify(updatedParticipant) !==
        JSON.stringify(selectedParticipant)
      ) {
        setSelectedParticipant(updatedParticipant);
      }
    }
  }, [groupedParticipants, isAssetsModalVisible, selectedParticipant]); // Debounce effect cho search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Trigger search sau 500ms delay
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [
    searchParams.Name,
    searchParams.CitizenIdentification,
    searchParams.TagName,
  ]);

  const handleInputChange = (key: keyof SearchParams, value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value || undefined,
      PageNumber: 1, // Reset về trang 1 khi search
    }));
  };

  const handleAction = async (action: string, record: AuctionDocument) => {
    try {
      // Set loading cho button cụ thể
      setLoadingActionId(`${action}-${record.auctionDocumentsId}`);
      if (action === "receivedTickeFee") {
        await AuctionServices.receiveAuctionRegistrationDocument({
          auctionDocumentsId: record.auctionDocumentsId,
          statusTicket: 1,
        });
        toast.success("Đã xác nhận nhận phí hồ sơ!");
        await getListAuctionDocument();
        // Không gọi onDataChange() để tránh popup bị đóng
      } else if (action === "receiveTicket") {
        await AuctionServices.receiveAuctionRegistrationDocument({
          auctionDocumentsId: record.auctionDocumentsId,
          statusTicket: 2,
        });
        toast.success("Đã xác nhận nhận phiếu!");
        await getListAuctionDocument();
        // Không gọi onDataChange() để tránh popup bị đóng
      } else if (action === "receiveDeposit") {
        setSelectedRecord(record);
        setIsPopupVisible(true);
      }
    } catch (error) {
      toast.error(
        `Lỗi khi thực hiện ${action === "receiveTicket" ? "nhận phiếu" : "nhận cọc"
        }!`
      );
      console.error(error);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleConfirmDeposit = async (note: string) => {
    if (!selectedRecord) return;
    try {
      setIsConfirmingDeposit(true);
      await AuctionServices.acceptPaymentDeposit(
        auctionId,
        selectedRecord.auctionDocumentsId,
        { note: note }
      );
      toast.success("Đã xác nhận nhận cọc!");
      setIsPopupVisible(false);
      setSelectedRecord(null);
      await getListAuctionDocument();
      // Thông báo parent component để refresh các component khác
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      toast.error("Lỗi khi xác nhận nhận cọc!");
      console.error(error);
    } finally {
      setIsConfirmingDeposit(false);
    }
  };

  const handleCancelPopup = () => {
    setIsPopupVisible(false);
    setSelectedRecord(null);
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
  }; // Xử lý mở modal lịch sử đấu giá
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

  // Xử lý mở modal từ chối nhận phiếu
  const handleShowRejectModal = (asset: AuctionDocument) => {
    setSelectedAssetForReject(asset);
    setIsAssetsModalVisible(false); // Đóng popup tài sản đăng ký
    setIsRejectModalVisible(true); // Mở modal từ chối
  };

  // Xử lý đóng modal từ chối nhận phiếu
  const handleCloseRejectModal = () => {
    setIsRejectModalVisible(false);
    setSelectedAssetForReject(null);
    setRejectReason("");
    setIsAssetsModalVisible(true); // Mở lại popup tài sản đăng ký
  };

  // Xử lý xác nhận từ chối nhận phiếu
  const handleConfirmReject = async () => {
    if (!selectedAssetForReject || !rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    try {
      setIsRejectingTicket(true);
      // TODO: Gọi API từ chối nhận phiếu - cần thêm API này
      const response = await AuctionServices.receiveAuctionRegistrationDocument(
        {
          auctionDocumentsId: selectedAssetForReject.auctionDocumentsId,
          statusTicket: 4,
          note: rejectReason.trim(),
        }
      );
      if (response.code === 200) {
        toast.success("Đã từ chối nhận phiếu!");
        setIsRejectModalVisible(false);
        setSelectedAssetForReject(null);
        setRejectReason("");
        await getListAuctionDocument();

        // Thông báo parent component để refresh
        if (onDataChange) {
          onDataChange();
        }
      } else {
        toast.error("Lỗi khi từ chối nhận phiếu!");
      }
    } catch (error) {
      toast.error("Lỗi kết nối mạng!!!");
      console.error(error);
    } finally {
      setIsRejectingTicket(false);
    }
  };

  const columns = [
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

        const depositCount = record.assets.filter(
          (asset) => asset.statusDeposit === 1
        ).length;

        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {Object.entries(statusCounts).map(([status, count]) => (
                <Tag
                  key={status}
                  color={
                    parseInt(status) === 0
                      ? "default"
                      : parseInt(status) === 1
                        ? "processing"
                        : parseInt(status) === 2
                          ? "success"
                          : parseInt(status) === 3
                            ? "warning"
                            : "error"
                  }
                  className="text-xs"
                >
                  {parseInt(status) === 0
                    ? `${count} chưa chuyển tiền hồ sơ`
                    : parseInt(status) === 1
                      ? `${count} đã chuyển tiền hồ sơ`
                      : parseInt(status) === 2
                        ? `${count} đã nhận hồ sơ`
                        : parseInt(status) === 3
                          ? `${count} đã hoàn tiền hồ sơ`
                          : `${count} không hợp lệ`}
                </Tag>
              ))}
            </div>
            {depositCount > 0 && (
              <Tag color="green" className="text-xs">
                {depositCount} đã cọc
              </Tag>
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
        <div className="text-right">
          <div className="font-bold text-lg text-green-600">
            {totalFee.toLocaleString("vi-VN")}
          </div>
          <div className="text-xs text-gray-500">VND</div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      align: "center" as const,
      render: (record: GroupedParticipant) => (
        <div className="flex flex-col gap-2">
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
        </div>
      ),
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Thống kê tổng quan */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <UserOutlined className="text-emerald-600" />
            Tổng quan danh sách đăng ký
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center bg-white border-l-4 border-l-blue-500">
              <div className="text-2xl font-bold text-blue-600">
                {groupedParticipants.length}
              </div>
              <div className="text-sm text-gray-600">
                Tổng số người tham gia
              </div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-green-500">
              <div className="text-2xl font-bold text-green-600">
                {documentAssetStatistics.length}
              </div>
              <div className="text-sm text-gray-600">Số loại tài sản</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-orange-500">
              <div className="text-2xl font-bold text-orange-600">
                {documentAssetStatistics.reduce(
                  (sum, asset) => sum + asset.quantity,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Tổng số đơn đăng ký</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-purple-500">
              <div className="text-2xl font-bold text-purple-600">
                {groupedParticipants
                  .reduce((sum, p) => sum + p.totalRegistrationFee, 0)
                  .toLocaleString("vi-VN")}
              </div>
            </Card>
          </div>

          {/* Thống kê chi tiết theo tài sản */}
          {documentAssetStatistics.length > 0 && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-100">
              <h3 className="text-sm font-medium text-emerald-700 mb-3">
                Chi tiết số lượng đơn đăng ký theo tài sản (
                {documentAssetStatistics.length} loại)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {documentAssetStatistics.map((asset) => (
                  <div
                    key={asset.assetId}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded text-xs"
                  >
                    <span
                      className="font-medium text-gray-700 truncate flex-1"
                      title={getAssetName(asset.assetId)}
                    >
                      {getAssetName(asset.assetId)}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold ml-2">
                      {asset.quantity} đơn
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Tổng:{" "}
                {documentAssetStatistics.reduce(
                  (sum, asset) => sum + asset.quantity,
                  0
                )}{" "}
                đơn đăng ký trên {documentAssetStatistics.length} loại tài sản
              </div>
            </div>
          )}
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-800 mb-4">Tìm kiếm</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              placeholder="Tìm kiếm theo tên"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.Name}
              onChange={(e) => handleInputChange("Name", e.target.value)}
              className="w-full sm:w-1/3"
            />
            <Input
              placeholder="Tìm kiếm theo CMND/CCCD"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.CitizenIdentification}
              onChange={(e) =>
                handleInputChange("CitizenIdentification", e.target.value)
              }
              className="w-full sm:w-1/3"
            />
            <Input
              placeholder="Tìm kiếm theo tên tài sản"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.TagName}
              onChange={(e) => handleInputChange("TagName", e.target.value)}
              className="w-full sm:w-1/3"
            />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={groupedParticipants}
          rowKey="participantId"
          loading={loading}
          pagination={{
            current: searchParams.PageNumber,
            pageSize: searchParams.PageSize,
            total: groupedParticipants.length,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15", "20"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người tham gia`,
            onChange: (page, pageSize) =>
              setSearchParams((prev) => ({
                ...prev,
                PageNumber: page,
                PageSize: pageSize,
              })),
          }}
          scroll={{ x: "max-content" }}
          className="border border-teal-100 rounded-lg"
          size="middle"
          rowClassName="hover:bg-blue-50"
        />
        {selectedRecord && (
          <DepositConfirmationPopup
            visible={isPopupVisible}
            onConfirm={handleConfirmDeposit}
            onCancel={handleCancelPopup}
            record={selectedRecord}
            loading={isConfirmingDeposit}
          />
        )}

        {/* Modal hiển thị danh sách tài sản chi tiết */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <ShoppingOutlined className="text-white text-sm" />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-800">
                  Tài sản đăng ký
                </div>
                <div className="text-xs text-gray-500">
                  {selectedParticipant?.name}
                </div>
              </div>
            </div>
          }
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

              <Divider
                orientation="left"
                className="text-gray-600 text-sm my-3"
              >
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
                      </div>
                    </div>

                    {/* Status and Actions compact */}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Tag
                          color={
                            asset.statusTicket === 0
                              ? "default"
                              : asset.statusTicket === 1
                                ? "processing"
                                : asset.statusTicket === 2
                                  ? "success"
                                  : asset.statusTicket === 3
                                    ? "warning"
                                    : "error"
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
                                  ? "Đã hoàn tiền"
                                  : "Không hợp lệ"}
                        </Tag>

                        {asset.statusDeposit === 1 && (
                          <Tag color="success" className="text-xs">
                            Đã cọc
                          </Tag>
                        )}
                      </div>

                      {userRole === "staff" && (
                        <Space size="small">
                          {asset.statusTicket === 0 ? (
                            // Khi statusTicket = 0, chỉ hiển thị nút "Đã nhận tiền"
                            <Button
                              type="primary"
                              size="small"
                              loading={
                                loadingActionId ===
                                `receivedTickeFee-${asset.auctionDocumentsId}`
                              }
                              disabled={
                                loadingActionId !== null &&
                                loadingActionId !==
                                `receivedTickeFee-${asset.auctionDocumentsId}`
                              }
                              onClick={() =>
                                handleAction("receivedTickeFee", asset)
                              }
                              className="bg-green-500 border-none text-xs px-3"
                            >
                              Đã nhận tiền hồ sơ
                            </Button>
                          ) : (
                            // Khi statusTicket khác 0, hiển thị các nút khác
                            <>
                              {asset.statusTicket !== 4 && (
                                <Button
                                  type="default"
                                  size="small"
                                  disabled={
                                    asset.statusTicket !== 1 ||
                                    loadingActionId !== null
                                  }
                                  loading={
                                    loadingActionId ===
                                    `rejectTicket-${asset.auctionDocumentsId}`
                                  }
                                  onClick={() => handleShowRejectModal(asset)}
                                  className="bg-red-500 text-white border-red-500 hover:bg-red-600 text-xs px-3"
                                >
                                  Từ chối nhận phiếu
                                </Button>
                              )}

                              <Button
                                type="primary"
                                size="small"
                                disabled={
                                  asset.statusTicket !== 1 ||
                                  (loadingActionId !== null &&
                                    loadingActionId !==
                                    `receiveTicket-${asset.auctionDocumentsId}`)
                                }
                                loading={
                                  loadingActionId ===
                                  `receiveTicket-${asset.auctionDocumentsId}`
                                }
                                onClick={() =>
                                  handleAction("receiveTicket", asset)
                                }
                                className="bg-blue-500 border-none text-xs px-3"
                              >
                                Nhận phiếu
                              </Button>

                              <Button
                                type="primary"
                                size="small"
                                disabled={
                                  asset.statusTicket !== 2 ||
                                  asset.statusDeposit !== 0 ||
                                  (loadingActionId !== null &&
                                    loadingActionId !==
                                    `receiveDeposit-${asset.auctionDocumentsId}`)
                                }
                                loading={
                                  loadingActionId ===
                                  `receiveDeposit-${asset.auctionDocumentsId}`
                                }
                                onClick={() =>
                                  handleAction("receiveDeposit", asset)
                                }
                                className="bg-green-500 border-none text-xs px-3"
                              >
                                Nhận cọc
                              </Button>
                            </>
                          )}
                        </Space>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer compact */}
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-600">
                    <strong>{selectedParticipant.assets.length}</strong> tài sản
                    • Tổng:{" "}
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
          )}{" "}
        </Modal>

        {/* Modal từ chối nhận phiếu */}
        <Modal
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationCircleOutlined className="text-red-600 text-lg" />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-800">
                  Từ chối nhận phiếu đăng ký
                </div>
                <div className="text-xs text-gray-500">
                  {selectedAssetForReject?.tagName}
                </div>
              </div>
            </div>
          }
          open={isRejectModalVisible}
          onCancel={handleCloseRejectModal}
          width={500}
          footer={[
            <Button key="cancel" onClick={handleCloseRejectModal}>
              Hủy
            </Button>,
            <Button
              key="confirm"
              type="primary"
              danger
              loading={isRejectingTicket}
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </Button>,
          ]}
          className="reject-modal"
        >
          <div className="space-y-4">
            {selectedAssetForReject && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-sm text-red-800">
                  <strong>Lưu ý:</strong> Sau khi từ chối, thông tin sẽ được ghi
                  nhận và không thể hoàn tác.
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do từ chối nhận phiếu <span className="text-red-500">*</span>
              </label>
              <TextArea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Vui lòng nhập lý do từ chối nhận phiếu đăng ký..."
                rows={4}
                maxLength={500}
                showCount
                className="w-full"
              />
            </div>
          </div>
        </Modal>

        {/* Modal lịch sử đấu giá */}
        <ParticipantBiddingHistoryModal
          visible={isBiddingHistoryModalVisible}
          onClose={handleCloseBiddingHistoryModal}
          participantInfo={selectedParticipantForHistory}
        />
      </div>
    </section>
  );
};

export default ListAuctionDocument;
