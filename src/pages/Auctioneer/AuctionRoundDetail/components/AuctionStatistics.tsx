/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, Statistic, Typography, Progress, Tag } from "antd";
import {
    BarChartOutlined,
    UserOutlined,
    DollarOutlined,
    HomeOutlined,
    LineChartOutlined,
    TrophyOutlined,
    PercentageOutlined,
    CheckCircleOutlined,
    StarOutlined,
    EnvironmentOutlined,
    SyncOutlined,
    ClockCircleOutlined,
    AlertOutlined,
    ThunderboltOutlined,
} from "@ant-design/icons";
import type { AuctionRoundPrice, AuctionRound } from "../modalsData";

const { Title, Text } = Typography;

interface AuctionStatisticsProps {
    priceHistory: AuctionRoundPrice[];
    auctionRound?: AuctionRound;
}

const AuctionStatistics = ({ priceHistory, auctionRound }: AuctionStatisticsProps) => {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatPercent = (value: number) => `${value.toFixed(1)}%`;

    // === CORE METRICS CALCULATION ===
    const totalBids = priceHistory.length;
    const uniqueBidders = new Set(priceHistory.map(item => item.citizenIdentification)).size;
    const uniqueAssets = new Set(priceHistory.map(item => item.tagName)).size;

    const prices = priceHistory.map(item => item.auctionPrice);
    const totalValue = prices.reduce((sum, price) => sum + price, 0);

    // === EFFICIENCY METRICS ===
    const averageBidsPerPerson = uniqueBidders > 0 ? totalBids / uniqueBidders : 0;
    const averageBidsPerAsset = uniqueAssets > 0 ? totalBids / uniqueAssets : 0;

    // === AUCTION ROUND DATA ===
    const auctionDetail = auctionRound?.auction;
    const auctionAssets = auctionDetail?.listAuctionAssets || [];

    // === FINANCIAL ANALYSIS ===
    const totalStartingValue = auctionAssets.reduce((sum, asset) => sum + parseInt(asset.startingPrice), 0);

    // === PERFORMANCE ANALYTICS ===
    const assetsWithBids = new Set(priceHistory.map(item => item.tagName)).size;
    const assetUtilizationRate = auctionAssets.length > 0 ? (assetsWithBids / auctionAssets.length) * 100 : 0;

    // ROI Analysis per asset
    const assetAnalytics = auctionAssets.map(asset => {
        const bidsForAsset = priceHistory.filter(bid => bid.tagName === asset.tagName);
        const currentPrice = bidsForAsset.length > 0
            ? Math.max(...bidsForAsset.map(bid => bid.auctionPrice))
            : parseInt(asset.startingPrice);

        const roi = ((currentPrice - parseInt(asset.startingPrice)) / parseInt(asset.startingPrice)) * 100;

        return {
            tagName: asset.tagName,
            startingPrice: parseInt(asset.startingPrice),
            currentPrice,
            roi,
            bidCount: bidsForAsset.length,
            deposit: parseInt(asset.deposit),
            registrationFee: parseInt(asset.registrationFee),
            isActive: bidsForAsset.length > 0
        };
    });

    const averageROI = assetAnalytics.length > 0
        ? assetAnalytics.reduce((sum, asset) => sum + asset.roi, 0) / assetAnalytics.length
        : 0;

    const activeAssets = assetAnalytics.filter(asset => asset.isActive);
    const topPerformingAssets = [...assetAnalytics]
        .sort((a, b) => b.roi - a.roi)
        .slice(0, 5);

    // === PARTICIPANT ANALYSIS ===
    const participantAnalytics = priceHistory.reduce((acc, item) => {
        const id = item.citizenIdentification;
        if (!acc[id]) {
            acc[id] = {
                name: item.userName,
                location: item.recentLocation,
                bidCount: 0,
                totalValue: 0,
                uniqueAssets: new Set(),
                avgBidValue: 0
            };
        }

        acc[id].bidCount++;
        acc[id].totalValue += item.auctionPrice;
        acc[id].uniqueAssets.add(item.tagName);
        acc[id].avgBidValue = acc[id].totalValue / acc[id].bidCount;

        return acc;
    }, {} as Record<string, any>);

    const topParticipants = Object.values(participantAnalytics)
        .sort((a: any, b: any) => b.bidCount - a.bidCount)
        .slice(0, 5);

    // === GEOGRAPHIC ANALYSIS ===
    const locationStats = priceHistory.reduce((acc, item) => {
        const location = item.recentLocation;
        if (!acc[location]) {
            acc[location] = { count: 0, totalValue: 0, participants: new Set() };
        }
        acc[location].count++;
        acc[location].totalValue += item.auctionPrice;
        acc[location].participants.add(item.citizenIdentification);
        return acc;
    }, {} as Record<string, any>);

    const locationAnalytics = Object.entries(locationStats)
        .map(([location, stats]: [string, any]) => ({
            location,
            bidCount: stats.count,
            totalValue: stats.totalValue,
            participantCount: stats.participants.size,
            avgBidValue: stats.totalValue / stats.count,
            marketShare: (stats.count / totalBids) * 100
        }))
        .sort((a, b) => b.bidCount - a.bidCount)
        .slice(0, 5);

    // === STATUS EVALUATION ===
    const getAuctionStatus = () => {
        if (!auctionRound) return { status: 'Không xác định', color: '#8c8c8c', icon: AlertOutlined };

        switch (auctionRound.status) {
            case 1: return { status: 'Đang hoạt động', color: '#52c41a', icon: CheckCircleOutlined };
            case 2: return { status: 'Đã hoàn thành', color: '#1890ff', icon: SyncOutlined };
            case 0: return { status: 'Chờ bắt đầu', color: '#fa8c16', icon: ClockCircleOutlined };
            default: return { status: 'Không xác định', color: '#8c8c8c', icon: AlertOutlined };
        }
    };

    const auctionStatus = getAuctionStatus();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* ===== HEADER SECTION ===== */}
            <div className="mb-8">
                <Card className="shadow-sm border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <BarChartOutlined className="text-2xl text-blue-600" />
                                <Title level={2} className="!mb-0 !text-gray-800">
                                    Dashboard Phiên Đấu Giá
                                </Title>
                                <Tag
                                    icon={React.createElement(auctionStatus.icon)}
                                    color={auctionStatus.color}
                                    className="!text-sm !px-3 !py-1 !ml-2"
                                >
                                    {auctionStatus.status}
                                </Tag>
                            </div>
                            {auctionDetail && (
                                <Text type="secondary" className="!text-base">
                                    {auctionDetail.auctionName} • {auctionDetail.categoryName}
                                    {auctionDetail.auctioneer && ` • Điều hành: ${auctionDetail.auctioneer}`}
                                </Text>
                            )}
                        </div>
                        <div className="text-center lg:text-right">
                            <Text className="!text-3xl !font-bold !text-blue-600 block">
                                Round {auctionRound?.roundNumber || 'N/A'}
                            </Text>
                        </div>
                    </div>
                </Card>
            </div>

            {/* ===== MAIN METRICS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tổng lượt đấu giá</span>}
                        value={totalBids}
                        prefix={<ThunderboltOutlined className="text-blue-500" />}
                        valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Người tham gia</span>}
                        value={uniqueBidders}
                        prefix={<UserOutlined className="text-green-500" />}
                        valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tài sản được đấu</span>}
                        value={`${assetsWithBids}/${auctionAssets.length}`}
                        prefix={<HomeOutlined className="text-purple-500" />}
                        valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
                    />
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow border-0">
                    <Statistic
                        title={<span className="text-gray-600 font-medium">Tỷ lệ tham gia</span>}
                        value={assetUtilizationRate}
                        precision={1}
                        suffix="%"
                        prefix={<PercentageOutlined className="text-orange-500" />}
                        valueStyle={{
                            color: assetUtilizationRate >= 80 ? '#52c41a' :
                                assetUtilizationRate >= 60 ? '#fa8c16' : '#f5222d',
                            fontSize: '28px',
                            fontWeight: 'bold'
                        }}
                    />
                </Card>
            </div>

            {/* ===== FINANCIAL OVERVIEW ===== */}
            <Card className="shadow-sm border-0 mb-8">
                <Title level={4} className="!mb-6 !flex !items-center !gap-2 !text-gray-800">
                    <DollarOutlined className="!text-green-500" />
                    Tổng quan tài chính
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <Statistic
                            title={<span className="text-blue-700 font-medium">Tổng giá trị hiện tại</span>}
                            value={totalValue}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#1890ff', fontSize: '20px', fontWeight: 'bold' }}
                        />
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <Statistic
                            title={<span className="text-purple-700 font-medium">Giá trị khởi điểm</span>}
                            value={totalStartingValue}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#722ed1', fontSize: '20px', fontWeight: 'bold' }}
                        />
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <Statistic
                            title={<span className="text-red-700 font-medium">ROI trung bình</span>}
                            value={averageROI}
                            precision={1}
                            suffix="%"
                            valueStyle={{
                                color: averageROI >= 10 ? '#f5222d' :
                                    averageROI >= 5 ? '#fa8c16' : '#52c41a',
                                fontSize: '20px',
                                fontWeight: 'bold'
                            }}
                        />
                    </div>
                </div>
            </Card>

            {/* ===== TOP PERFORMERS ===== */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                <Card className="shadow-sm border-0">
                    <Title level={4} className="!mb-4 !flex !items-center !gap-2 !text-gray-800">
                        <TrophyOutlined className="!text-orange-500" />
                        Tài sản hiệu suất cao
                    </Title>
                    <div className="space-y-3">
                        {topPerformingAssets.slice(0, 3).map((asset, index) => (
                            <div key={asset.tagName} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <Text strong className="text-gray-900">{asset.tagName}</Text>
                                        <div className="text-sm text-gray-500">
                                            {formatPrice(asset.currentPrice)} • {asset.bidCount} lượt
                                        </div>
                                    </div>
                                </div>
                                <Tag color={asset.roi >= 10 ? 'red' : asset.roi >= 5 ? 'orange' : 'green'} className="font-bold">
                                    {asset.roi >= 0 ? '+' : ''}{formatPercent(asset.roi)}
                                </Tag>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="shadow-sm border-0">
                    <Title level={4} className="!mb-4 !flex !items-center !gap-2 !text-gray-800">
                        <StarOutlined className="!text-blue-500" />
                        Người tham gia tích cực
                    </Title>
                    <div className="space-y-3">
                        {topParticipants.slice(0, 3).map((participant, index) => (
                            <div key={participant.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <Text strong className="text-gray-900">{participant.name}</Text>
                                        <div className="text-sm text-gray-500">
                                            {participant.location} • {participant.uniqueAssets.size} tài sản
                                        </div>
                                    </div>
                                </div>
                                <Tag color="blue" className="font-bold">
                                    {participant.bidCount} lượt
                                </Tag>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* ===== GEOGRAPHIC INSIGHTS ===== */}
            <Card className="shadow-sm border-0 mb-8">
                <Title level={4} className="!mb-6 !flex !items-center !gap-2 !text-gray-800">
                    <EnvironmentOutlined className="!text-green-500" />
                    Phân bố địa lý
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {locationAnalytics.slice(0, 4).map((location) => (
                        <div key={location.location} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
                            <div className="text-center mb-3">
                                <Text strong className="text-lg text-gray-800">{location.location}</Text>
                                <div className="mt-1">
                                    <Tag color="blue" className="text-xs">
                                        {formatPercent(location.marketShare)} thị phần
                                    </Tag>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lượt đấu:</span>
                                    <span className="font-medium">{location.bidCount}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Người tham gia:</span>
                                    <span className="font-medium">{location.participantCount}</span>
                                </div>
                                <Progress
                                    percent={Math.round(location.marketShare)}
                                    size="small"
                                    strokeColor="#1890ff"
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ===== EFFICIENCY SUMMARY ===== */}
            <Card className="shadow-sm border-0">
                <Title level={4} className="!mb-6 !flex !items-center !gap-2 !text-gray-800">
                    <LineChartOutlined className="!text-purple-500" />
                    Hiệu quả hoạt động
                </Title>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {averageBidsPerPerson.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Lượt đấu TB/Người</div>
                        <Progress
                            percent={Math.min((averageBidsPerPerson / 5) * 100, 100)}
                            size="small"
                            strokeColor="#52c41a"
                            className="mt-2"
                        />
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">
                            {averageBidsPerAsset.toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-600">Lượt đấu TB/Tài sản</div>
                        <Progress
                            percent={Math.min((averageBidsPerAsset / 10) * 100, 100)}
                            size="small"
                            strokeColor="#fa8c16"
                            className="mt-2"
                        />
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {activeAssets.length}/{auctionAssets.length}
                        </div>
                        <div className="text-sm text-gray-600">Tài sản có hoạt động</div>
                        <Progress
                            percent={assetUtilizationRate}
                            size="small"
                            strokeColor="#1890ff"
                            className="mt-2"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AuctionStatistics;
