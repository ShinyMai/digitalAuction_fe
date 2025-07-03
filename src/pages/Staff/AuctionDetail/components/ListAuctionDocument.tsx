import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AuctionServices from "../../../../services/AuctionServices";
import type { AuctionDocument, AuctionDateModal } from "../../Modals";
import { Table, Input, Space, Tag, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, EllipsisOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

interface SearchParams {
    name?: string;
    PageNumber?: number;
    PageSize?: number;
    CitizenIdentification?: string;
    TagName?: string;
    SortBy?: string;
}

interface Props {
    auctionId?: string;
    auctionDateModals?: AuctionDateModal;
}

const ListAuctionDocument = ({ auctionId, auctionDateModals }: Props) => {
    const [searchParams, setSearchParams] = useState<SearchParams>({
        PageNumber: 1,
        PageSize: 8,
    });
    const [auctionDocuments, setAuctionDocuments] = useState<AuctionDocument[]>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchValues, setSearchValues] = useState<{
        name?: string;
        CitizenIdentification?: string;
        TagName?: string;
    }>({});

    // Kiểm tra nếu ngày hiện tại nằm trong khoảng registerOpenDate đến registerEndDate
    const isWithinRegistrationPeriod =
        auctionDateModals?.registerOpenDate && auctionDateModals?.registerEndDate
            ? dayjs().isAfter(dayjs(auctionDateModals.registerOpenDate)) &&
            dayjs().isBefore(dayjs(auctionDateModals.registerEndDate))
            : false;

    // Kiểm tra nếu ngày hiện tại lớn hơn auctionEndDate
    const isAfterAuctionEndDate = auctionDateModals?.auctionEndDate
        ? dayjs().isAfter(dayjs(auctionDateModals.auctionEndDate))
        : false;

    // Kiểm tra nếu ngày hiện tại lớn hơn registerEndDate
    const isAfterRegisterEndDate = auctionDateModals?.registerEndDate
        ? dayjs().isAfter(dayjs(auctionDateModals.registerEndDate))
        : false;

    useEffect(() => {
        getListAuctionDocument();
    }, [searchParams, auctionId]);

    const getListAuctionDocument = async () => {
        try {
            setLoading(true);
            const params: SearchParams = {
                PageNumber: searchParams.PageNumber || 1,
                PageSize: searchParams.PageSize || 8,
                name: searchParams.name,
                CitizenIdentification: searchParams.CitizenIdentification,
                TagName: searchParams.TagName,
                SortBy: searchParams.SortBy,
            };
            const response = await AuctionServices.getListAuctionDocument(params, auctionId);
            setAuctionDocuments(response.data.auctionDocuments);
            setTotalCount(response.data.totalCount);
        } catch (error) {
            toast.error("Lỗi khi tải danh sách tài liệu đấu giá!");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchParams((prev) => ({
            ...prev,
            ...searchValues,
            PageNumber: 1, // Reset về trang 1 khi tìm kiếm
        }));
    };

    const handleInputChange = (key: keyof SearchParams, value: string) => {
        setSearchValues((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const handleAction = async (action: string, record: AuctionDocument) => {
        try {
            //   if (action === "receiveTicket") {
            //     await AuctionServices.updateAuctionDocumentStatus(record.auctionDocumentsId, {
            //       statusTicket: 1,
            //     });
            //     toast.success("Đã xác nhận nhận phiếu!");
            //   } else if (action === "receiveDeposit") {
            //     await AuctionServices.updateAuctionDocumentStatus(record.auctionDocumentsId, {
            //       statusDeposit: true,
            //     });
            //     toast.success("Đã xác nhận nhận cọc!");
            //   }
            getListAuctionDocument();
        } catch (error) {
            toast.error(`Lỗi khi thực hiện ${action === "receiveTicket" ? "nhận phiếu" : "nhận cọc"}!`);
            console.error(error);
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
                "Trạng thái tiền đặt trước",
                isAfterAuctionEndDate ? "Trạng thái hoàn tiền" : null,
                "Trạng thái nhận đơn",
            ].filter((header) => header !== null);

            const csvRows = [
                headers.join(","), // Header row
                ...auctionDocuments.map((doc) => {
                    const row = [
                        doc.numericalOrder || "-",
                        `"${doc.name}"`,
                        doc.citizenIdentification,
                        `"${doc.tagName}"`,
                        `${doc.registrationFee.toLocaleString("vi-VN")} VND`,
                        doc.statusDeposit ? "Đã nộp" : "Chưa nộp",
                        isAfterAuctionEndDate ? (doc.statusRefundDeposit ? "Đã hoàn" : "Chưa hoàn") : null,
                        doc.statusTicket === 1 ? "Đã xác nhận" : "Chưa xác nhận",
                    ].filter((cell) => cell !== null);
                    return row.join(",");
                }),
            ];

            const csvContent = csvRows.join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
            title: "STT",
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
            render: (registrationFee: number) => `${registrationFee.toLocaleString("vi-VN")} VND`,
        },
        {
            title: "Trạng thái tiền đặt trước",
            dataIndex: "statusDeposit",
            key: "statusDeposit",
            render: (statusDeposit: boolean) => (
                <Tag color={statusDeposit ? "green" : "red"}>
                    {statusDeposit ? "Đã nộp" : "Chưa nộp"}
                </Tag>
            ),
        },
        ...(isAfterAuctionEndDate
            ? [
                {
                    title: "Trạng thái hoàn tiền",
                    dataIndex: "statusRefundDeposit",
                    key: "statusRefundDeposit",
                    render: (statusRefundDeposit: boolean) => (
                        <Tag color={statusRefundDeposit ? "green" : "red"}>
                            {statusRefundDeposit ? "Đã hoàn" : "Chưa hoàn"}
                        </Tag>
                    ),
                },
            ]
            : []),
        {
            title: "Trạng thái nhận đơn",
            dataIndex: "statusTicket",
            key: "statusTicket",
            render: (statusTicket: number) => {
                const statusMap: { [key: number]: { color: string; text: string } } = {
                    0: { color: "gray", text: "Chưa xác nhận" },
                    1: { color: "blue", text: "Đã xác nhận" },
                };
                const { color, text } = statusMap[statusTicket] || { color: "gray", text: "Không xác định" };
                return <Tag color={color}>{text}</Tag>;
            },
        },
        {
            title: "Chức năng",
            key: "action",
            render: (_: any, record: AuctionDocument) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item
                                key="receiveTicket"
                                onClick={() => handleAction("receiveTicket", record)}
                                disabled={record.statusTicket === 1 || !isWithinRegistrationPeriod}
                            >
                                Đã nhận phiếu
                            </Menu.Item>
                            <Menu.Item
                                key="receiveDeposit"
                                onClick={() => handleAction("receiveDeposit", record)}
                                disabled={record.statusDeposit || !isWithinRegistrationPeriod}
                            >
                                Đã nhận cọc
                            </Menu.Item>
                        </Menu>
                    }
                    trigger={["click"]}
                >
                    <Button
                        type="text"
                        icon={<EllipsisOutlined />}
                        className="text-blue-600 hover:text-blue-800"
                    />
                </Dropdown>
            ),
        },
    ];

    return (
        <section className="w-full min-h-screen p-6 bg-gradient-to-b from-blue-50 to-teal-50">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6">
                <h1 className="text-2xl font-bold text-blue-800 mb-6">Danh sách đăng ký tham gia</h1>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h2 className="text-lg font-semibold text-blue-800 mb-4">Tìm kiếm</h2>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <Input
                            placeholder="Tìm kiếm theo tên"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchValues.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full sm:w-1/4"
                        />
                        <Input
                            placeholder="Tìm kiếm theo CMND/CCCD"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchValues.CitizenIdentification}
                            onChange={(e) => handleInputChange("CitizenIdentification", e.target.value)}
                            className="w-full sm:w-1/4"
                        />
                        <Input
                            placeholder="Tìm kiếm theo tên tài sản"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchValues.TagName}
                            onChange={(e) => handleInputChange("TagName", e.target.value)}
                            className="w-full sm:w-1/4"
                        />
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            className="bg-teal-500 hover:bg-teal-600 w-full sm:w-auto"
                        >
                            Tìm kiếm
                        </Button>
                        <Button
                            type="primary"
                            onClick={handleDownload}
                            icon={<DownloadOutlined />}
                            className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
                            disabled={!isAfterRegisterEndDate}
                        >
                            Tải danh sách
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
                            setSearchParams((prev) => ({ ...prev, PageNumber: page, PageSize: pageSize })),
                    }}
                    scroll={{ x: "max-content" }}
                    className="border border-teal-100 rounded-lg"
                />
            </div>
        </section>
    );
};

export default ListAuctionDocument;