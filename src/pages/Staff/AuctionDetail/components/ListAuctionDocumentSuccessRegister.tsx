import { useEffect, useState, useCallback } from "react";
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
} from "antd";
import {
    SearchOutlined,
    DownloadOutlined,
    EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

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
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // State cho modal lý do không tham gia
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<AuctionDocument | null>(null);
    const [reasonModalLoading, setReasonModalLoading] = useState<boolean>(false);

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
            setTotalCount(response.data.totalCount);
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
    const handleShowReasonModal = (document: AuctionDocument) => {
        setSelectedDocument(document);
        setIsModalVisible(true);
    };

    // Xử lý đóng modal
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSelectedDocument(null);
    };

    // Xử lý đồng ý lý do không tham gia
    const handleApproveReason = async () => {
        if (!selectedDocument) return;

        try {
            setReasonModalLoading(true);
            // TODO: Gọi API để phê duyệt lý do không tham gia
            // await AuctionServices.approveNonParticipation(selectedDocument.auctionDocumentsId);

            toast.success("Đã phê duyệt lý do không tham gia!");
            handleCloseModal();
            getListAuctionDocument(); // Refresh danh sách
        } catch (error) {
            toast.error("Lỗi khi phê duyệt lý do không tham gia!");
            console.error(error);
        } finally {
            setReasonModalLoading(false);
        }
    };

    // Xử lý từ chối lý do không tham gia
    const handleRejectReason = async () => {
        if (!selectedDocument) return;

        try {
            setReasonModalLoading(true);
            // TODO: Gọi API để từ chối lý do không tham gia
            // await AuctionServices.rejectNonParticipation(selectedDocument.auctionDocumentsId);

            toast.success("Đã từ chối lý do không tham gia!");
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
                "Tên tài sản",
                "Phí đăng ký",
                "Chữ ký",
                "Ghi chú",
            ];

            const csvRows = [
                headers.join(","), // Header row
                ...auctionDocuments.map((doc) => {
                    const row = [
                        doc.numericalOrder || "-",
                        `"${doc.name}"`,
                        doc.citizenIdentification,
                        `"${doc.tagName}"`,
                        `${doc.registrationFee.toLocaleString("vi-VN")} VND`,
                        "", // Chữ ký để trống
                        `"${doc.note || ""}"`, // Ghi chú từ trường note
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
            link.setAttribute("download", "auction_documents.csv");
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
            render: (numericalOrder: number | null) => numericalOrder || "-",
        },
        {
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "CMND/CCCD",
            dataIndex: "citizenIdentification",
            key: "citizenIdentification",
        },
        {
            title: "Tên tài sản",
            dataIndex: "tagName",
            key: "tagName",
        },
        {
            title: "Phí đăng ký",
            dataIndex: "registrationFee",
            key: "registrationFee",
            render: (registrationFee: number) =>
                `${registrationFee.toLocaleString("vi-VN")} VND`,
        },
        {
            title: "Trạng thái cọc",
            dataIndex: "statusDeposit",
            key: "statusDeposit",
            render: (statusDeposit: number) => {
                const color = statusDeposit === 0 ? "red" : "green";
                const text = statusDeposit === 0 ? "Chưa cọc" : "Đã cọc";
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Trạng thái đơn",
            dataIndex: "statusTicket",
            key: "statusTicket",
            render: (statusTicket: number) => {
                let color = "red";
                let text = "Chưa chuyển tiền";
                if (statusTicket === 1) {
                    color = "blue";
                    text = "Đã chuyển tiền";
                } else if (statusTicket === 2) {
                    color = "cyan";
                    text = "Đã ký phiếu";
                } else if (statusTicket === 3) {
                    color = "green";
                    text = "Đã hoàn tiền";
                }
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Lý do không tham gia",
            key: "nonParticipationReason",
            width: 180,
            render: (record: AuctionDocument) => (
                <Button
                    type="primary"
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => handleShowReasonModal(record)}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Xem lý do
                </Button>
            ),
        },
    ];

    return (
        <section className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
            <div className="w-full mx-auto bg-white shadow-lg rounded-xl p-6">
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
                            disabled={!isAfterRegisterEndDate || auctionDocuments.length === 0}
                        >
                            Tải danh sách điểm danh
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={auctionDocuments}
                    rowKey="auctionDocumentsId"
                    loading={loading}
                    pagination={{
                        current: searchParams.PageNumber,
                        pageSize: searchParams.PageSize,
                        total: totalCount,
                        showSizeChanger: true,
                        pageSizeOptions: ["8", "16", "24", "32"],
                        onChange: (page, pageSize) =>
                            setSearchParams((prev) => ({
                                ...prev,
                                PageNumber: page,
                                PageSize: pageSize,
                            })),
                    }}
                    scroll={{ x: "max-content" }}
                    className="border border-teal-100 rounded-lg"
                />
            </div>

            {/* Modal hiển thị lý do không tham gia */}
            <Modal
                title="Lý do không tham gia đấu giá"
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
                            Từ chối
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleApproveReason}
                            loading={reasonModalLoading}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Đồng ý
                        </Button>
                    </Space>
                }
            >
                {selectedDocument && (
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Thông tin người tham gia:
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-gray-600">Họ tên:</span>
                                    <span className="ml-2 font-medium">{selectedDocument.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">CMND/CCCD:</span>
                                    <span className="ml-2 font-medium">{selectedDocument.citizenIdentification}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Số báo danh:</span>
                                    <span className="ml-2 font-medium">{selectedDocument.numericalOrder || "Chưa có"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-600">Tài sản:</span>
                                    <span className="ml-2 font-medium">{selectedDocument.tagName}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-yellow-800 mb-2">
                                Lý do không tham gia:
                            </h3>
                            <div className="text-gray-700">
                                {selectedDocument.note || "Không có lý do cụ thể được cung cấp."}
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-800 mb-2">
                                Trạng thái hiện tại:
                            </h3>
                            <div className="flex gap-2">
                                <Tag color={selectedDocument.statusDeposit === 0 ? "red" : "green"}>
                                    {selectedDocument.statusDeposit === 0 ? "Chưa cọc" : "Đã cọc"}
                                </Tag>
                                <Tag color={
                                    selectedDocument.statusTicket === 0 ? "red" :
                                        selectedDocument.statusTicket === 1 ? "blue" :
                                            selectedDocument.statusTicket === 2 ? "cyan" : "green"
                                }>
                                    {selectedDocument.statusTicket === 0 ? "Chưa chuyển tiền" :
                                        selectedDocument.statusTicket === 1 ? "Đã chuyển tiền" :
                                            selectedDocument.statusTicket === 2 ? "Đã ký phiếu" : "Đã hoàn tiền"}
                                </Tag>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
};

export default ListAuctionDocumentSuccesRegister;