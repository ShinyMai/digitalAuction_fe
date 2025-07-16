/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Card, Table, Typography, Spin, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { motion } from "framer-motion";
import { formatNumber } from "../../../../utils/numberFormat";

const { Title, Text } = Typography;

export type AuctionRoundPrice = {
    AuctionRoundId: string;
    UserName: string;
    CitizenIdentification: string;
    RecentLocation: string;
    TagName: string;
    AuctionPrice: string;
};

interface AuctioneerCreateAuctionRoundProps {
    auctionRoundPrices: AuctionRoundPrice[];
    loading?: boolean;
}

const AuctioneerCreateAuctionRound = ({ auctionRoundPrices, loading = false }: AuctioneerCreateAuctionRoundProps) => {
    const [highestPrices, setHighestPrices] = useState<AuctionRoundPrice[]>([]);

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
        <section className="w-full overflow-hidden box-border h-[550px] sm:h-[750px] md:h-[550px] lg:h-[450px]">
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
                    }
                `}
            </style>
            <div className="flex flex-col lg:flex-row h-full box-border">
                {/* Phần bên trái: Danh sách giá cao nhất cho từng loại tài sản */}
                <motion.div
                    className="w-full lg:w-1/3 p-2 lg:p-3 lg:border-r border-gray-200 h-full max-h-full flex flex-col overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="flex-1 shadow-md rounded-lg overflow-hidden box-border flex flex-col">
                        <Title level={4} className="text-gray-800 mb-2 text-base sm:text-lg md:text-lg">
                            Giá Đấu Cao Nhất Theo Loại Tài Sản
                        </Title>
                        {loading && <Spin size="large" className="flex justify-center my-6" />}
                        {!loading && highestPrices.length === 0 && (
                            <Text className="text-gray-500 text-sm sm:text-base">Không có dữ liệu giá đấu</Text>
                        )}
                        {!loading && highestPrices.length > 0 && (
                            <div className={`space-y-4 text-sm sm:text-base ${highestPrices.length > 2 ? 'scroll-container' : ''}`}>
                                {highestPrices.map((price, index) => (
                                    <div key={index} className="border-b border-gray-200 pb-2">
                                        <div>
                                            <Text strong>Tên tài sản: </Text>
                                            <Text>{price.TagName}</Text>
                                        </div>
                                        <div>
                                            <Text strong>Tên người dùng: </Text>
                                            <Text>{price.UserName}</Text>
                                        </div>
                                        <div>
                                            <Text strong>Số căn cước: </Text>
                                            <Text>{price.CitizenIdentification}</Text>
                                        </div>
                                        <div>
                                            <Text strong>Giá đấu: </Text>
                                            <Text>{formatNumber(parseFloat(price.AuctionPrice))} VND</Text>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </motion.div>

                {/* Phần bên phải: Danh sách AuctionRoundPrice */}
                <motion.div
                    className="w-full lg:w-2/3 p-2 lg:p-3 h-full max-h-full flex flex-col overflow-x-hidden overflow-y-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="flex-1 shadow-md rounded-lg overflow-hidden box-border flex flex-col">
                        <Title level={4} className="text-gray-800 mb-2 text-base sm:text-lg md:text-lg">
                            Danh Sách Giá Đấu
                        </Title>
                        <div className="flex-1 overflow-hidden">
                            <Table
                                columns={columns}
                                dataSource={auctionRoundPrices}
                                loading={loading}
                                rowKey="AuctionRoundId"
                                locale={{ emptyText: "Không có dữ liệu" }}
                                className="w-full rounded-lg overflow-hidden table-fixed"
                                rowClassName="hover:bg-blue-50 transition-colors duration-200"
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