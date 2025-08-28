import { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionDocument, AuctionDateModal } from "../../Modals";
import { Table, Input, Tag, Select, Button, Card, Divider } from "antd";
import {
  HistoryOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import ParticipantBiddingHistoryModal from "../../../../components/Common/ParticipantBiddingHistoryModal/ParticipantBiddingHistoryModal";
import CustomModal from "../../../../components/Common/CustomModal";

// ================= Types =================
interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
}

// Interface cho dữ liệu đã nhóm theo người
interface GroupedParticipant {
  participantId: string;
  name: string;
  citizenIdentification: string;
  numericalOrder?: number;
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

interface Props {
  auctionId: string;
  auctionDateModals?: AuctionDateModal;
  auctionAssets: AuctionAsset[];
}

// ================= Component =================
const ListAuctionDocument = ({ auctionId, auctionAssets }: Props) => {
  // Bộ lọc gửi lên API
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1, // luôn gửi 1 để lấy batch 100 đầu tiên
    PageSize: 100, // yêu cầu: đặt PageSize=100 khi call API
    SortBy: "numericalorder",
    IsAscending: true,
  });

  // Phân trang FE
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSizeFe, setPageSizeFe] = useState<number>(8);

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

  // ===== Group theo CMND/CCCD =====
  const groupedParticipants = useMemo(() => {
    const grouped = new Map<string, GroupedParticipant>();

    auctionDocuments.forEach((doc) => {
      const key = doc.citizenIdentification;
      if (grouped.has(key)) {
        const existing = grouped.get(key)!;
        existing.assets.push(doc);
        existing.totalRegistrationFee += doc.registrationFee;
        // ưu tiên gán numericalOrder nếu chưa có
        if (existing.numericalOrder == null && doc.numericalOrder != null) {
          existing.numericalOrder = doc.numericalOrder;
        }
      } else {
        grouped.set(key, {
          participantId: doc.citizenIdentification,
          name: doc.name,
          numericalOrder: doc.numericalOrder,
          citizenIdentification: doc.citizenIdentification,
          userId: doc.userId,
          totalRegistrationFee: doc.registrationFee,
          assets: [doc],
        });
      }
    });

    // (tuỳ chọn) sắp xếp tăng dần theo Số báo danh để hiển thị ổn định
    const arr = Array.from(grouped.values());
    arr.sort((a, b) => {
      const na = a.numericalOrder ?? Number.MAX_SAFE_INTEGER;
      const nb = b.numericalOrder ?? Number.MAX_SAFE_INTEGER;
      if (na !== nb) return na - nb;
      return (a.name || "").localeCompare(b.name || "", "vi");
    });
    return arr;
  }, [auctionDocuments]);

  // ===== Phân trang FE: cắt mảng theo currentPage & pageSizeFe =====
  const paginatedParticipants = useMemo(() => {
    const start = (currentPage - 1) * pageSizeFe;
    const end = start + pageSizeFe;
    return groupedParticipants.slice(start, end);
  }, [groupedParticipants, currentPage, pageSizeFe]);

  // ===== Fetch: luôn dùng PageSize=100 (FE sẽ phân trang) =====
  useEffect(() => {
    const getListAuctionDocument = async () => {
      try {
        setLoading(true);
        const params: SearchParams = {
          // Luôn cố định để lấy nhiều bản ghi nhất có thể cho FE paginate
          PageNumber: 1,
          PageSize: 100,
          // filter
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

        const filteredDocuments = response.data.auctionDocuments;
        setAuctionDocuments(filteredDocuments);
        // Reset về trang 1 mỗi khi filter thay đổi
        setCurrentPage(1);
      } catch (error) {
        toast.error("Lỗi khi tải danh sách tài liệu đấu giá!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getListAuctionDocument();
  }, [
    searchParams.Name,
    searchParams.CitizenIdentification,
    searchParams.TagName,
    searchParams.SortBy,
    searchParams.IsAscending,
    auctionId,
  ]);

  // ===== Handlers =====
  const handleInputChange = (key: keyof SearchParams, value: string) => {
    const newValue = value || undefined;
    setSearchValues((prev) => ({ ...prev, [key]: newValue }));
    setSearchParams((prev) => ({
      ...prev,
      [key]: newValue,
      PageNumber: 1, // chỉ dùng để hiển thị, call API vẫn 1
      PageSize: 100,
    }));
    setCurrentPage(1); // reset FE pagination
  };

  const handleShowAssetsModal = (participant: GroupedParticipant) => {
    setSelectedParticipant(participant);
    setIsAssetsModalVisible(true);
  };

  const handleCloseAssetsModal = () => {
    setIsAssetsModalVisible(false);
    setSelectedParticipant(null);
  };

  const handleShowBiddingHistory = (participant: GroupedParticipant) => {
    setSelectedParticipantForHistory({
      name: participant.name,
      citizenIdentification: participant.citizenIdentification,
      auctionId: auctionId,
      userId: participant.userId,
    });
    setIsBiddingHistoryModalVisible(true);
  };

  const handleCloseBiddingHistoryModal = () => {
    setIsBiddingHistoryModalVisible(false);
    setSelectedParticipantForHistory(null);
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
        <div className="p-2">
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
        <div>
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
                    ? `${count} chưa chuyển tiền`
                    : parseInt(status) === 1
                    ? `${count} đã chuyển tiền`
                    : parseInt(status) === 2
                    ? `${count} đã nhận phiếu`
                    : parseInt(status) === 3
                    ? `${count} đã hoàn tiền`
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
            <DollarOutlined className="mr-1" />
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
        <Button
          type="primary"
          size="small"
          icon={<HistoryOutlined />}
          onClick={() => handleShowBiddingHistory(record)}
          className="bg-blue-500 hover:bg-blue-600"
          title="Xem lịch sử đấu giá"
        >
          Lịch sử đấu giá
        </Button>
      ),
    },
  ];

  return (
    <section className="w-full h-fit ">
      <div className="w-full mx-auto">
        {/* Stats */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4 flex items-center gap-2">
            <UserOutlined className="text-emerald-600" />
            Tổng quan danh sách đăng ký
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center bg-white border-l-4 border-l-blue-500">
              <div className="text-2xl font-bold text-blue-600">
                {groupedParticipants.length}
              </div>
              <div className="text-sm text-gray-600">
                Tổng số người tham gia
              </div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-orange-500">
              <div className="text-2xl font-bold text-orange-600">
                {auctionDocuments.length}
              </div>
              <div className="text-sm text-gray-600">Tổng số đơn đăng ký</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-purple-500">
              <div className="text-2xl font-bold text-purple-600">
                {groupedParticipants
                  .reduce((sum, p) => sum + p.totalRegistrationFee, 0)
                  .toLocaleString("vi-VN")}
              </div>
              <div className="text-sm text-gray-600">
                Tổng phí đăng ký (VND)
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-blue-500">
              <h2 className="text-lg font-semibold text-white">
                Tìm kiếm hồ sơ đấu giá
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Table với phân trang FE */}
        <Table
          columns={columns}
          dataSource={paginatedParticipants}
          rowKey="participantId"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSizeFe,
            total: groupedParticipants.length,
            showSizeChanger: true,
            pageSizeOptions: ["8", "10", "20", "50", "100"],
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người tham gia`,
            onChange: (page, size) => {
              setCurrentPage(page);
              if (size && size !== pageSizeFe) {
                setPageSizeFe(size);
                // khi đổi pageSize, đưa về trang 1 để tránh out-of-range
                if (page !== 1) setCurrentPage(1);
              }
            },
          }}
          scroll={{ x: "max-content" }}
          size="middle"
          rowClassName="!p-2 hover:bg-blue-50"
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

                      <Tag
                        color={asset.statusDeposit === 1 ? "success" : "orange"}
                        className="text-xs"
                      >
                        {asset.statusDeposit === 1 ? "Đã cọc" : "Chưa cọc"}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
            </div>

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
    </section>
  );
};

export default ListAuctionDocument;
