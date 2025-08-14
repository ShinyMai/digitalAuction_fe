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
} from "@ant-design/icons";
import ParticipantBiddingHistoryModal from "../../../../components/Common/ParticipantBiddingHistoryModal/ParticipantBiddingHistoryModal";

// Interface cho dữ liệu đã nhóm theo người
interface GroupedParticipant {
  participantId: string;
  name: string;
  citizenIdentification: string;
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
  statusTicket?: number;
}

interface Props {
  auctionId: string;
  auctionDateModals?: AuctionDateModal;
}

const ListAuctionDocument = ({ auctionId, auctionAssets }: Props) => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: auctionAssets.length * 4,
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
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
  const [selectedParticipantToConfirm, setSelectedParticipantToConfirm] =
    useState<GroupedParticipant | null>(null);

  // Nhóm dữ liệu theo CMND/CCCD
  const groupedParticipants = useMemo(() => {
    const grouped = new Map<string, GroupedParticipant>();

    auctionDocuments.forEach((doc) => {
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
          totalRegistrationFee: doc.registrationFee,
          assets: [doc],
          isAttended: doc.isAttended !== false, // Mặc định true nếu undefined, false nếu đã set false
        });
      }
    });

    return Array.from(grouped.values());
  }, [auctionDocuments]);

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
        statusTicket: searchParams.statusTicket,
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
    console.log("showNotParticipatingConfirm called", participant);
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
          (asset) => asset.statusDeposit === true
        ).length;

        return (
          <div className="space-y-2">
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
                        : `${count} đã hoàn tiền`}
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
      title: "Trạng thái tham gia",
      key: "attendanceStatus",
      width: 150,
      align: "center" as const,
      render: (record: GroupedParticipant) => {
        const isAttended = record.isAttended !== false; // Mặc định true nếu undefined
        return (
          <div className="text-center">
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
                {auctionDocuments.length}
              </div>
              <div className="text-sm text-gray-600">Tổng số đơn đăng ký</div>
            </Card>
            <Card className="text-center bg-white border-l-4 border-l-orange-500">
              <div className="text-2xl font-bold text-orange-600">
                {
                  groupedParticipants
                    .flatMap((p) => p.assets)
                    .filter((asset) => asset.statusDeposit === true).length
                }
              </div>
              <div className="text-sm text-gray-600">Đã cọc</div>
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

        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
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
        <Table
          columns={columns}
          dataSource={groupedParticipants}
          rowKey="participantId"
          loading={loading}
          pagination={{
            current: searchParams.PageNumber,
            pageSize: 8,
            total: groupedParticipants.length,
            showSizeChanger: false,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} người tham gia`,
            onChange: (page) =>
              setSearchParams((prev) => ({
                ...prev,
                PageNumber: page,
                PageSize: 8,
              })),
          }}
          scroll={{ x: "max-content" }}
          className="border border-teal-100 rounded-lg"
          size="middle"
          rowClassName="hover:bg-blue-50"
        />
      </div>

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
                    <div className="flex items-center gap-2">
                      <Tag
                        color={
                          asset.statusTicket === 0
                            ? "gray"
                            : asset.statusTicket === 1
                              ? "blue"
                              : asset.statusTicket === 2
                                ? "green"
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
                              : "Đã hoàn tiền"}
                      </Tag>

                      <Tag
                        color={asset.statusDeposit ? "green" : "orange"}
                        className="text-xs"
                      >
                        {asset.statusDeposit ? "Đã cọc" : "Chưa cọc"}
                      </Tag>
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
      </Modal>

      {/* Modal lịch sử đấu giá */}
      <ParticipantBiddingHistoryModal
        visible={isBiddingHistoryModalVisible}
        onClose={handleCloseBiddingHistoryModal}
        participantInfo={selectedParticipantForHistory}
      />

      {/* Modal xác nhận không tham gia */}
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
                    <strong>Hãy kiểm tra lại trong danh sách ký tham gia để chắc chắn khách hàng không tham gia.</strong>
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
                  <p className="font-medium text-gray-800">{selectedParticipantToConfirm.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">CMND/CCCD:</span>
                  <p className="font-medium text-gray-800">{selectedParticipantToConfirm.citizenIdentification}</p>
                </div>
                <div>
                  <span className="text-gray-600">Số tài sản đăng ký:</span>
                  <p className="font-medium text-blue-600">{selectedParticipantToConfirm.assets.length} tài sản</p>
                </div>
              </div>
            </div>

            {/* Thông báo kết quả */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm mb-2">
                <strong>Sau khi xác nhận:</strong>
              </p>
              <ul className="text-blue-700 text-sm space-y-1 ml-4">
                <li>• Khách hàng sẽ được đánh dấu là <strong>"Không tham gia"</strong></li>
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
