import { useEffect, useState } from "react";
import { Tabs, Button, Typography } from "antd";
import { ReloadOutlined, HistoryOutlined, TrophyOutlined, BarChartOutlined } from "@ant-design/icons";
import type { AuctionRoundPrice } from "../Modals";
import { fakeAuctionRoundPrices } from "./fakeData";
import AuctionHeader from "./components/AuctionHeader";
import PriceHistoryTable from "./components/PriceHistoryTable";
import HighestBiddersTable from "./components/HighestBiddersTable";
import AuctionStatistics from "./components/AuctionStatistics";
import "./styles.css";

const AuctionRoundDetail = () => {
    const [auctionRoundPrice, setAuctionRoundPrice] = useState<AuctionRoundPrice[]>([]);
    const [activeTab, setActiveTab] = useState<string>('history');

    useEffect(() => {
        // Simulate fetching auction round prices
        getListOfAuctionRoundPrices();
    }, []);

    const getListOfAuctionRoundPrices = () => {
        try {
            setAuctionRoundPrice(fakeAuctionRoundPrices);
        } catch (error) {
            console.error("Error fetching auction round prices:", error);
        }
    };

    // Tính toán thống kê cơ bản
    const totalParticipants = new Set(auctionRoundPrice.map(item => item.CitizenIdentification)).size;
    const totalAssets = new Set(auctionRoundPrice.map(item => item.TagName)).size;

    const tabItems = [
        {
            key: 'history',
            label: (
                <span className="flex items-center gap-2">
                    <HistoryOutlined />
                    Lịch sử trả giá
                </span>
            ),
            children: <PriceHistoryTable priceHistory={auctionRoundPrice} />
        },
        {
            key: 'winners',
            label: (
                <span className="flex items-center gap-2">
                    <TrophyOutlined />
                    Người trả giá cao nhất
                </span>
            ),
            children: <HighestBiddersTable priceHistory={auctionRoundPrice} />
        },
        {
            key: 'statistics',
            label: (
                <span className="flex items-center gap-2">
                    <BarChartOutlined />
                    Thống kê
                </span>
            ),
            children: <AuctionStatistics priceHistory={auctionRoundPrice} />
        }
    ];

    return (
        <div className="min-h-fit bg-gray-50 p-6 w-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <AuctionHeader
                    auctionRoundId="AR001"
                    totalParticipants={totalParticipants}
                    totalAssets={totalAssets}
                    status="active"
                />

                {/* Tabs with Ant Design */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Typography.Title level={4} className="m-0">
                            Quản lý phiên đấu giá
                        </Typography.Title>
                        <Button
                            type="primary"
                            icon={<ReloadOutlined />}
                            onClick={getListOfAuctionRoundPrices}
                            className="flex items-center"
                        >
                            Làm mới dữ liệu
                        </Button>
                    </div>

                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        size="large"
                        className="custom-tabs"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuctionRoundDetail;
