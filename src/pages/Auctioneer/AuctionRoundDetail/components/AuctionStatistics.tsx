/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, Row, Col, Statistic, Typography, List, Avatar, Progress, Tag, Space } from "antd";
import {
    BarChartOutlined,
    UserOutlined,
    DollarOutlined,
    HomeOutlined,
    RiseOutlined,
    LineChartOutlined,
    TrophyOutlined,
    PercentageOutlined,
    CheckCircleOutlined,
    StarOutlined,
    EnvironmentOutlined,
    GoldOutlined,
    BankOutlined,
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
    const averagePrice = prices.length > 0 ? totalValue / prices.length : 0;
    const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const priceRange = highestPrice - lowestPrice;

    // === EFFICIENCY METRICS ===
    const averageBidsPerPerson = uniqueBidders > 0 ? totalBids / uniqueBidders : 0;
    const averageBidsPerAsset = uniqueAssets > 0 ? totalBids / uniqueAssets : 0;

    // === AUCTION ROUND DATA ===
    const auctionDetail = auctionRound?.auction;
    const auctionAssets = auctionDetail?.listAuctionAssets || [];

    // === FINANCIAL ANALYSIS ===
    const totalStartingValue = auctionAssets.reduce((sum, asset) => sum + parseInt(asset.startingPrice), 0);
    const totalDeposits = auctionAssets.reduce((sum, asset) => sum + parseInt(asset.deposit), 0);
    const totalRegistrationFees = auctionAssets.reduce((sum, asset) => sum + parseInt(asset.registrationFee), 0);
    const totalPotentialRevenue = totalDeposits + totalRegistrationFees;

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
        <div className="!space-y-6">
            {/* ===== EXECUTIVE SUMMARY ===== */}
            <Card className="!border-l-4 !border-l-blue-500">
                <Row gutter={[24, 16]} align="middle">
                    <Col xs={24} lg={18}>
                        <Space direction="vertical" size="small" className="!w-full">
                            <div className="!flex !items-center !gap-4">
                                <Title level={3} className="!mb-0 !text-blue-700">
                                    Dashboard Tổng quan
                                </Title>
                                <Tag
                                    icon={React.createElement(auctionStatus.icon)}
                                    color={auctionStatus.color}
                                    className="!text-sm !px-3 !py-1"
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
                        </Space>
                    </Col>
                    <Col xs={24} lg={6}>
                        <div className="!text-right">
                            <Text className="!text-2xl !font-bold !text-blue-600">
                                Round {auctionRound?.roundNumber || 'N/A'}
                            </Text>
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* ===== KEY PERFORMANCE INDICATORS ===== */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <BarChartOutlined className="!text-blue-500" />
                    Chỉ số hiệu suất chính (KPIs)
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={12} sm={8} lg={6}>
                        <Statistic
                            title="Tổng lượt đấu giá"
                            value={totalBids}
                            prefix={<ThunderboltOutlined />}
                            valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                        />
                    </Col>
                    <Col xs={12} sm={8} lg={6}>
                        <Statistic
                            title="Người tham gia"
                            value={uniqueBidders}
                            prefix={<UserOutlined />}
                            valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                        />
                    </Col>
                    <Col xs={12} sm={8} lg={6}>
                        <Statistic
                            title="Tài sản được đấu"
                            value={`${assetsWithBids}/${auctionAssets.length}`}
                            prefix={<HomeOutlined />}
                            valueStyle={{ color: '#722ed1', fontSize: '24px' }}
                        />
                    </Col>
                    <Col xs={12} sm={8} lg={6}>
                        <Statistic
                            title="Tỷ lệ tham gia"
                            value={assetUtilizationRate}
                            precision={1}
                            suffix="%"
                            prefix={<PercentageOutlined />}
                            valueStyle={{
                                color: assetUtilizationRate >= 80 ? '#52c41a' :
                                    assetUtilizationRate >= 60 ? '#fa8c16' : '#f5222d',
                                fontSize: '24px'
                            }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* ===== FINANCIAL ANALYTICS ===== */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <BankOutlined className="!text-green-500" />
                    Phân tích tài chính
                </Title>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Tổng giá trị đấu giá hiện tại"
                            value={totalValue}
                            prefix={<DollarOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Giá trị khởi điểm"
                            value={totalStartingValue}
                            prefix={<GoldOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#722ed1' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="ROI trung bình"
                            value={averageROI}
                            precision={1}
                            suffix="%"
                            prefix={<RiseOutlined />}
                            valueStyle={{
                                color: averageROI >= 10 ? '#f5222d' :
                                    averageROI >= 5 ? '#fa8c16' : '#52c41a'
                            }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Doanh thu dự kiến"
                            value={totalPotentialRevenue}
                            prefix={<BankOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Giá trung bình/lượt"
                            value={averagePrice}
                            prefix={<LineChartOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#fa8c16' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Biên độ giá"
                            value={priceRange}
                            prefix={<PercentageOutlined />}
                            formatter={(value) => formatPrice(Number(value))}
                            valueStyle={{ color: '#13c2c2' }}
                        />
                    </Col>
                </Row>
            </Card>

            {/* ===== PERFORMANCE ANALYTICS ===== */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card>
                        <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                            <TrophyOutlined className="!text-orange-500" />
                            Top 5 Tài sản hiệu suất cao
                        </Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={topPerformingAssets}
                            renderItem={(asset, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                className={`!w-10 !h-10 !font-bold !text-white ${asset.roi >= 20 ? '!bg-red-500' :
                                                    asset.roi >= 10 ? '!bg-orange-500' :
                                                        asset.roi >= 0 ? '!bg-green-500' : '!bg-gray-500'
                                                    }`}
                                            >
                                                {index + 1}
                                            </Avatar>
                                        }
                                        title={
                                            <div className="!flex !items-center !justify-between">
                                                <Text strong className="!text-gray-900">{asset.tagName}</Text>
                                                <Tag
                                                    color={asset.roi >= 10 ? 'red' : asset.roi >= 5 ? 'orange' : 'green'}
                                                    className="!font-bold"
                                                >
                                                    {asset.roi >= 0 ? '+' : ''}{formatPercent(asset.roi)}
                                                </Tag>
                                            </div>
                                        }
                                        description={
                                            <div className="!flex !justify-between !text-sm">
                                                <span>{formatPrice(asset.startingPrice)} → {formatPrice(asset.currentPrice)}</span>
                                                <span>{asset.bidCount} lượt đấu</span>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card>
                        <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                            <StarOutlined className="!text-blue-500" />
                            Top 5 Người tham gia tích cực
                        </Title>
                        <List
                            itemLayout="horizontal"
                            dataSource={topParticipants}
                            renderItem={(participant, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <Avatar
                                                className={`!w-10 !h-10 !font-bold !text-white ${index === 0 ? '!bg-gold' :
                                                    index === 1 ? '!bg-gray-400' :
                                                        index === 2 ? '!bg-orange-500' : '!bg-blue-500'
                                                    }`}
                                            >
                                                {index + 1}
                                            </Avatar>
                                        }
                                        title={
                                            <div className="!flex !items-center !justify-between">
                                                <Text strong>{participant.name}</Text>
                                                <Tag color="blue">{participant.bidCount} lượt</Tag>
                                            </div>
                                        }
                                        description={
                                            <div className="!flex !justify-between !text-sm">
                                                <span>📍 {participant.location}</span>
                                                <span>🏠 {participant.uniqueAssets.size} tài sản</span>
                                                <span>💰 {formatPrice(participant.avgBidValue)}/lượt</span>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>

            {/* ===== GEOGRAPHIC DISTRIBUTION ===== */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <EnvironmentOutlined className="!text-green-500" />
                    Phân bố địa lý & Thị phần
                </Title>
                <Row gutter={[16, 16]}>
                    {locationAnalytics.map((location, index) => (
                        <Col xs={24} sm={12} lg={8} xl={6} key={location.location}>
                            <Card size="small" className="!h-full">
                                <div className="!text-center !mb-3">
                                    <Text strong className="!text-lg">{location.location}</Text>
                                    <br />
                                    <Tag color="blue" className="!mt-1">
                                        #{index + 1} • {formatPercent(location.marketShare)} thị phần
                                    </Tag>
                                </div>
                                <div className="!space-y-2">
                                    <div className="!flex !justify-between">
                                        <Text type="secondary">Lượt đấu:</Text>
                                        <Text strong>{location.bidCount}</Text>
                                    </div>
                                    <div className="!flex !justify-between">
                                        <Text type="secondary">Người tham gia:</Text>
                                        <Text strong>{location.participantCount}</Text>
                                    </div>
                                    <div className="!flex !justify-between">
                                        <Text type="secondary">Giá TB:</Text>
                                        <Text strong>{formatPrice(location.avgBidValue)}</Text>
                                    </div>
                                    <Progress
                                        percent={Math.round(location.marketShare)}
                                        size="small"
                                        strokeColor={
                                            index === 0 ? '#52c41a' :
                                                index === 1 ? '#1890ff' :
                                                    index === 2 ? '#fa8c16' : '#722ed1'
                                        }
                                        format={(percent) => `${percent}%`}
                                    />
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Card>

            {/* ===== EFFICIENCY METRICS ===== */}
            <Card>
                <Title level={4} className="!mb-4 !flex !items-center !gap-2">
                    <LineChartOutlined className="!text-purple-500" />
                    Chỉ số hiệu quả
                </Title>
                <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Lượt đấu TB/Người"
                            value={averageBidsPerPerson}
                            precision={1}
                            prefix={<UserOutlined />}
                            valueStyle={{
                                color: averageBidsPerPerson >= 3 ? '#52c41a' :
                                    averageBidsPerPerson >= 2 ? '#fa8c16' : '#f5222d'
                            }}
                        />
                        <Progress
                            percent={Math.min((averageBidsPerPerson / 5) * 100, 100)}
                            size="small"
                            strokeColor={averageBidsPerPerson >= 3 ? '#52c41a' : averageBidsPerPerson >= 2 ? '#fa8c16' : '#f5222d'}
                            className="!mt-2"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Lượt đấu TB/Tài sản"
                            value={averageBidsPerAsset}
                            precision={1}
                            prefix={<HomeOutlined />}
                            valueStyle={{
                                color: averageBidsPerAsset >= 5 ? '#52c41a' :
                                    averageBidsPerAsset >= 3 ? '#fa8c16' : '#f5222d'
                            }}
                        />
                        <Progress
                            percent={Math.min((averageBidsPerAsset / 10) * 100, 100)}
                            size="small"
                            strokeColor={averageBidsPerAsset >= 5 ? '#52c41a' : averageBidsPerAsset >= 3 ? '#fa8c16' : '#f5222d'}
                            className="!mt-2"
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <Statistic
                            title="Tài sản có hoạt động"
                            value={`${activeAssets.length}/${auctionAssets.length}`}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{
                                color: assetUtilizationRate >= 80 ? '#52c41a' :
                                    assetUtilizationRate >= 60 ? '#fa8c16' : '#f5222d'
                            }}
                        />
                        <Progress
                            percent={assetUtilizationRate}
                            size="small"
                            strokeColor={assetUtilizationRate >= 80 ? '#52c41a' : assetUtilizationRate >= 60 ? '#fa8c16' : '#f5222d'}
                            className="!mt-2"
                        />
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AuctionStatistics;
