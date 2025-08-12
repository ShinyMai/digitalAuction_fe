/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
} from "antd";
import {
    SearchOutlined,
    DownloadOutlined,
    CheckOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons";

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

const ListAuctionDocumentCancelRefund = ({
    auctionId,
}: Props) => {
    const [searchParams, setSearchParams] =
        useState<SearchParams>({
            PageNumber: 1,
            PageSize: 8,
        });
    const [auctionDocuments, setAuctionDocuments] = useState<
        AuctionDocument[]
    >([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchValues, setSearchValues] = useState<{
        name?: string;
        CitizenIdentification?: string;
        TagName?: string;
    }>({});
    const [isRefundMode, setIsRefundMode] = useState<boolean>(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState<boolean>(false);

    useEffect(() => {
        getListAuctionDocument();
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
                StatusDeposit: searchParams.StatusDeposit,
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
    };

    const handleSearch = () => {
        setSearchParams((prev) => ({
            ...prev,
            ...searchValues,
            PageNumber: 1, // Reset về trang 1 khi tìm kiếm
        }));
    };

    const handleInputChange = (
        key: keyof SearchParams,
        value: string
    ) => {
        setSearchValues((prev) => ({
            ...prev,
            [key]: value || undefined,
        }));
    };

    const handleDownload = async () => {
        try {
            const response = await AuctionServices.exportRefundList({ auctionId });
            console.log("Response data:", response);

            if (response && response.data) {
                // Check if response contains base64 data
                if (response.data.base64 && response.data.fileName && response.data.contentType) {
                    // Convert base64 to blob
                    const base64Data = response.data.base64;
                    const byteCharacters = atob(base64Data);
                    const byteNumbers = new Array(byteCharacters.length);
                    for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    const byteArray = new Uint8Array(byteNumbers);
                    const blob = new Blob([byteArray], { type: response.data.contentType });

                    // Create download link
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = response.data.fileName;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    toast.success("Tải danh sách thành công!");
                } else {
                    toast.success(response.message || "Xuất file thành công!");
                }
            }
        } catch (error) {
            toast.error("Lỗi khi tải danh sách!");
            console.error(error);
        }
    };

    const handleRefundModeToggle = () => {
        setIsRefundMode(true);
    };

    const handleConfirmRefund = () => {
        if (selectedRowKeys.length === 0) {
            setIsErrorModalVisible(true);
        } else {
            setIsConfirmModalVisible(true);
        }
    };

    const handleConfirmModalOk = () => {
        console.log("Selected auction document IDs:", selectedRowKeys);
        setIsRefundMode(false);
        setSelectedRowKeys([]);
        setIsConfirmModalVisible(false);
    };

    const handleConfirmModalCancel = () => {
        setIsConfirmModalVisible(false);
    };

    const handleErrorModalOk = () => {
        setIsErrorModalVisible(false);
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
                            value={searchValues.name}
                            onChange={(e) =>
                                handleInputChange("Name", e.target.value)
                            }
                            className="w-full sm:w-1/4"
                        />
                        <Input
                            placeholder="Tìm kiếm theo CMND/CCCD"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchValues.CitizenIdentification}
                            onChange={(e) =>
                                handleInputChange("CitizenIdentification", e.target.value)
                            }
                            className="w-full sm:w-1/4"
                        />
                        <Input
                            placeholder="Tìm kiếm theo tên tài sản"
                            prefix={<SearchOutlined />}
                            allowClear
                            value={searchValues.TagName}
                            onChange={(e) =>
                                handleInputChange("TagName", e.target.value)
                            }
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
                                >
                                    Xác nhận
                                </Button>
                                <Button
                                    type="link"
                                    onClick={handleCancelRefund}
                                    icon={<CloseOutlined />}
                                    className="bg-red-500 hover:bg-red-600 rounded-l-none flex-1"
                                />
                            </div>
                        ) : (
                            <Button
                                type="primary"
                                onClick={handleRefundModeToggle}
                                className="bg-yellow-500 hover:bg-yellow-600 w-full sm:w-auto"
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
                <Modal
                    title="Thông báo"
                    open={isErrorModalVisible}
                    onCancel={handleErrorModalOk}
                    footer={null}
                    closeIcon={<CloseOutlined />}
                    className="flex items-center justify-center"
                    bodyStyle={{ height: '200px', display: 'flex', justifyContent: 'center' }}
                >
                    <div className="flex flex-col items-center justify-center text-center gap-4">
                        <div className="text-red-600 text-4xl"><ExclamationCircleOutlined /></div>
                        <p className="text-lg text-gray-700 font-medium">
                            Bạn chưa lựa chọn danh sách khách hàng đã được hoàn tiền.
                        </p>
                    </div>
                </Modal>
                <Modal
                    title="Xác nhận hoàn tiền"
                    open={isConfirmModalVisible}
                    onOk={handleConfirmModalOk}
                    onCancel={handleConfirmModalCancel}
                    okText="Xác nhận"
                    cancelText="Hủy"
                    okButtonProps={{ className: "bg-teal-500 hover:bg-teal-600" }}
                >
                    <p>Bạn đã hoàn lại tiền cọc và tiền mua hồ sơ cho những khách hàng này rồi đúng chứ?</p>
                </Modal>
            </div>
        </section>
    );
};

export default ListAuctionDocumentCancelRefund;