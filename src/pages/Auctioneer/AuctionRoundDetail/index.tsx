import { useEffect, useState } from "react";
import { Tabs, Button, Typography } from "antd";
import { ReloadOutlined, HistoryOutlined, BarChartOutlined, HomeOutlined } from "@ant-design/icons";
import type { AuctionRound, AuctionRoundPrice } from "./modalsData";
import { fakeAuctionRoundPrices, fakeAuctionRounds } from "./fakeData";
import AuctionHeader from "./components/AuctionHeader";
import PriceHistoryTable from "./components/PriceHistoryTable";
import AuctionStatistics from "./components/AuctionStatistics";
import AssetAnalysisTable from "./components/AssetAnalysisTable";
import "./styles.css";

const AuctionRoundDetail = () => {
    // Current auction round ID - single source of truth
    const CURRENT_AUCTION_ROUND_ID = "AR001";

    const [auctionRoundPrice, setAuctionRoundPrice] = useState<AuctionRoundPrice[]>([]);
    const [auctionRound, setAuctionRound] = useState<AuctionRound>();
    const [activeTab, setActiveTab] = useState<string>('history');

    useEffect(() => {
        // Simulate fetching auction round prices
        getListOfAuctionRound();
        getListOfAuctionRoundPrices();
    }, []);

    const getListOfAuctionRound = () => {
        try {
            const auctionRoundNow = fakeAuctionRounds.find(round => round.auctionRoundId === CURRENT_AUCTION_ROUND_ID);
            setAuctionRound(auctionRoundNow);
        } catch (error) {
            console.error("Error fetching auction round data:", error);

        }
    }

    const getListOfAuctionRoundPrices = () => {
        try {
            // Filter chỉ lấy data của round hiện tại
            const currentRoundPrices = fakeAuctionRoundPrices.filter(price => price.AuctionRoundId === CURRENT_AUCTION_ROUND_ID);
            setAuctionRoundPrice(currentRoundPrices);
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
            key: 'assets',
            label: (
                <span className="flex items-center gap-2">
                    <HomeOutlined />
                    Phân tích tài sản
                </span>
            ),
            children: <AssetAnalysisTable priceHistory={auctionRoundPrice} />
        },
        {
            key: 'statistics',
            label: (
                <span className="flex items-center gap-2">
                    <BarChartOutlined />
                    Thống kê
                </span>
            ),
            children: auctionRound ? (
                <AuctionStatistics
                    priceHistory={auctionRoundPrice}
                    auctionRound={auctionRound}
                />
            ) : (
                <div>Loading auction round data...</div>
            )
        }
    ];

    return (
        <div className="min-h-fit bg-gray-50 p-6 w-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <AuctionHeader
                    auctionRoundId={CURRENT_AUCTION_ROUND_ID}
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
