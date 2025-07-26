import React, { useState } from "react";
import { Table, Card, Typography, Tag, Button, Badge, Empty, message } from "antd";
import { UserOutlined, IdcardOutlined, EnvironmentOutlined, DollarOutlined, TrophyOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import type { AuctionRoundPrice } from "../../Modals";

const { Title } = Typography;

interface HighestBidder extends AuctionRoundPrice {
    isWinner?: boolean;
}

interface HighestBiddersTableProps {
    priceHistory: AuctionRoundPrice[];
}

const HighestBiddersTable: React.FC<HighestBiddersTableProps> = ({ priceHistory }) => {
    const [winners, setWinners] = useState<Set<string>>(new Set());

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(parseInt(price));
    };

    // Lấy người trả giá cao nhất cho mỗi tài sản
    const getHighestBidders = (): HighestBidder[] => {
        const groupedByAsset = priceHistory.reduce((acc, item) => {
            if (!acc[item.TagName] || parseInt(item.AuctionPrice) > parseInt(acc[item.TagName].AuctionPrice)) {
                acc[item.TagName] = item;
            }
            return acc;
        }, {} as Record<string, AuctionRoundPrice>);

        return Object.values(groupedByAsset).map(bidder => ({
            ...bidder,
            isWinner: winners.has(`${bidder.TagName}-${bidder.CitizenIdentification}`)
        }));
    };

    const confirmWinner = (tagName: string, citizenId: string) => {
        const winnerKey = `${tagName}-${citizenId}`;
        const newWinners = new Set(winners);

        if (winners.has(winnerKey)) {
            newWinners.delete(winnerKey);
            message.success('Đã hủy xác nhận người chiến thắng');
        } else {
            // Remove any other winner for this asset
            winners.forEach(key => {
                if (key.startsWith(`${tagName}-`)) {
                    newWinners.delete(key);
                }
            });
            newWinners.add(winnerKey);
            message.success('Đã xác nhận người chiến thắng');
        }

        setWinners(newWinners);
    };

    const columns = [
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Tên tài sản
                </span>
            ),
            dataIndex: 'TagName',
            key: 'TagName',
            render: (text: string, record: HighestBidder) => (
                <div className="!flex !items-center !gap-2">
                    <Tag color="blue" className="!text-sm !py-1 !px-3">
                        {text}
                    </Tag>
                    {record.isWinner && (
                        <Badge status="success" text="Người chiến thắng" />
                    )}
                </div>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <UserOutlined />
                    Người đấu giá
                </span>
            ),
            dataIndex: 'UserName',
            key: 'UserName',
            render: (text: string) => (
                <span className="!font-medium !text-gray-900">{text}</span>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <IdcardOutlined />
                    CCCD
                </span>
            ),
            dataIndex: 'CitizenIdentification',
            key: 'CitizenIdentification',
            render: (text: string) => (
                <span className="!font-mono !text-gray-600">{text}</span>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <EnvironmentOutlined />
                    Địa điểm
                </span>
            ),
            dataIndex: 'RecentLocation',
            key: 'RecentLocation',
            render: (text: string) => (
                <Tag color="green">{text}</Tag>
            ),
        },
        {
            title: (
                <span className="flex items-center gap-2">
                    <DollarOutlined />
                    Giá cao nhất
                </span>
            ),
            dataIndex: 'AuctionPrice',
            key: 'AuctionPrice',
            render: (price: string) => (
                <span className="!font-bold !text-green-600 !text-lg">
                    {formatPrice(price)}
                </span>
            ),
            sorter: (a: HighestBidder, b: HighestBidder) =>
                parseInt(a.AuctionPrice) - parseInt(b.AuctionPrice),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: unknown, record: HighestBidder) => (
                <Button
                    type={record.isWinner ? "default" : "primary"}
                    icon={record.isWinner ? <CloseOutlined /> : <CheckOutlined />}
                    onClick={() => confirmWinner(record.TagName, record.CitizenIdentification)}
                    className={record.isWinner ? "!bg-red-50 !border-red-200 !text-red-600 hover:!bg-red-100" : ""}
                >
                    {record.isWinner ? 'Hủy xác nhận' : 'Xác nhận chiến thắng'}
                </Button>
            ),
        },
    ]; const highestBidders = getHighestBidders();

    return (
        <Card className="!shadow-md">
            <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                <TrophyOutlined className="!text-yellow-500" />
                Người trả giá cao nhất theo tài sản
            </Title>

            <Table
                columns={columns}
                dataSource={highestBidders.map((item, index) => ({
                    ...item,
                    key: index,
                }))}
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} tài sản`,
                }}
                locale={{
                    emptyText: (
                        <Empty
                            description="Chưa có lượt đấu giá nào"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    ),
                }}
                scroll={{ x: 1000 }}
                size="middle"
                className="custom-table"
                rowClassName={(record: HighestBidder) =>
                    record.isWinner ? '!bg-green-50' : ''
                }
            />
        </Card>
    );
};

export default HighestBiddersTable;
