import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type {
  AuctionDocument,
  AuctionDateModal,
  AuctionDataDetail,
} from "../../Modals";
import { Table, Input, Tag, Button, Modal, Space, Card, Collapse } from "antd";
import {
  SearchOutlined,
  DownloadOutlined,
  EyeOutlined,
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import ParticipantBiddingHistoryModal from "../../../../components/Common/ParticipantBiddingHistoryModal/ParticipantBiddingHistoryModal";

const { TextArea } = Input;

// Custom styles cho modal đẹp
const modalStyles = `
.reject-modal .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.reject-modal .ant-modal-header {
    padding: 0;
    border: none;
}

.reject-modal .ant-modal-body {
    padding: 0 24px 24px 24px;
}

.reject-modal .ant-modal-close {
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    transition: all 0.2s;
}

.reject-modal .ant-modal-close:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.05);
}

.reject-modal .ant-modal-close-x {
    font-size: 16px;
    line-height: 32px;
    color: #ef4444;
}
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = modalStyles;
  document.head.appendChild(styleSheet);
}

// Interface cho dữ liệu đã nhóm theo người
interface GroupedParticipant {
  participantId: string;
  name: string;
  citizenIdentification: string;
  userId: string;
  numericalOrder?: number;
  statusDeposit: number;
  statusTicket: number;
  statusRefund?: number;
  isAttended?: boolean;
  totalRegistrationFee: number;
  assets: {
    tagName: string;
    registrationFee: number;
    auctionDocumentsId: string;
    statusRefund?: number;
    refundReason?: string;
    refundProof?: string;
  }[];
  representativeDocument: AuctionDocument;
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
}

const ListAuctionDocumentSuccesRegister = ({
  auctionId,
  auctionDateModals,
  auctionDetailData,
}: Props) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 8,
    StatusDeposit: 1,
  });
  const [auctionDocuments, setAuctionDocuments] = useState<AuctionDocument[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [documentAssetStatistics, setDocumentAssetStatistics] = useState<
    DocumentAssetStatistic[]
  >([]);

  // State cho modal lý do không tham gia
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<GroupedParticipant | null>(null);
  const [reasonModalLoading, setReasonModalLoading] = useState<boolean>(false);

  // State cho modal xem chi tiết (đã xử lý)
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] =
    useState<boolean>(false);
  const [selectedDetailParticipant, setSelectedDetailParticipant] =
    useState<GroupedParticipant | null>(null);
  const [isRejectModalVisible, setIsRejectModalVisible] =
    useState<boolean>(false);
  const [rejectReason, setRejectReason] = useState<string>("");
  const [rejectModalLoading, setRejectModalLoading] = useState<boolean>(false);

  const [isBiddingHistoryModalVisible, setIsBiddingHistoryModalVisible] =
    useState<boolean>(false);
  const [selectedParticipantForHistory, setSelectedParticipantForHistory] =
    useState<{
      name: string;
      citizenIdentification: string;
      auctionId?: string;
      userId?: string;
    } | null>(null);

  const getAssetName = useCallback(
    (assetId: string) => {
      const asset = auctionDetailData?.listAuctionAssets?.find(
        (asset) => asset.auctionAssetsId === assetId
      );
      return asset?.tagName || `Tài sản ID: ${assetId.substring(0, 8)}...`;
    },
    [auctionDetailData]
  );

  // Function để thay thế auctionDocumentId bằng tagName trong message
  const replaceDocumentIdWithTagName = useCallback(
    (message: string) => {
      if (!selectedParticipant) return message;

      let updatedMessage = message;

      // Tìm và thay thế tất cả ID trong message
      selectedParticipant.assets.forEach((asset) => {
        const regex = new RegExp(asset.auctionDocumentsId, "g");
        updatedMessage = updatedMessage.replace(regex, `"${asset.tagName}"`);
      });

      return updatedMessage;
    },
    [selectedParticipant]
  );

  // Nhóm dữ liệu theo CMND/CCCD
  const groupedParticipants = useMemo(() => {
    const grouped = new Map<string, GroupedParticipant>();

    auctionDocuments.forEach((doc) => {
      const key = doc.citizenIdentification;

      if (grouped.has(key)) {
        const existing = grouped.get(key)!;
        existing.assets.push({
          tagName: doc.tagName,
          registrationFee: doc.registrationFee,
          auctionDocumentsId: doc.auctionDocumentsId,
          statusRefund: doc.statusRefund,
          refundReason: doc.refundReason,
          refundProof: doc.refundProof,
        });
        existing.totalRegistrationFee += doc.registrationFee;

        // Cập nhật trạng thái chung: ưu tiên trạng thái "yêu cầu hoàn cọc" (1) nếu có
        if (
          doc.statusRefund === 1 ||
          doc.statusRefund === 2 ||
          doc.statusRefund === 3
        ) {
          if (
            !existing.statusRefund ||
            (existing.statusRefund !== 1 && doc.statusRefund === 1)
          ) {
            existing.statusRefund = doc.statusRefund;
          }
        }
      } else {
        grouped.set(key, {
          participantId: doc.citizenIdentification,
          name: doc.name,
          citizenIdentification: doc.citizenIdentification,
          numericalOrder: doc.numericalOrder,
          statusDeposit: doc.statusDeposit,
          statusTicket: doc.statusTicket,
          userId: doc.userId || "",
          statusRefund:
            doc.statusRefund === 1 ||
              doc.statusRefund === 2 ||
              doc.statusRefund === 3
              ? doc.statusRefund
              : undefined, // Set khi có yêu cầu hoàn cọc hoặc đã xử lý
          isAttended: doc.isAttended,
          totalRegistrationFee: doc.registrationFee,
          assets: [
            {
              tagName: doc.tagName,
              registrationFee: doc.registrationFee,
              auctionDocumentsId: doc.auctionDocumentsId,
              statusRefund: doc.statusRefund,
              refundReason: doc.refundReason, // Lưu lý do riêng cho từng tài sản
              refundProof: doc.refundProof, // Lưu file riêng cho từng tài sản
            },
          ],
          representativeDocument: doc,
        });
      }
    });

    const result = Array.from(grouped.values());

    return result;
  }, [auctionDocuments]);

  // Kiểm tra nếu ngày hiện tại lớn hơn registerEndDate
  const isAfterRegisterEndDate = auctionDateModals?.registerEndDate
    ? dayjs().isAfter(dayjs(auctionDateModals.registerEndDate))
    : false;

  const getListAuctionDocument = useCallback(async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 8,
        Name: searchParams.Name,
        CitizenIdentification: searchParams.CitizenIdentification,
        TagName: searchParams.TagName,
        SortBy: searchParams.SortBy,
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

  // Debounce effect cho search
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

  // Xử lý hiển thị modal lý do không tham gia (cho yêu cầu chờ phê duyệt)
  const handleShowReasonModal = (participant: GroupedParticipant) => {
    setSelectedParticipant(participant);
    setIsModalVisible(true);
  };

  // Xử lý hiển thị modal xem chi tiết (cho yêu cầu đã xử lý)
  const handleShowDetailModal = (participant: GroupedParticipant) => {
    setSelectedDetailParticipant(participant);
    setIsViewDetailModalVisible(true);
  };

  // Xử lý đóng modal yêu cầu chờ phê duyệt
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedParticipant(null);
  };
  // Xử lý đóng modal xem chi tiết
  const handleCloseDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedDetailParticipant(null);
  };

  // Xử lý hiển thị modal lịch sử đấu giá
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

  // Xử lý đồng ý lý do không tham gia - Cập nhật tất cả tài sản của người này
  const handleApproveReason = async () => {
    if (!selectedParticipant) return;

    try {
      setReasonModalLoading(true);

      const approveData = {
        auctionDocumentIds: selectedParticipant.assets
          .filter((asset) => asset.statusRefund === 1)
          .map((asset) => asset.auctionDocumentsId),
        noteReviewRefund: "Phê duyệt yêu cầu hoàn cọc",
        statusRefund: 2,
      };

      const response = await AuctionServices.staffReviewRefund(approveData);
      if (response.code == 200) {
        toast.success(
          `Đã phê duyệt yêu cầu hoàn cọc cho ${selectedParticipant.name} (${selectedParticipant.assets.filter(
            (asset) => asset.statusRefund === 1
          ).length
          } tài sản)!`
        );
        handleCloseModal();
        getListAuctionDocument(); // Refresh danh sách
      } else {
        // Thay thế ID bằng tên tài sản trong message
        const friendlyMessage = replaceDocumentIdWithTagName(response.message);
        toast.error(friendlyMessage);
      }
    } catch (error) {
      toast.error("Lỗi khi phê duyệt lý do không tham gia!");
      console.error(error);
    } finally {
      setReasonModalLoading(false);
    }
  };

  // Xử lý từ chối lý do không tham gia - Mở modal để điền lý do từ chối
  const handleRejectReason = () => {
    setIsModalVisible(false); // Chỉ đóng modal hiện tại, không reset selectedParticipant
    setIsRejectModalVisible(true); // Mở modal từ chối
  };

  // Xử lý gửi lý do từ chối
  const handleSubmitRejectReason = async () => {
    if (!selectedParticipant || !rejectReason.trim()) {
      toast.error("Vui lòng điền lý do từ chối!");
      return;
    }

    try {
      setRejectModalLoading(true);

      const rejectData = {
        auctionDocumentIds: selectedParticipant.assets
          .filter((asset) => asset.statusRefund === 1)
          .map((asset) => asset.auctionDocumentsId),
        noteReviewRefund: rejectReason.trim(),
        statusRefund: 3,
      };

      const response = await AuctionServices.staffReviewRefund(rejectData);
      if (response.code == 200) {
        toast.success(
          `Đã từ chối yêu cầu hoàn cọc cho ${selectedParticipant.name}!`
        );
        handleCloseRejectModal();
        getListAuctionDocument(); // Refresh danh sách
      } else {
        // Thay thế ID bằng tên tài sản trong message
        const friendlyMessage = replaceDocumentIdWithTagName(response.message);
        toast.error(friendlyMessage);
      }
    } catch (error) {
      toast.error("Lỗi khi từ chối yêu cầu hoàn cọc!");
      console.error(error);
    } finally {
      setRejectModalLoading(false);
    }
  };

  // Xử lý đóng modal từ chối
  const handleCloseRejectModal = () => {
    setIsRejectModalVisible(false);
    setRejectReason("");
    setSelectedParticipant(null);
  };

  const handleDownload = () => {
    try {
      const headers = [
        "STT",
        "Tên",
        "CMND/CCCD",
        "Số tài sản",
        "Danh sách tài sản",
        "Tổng phí đăng ký",
        "Trạng thái cọc",
        "Trạng thái đơn",
        "Chữ ký",
      ];

      const csvRows = [
        headers.join(","), // Header row
        ...groupedParticipants.map((participant) => {
          const assetsList = participant.assets
            .map(
              (asset) =>
                `${asset.tagName} (${asset.registrationFee.toLocaleString(
                  "vi-VN"
                )} VND)`
            )
            .join("; ");

          const depositStatus =
            participant.statusDeposit === 0 ? "Chưa cọc" : "Đã cọc";
          const ticketStatus =
            participant.statusTicket === 0
              ? "Chưa chuyển tiền"
              : participant.statusTicket === 1
                ? "Đã chuyển tiền"
                : participant.statusTicket === 2
                  ? "Đã ký phiếu"
                  : "Đã hoàn tiền";

          const row = [
            participant.numericalOrder || "-",
            `"${participant.name}"`,
            participant.citizenIdentification,
            participant.assets.length,
            `"${assetsList}"`,
            `${participant.totalRegistrationFee.toLocaleString("vi-VN")} VND`,
            depositStatus,
            ticketStatus,
            "", // Chữ ký để trống
          ];
          return row.join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "grouped_auction_participants.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Tải danh sách thành công!");
    } catch (error) {
      toast.error("Lỗi khi tải danh sách!");
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Số báo danh",
      dataIndex: "numericalOrder",
      key: "numericalOrder",
      width: 120,
      render: (numericalOrder: number | null) => (
        <div className="text-center font-medium">{numericalOrder || "-"}</div>
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
      title: "Tài sản đăng ký",
      key: "assets",
      render: (record: GroupedParticipant) => (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingOutlined className="text-green-500" />
            <span className="font-medium text-sm">
              Số lượng: {record.assets.length} tài sản
            </span>
          </div>
          <Collapse
            size="small"
            items={[
              {
                key: "1",
                label: `Xem chi tiết ${record.assets.length} tài sản`,
                children: (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {record.assets.map((asset, index) => (
                      <div
                        key={asset.auctionDocumentsId}
                        className="bg-gray-50 p-2 rounded border-l-3 border-l-blue-400"
                      >
                        <div className="font-medium text-sm text-gray-800">
                          {index + 1}. {asset.tagName}
                        </div>
                        <div className="text-xs text-gray-600">
                          Phí: {asset.registrationFee.toLocaleString("vi-VN")}{" "}
                          VND
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      ),
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
      title: "Trạng thái",
      key: "status",
      width: 200,
      render: (record: GroupedParticipant) => (
        <div className="space-y-2">
          <div>
            <Tag
              color={record.statusDeposit === 0 ? "red" : "green"}
              className="mb-1"
            >
              {record.statusDeposit === 0 ? "Chưa cọc" : "Đã cọc"}
            </Tag>
          </div>
          <div>
            <Tag
              color={
                record.statusTicket === 0
                  ? "red"
                  : record.statusTicket === 1
                    ? "blue"
                    : record.statusTicket === 2
                      ? "cyan"
                      : "green"
              }
            >
              {record.statusTicket === 0
                ? "Chưa chuyển tiền"
                : record.statusTicket === 1
                  ? "Đã chuyển tiền"
                  : record.statusTicket === 2
                    ? "Đã ký phiếu"
                    : "Đã hoàn tiền"}
            </Tag>
          </div>
          <div>
            <Tag
              color={
                record.statusRefund === 1
                  ? "orange"
                  : record.statusRefund === 2
                    ? "green"
                    : record.statusRefund === 3
                      ? "red"
                      : "gray"
              }
            >
              {record.statusRefund === 1
                ? "Yêu cầu hoàn cọc"
                : record.statusRefund === 2
                  ? "Đã chấp nhận hoàn"
                  : record.statusRefund === 3
                    ? "Đã từ chối hoàn"
                    : "Không yêu cầu"}
            </Tag>
          </div>
          {record.isAttended !== undefined && (
            <div>
              <Tag color={record.isAttended ? "green" : "red"}>
                {record.isAttended ? "Đã tham gia" : "Chưa tham gia"}
              </Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200, // Tăng width để chứa thêm nút
      render: (record: GroupedParticipant) => {
        // Kiểm tra có yêu cầu chờ xử lý không
        const hasPendingRequests = record.assets.some(
          (asset) => asset.statusRefund === 1
        );
        // Kiểm tra có yêu cầu đã xử lý không
        const hasProcessedRequests = record.assets.some(
          (asset) => asset.statusRefund === 2 || asset.statusRefund === 3
        );

        return (
          <div className="space-y-1">
            {/* Button xử lý yêu cầu - chỉ hiển thị khi có yêu cầu chờ xử lý */}
            {hasPendingRequests && (
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleShowReasonModal(record)}
                className="bg-orange-500 hover:bg-orange-600 w-full"
              >
                Xử lý yêu cầu
              </Button>
            )}

            {/* Button xem lý do - hiển thị khi có yêu cầu đã xử lý */}
            {hasProcessedRequests && (
              <Button
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleShowDetailModal(record)}
                className={`w-full ${record.statusRefund === 2
                    ? "bg-green-500 hover:bg-green-600"
                    : record.statusRefund === 3
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
              >
                Xem lý do
              </Button>
            )}

            {/* Button lịch sử đấu giá - luôn hiển thị */}
            <Button
              type="default"
              size="small"
              icon={<HistoryOutlined />}
              onClick={() => handleShowBiddingHistory(record)}
              className="w-full border-purple-500 text-purple-600 hover:border-purple-600 hover:text-purple-700"
            >
              Lịch sử đấu giá
            </Button>

            {/* Trường hợp không có yêu cầu nào */}
            {!hasPendingRequests && !hasProcessedRequests && (
              <Button size="small" disabled className="w-full">
                Không có yêu cầu
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
      <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* Thống kê tổng quan */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <UserOutlined className="text-emerald-600" />
            Tổng quan người tham gia đấu giá
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="text-center bg-white border-l-4 border-l-blue-500">
              <div className="text-2xl font-bold text-blue-600">
                {groupedParticipants.length}
              </div>
              <div className="text-sm text-gray-600">Tổng số người</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-green-500">
              <div className="text-2xl font-bold text-green-600">
                {groupedParticipants.reduce(
                  (sum, p) => sum + p.assets.length,
                  0
                )}
              </div>
              <div className="text-sm text-gray-600">Tổng số tài sản</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-yellow-500">
              <div className="text-2xl font-bold text-yellow-600">
                {groupedParticipants
                  .reduce((sum, p) => sum + p.totalRegistrationFee, 0)
                  .toLocaleString("vi-VN")}
              </div>
              <div className="text-sm text-gray-600">
                Tổng phí đăng ký (VND)
              </div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-purple-500">
              <div className="text-2xl font-bold text-purple-600">
                {groupedParticipants.length > 0
                  ? (
                    groupedParticipants.reduce(
                      (sum, p) => sum + p.assets.length,
                      0
                    ) / groupedParticipants.length
                  ).toFixed(1)
                  : "0"}
              </div>
              <div className="text-sm text-gray-600">TB tài sản/người</div>
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
              className="w-full sm:w-1/5"
            />
            <Input
              placeholder="Tìm kiếm theo CMND/CCCD"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.CitizenIdentification}
              onChange={(e) =>
                handleInputChange("CitizenIdentification", e.target.value)
              }
              className="w-full sm:w-1/5"
            />
            <Input
              placeholder="Tìm kiếm theo tên tài sản"
              prefix={<SearchOutlined />}
              allowClear
              value={searchParams.TagName}
              onChange={(e) => handleInputChange("TagName", e.target.value)}
              className="w-full sm:w-1/5"
            />
            <Button
              type="primary"
              onClick={handleDownload}
              icon={<DownloadOutlined />}
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
              disabled={
                !isAfterRegisterEndDate || groupedParticipants.length === 0
              }
            >
              Tải danh sách điểm danh
            </Button>
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
      </div>

      {/* Modal xử lý yêu cầu hoàn cọc (chỉ cho yêu cầu chờ phê duyệt) */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-orange-500" />
            <span>Xử lý yêu cầu hoàn cọc</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleCloseModal}
        width={600}
        footer={
          <Space>
            <Button onClick={handleCloseModal}>Hủy</Button>
            <Button
              type="primary"
              danger
              onClick={handleRejectReason}
              loading={reasonModalLoading}
            >
              Từ chối yêu cầu
            </Button>
            <Button
              type="primary"
              onClick={handleApproveReason}
              loading={reasonModalLoading}
              className="bg-green-500 hover:bg-green-600"
            >
              Phê duyệt yêu cầu
            </Button>
          </Space>
        }
      >
        {selectedParticipant && (
          <div className="space-y-2">
            {/* Thông tin người tham gia */}
            <div className="bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <UserOutlined className="text-blue-500" />
                Thông tin người tham gia
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <span className="ml-1 font-medium">
                    {selectedParticipant.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">CMND/CCCD:</span>
                  <span className="ml-1 font-medium">
                    {selectedParticipant.citizenIdentification}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Số báo danh:</span>
                  <span className="ml-1 font-medium">
                    {selectedParticipant.numericalOrder || "Chưa có"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng số tài sản:</span>
                  <span className="ml-1 font-medium text-blue-600">
                    {selectedParticipant.assets.length} tài sản
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Yêu cầu hoàn cọc:</span>
                  <span className="ml-1 font-medium text-orange-600">
                    {
                      selectedParticipant.assets.filter(
                        (asset) => asset.statusRefund === 1
                      ).length
                    }{" "}
                    tài sản
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng tiền yêu cầu hoàn:</span>
                  <span className="ml-1 font-medium text-red-600">
                    {selectedParticipant.assets
                      .filter((asset) => asset.statusRefund === 1)
                      .reduce((sum, asset) => sum + asset.registrationFee, 0)
                      .toLocaleString("vi-VN")}{" "}
                    VND
                  </span>
                </div>
              </div>
            </div>

            {/* Danh sách tài sản yêu cầu hoàn cọc */}
            <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-800 mb-2 flex items-center gap-2 text-sm">
                <ShoppingOutlined className="text-orange-600" />
                Tài sản yêu cầu hoàn cọc (
                {
                  selectedParticipant.assets.filter(
                    (asset) => asset.statusRefund === 1
                  ).length
                }{" "}
                tài sản)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {selectedParticipant.assets
                  .filter((asset) => asset.statusRefund === 1)
                  .map((asset, index) => (
                    <div
                      key={asset.auctionDocumentsId}
                      className="bg-white p-3 rounded-lg border border-orange-200"
                    >
                      {/* Header tài sản */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <h4 className="font-semibold text-gray-800 text-sm">
                            {asset.tagName}
                          </h4>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">
                            {asset.registrationFee.toLocaleString("vi-VN")} VND
                          </div>
                          <Tag color="orange">Yêu cầu hoàn</Tag>
                        </div>
                      </div>

                      {/* Thông tin yêu cầu hoàn cọc */}
                      <div className="mt-2 p-2 rounded border bg-orange-50 border-orange-200">
                        {/* Lý do */}
                        <div className="mb-2">
                          <div className="text-xs font-medium mb-1 text-orange-800">
                            Lý do yêu cầu hoàn cọc:
                          </div>
                          {asset.refundReason ? (
                            <div className="bg-white p-2 rounded text-xs text-gray-700 border">
                              {asset.refundReason}
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-2 rounded text-xs text-gray-500 text-center">
                              Chưa có lý do được cung cấp
                            </div>
                          )}
                        </div>

                        {/* File đính kèm */}
                        <div>
                          <div className="text-xs font-medium mb-1 text-orange-800">
                            File đính kèm:
                          </div>
                          {asset.refundProof ? (
                            <div className="bg-white p-2 rounded border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <FileTextOutlined className="text-xs text-orange-500" />
                                  <span className="text-xs text-gray-700">
                                    Tài liệu hoàn cọc
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<EyeOutlined />}
                                    href={asset.refundProof}
                                    target="_blank"
                                    className="text-blue-600 text-xs px-1 h-5"
                                  >
                                    Xem
                                  </Button>
                                  <Button
                                    type="link"
                                    size="small"
                                    icon={<DownloadOutlined />}
                                    href={asset.refundProof}
                                    download
                                    className="text-green-600 text-xs px-1 h-5"
                                  >
                                    Tải
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-2 rounded text-center">
                              <div className="text-gray-500 text-xs">
                                Chưa có file được tải lên
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cảnh báo */}
            <div className="bg-orange-50 border border-orange-200 p-2 rounded-lg">
              <div className="text-orange-800 text-xs">
                <strong>⚠️ Lưu ý:</strong> Hành động sẽ áp dụng cho{" "}
                {
                  selectedParticipant.assets.filter(
                    (asset) => asset.statusRefund === 1
                  ).length
                }{" "}
                tài sản được yêu cầu hoàn cọc của {selectedParticipant.name}.
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal từ chối yêu cầu hoàn cọc - Thiết kế đơn giản và đẹp */}
      <Modal
        title={
          <div className="flex items-center gap-3 p-4 bg-red-50 border-b border-red-100">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <FileTextOutlined className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-red-800 mb-1">
                Từ chối yêu cầu hoàn cọc
              </h3>
              <p className="text-sm text-red-600">
                Vui lòng cung cấp lý do từ chối rõ ràng và chi tiết
              </p>
            </div>
          </div>
        }
        open={isRejectModalVisible}
        onCancel={handleCloseRejectModal}
        width={650}
        footer={null}
        className="reject-refund-modal"
        centered
      >
        {selectedParticipant && (
          <div className="p-6 space-y-6">
            {/* Thông tin người yêu cầu */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                <UserOutlined className="text-blue-600" />
                Thông tin người yêu cầu hoàn cọc
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Họ và tên</div>
                  <div className="font-semibold text-gray-900">
                    {selectedParticipant?.name}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">CMND/CCCD</div>
                  <div className="font-semibold text-gray-900">
                    {selectedParticipant?.citizenIdentification}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">
                    Số tài sản yêu cầu hoàn
                  </div>
                  <div className="font-semibold text-orange-600">
                    {
                      selectedParticipant?.assets.filter(
                        (asset) => asset.statusRefund === 1
                      ).length
                    }{" "}
                    tài sản
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">
                    Tổng số tiền yêu cầu hoàn
                  </div>
                  <div className="font-semibold text-red-600">
                    {selectedParticipant?.assets
                      .filter((asset) => asset.statusRefund === 1)
                      .reduce((sum, asset) => sum + asset.registrationFee, 0)
                      .toLocaleString("vi-VN")}{" "}
                    VND
                  </div>
                </div>
              </div>
            </div>

            {/* Form nhập lý do từ chối */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <FileTextOutlined className="text-gray-600 text-lg" />
                <h4 className="text-lg font-semibold text-gray-800">
                  Lý do từ chối yêu cầu
                </h4>
                <span className="text-red-500 text-xl">*</span>
              </div>
              <TextArea
                rows={6}
                placeholder="Vui lòng nhập lý do từ chối chi tiết và rõ ràng để người yêu cầu hiểu được nguyên nhân. Ví dụ: Hồ sơ không đầy đủ, thông tin không chính xác, không đáp ứng điều kiện hoàn cọc..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                showCount
                maxLength={500}
                className="w-full"
                style={{ fontSize: "14px", lineHeight: "1.5" }}
              />
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-200">
                <div className="flex items-start gap-2 text-sm text-blue-700">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs font-bold">i</span>
                  </div>
                  <div>
                    <strong>Lưu ý:</strong> Lý do từ chối sẽ được gửi thông báo
                    email đến người yêu cầu và được lưu trữ trong hệ thống để
                    theo dõi.
                  </div>
                </div>
              </div>
            </div>

            {/* Cảnh báo quan trọng */}
            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">!</span>
                </div>
                <div>
                  <h5 className="font-bold text-yellow-800 text-base mb-2">
                    ⚠️ Cảnh báo quan trọng
                  </h5>
                  <p className="text-yellow-700 text-sm leading-relaxed">
                    Sau khi từ chối, yêu cầu hoàn cọc cho{" "}
                    <strong>
                      {
                        selectedParticipant?.assets.filter(
                          (asset) => asset.statusRefund === 1
                        ).length
                      }{" "}
                      tài sản
                    </strong>{" "}
                    sẽ bị <strong>hủy bỏ vĩnh viễn</strong> và không thể khôi
                    phục. Người dùng sẽ nhận được email thông báo kèm theo lý do
                    từ chối mà bạn vừa nhập.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
              <Button
                size="large"
                onClick={handleCloseRejectModal}
                className="px-6 py-2 h-11"
              >
                Hủy bỏ
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={handleSubmitRejectReason}
                loading={rejectModalLoading}
                disabled={!rejectReason.trim()}
                danger
                className="px-6 py-2 h-11"
                icon={<FileTextOutlined />}
              >
                Gửi lý do từ chối
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal xem chi tiết yêu cầu đã xử lý */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined
              className={
                selectedDetailParticipant?.statusRefund === 2
                  ? "text-green-500"
                  : "text-red-500"
              }
            />
            <span>
              {selectedDetailParticipant?.statusRefund === 2
                ? "Chi tiết yêu cầu đã chấp nhận"
                : "Chi tiết yêu cầu đã từ chối"}
            </span>
          </div>
        }
        open={isViewDetailModalVisible}
        onCancel={handleCloseDetailModal}
        width={600}
        footer={
          <Button onClick={handleCloseDetailModal} type="primary">
            Đóng
          </Button>
        }
      >
        {selectedDetailParticipant && (
          <div className="space-y-2">
            {/* Thông tin người tham gia */}
            <div className="bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-1 flex items-center gap-2 text-sm">
                <UserOutlined className="text-blue-500" />
                Thông tin người tham gia
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <span className="ml-1 font-medium">
                    {selectedDetailParticipant.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">CMND/CCCD:</span>
                  <span className="ml-1 font-medium">
                    {selectedDetailParticipant.citizenIdentification}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Số báo danh:</span>
                  <span className="ml-1 font-medium">
                    {selectedDetailParticipant.numericalOrder || "Chưa có"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Tổng số tài sản:</span>
                  <span className="ml-1 font-medium text-blue-600">
                    {selectedDetailParticipant.assets.length} tài sản
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Đã chấp nhận:</span>
                  <span className="ml-1 font-medium text-green-600">
                    {
                      selectedDetailParticipant.assets.filter(
                        (asset) => asset.statusRefund === 2
                      ).length
                    }{" "}
                    tài sản
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Đã từ chối:</span>
                  <span className="ml-1 font-medium text-red-600">
                    {
                      selectedDetailParticipant.assets.filter(
                        (asset) => asset.statusRefund === 3
                      ).length
                    }{" "}
                    tài sản
                  </span>
                </div>
              </div>
            </div>

            {/* Danh sách tài sản với thông tin riêng biệt */}
            <div className="bg-gray-50 p-2 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2 text-sm">
                <ShoppingOutlined className="text-blue-600" />
                Danh sách tài sản ({selectedDetailParticipant.assets.length} tài
                sản)
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {selectedDetailParticipant.assets.map((asset, index) => (
                  <div
                    key={asset.auctionDocumentsId}
                    className="bg-white p-3 rounded-lg border border-gray-200"
                  >
                    {/* Header tài sản */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </span>
                        <h4 className="font-semibold text-gray-800 text-sm">
                          {asset.tagName}
                        </h4>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {asset.registrationFee.toLocaleString("vi-VN")} VND
                        </div>
                        <Tag
                          color={
                            asset.statusRefund === 1
                              ? "orange"
                              : asset.statusRefund === 2
                                ? "green"
                                : asset.statusRefund === 3
                                  ? "red"
                                  : "gray"
                          }
                        >
                          {asset.statusRefund === 1
                            ? "Yêu cầu hoàn"
                            : asset.statusRefund === 2
                              ? "Đã chấp nhận"
                              : asset.statusRefund === 3
                                ? "Đã từ chối"
                                : "Không yêu cầu"}
                        </Tag>
                      </div>
                    </div>

                    {/* Thông tin chi tiết nếu có yêu cầu hoàn cọc */}
                    {asset.statusRefund &&
                      (asset.statusRefund === 1 ||
                        asset.statusRefund === 2 ||
                        asset.statusRefund === 3) && (
                        <div
                          className={`mt-2 p-2 rounded border ${asset.statusRefund === 1
                              ? "bg-orange-50 border-orange-200"
                              : asset.statusRefund === 2
                                ? "bg-green-50 border-green-200"
                                : "bg-red-50 border-red-200"
                            }`}
                        >
                          {/* Lý do */}
                          <div className="mb-2">
                            <div
                              className={`text-xs font-medium mb-1 ${asset.statusRefund === 1
                                  ? "text-orange-800"
                                  : asset.statusRefund === 2
                                    ? "text-green-800"
                                    : "text-red-800"
                                }`}
                            >
                              {asset.statusRefund === 1
                                ? "Lý do yêu cầu:"
                                : asset.statusRefund === 2
                                  ? "Lý do chấp nhận:"
                                  : "Lý do từ chối:"}
                            </div>
                            {asset.refundReason ? (
                              <div className="bg-white p-2 rounded text-xs text-gray-700 border">
                                {asset.refundReason}
                              </div>
                            ) : (
                              <div className="bg-gray-100 p-2 rounded text-xs text-gray-500 text-center">
                                Chưa có lý do được cung cấp
                              </div>
                            )}
                          </div>

                          {/* File đính kèm */}
                          <div>
                            <div
                              className={`text-xs font-medium mb-1 ${asset.statusRefund === 1
                                  ? "text-orange-800"
                                  : asset.statusRefund === 2
                                    ? "text-green-800"
                                    : "text-red-800"
                                }`}
                            >
                              File đính kèm:
                            </div>
                            {asset.refundProof ? (
                              <div className="bg-white p-2 rounded border">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1">
                                    <FileTextOutlined
                                      className={`text-xs ${asset.statusRefund === 1
                                          ? "text-orange-500"
                                          : asset.statusRefund === 2
                                            ? "text-green-500"
                                            : "text-red-500"
                                        }`}
                                    />
                                    <span className="text-xs text-gray-700">
                                      Tài liệu hoàn cọc
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      type="link"
                                      size="small"
                                      icon={<EyeOutlined />}
                                      href={asset.refundProof}
                                      target="_blank"
                                      className="text-blue-600 text-xs px-1 h-5"
                                    >
                                      Xem
                                    </Button>
                                    <Button
                                      type="link"
                                      size="small"
                                      icon={<DownloadOutlined />}
                                      href={asset.refundProof}
                                      download
                                      className="text-green-600 text-xs px-1 h-5"
                                    >
                                      Tải
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-100 p-2 rounded text-center">
                                <div className="text-gray-500 text-xs">
                                  Chưa có file được tải lên
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>

            {/* Thông tin tóm tắt */}
            <div
              className={`p-2 rounded-lg border ${selectedDetailParticipant.statusRefund === 2
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
                }`}
            >
              <div
                className={`text-xs ${selectedDetailParticipant.statusRefund === 2
                    ? "text-green-800"
                    : "text-red-800"
                  }`}
              >
                <strong>
                  {selectedDetailParticipant.statusRefund === 2
                    ? "✅ Trạng thái:"
                    : "❌ Trạng thái:"}
                </strong>
                {selectedDetailParticipant.statusRefund === 2
                  ? ` Đã chấp nhận yêu cầu hoàn cọc cho ${selectedDetailParticipant.assets.filter(
                    (asset) => asset.statusRefund === 2
                  ).length
                  } tài sản của ${selectedDetailParticipant.name}.`
                  : ` Đã từ chối yêu cầu hoàn cọc cho ${selectedDetailParticipant.assets.filter(
                    (asset) => asset.statusRefund === 3
                  ).length
                  } tài sản của ${selectedDetailParticipant.name}.`}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal lịch sử đấu giá */}
      <ParticipantBiddingHistoryModal
        visible={isBiddingHistoryModalVisible}
        onClose={handleCloseBiddingHistoryModal}
        participantInfo={selectedParticipantForHistory}
      />
    </section>
  );
};

export default ListAuctionDocumentSuccesRegister;
