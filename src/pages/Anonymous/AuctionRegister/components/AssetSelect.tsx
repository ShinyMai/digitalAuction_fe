import React, { useState } from "react";
import { Table, Tooltip, Pagination, Button, message } from "antd";
import {
    TagOutlined,
    ApartmentOutlined,
    FileTextOutlined,
    DollarOutlined,
    WalletOutlined,
    CreditCardOutlined,
    PictureOutlined,
} from "@ant-design/icons";

interface Props {
    listAsset?: DataType[];
    onGetAssetSelect: (value: string) => void;
    onNext: (assetId: string) => void;
    onPrev: () => void;
}

interface DataType {
    auctionAssetsId: string;
    tagName: string;
    startingPrice: string;
    unit: string;
    deposit: string;
    registrationFee: string;
    description?: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    auctionId: string;
    auction?: string;
    imageUrl?: string;
}

const formatVND = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(number);
};

const AssetSelect = ({ listAsset, onGetAssetSelect, onNext, onPrev }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

    const truncateDescription = (text?: string, maxLength: number = 100) => {
        if (!text) return "";
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + "...";
    };

    const columns = [
        {
            title: (
                <div className="flex items-center gap-2">
                    <PictureOutlined className="text-blue-600" />
                    Hình ảnh
                </div>
            ),
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (url: string) =>
                url ? (
                    <img src={url} alt="Asset" className="w-16 h-16 object-cover rounded" />
                ) : (
                    <div className="text-gray-400">Không có hình</div>
                ),
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <TagOutlined className="text-blue-600" />
                    Tên Tài Sản
                </div>
            ),
            dataIndex: "tagName",
            key: "tagName",
            render: (text: string) => <span className="text-teal-700">{text}</span>,
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <ApartmentOutlined className="text-blue-600" />
                    Đơn Vị
                </div>
            ),
            dataIndex: "unit",
            key: "unit",
            render: (text: string) => text || "-",
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <FileTextOutlined className="text-blue-600" />
                    Mô Tả
                </div>
            ),
            dataIndex: "description",
            key: "description",
            render: (text: string) => (
                <Tooltip title={text} placement="top" color="#4b5563">
                    <div className="cursor-pointer hover:text-blue-600 text-gray-600">
                        {truncateDescription(text)}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <DollarOutlined className="text-blue-600" />
                    Giá Khởi Điểm
                </div>
            ),
            dataIndex: "startingPrice",
            key: "startingPrice",
            render: (text: string) => (
                <span className="text-teal-600 font-medium">{formatVND(text)}</span>
            ),
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <WalletOutlined className="text-blue-600" />
                    Tiền Đặt Trước
                </div>
            ),
            dataIndex: "deposit",
            key: "deposit",
            render: (text: string) => (
                <span className="text-teal-600 font-medium">{formatVND(text)}</span>
            ),
        },
        {
            title: (
                <div className="flex items-center gap-2">
                    <CreditCardOutlined className="text-blue-600" />
                    Phí Đăng Ký
                </div>
            ),
            dataIndex: "registrationFee",
            key: "registrationFee",
            render: (text: string) => (
                <span className="text-teal-600 font-medium">{formatVND(text)}</span>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: DataType) => (
                <Button
                    type="primary"
                    className="bg-teal-500 hover:bg-teal-600"
                    onClick={() => handleGetValueAssetAndNext(record.auctionAssetsId)}
                >
                    Mua hồ sơ
                </Button>
            ),
        },
    ];

    const paginatedData = listAsset?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleGetValueAssetAndNext = (value: string) => {
        onGetAssetSelect(value)
        onNext(value)
    }

    return (
        <div className="w-full h-full pt-6 px-4 bg-gradient-to-b from-blue-50 to-teal-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center bg-gradient-to-r from-blue-200 to-teal-200 p-4 rounded-lg shadow-md">
                Lựa Chọn Các Tài Sản Đấu Giá
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <Table
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="auctionAssetsId"
                    pagination={false}
                    className="custom-table"
                    rowClassName="hover:bg-blue-50 transition-colors duration-200"
                />
                {listAsset?.length && listAsset?.length > pageSize && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={listAsset?.length || 0}
                            onChange={(page) => setCurrentPage(page)}
                            showSizeChanger={false}
                            className="pagination-custom"
                        />
                    </div>
                )}
            </div>
            <div className="mt-6 flex justify-between">
                {/* <Button className="bg-gray-200 hover:bg-gray-300" onClick={onPrev}>
                    Quay Lại
                </Button> */}
            </div>
        </div>
    );
};

export default AssetSelect;