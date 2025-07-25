/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Button, Tabs, message, Breadcrumb } from 'antd';
import {
    ArrowLeftOutlined,
    ReloadOutlined,
    BarChartOutlined,
    UnorderedListOutlined,
    TrophyOutlined,
    ClockCircleOutlined,
    ExportOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import StatsOverview from './components/StatsOverview';
import BidList from './components/BidList';
import TopBidders from './components/TopBidders';
import BidTimeline from './components/BidTimeline';
import type { RoundDetailData } from './types';

/**
 * API Endpoints Documentation
 * 
 * 1. GET /api/auction-rounds/{roundId}/detail
 * Purpose: Lấy chi tiết đầy đủ của một vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter) - ID của vòng đấu giá
 * Response: {
 *   round: AuctionRound;
 *   prices: ExtendedAuctionRoundPrice[];
 *   stats: RoundDetailStats;
 *   topBidders: BidderInfo[];
 *   winningBids: ExtendedAuctionRoundPrice[];
 * }
 * 
 * 2. GET /api/auction-rounds/{roundId}/prices
 * Purpose: Lấy danh sách tất cả giá trả trong vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter)
 *   - page: number (query) - Trang hiện tại
 *   - limit: number (query) - Số item per page
 *   - sortBy: string (query) - Sắp xếp theo (price, time)
 *   - order: string (query) - Thứ tự (asc, desc)
 * Response: {
 *   prices: ExtendedAuctionRoundPrice[];
 *   total: number;
 *   page: number;
 *   limit: number;
 * }
 * 
 * 3. GET /api/auction-rounds/{roundId}/stats
 * Purpose: Lấy thống kê của vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter)
 * Response: RoundDetailStats
 * 
 * 4. GET /api/auction-rounds/{roundId}/top-bidders
 * Purpose: Lấy danh sách top bidders
 * Parameters:
 *   - roundId: string (path parameter)
 *   - limit: number (query) - Số lượng top bidders (default: 10)
 * Response: BidderInfo[]
 * 
 * 5. POST /api/auction-rounds/{roundId}/export
 * Purpose: Export dữ liệu vòng đấu giá
 * Parameters:
 *   - roundId: string (path parameter)
 * Request Body: {
 *   format: 'excel' | 'pdf';
 *   includeStats: boolean;
 *   includeBids: boolean;
 *   includeTimeline: boolean;
 * }
 * Response: File download
 */

const AuctionRoundDetail: React.FC = () => {
    const navigate = useNavigate();
    const { roundId } = useParams<{ roundId: string }>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<RoundDetailData | null>(null);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        console.log('🔍 RoundId from URL params:', roundId);
        if (roundId) {
            fetchRoundDetail(roundId);
        } else {
            console.warn('⚠️ No roundId found in URL params');
            // For testing purposes, load fake data anyway
            fetchRoundDetail('test-round-id');
        }
    }, [roundId]);

    const fetchRoundDetail = async (_id: string) => {
        try {
            setLoading(true);
            // TODO: Replace with actual API call
            // const response = await AuctionServices.getRoundDetail(id);
            // setData(response.data);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Fake data để test UI - sẽ thay thế bằng API call thực tế
            const fakeData: RoundDetailData = {
                round: {
                    AuctionRoundId: "AR-2024-001",
                    AuctionId: "AUCTION-001",
                    RoubdNumber: 1,
                    Status: 1,
                    CreatedAt: "2024-12-20T10:30:00Z",
                    CreatedBy: "Admin System"
                },
                prices: [
                    {
                        AuctionRoundPriceId: "ARP-001",
                        AuctionRoundId: "AR-2024-001",
                        UserName: "Nguyễn Văn An",
                        CitezenIdentification: "123456789012",
                        RecentLocation: "Quận 1, TP.HCM",
                        TagName: "Nhà phố 3 tầng",
                        AuctionPrice: 5000000000,
                        CreatedAt: "2024-12-20T15:45:00Z",
                        CreatedBy: "USER-001",
                        rank: 1,
                        isWinning: true
                    },
                    {
                        AuctionRoundPriceId: "ARP-002",
                        AuctionRoundId: "AR-2024-001",
                        UserName: "Trần Thị Bình",
                        CitezenIdentification: "987654321098",
                        RecentLocation: "Cầu Giấy, Hà Nội",
                        TagName: "Ô tô Mercedes C200",
                        AuctionPrice: 4800000000,
                        CreatedAt: "2024-12-20T15:42:30Z",
                        CreatedBy: "USER-002",
                        rank: 2,
                        isWinning: false
                    },
                    {
                        AuctionRoundPriceId: "ARP-003",
                        AuctionRoundId: "AR-2024-001",
                        UserName: "Lê Hoàng Minh",
                        CitezenIdentification: "456789123456",
                        RecentLocation: "Hải Châu, Đà Nẵng",
                        TagName: "Đất nền 100m2",
                        AuctionPrice: 4500000000,
                        CreatedAt: "2024-12-20T15:40:15Z",
                        CreatedBy: "USER-003",
                        rank: 3,
                        isWinning: false
                    },
                    {
                        AuctionRoundPriceId: "ARP-004",
                        AuctionRoundId: "AR-2024-001",
                        UserName: "Phạm Thị Hồng",
                        CitezenIdentification: "321654987123",
                        RecentLocation: "Bình Thạnh, TP.HCM",
                        TagName: "Căn hộ chung cư 80m2",
                        AuctionPrice: 4200000000,
                        CreatedAt: "2024-12-20T15:38:45Z",
                        CreatedBy: "USER-004",
                        rank: 4,
                        isWinning: false
                    },
                    {
                        AuctionRoundPriceId: "ARP-005",
                        AuctionRoundId: "AR-2024-001",
                        UserName: "Hoàng Văn Nam",
                        CitezenIdentification: "789123456789",
                        RecentLocation: "Hai Bà Trưng, Hà Nội",
                        TagName: "Xe máy SH 150i",
                        AuctionPrice: 4000000000,
                        CreatedAt: "2024-12-20T15:35:20Z",
                        CreatedBy: "USER-005",
                        rank: 5,
                        isWinning: false
                    }
                ],
                stats: {
                    totalBids: 45,
                    uniqueBidders: 23,
                    highestBid: 5000000000,
                    lowestBid: 3500000000,
                    averageBid: 4200000000,
                    bidIncrement: 100000000,
                    timeRange: {
                        firstBid: "2024-12-20T10:30:00Z",
                        lastBid: "2024-12-20T15:45:00Z"
                    },
                    topBidderLocation: "TP. Hồ Chí Minh"
                },
                topBidders: [
                    {
                        userName: "Nguyễn Văn An",
                        citizenId: "123456789012",
                        location: "Quận 1, TP.HCM",
                        totalBids: 12,
                        highestBid: 5000000000,
                        averageBid: 4600000000,
                        bidTimes: ["2024-12-20T15:45:00Z", "2024-12-20T15:30:00Z", "2024-12-20T15:15:00Z"]
                    },
                    {
                        userName: "Lê Hoàng Minh",
                        citizenId: "456789123456",
                        location: "Hải Châu, Đà Nẵng",
                        totalBids: 15,
                        highestBid: 4500000000,
                        averageBid: 4100000000,
                        bidTimes: ["2024-12-20T15:40:15Z", "2024-12-20T15:25:00Z", "2024-12-20T15:10:00Z"]
                    },
                    {
                        userName: "Trần Thị Bình",
                        citizenId: "987654321098",
                        location: "Cầu Giấy, Hà Nội",
                        totalBids: 8,
                        highestBid: 4800000000,
                        averageBid: 4300000000,
                        bidTimes: ["2024-12-20T15:42:30Z", "2024-12-20T15:20:00Z"]
                    }
                ],
                winningBids: [
                    {
                        AuctionRoundPriceId: "ARP-001",
                        AuctionRoundId: "AR-2024-001",
                        UserName: "Nguyễn Văn An",
                        CitezenIdentification: "123456789012",
                        RecentLocation: "Quận 1, TP.HCM",
                        TagName: "Nhà phố 3 tầng",
                        AuctionPrice: 5000000000,
                        CreatedAt: "2024-12-20T15:45:00Z",
                        CreatedBy: "USER-001",
                        rank: 1,
                        isWinning: true
                    }
                ]
            };

            setData(fakeData);
            console.log('✅ Fake data loaded successfully:', fakeData);
            message.success('Đã tải dữ liệu chi tiết vòng đấu giá');
        } catch (_error) {
            message.error('Không thể tải dữ liệu chi tiết vòng đấu giá');
            console.error('Error fetching round detail:', _error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        if (roundId) {
            await fetchRoundDetail(roundId);
        }
    };

    const handleExport = async () => {
        try {
            // TODO: Implement export functionality
            message.success('Đang chuẩn bị file export...');
        } catch (error) {
            message.error('Không thể export dữ liệu');
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const tabItems = [
        {
            key: 'overview',
            label: (
                <span className="flex items-center space-x-2">
                    <BarChartOutlined />
                    <span>Tổng quan</span>
                </span>
            ),
            children: (
                <div className="space-y-6">
                    <StatsOverview stats={data?.stats || {
                        totalBids: 0,
                        uniqueBidders: 0,
                        highestBid: 0,
                        lowestBid: 0,
                        averageBid: 0,
                        bidIncrement: 0,
                        timeRange: { firstBid: '', lastBid: '' },
                        topBidderLocation: ''
                    }} loading={loading} />

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="xl:col-span-2">
                            <BidList
                                bids={data?.prices || []}
                                loading={loading}
                                onRefresh={handleRefresh}
                            />
                        </div>
                        <div>
                            <TopBidders
                                bidders={data?.topBidders || []}
                                loading={loading}
                            />
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'bids',
            label: (
                <span className="flex items-center space-x-2">
                    <UnorderedListOutlined />
                    <span>Danh sách giá ({data?.prices.length || 0})</span>
                </span>
            ),
            children: (
                <BidList
                    bids={data?.prices || []}
                    loading={loading}
                    onRefresh={handleRefresh}
                />
            )
        },
        {
            key: 'topBidders',
            label: (
                <span className="flex items-center space-x-2">
                    <TrophyOutlined />
                    <span>Top Bidders</span>
                </span>
            ),
            children: (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopBidders
                        bidders={data?.topBidders || []}
                        loading={loading}
                    />
                    <BidTimeline
                        bids={data?.prices || []}
                        loading={loading}
                    />
                </div>
            )
        },
        {
            key: 'timeline',
            label: (
                <span className="flex items-center space-x-2">
                    <ClockCircleOutlined />
                    <span>Timeline</span>
                </span>
            ),
            children: (
                <BidTimeline
                    bids={data?.prices || []}
                    loading={loading}
                />
            )
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
                    {/* Breadcrumb */}
                    <Breadcrumb className="mb-4">
                        <Breadcrumb.Item>
                            <Button
                                type="link"
                                icon={<ArrowLeftOutlined />}
                                onClick={handleBack}
                                className="!p-0 !h-auto"
                            >
                                Quay lại
                            </Button>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Quản lý vòng đấu giá</Breadcrumb.Item>
                        <Breadcrumb.Item>Chi tiết vòng {data?.round.RoubdNumber}</Breadcrumb.Item>
                    </Breadcrumb>

                    {/* Title and Actions */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-2">
                                Chi tiết Vòng {data?.round.RoubdNumber || '...'}
                            </h1>
                            <p className="text-gray-600">
                                Theo dõi chi tiết các lượt trả giá và thống kê trong vòng đấu giá
                            </p>
                            {data && (
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                    <span>Tạo: {new Date(data.round.CreatedAt).toLocaleString('vi-VN')}</span>
                                    <span>•</span>
                                    <span>Bởi: {data.round.CreatedBy}</span>
                                    <span>•</span>
                                    <span>ID: {data.round.AuctionRoundId}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={handleRefresh}
                                loading={loading}
                                size="large"
                                className="w-full sm:w-auto !bg-gray-100 hover:!bg-gray-200 !border-gray-300"
                            >
                                Làm mới
                            </Button>
                            <Button
                                type="primary"
                                icon={<ExportOutlined />}
                                onClick={handleExport}
                                size="large"
                                className="w-full sm:w-auto !bg-blue-500 hover:!bg-blue-600 !border-blue-500"
                            >
                                Export
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        items={tabItems}
                        className="!m-0"
                        tabBarStyle={{
                            padding: '0 24px',
                            margin: 0,
                            background: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%)',
                            borderBottom: '1px solid #e2e8f0'
                        }}
                        tabBarGutter={32}
                    />

                    <div className="p-6">
                        {tabItems.find(item => item.key === activeTab)?.children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionRoundDetail;
