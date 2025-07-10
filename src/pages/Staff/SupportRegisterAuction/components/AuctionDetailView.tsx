/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, Card, Form, Input, Table, Typography, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import type { AuctionDataDetail, AuctionAsset } from "../../../Staff/Modals";
import { formatNumber } from "../../../../utils/numberFormat";

const { Title, Text } = Typography;

interface RegisterForm {
    bankAccount: string;
    citizenIdentification: string;
    phoneNumber: string;
    bankAccountNumber: string;
    bankBranch: string;

}

const AuctionDetailView = ({
    auctionDetail,
    loading,
    onBack,
    onSubmit,
}: {
    auctionDetail: AuctionDataDetail | null;
    loading: boolean;
    onBack: () => void;
    onSubmit: (values: RegisterForm, selectedAssetIds: string[]) => void;
}) => {
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);

    const columns = [
        {
            title: "Tên tài sản",
            dataIndex: "tagName",
            key: "tagName",
        },
        {
            title: "Giá khởi điểm",
            dataIndex: "startingPrice",
            key: "startingPrice",
            render: (price: number, record: AuctionAsset) => `${formatNumber(price)}/ ${record.unit}`,
        },
    ];

    const handleSubmit = async (values: RegisterForm) => {
        if (selectedRowKeys.length === 0) {
            toast.error("Vui lòng chọn ít nhất một tài sản đấu giá!");
            return;
        }
        onSubmit(values, selectedRowKeys);
    };

    // Xử lý phân trang phía client
    const paginatedAssets = auctionDetail?.listAuctionAssets
        ? auctionDetail.listAuctionAssets.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        )
        : [];

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    return (
        <motion.div
            key="detail"
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={onBack}
                className="mb-4 bg-gray-200 text-gray-800 hover:bg-gray-300"
                size="large"
            >
                Quay lại
            </Button>

            {loading && <Spin size="large" className="flex justify-center my-8" />}
            {auctionDetail && !loading && (
                <div className="flex flex-row gap-4 w-full">
                    {/* Thông Tin Buổi Đấu Giá + Danh Sách Tài Sản Đấu Giá */}
                    <Card className="shadow-md rounded-lg flex-1 min-w-0">
                        <div className="flex flex-col">
                            {/* Thông Tin Buổi Đấu Giá */}
                            <div className="mb-6">
                                <Title level={4} className="text-gray-800 mb-4">
                                    Thông Tin Buổi Đấu Giá
                                </Title>
                                <div className="space-y-2">
                                    <div>
                                        <Text strong>Tên buổi đấu giá: </Text>
                                        <Text>{auctionDetail.auctionName}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Danh mục: </Text>
                                        <Text>{auctionDetail.categoryName}</Text>
                                    </div>
                                    <div>
                                        <Text strong>Mô tả: </Text>
                                        <Text>{auctionDetail.auctionDescription || "-"}</Text>
                                    </div>
                                </div>
                            </div>

                            {/* Danh Sách Tài Sản Đấu Giá */}
                            {auctionDetail.listAuctionAssets && auctionDetail.listAuctionAssets.length > 0 && (
                                <div>
                                    <Title level={4} className="text-gray-800 mb-4">
                                        Danh Sách Tài Sản Đấu Giá
                                    </Title>
                                    <Table
                                        rowSelection={{
                                            type: "checkbox",
                                            selectedRowKeys,
                                            onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys as string[]),
                                        }}
                                        columns={columns}
                                        dataSource={paginatedAssets}
                                        rowKey="auctionAssetsId"
                                        pagination={{
                                            current: currentPage,
                                            pageSize: pageSize,
                                            total: auctionDetail.listAuctionAssets.length,
                                            showSizeChanger: true,
                                            pageSizeOptions: ["5", "10", "20"],
                                        }}
                                        onChange={handleTableChange}
                                        locale={{ emptyText: "Không có tài sản" }}
                                        className="w-full rounded-lg overflow-hidden"
                                        rowClassName="hover:bg-blue-50 transition-colors duration-200"
                                    />
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Thông Tin Đăng Ký */}
                    <Card className="shadow-md rounded-lg flex-1 min-w-0">
                        <Title level={4} className="text-gray-800 mb-4">
                            Thông Tin Đăng Ký
                        </Title>
                        <Form
                            form={form}
                            onFinish={handleSubmit}
                            layout="vertical"
                            className="w-full"
                        >
                            <Form.Item
                                name="bankAccount"
                                label="Tên người thụ hưởng"
                                rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                            >
                                <Input placeholder="Nhập họ và tên" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="citizenIdentification"
                                label="Số căn cước"
                                rules={[
                                    { required: true, message: "Vui lòng nhập số căn cước!" },
                                    { pattern: /^[0-9]{12}$/, message: "Số căn cước phải có 12 chữ số!" },
                                ]}
                            >
                                <Input placeholder="Nhập số căn cước" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="bankAccountNumber"
                                label="Số tài khoản ngân hàng"
                                rules={[{ required: true, message: "Vui lòng nhập số tài khoản ngân hàng!" }]}
                            >
                                <Input placeholder="Nhập số tài khoản ngân hàng" size="large" />
                            </Form.Item>
                            <Form.Item
                                name="bankBranch"
                                label="Tên chi nhánh ngân hàng"
                                rules={[{ required: true, message: "Vui lòng nhập tên ngân hàng!" }]}
                            >
                                <Input placeholder="Nhập tên ngân hàng" size="large" />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="w-full bg-blue-500 hover:bg-blue-600"
                                    size="large"
                                    disabled={selectedRowKeys.length === 0}
                                >
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            )}
        </motion.div>
    );
};

export default AuctionDetailView;