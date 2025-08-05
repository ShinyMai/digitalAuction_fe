import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type {
    AuctionDocument,
    AuctionDateModal,
} from "../../Modals";
import {
    Table,
    Input,
    Tag,
    Button,
    Modal,
    Space,
    Card,
    Collapse,
} from "antd";
import {
    SearchOutlined,
    DownloadOutlined,
    EyeOutlined,
    UserOutlined,
    ShoppingOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

// Interface cho dữ liệu đã nhóm theo người
interface GroupedParticipant {
    participantId: string;
    name: string;
    citizenIdentification: string;
    numericalOrder?: number;
    statusDeposit: number;
    statusTicket: number;
    totalRegistrationFee: number;
    nonParticipationFileUrl?: string; // URL file lý do không tham gia
    assets: {
        tagName: string;
        registrationFee: number;
        auctionDocumentsId: string;
    }[];
    // Để hiển thị modal, lấy document đầu tiên làm đại diện
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

interface Props {
    auctionId?: string;
    auctionDateModals?: AuctionDateModal;
}

const ListAuctionDocumentSuccesRegister = ({
    auctionId,
    auctionDateModals,
}: Props) => {
    const [searchParams, setSearchParams] =
        useState<SearchParams>({
            PageNumber: 1,
            PageSize: 8,
            StatusDeposit: 1,
        });
    const [auctionDocuments, setAuctionDocuments] = useState<
        AuctionDocument[]
    >([]);
    const [loading, setLoading] = useState<boolean>(false);

    // State cho modal lý do không tham gia
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedParticipant, setSelectedParticipant] = useState<GroupedParticipant | null>(null);
    const [reasonModalLoading, setReasonModalLoading] = useState<boolean>(false);

    // Nhóm dữ liệu theo CMND/CCCD
    const groupedParticipants = useMemo(() => {
        const grouped = new Map<string, GroupedParticipant>();

        auctionDocuments.forEach(doc => {
            const key = doc.citizenIdentification; // Dùng CMND/CCCD làm key

            if (grouped.has(key)) {
                const existing = grouped.get(key)!;
                existing.assets.push({
                    tagName: doc.tagName,
                    registrationFee: doc.registrationFee,
                    auctionDocumentsId: doc.auctionDocumentsId,
                });
                existing.totalRegistrationFee += doc.registrationFee;
            } else {
                grouped.set(key, {
                    participantId: doc.citizenIdentification,
                    name: doc.name,
                    citizenIdentification: doc.citizenIdentification,
                    numericalOrder: doc.numericalOrder,
                    statusDeposit: doc.statusDeposit,
                    statusTicket: doc.statusTicket,
                    totalRegistrationFee: doc.registrationFee,
                    nonParticipationFileUrl: doc.note || undefined, // Sử dụng field note làm URL file
                    assets: [{
                        tagName: doc.tagName,
                        registrationFee: doc.registrationFee,
                        auctionDocumentsId: doc.auctionDocumentsId,
                    }],
                    representativeDocument: doc,
                });
            }
        });

        return Array.from(grouped.values());
    }, [auctionDocuments]);

    // Kiểm tra nếu ngày hiện tại lớn hơn registerEndDate
    const isAfterRegisterEndDate =
        auctionDateModals?.registerEndDate
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
                StatusDeposit: searchParams.StatusDeposit
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
    }, [searchParams.Name, searchParams.CitizenIdentification, searchParams.TagName]);

    const handleInputChange = (
        key: keyof SearchParams,
        value: string
    ) => {
        setSearchParams((prev) => ({
            ...prev,
            [key]: value || undefined,
            PageNumber: 1, // Reset về trang 1 khi search
        }));
    };

    // Xử lý hiển thị modal lý do không tham gia
    const handleShowReasonModal = (participant: GroupedParticipant) => {
        setSelectedParticipant(participant);
        setIsModalVisible(true);
    };

    // Xử lý đóng modal
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedParticipant(null);
    };

    // Xử lý đồng ý lý do không tham gia - Cập nhật tất cả tài sản của người này
    const handleApproveReason = async () => {
        if (!selectedParticipant) return;

        try {
            setReasonModalLoading(true);

            // Gọi API để phê duyệt lý do không tham gia cho tất cả tài sản của người này
            // const assetIds = selectedParticipant.assets.map(asset => asset.auctionDocumentsId);

            // TODO: Gọi API để phê duyệt lý do không tham gia cho tất cả assets
            // await AuctionServices.approveNonParticipationForParticipant(
            //     selectedParticipant.citizenIdentification, 
            //     assetIds
            // );

            toast.success(`Đã phê duyệt lý do không tham gia cho ${selectedParticipant.name} (${selectedParticipant.assets.length} tài sản)!`);
            handleCloseModal();
            getListAuctionDocument(); // Refresh danh sách
        } catch (error) {
            toast.error("Lỗi khi phê duyệt lý do không tham gia!");
            console.error(error);
        } finally {
            setReasonModalLoading(false);
        }
    };

    // Xử lý từ chối lý do không tham gia - Cập nhật tất cả tài sản của người này
    const handleRejectReason = async () => {
        if (!selectedParticipant) return;

        try {
            setReasonModalLoading(true);

            // Gọi API để từ chối lý do không tham gia cho tất cả tài sản của người này
            // const assetIds = selectedParticipant.assets.map(asset => asset.auctionDocumentsId);

            // TODO: Gọi API để từ chối lý do không tham gia cho tất cả assets
            // await AuctionServices.rejectNonParticipationForParticipant(
            //     selectedParticipant.citizenIdentification, 
            //     assetIds
            // );

            toast.success(`Đã từ chối lý do không tham gia cho ${selectedParticipant.name} (${selectedParticipant.assets.length} tài sản)!`);
            handleCloseModal();
            getListAuctionDocument(); // Refresh danh sách
        } catch (error) {
            toast.error("Lỗi khi từ chối lý do không tham gia!");
            console.error(error);
        } finally {
            setReasonModalLoading(false);
        }
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
                    const assetsList = participant.assets.map(asset =>
                        `${asset.tagName} (${asset.registrationFee.toLocaleString("vi-VN")} VND)`
                    ).join("; ");

                    const depositStatus = participant.statusDeposit === 0 ? "Chưa cọc" : "Đã cọc";
                    const ticketStatus = participant.statusTicket === 0 ? "Chưa chuyển tiền" :
                        participant.statusTicket === 1 ? "Đã chuyển tiền" :
                            participant.statusTicket === 2 ? "Đã ký phiếu" : "Đã hoàn tiền";

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
                    return row.join(",")
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
                <div className="text-center font-medium">
                    {numericalOrder || "-"}
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
                                key: '1',
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
                                                    Phí: {asset.registrationFee.toLocaleString("vi-VN")} VND
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
                        <Tag color={record.statusDeposit === 0 ? "red" : "green"} className="mb-1">
                            {record.statusDeposit === 0 ? "Chưa cọc" : "Đã cọc"}
                        </Tag>
                    </div>
                    <div>
                        <Tag color={
                            record.statusTicket === 0 ? "red" :
                                record.statusTicket === 1 ? "blue" :
                                    record.statusTicket === 2 ? "cyan" : "green"
                        }>
                            {record.statusTicket === 0 ? "Chưa chuyển tiền" :
                                record.statusTicket === 1 ? "Đã chuyển tiền" :
                                    record.statusTicket === 2 ? "Đã ký phiếu" : "Đã hoàn tiền"}
                        </Tag>
                    </div>
                </div>
            ),
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (record: GroupedParticipant) => (
                <div className="space-y-2">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleShowReasonModal(record)}
                        className="bg-blue-500 hover:bg-blue-600 w-full"
                    >
                        Xem lý do
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
                                {groupedParticipants.reduce((sum, p) => sum + p.assets.length, 0)}
                            </div>
                            <div className="text-sm text-gray-600">Tổng số tài sản</div>
                        </Card>
                        <Card className="text-center bg-white border-l-4 border-l-yellow-500">
                            <div className="text-2xl font-bold text-yellow-600">
                                {groupedParticipants.reduce((sum, p) => sum + p.totalRegistrationFee, 0).toLocaleString("vi-VN")}
                            </div>
                            <div className="text-sm text-gray-600">Tổng phí đăng ký (VND)</div>
                        </Card>
                        <Card className="text-center bg-white border-l-4 border-l-purple-500">
                            <div className="text-2xl font-bold text-purple-600">
                                {groupedParticipants.length > 0 ?
                                    (groupedParticipants.reduce((sum, p) => sum + p.assets.length, 0) / groupedParticipants.length).toFixed(1)
                                    : "0"
                                }
                            </div>
                            <div className="text-sm text-gray-600">TB tài sản/người</div>
                        </Card>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-800 mb-4">
                        Tìm kiếm
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Input
                            placeholder="Tìm kiếm theo tên"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchParams.Name}
                            onChange={(e) =>
                                handleInputChange("Name", e.target.value)
                            }
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
                            onChange={(e) =>
                                handleInputChange("TagName", e.target.value)
                            }
                            className="w-full sm:w-1/5"
                        />
                        <Button
                            type="primary"
                            onClick={handleDownload}
                            icon={<DownloadOutlined />}
                            className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
                            disabled={!isAfterRegisterEndDate || groupedParticipants.length === 0}
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

            {/* Modal hiển thị lý do không tham gia */}
            <Modal
                title={
                    <div className="flex items-center gap-2">
                        <FileTextOutlined className="text-blue-500" />
                        <span>Lý do không tham gia đấu giá</span>
                    </div>
                }
                open={isModalVisible}
                onCancel={handleCloseModal}
                width={600}
                footer={
                    <Space>
                        <Button onClick={handleCloseModal}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            danger
                            onClick={handleRejectReason}
                            loading={reasonModalLoading}
                        >
                            Từ chối tất cả
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleApproveReason}
                            loading={reasonModalLoading}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Đồng ý tất cả
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
                                    <span className="ml-1 font-medium">{selectedParticipant.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">CMND/CCCD:</span>
                                    <span className="ml-1 font-medium">{selectedParticipant.citizenIdentification}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Số báo danh:</span>
                                    <span className="ml-1 font-medium">{selectedParticipant.numericalOrder || "Chưa có"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Tổng số tài sản:</span>
                                    <span className="ml-1 font-medium text-blue-600">{selectedParticipant.assets.length} tài sản</span>
                                </div>
                            </div>
                        </div>

                        {/* Danh sách tài sản với scroll cao tối đa 120px */}
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-1 flex items-center gap-2 text-sm">
                                <ShoppingOutlined className="text-blue-600" />
                                Danh sách tài sản ({selectedParticipant.assets.length})
                            </h3>
                            <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                                {selectedParticipant.assets.map((asset, index) => (
                                    <div key={asset.auctionDocumentsId} className="bg-white p-1.5 rounded border border-blue-200">
                                        <div className="font-medium text-gray-800 text-xs">
                                            {index + 1}. {asset.tagName}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            {asset.registrationFee.toLocaleString("vi-VN")} VND
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-blue-100 p-1.5 rounded mt-1">
                                <div className="text-xs text-blue-800">
                                    <strong>Tổng:</strong> {selectedParticipant.totalRegistrationFee.toLocaleString("vi-VN")} VND
                                </div>
                            </div>
                        </div>

                        {/* File lý do không tham gia compact */}
                        <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                            <h3 className="font-medium text-yellow-800 mb-1 flex items-center gap-2 text-sm">
                                <FileTextOutlined className="text-yellow-600" />
                                File lý do không tham gia
                            </h3>
                            {selectedParticipant.nonParticipationFileUrl ? (
                                <div className="space-y-1">
                                    <div className="bg-white p-1.5 rounded border border-yellow-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <FileTextOutlined className="text-red-500 text-xs" />
                                                <span className="text-xs font-medium">
                                                    Đơn xin không tham gia đấu giá
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    icon={<EyeOutlined />}
                                                    href={selectedParticipant.nonParticipationFileUrl}
                                                    target="_blank"
                                                    className="text-blue-600 text-xs px-1 h-6"
                                                >
                                                    Xem
                                                </Button>
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    icon={<DownloadOutlined />}
                                                    href={selectedParticipant.nonParticipationFileUrl}
                                                    download
                                                    className="text-green-600 text-xs px-1 h-6"
                                                >
                                                    Tải
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-yellow-700 bg-yellow-100 p-1.5 rounded">
                                        💡 File này áp dụng cho tất cả {selectedParticipant.assets.length} tài sản.
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-100 p-1.5 rounded text-center">
                                    <FileTextOutlined className="text-gray-400 text-sm mb-1" />
                                    <div className="text-gray-500 text-xs">
                                        Chưa có file được tải lên
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Trạng thái hiện tại compact */}
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-1 text-sm">
                                Trạng thái hiện tại
                            </h3>
                            <div className="flex gap-1">
                                <Tag color={selectedParticipant.statusDeposit === 0 ? "red" : "green"} className="text-xs">
                                    {selectedParticipant.statusDeposit === 0 ? "Chưa cọc" : "Đã cọc"}
                                </Tag>
                                <Tag color={
                                    selectedParticipant.statusTicket === 0 ? "red" :
                                        selectedParticipant.statusTicket === 1 ? "blue" :
                                            selectedParticipant.statusTicket === 2 ? "cyan" : "green"
                                } className="text-xs">
                                    {selectedParticipant.statusTicket === 0 ? "Chưa chuyển tiền" :
                                        selectedParticipant.statusTicket === 1 ? "Đã chuyển tiền" :
                                            selectedParticipant.statusTicket === 2 ? "Đã ký phiếu" : "Đã hoàn tiền"}
                                </Tag>
                            </div>
                        </div>

                        {/* Cảnh báo compact */}
                        <div className="bg-orange-50 border border-orange-200 p-1.5 rounded-lg">
                            <div className="text-orange-800 text-xs">
                                <strong>⚠️ Lưu ý:</strong> Hành động sẽ áp dụng cho tất cả {selectedParticipant.assets.length} tài sản của {selectedParticipant.name}.
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default ListAuctionDocumentSuccesRegister;