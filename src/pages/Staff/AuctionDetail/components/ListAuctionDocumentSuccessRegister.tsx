/* eslint-disable @typescript-eslint/no-explicit-any */
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
} from "antd";
import {
    SearchOutlined,
    DownloadOutlined,
    CheckOutlined,
    CloseOutlined,
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
    const [isRefundMode, setIsRefundMode] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    // Kiểm tra nếu ngày hiện tại lớn hơn hoặc bằng auctionStartDate
    const isAfterOrOnAuctionStartDate =
        auctionDateModals?.auctionStartDate
            ? dayjs().isAfter(dayjs(auctionDateModals.auctionStartDate)) ||
            dayjs().isSame(dayjs(auctionDateModals.auctionStartDate), "day")
            : false;

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


    const handleRefundModeToggle = () => {
        setIsRefundMode(true);
    };

    const handleConfirmRefund = () => {
        console.log("Selected auction document IDs:", selectedRowKeys);
        // Reset trạng thái sau khi xác nhận
        setIsRefundMode(false);
        setSelectedRowKeys([]);
    };

    const handleCancelRefund = () => {
        setIsRefundMode(false);
        setSelectedRowKeys([]);
    };

    const rowSelection = isRefundMode
        ? {
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
                setSelectedRowKeys(newSelectedRowKeys);
            },
            getCheckboxProps: (record: AuctionDocument) => ({
                disabled: record.statusTicket === 3, // Vô hiệu hóa checkbox cho các bản ghi đã hoàn tiền
            }),
        }
        : undefined;

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
                            Tải danh sách
                        </Button>
                        {isRefundMode ? (
                            <div className="flex w-full sm:w-auto">
                                <Button
                                    type="primary"
                                    onClick={handleConfirmRefund}
                                    icon={<CheckOutlined />}
                                    className="bg-blue-500 hover:bg-blue-600 rounded-r-none border-r-0 flex-1 mr-2"
                                    disabled={!isAfterOrOnAuctionStartDate || auctionDocuments.length === 0}
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    type="link"
                                    onClick={handleCancelRefund}
                                    icon={<CloseOutlined />}
                                    className="bg-red-500 hover:bg-red-600 rounded-l-none flex-1"
                                    disabled={!isAfterOrOnAuctionStartDate || auctionDocuments.length === 0}
                                />
                            </div>
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleRefundModeToggle}
                                className="bg-yellow-500 hover:bg-yellow-600 w-full sm:w-auto"
                                disabled={!isAfterOrOnAuctionStartDate || auctionDocuments.length === 0}
                            >
                                Hoàn tiền
                            </Button>
                        )}
                    </div>
                </div>
                <Table
                    rowSelection={rowSelection}
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
        </section>
    );
};

export default ListAuctionDocumentSuccesRegister;