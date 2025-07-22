/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, Table, Typography, Spin, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";
import { formatNumber } from "../../../../utils/numberFormat";
import type { AuctionRoundModals } from "../../Modals";

const { Title, Text } = Typography;

export type AuctionRoundPrice = {
    AuctionRoundId: string;
    UserName: string;
    CitizenIdentification: string;
    RecentLocation: string;
    TagName: string;
    AuctionPrice: string;
};

// Thêm function xử lý xác nhận người thắng
const handleConfirmWinner = (price: AuctionRoundPrice) => {
    console.log("Xác nhận người thắng:", price);
    // TODO: Implement winner confirmation logic
};

interface AuctionAsset {
    auctionAssetsId: string;
    tagName: string;
}

interface AuctioneerCreateAuctionRoundProps {
    auctionRoundPrices: AuctionRoundPrice[];
    auctionAssets: AuctionAsset[];
    loading?: boolean;
    auctionRoundData: AuctionRoundModals;
}

const AuctioneerCreateAuctionRound = ({ auctionRoundPrices, loading = false, auctionRoundData }: AuctioneerCreateAuctionRoundProps) => {
    const [highestPrices, setHighestPrices] = useState<AuctionRoundPrice[]>([]);

    useEffect(() => {
        console.log("Current Round Data:", auctionRoundData);
    }, [auctionRoundData]);

    // Tìm giá cao nhất cho từng loại tài sản
    useEffect(() => {
        if (auctionRoundPrices.length > 0) {
            const highestByTagName = Object.values(
                auctionRoundPrices.reduce((acc: { [key: string]: AuctionRoundPrice }, current) => {
                    const tag = current.TagName;
                    if (!acc[tag] || parseFloat(current.AuctionPrice) > parseFloat(acc[tag].AuctionPrice)) {
                        acc[tag] = current;
                    }
                    return acc;
                }, {})
            );
            setHighestPrices(highestByTagName);
        } else {
            setHighestPrices([]);
        }
    }, [auctionRoundPrices]);

    // Cột cho bảng bên phải
    const columns: ColumnsType<AuctionRoundPrice> = [
        {
            title: "STT",
            key: "index",
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: "Tên người dùng",
            dataIndex: "UserName",
            key: "UserName",
            width: 120,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="truncate block">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Số căn cước",
            dataIndex: "CitizenIdentification",
            key: "CitizenIdentification",
            width: 120,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="truncate block">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Địa chỉ",
            dataIndex: "RecentLocation",
            key: "RecentLocation",
            width: 150,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="truncate block">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Tên tài sản",
            dataIndex: "TagName",
            key: "TagName",
            width: 120,
            render: (text: string) => (
                <Tooltip title={text}>
                    <span className="truncate block">{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "Giá đấu",
            dataIndex: "AuctionPrice",
            key: "AuctionPrice",
            width: 100,
            render: (price: string) => (
                <Tooltip title={formatNumber(parseFloat(price))}>
                    <span className="truncate block">{formatNumber(parseFloat(price))}</span>
                </Tooltip>
            ),
        },
    ];

    return (
        <section className="w-full overflow-hidden box-border h-full">
            <style>
                {`
                    .truncate {
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .scroll-container {
                        max-height: calc(100vh - 350px);
                        overflow-y: auto;
                        scrollbar-width: thin;
                        scrollbar-color: #93C5FD transparent;
                    }
                    .scroll-container::-webkit-scrollbar {
                        width: 6px;
                    }
                    .scroll-container::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .scroll-container::-webkit-scrollbar-thumb {
                        background-color: #93C5FD;
                        border-radius: 3px;
                    }
                    .price-card {
                        transition: all 0.3s ease;
                        cursor: pointer;
                    }
                    .price-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    }
                    .ant-table-cell {
                        font-size: 14px !important;
                        padding: 12px 16px !important;
                    }
                    .ant-table-thead > tr > th {
                        background: #F8FAFC !important;
                        font-weight: 600 !important;
                    }
                    .ant-table-row:hover {
                        background: #EFF6FF !important;
                    }
                `}
            </style>
            <div className="flex flex-col lg:flex-row h-full box-border gap-4">
                {/* Phần bên trái: Danh sách giá cao nhất cho từng loại tài sản */}
                <motion.div
                    className="w-full lg:w-1/3 h-full max-h-full flex flex-col overflow-hidden"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card
                        className="flex-1 shadow-lg rounded-xl overflow-hidden box-border flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50"
                        bordered={false}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Title level={4} className="text-gray-800 m-0 text-lg flex items-center gap-2">
                                <span className="bg-blue-100 p-2 rounded-lg">🏆</span>
                                Giá Đấu Cao Nhất
                            </Title>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center flex-1">
                                <Spin size="large" />
                            </div>
                        )}

                        {!loading && highestPrices.length === 0 && (
                            <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
                                <span className="text-4xl mb-2">📊</span>
                                <Text>Chưa có dữ liệu giá đấu</Text>
                            </div>
                        )}

                        {!loading && highestPrices.length > 0 && (
                            <div className={`space-y-3 ${highestPrices.length > 2 ? 'scroll-container pr-2' : ''}`}>
                                {highestPrices.map((price, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                        className="price-card bg-white p-4 rounded-xl border border-blue-100"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="bg-blue-100 p-2 rounded-lg">
                                                <span className="text-lg">💎</span>
                                            </div>
                                            <div className="flex-1">
                                                <Text className="block font-semibold text-blue-600">{price.TagName}</Text>
                                                <Text className="text-sm text-gray-500">{price.UserName}</Text>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                                            <Text className="text-gray-600">Số CCCD:</Text>
                                            <Text className="font-medium">{price.CitizenIdentification}</Text>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <Text className="text-gray-600">Giá đấu:</Text>
                                            <Text className="text-lg font-semibold text-green-600">
                                                {formatNumber(parseFloat(price.AuctionPrice))} VND
                                            </Text>
                                        </div>
                                        <motion.div
                                            className="mt-4 pt-3 border-t border-gray-100"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <button
                                                onClick={() => handleConfirmWinner(price)}
                                                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                                                text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] 
                                                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 
                                                flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                                            >
                                                <span className="text-lg">👑</span>
                                                Xác nhận người thắng
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Phần bên phải: Danh sách AuctionRoundPrice */}
                <motion.div
                    className="w-full lg:w-2/3 h-full max-h-full flex flex-col overflow-hidden"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card
                        className="flex-1 shadow-lg rounded-xl overflow-hidden box-border flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50"
                        bordered={false}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <Title level={4} className="text-gray-800 m-0 text-lg flex items-center gap-2">
                                <span className="bg-indigo-100 p-2 rounded-lg">📋</span>
                                Danh Sách Giá Đấu
                            </Title>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <Table
                                columns={columns}
                                dataSource={auctionRoundPrices}
                                loading={loading}
                                rowKey="AuctionRoundId"
                                locale={{
                                    emptyText: (
                                        <div className="flex flex-col items-center justify-center py-8">
                                            <span className="text-4xl mb-2">📊</span>
                                            <Text>Không có dữ liệu</Text>
                                        </div>
                                    )
                                }}
                                className="w-full overflow-hidden h-full"
                                rowClassName="cursor-pointer"
                                pagination={false}
                                scroll={{ y: "calc(100vh - 450px)" }}
                            />
                        </div>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default AuctioneerCreateAuctionRound;