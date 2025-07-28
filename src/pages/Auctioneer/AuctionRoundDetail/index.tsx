import { useEffect, useState } from "react";
import { Tabs, Button, Typography } from "antd";
import { ReloadOutlined, HistoryOutlined, BarChartOutlined, HomeOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import type { AuctionRound, AuctionRoundPrice, AuctionHeaderData, AuctionStatisticsData, AssetAnalysisData } from "./modalsData";
import AuctionHeader from "./components/AuctionHeader";
import PriceHistoryTable from "./components/PriceHistoryTable";
import AuctionStatistics from "./components/AuctionStatistics";
import AssetAnalysisTable from "./components/AssetAnalysisTable";
import "./styles.css";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
// Import fake data - sẽ thay thế bằng API calls thật
import {
    fakeAuctionRoundPrices,
    fakeHeaderStats,
    fakeAssetAnalysis,
    fakeStatistics
} from "./fakeData";

interface AuctionRoundDetailProps {
    auctionRound?: AuctionRound
    onBackToList?: () => void;
}

const AuctionRoundDetail = ({ auctionRound, onBackToList }: AuctionRoundDetailProps) => {
    // Current auction round ID - single source of truth
    const CURRENT_AUCTION_ROUND_ID = "AR001";

    // State management
    const [auctionRoundPrice, setAuctionRoundPrice] = useState<AuctionRoundPrice[]>([]);
    const [headerStats, setHeaderStats] = useState<AuctionHeaderData | null>(null);
    const [assetAnalysis, setAssetAnalysis] = useState<AssetAnalysisData | null>(null);
    const [statistics, setStatistics] = useState<AuctionStatisticsData | null>(null);
    const [activeTab, setActiveTab] = useState<string>('history');
    const [loading, setLoading] = useState<boolean>(false);

    // Load all data function - calls all API functions
    const loadAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                getListOfAuctionRoundPrices(),
                getAuctionHeaderStats(),
                getAssetAnalysisData(),
                getAuctionStatistics()
            ]);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Có lỗi xảy ra khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        const initializeData = async () => {
            await loadAllData();
        };
        initializeData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auctionRound]);

    // API Function 1: Get auction round prices (from service logic)
    const getListOfAuctionRoundPrices = async () => {
        try {
            if (auctionRound) {
                // TODO: Replace with real API call when ready
                const response = await AuctionServices.getListAuctionRoundPrices(auctionRound?.auctionRoundId);
                setAuctionRoundPrice(response.data.listAuctionRoundPrices);
                console.log('Using real API data for auction round prices:', auctionRound?.auctionRoundId);
            } else {
                // For now, return fake data
                console.log('Using fake data for auction round prices');
                setAuctionRoundPrice(fakeAuctionRoundPrices);
            }
        } catch (error) {
            console.error("Error fetching auction round prices:", error);
            // Fallback to fake data on error
            setAuctionRoundPrice(fakeAuctionRoundPrices);
        }
    };

    // API Function 2: Get header statistics (MISSING API)
    const getAuctionHeaderStats = async () => {
        try {
            // TODO: THIẾU API - Cần thêm vào AuctionServices
            // const response = await AuctionServices.getAuctionRoundHeader(auctionRound?.auctionRoundId);
            // setHeaderStats(response.data);

            // For now, return fake data
            console.log('⚠️ MISSING API: getAuctionRoundHeader - Using fake data for header:', auctionRound?.auctionRoundId || 'AR001');
            setHeaderStats(fakeHeaderStats);
        } catch (error) {
            console.error("Error fetching header stats:", error);
            setHeaderStats(fakeHeaderStats);
        }
    };

    // API Function 3: Get asset analysis data (MISSING API)
    const getAssetAnalysisData = async () => {
        try {
            // TODO: THIẾU API - Cần thêm vào AuctionServices
            // const response = await AuctionServices.getAssetAnalysis(auctionRound?.auctionRoundId);
            // setAssetAnalysis(response.data);

            // For now, return fake data
            console.log('⚠️ MISSING API: getAssetAnalysis - Using fake data for asset analysis:', auctionRound?.auctionRoundId || 'AR001');
            setAssetAnalysis(fakeAssetAnalysis);
        } catch (error) {
            console.error("Error fetching asset analysis:", error);
            setAssetAnalysis(fakeAssetAnalysis);
        }
    };

    // API Function 4: Get auction statistics (MISSING API)
    const getAuctionStatistics = async () => {
        try {
            // TODO: THIẾU API - Cần thêm vào AuctionServices
            // const response = await AuctionServices.getAuctionStatistics(auctionRound?.auctionRoundId);
            // setStatistics(response.data);

            // For now, return fake data
            console.log('⚠️ MISSING API: getAuctionStatistics - Using fake data for statistics:', auctionRound?.auctionRoundId || 'AR001');
            setStatistics(fakeStatistics);
        } catch (error) {
            console.error("Error fetching statistics:", error);
            setStatistics(fakeStatistics);
        }
    };

    // API Function 5: Update winner flag (existing)
    const onUpdateWinnerFlag = async (auctionRoundPriceId: string, userName: string, assetName: string) => {
        try {
            const response = await AuctionServices.updateWinnerFlag({
                auctionRoundPriceId: auctionRoundPriceId
            });
            if (response.data.success) {
                toast.success(`Đã cập nhật ${userName} là người chiến thắng cho tài sản ${assetName}`);
                // Refresh price history after update
                await getListOfAuctionRoundPrices();
            } else {
                toast.error(`Cập nhật người chiến thắng thất bại: ${response.data.message}`);
            }
        } catch (error) {
            console.error("Error updating winner flag:", error);
            toast.error("Có lỗi xảy ra khi cập nhật người chiến thắng");
        }
    };

    // API Function 6: End auction (MISSING API)
    const endAuction = async () => {
        try {
            // TODO: THIẾU API - Cần thêm vào AuctionServices
            // const response = await AuctionServices.endAuction(auctionRound?.auctionRoundId);
            // if (response.data.success) {
            //     toast.success("Phiên đấu giá đã được kết thúc");
            //     await loadAllData(); // Refresh data
            // }

            console.log('⚠️ MISSING API: endAuction - Ending auction round:', auctionRound?.auctionRoundId || 'AR001');
            toast.success("Phiên đấu giá đã được kết thúc");
            return Promise.resolve({ success: true });
        } catch (error) {
            console.error('Error ending auction:', error);
            toast.error("Có lỗi xảy ra khi kết thúc phiên đấu giá");
            throw error;
        }
    };

    // API Function 7: Refresh all data (MISSING API)
    const refreshData = async () => {
        try {
            // TODO: THIẾU API - Cần thêm vào AuctionServices
            // const response = await AuctionServices.refreshAuctionData(auctionRound?.auctionRoundId);
            // return response.data;

            console.log('⚠️ MISSING API: refreshAuctionData - Refreshing data for auction round:', auctionRound?.auctionRoundId || 'AR001');
            return Promise.resolve({ success: true });
        } catch (error) {
            console.error('Error refreshing data:', error);
            throw error;
        }
    };

    // Refresh all data function
    const refreshAllData = async () => {
        await refreshData();
        await loadAllData();
        toast.success("Dữ liệu đã được làm mới");
    };

    // Calculate basic stats from current data
    const totalParticipants = new Set(auctionRoundPrice.map(item => item.citizenIdentification)).size;
    const totalAssets = new Set(auctionRoundPrice.map(item => item.tagName)).size;

    // Debug log - will be removed when implementing component enhancements
    console.log("Current state:", { headerStats, assetAnalysis, statistics });

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
            children: <AssetAnalysisTable
                priceHistory={auctionRoundPrice}
                onUpdateWinner={onUpdateWinnerFlag}
            />
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
                {/* Back Button */}
                {onBackToList && (
                    <div className="mb-4">
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={onBackToList}
                            className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            size="large"
                        >
                            Quay lại danh sách
                        </Button>
                    </div>
                )}

                {/* Header */}
                <AuctionHeader
                    auctionRoundId={CURRENT_AUCTION_ROUND_ID}
                    totalParticipants={totalParticipants}
                    totalAssets={totalAssets}
                    status="active"
                    onEndAuction={endAuction}
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
                            onClick={refreshAllData}
                            className="flex items-center"
                            loading={loading}
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
