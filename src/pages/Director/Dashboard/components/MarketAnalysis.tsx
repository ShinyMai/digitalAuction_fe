import React from 'react';
import { Card, Row, Col, Typography, Space, Badge, Progress } from 'antd';
import {
    GlobalOutlined,
    ArrowUpOutlined,
    BarChartOutlined,
    PieChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface MarketAnalysisProps {
    loading?: boolean;
}

interface MarketSegment {
    name: string;
    marketShare: number;
    growth: number;
    potential: number;
    competitive: 'high' | 'medium' | 'low';
}

interface CompetitorData {
    name: string;
    marketShare: number;
    change: number;
    threat: 'high' | 'medium' | 'low';
}

const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const marketSegments: MarketSegment[] = [
        {
            name: 'Real Estate Auctions',
            marketShare: 45.2,
            growth: 12.8,
            potential: 85,
            competitive: 'high'
        },
        {
            name: 'Asset Recovery',
            marketShare: 28.7,
            growth: 8.5,
            potential: 72,
            competitive: 'medium'
        },
        {
            name: 'Government Auctions',
            marketShare: 16.8,
            growth: 15.2,
            potential: 90,
            competitive: 'low'
        },
        {
            name: 'Online Marketplace',
            marketShare: 9.3,
            growth: 25.4,
            potential: 95,
            competitive: 'high'
        }
    ];

    const competitors: CompetitorData[] = [
        { name: 'Competitor A', marketShare: 32.1, change: -2.3, threat: 'high' },
        { name: 'Competitor B', marketShare: 18.9, change: 1.2, threat: 'medium' },
        { name: 'Competitor C', marketShare: 12.4, change: -0.8, threat: 'low' },
        { name: 'Others', marketShare: 36.6, change: 1.9, threat: 'medium' }
    ];

    const getCompetitiveColor = (level: string) => {
        switch (level) {
            case 'high': return '#f5222d';
            case 'medium': return '#faad14';
            case 'low': return '#52c41a';
            default: return '#8c8c8c';
        }
    };

    const getThreatColor = (threat: string) => {
        switch (threat) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const getThreatText = (threat: string) => {
        switch (threat) {
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return 'Chưa đánh giá';
        }
    };

    const getCompetitiveText = (level: string) => {
        switch (level) {
            case 'high': return 'Cạnh tranh cao';
            case 'medium': return 'Cạnh tranh TB';
            case 'low': return 'Cạnh tranh thấp';
            default: return 'Chưa đánh giá';
        }
    };

    const totalMarketSize = 2.8; // Tỷ USD
    const ourMarketShare = 34.7; // %
    const marketGrowthRate = 15.2; // %

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <GlobalOutlined className="text-green-500" />
                    <Title level={4} className="!mb-0">Market Analysis</Title>
                </div>
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Market Overview */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={8}>
                    <Card size="small" className="!border-blue-200 !bg-blue-50 text-center">
                        <Text className="!text-blue-700 !text-sm !block !mb-1">Market Size</Text>
                        <Text className="!text-2xl !font-bold !text-blue-600">
                            ${totalMarketSize}B
                        </Text>
                        <Text className="!text-xs !text-gray-500">Total Addressable Market</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" className="!border-green-200 !bg-green-50 text-center">
                        <Text className="!text-green-700 !text-sm !block !mb-1">Our Share</Text>
                        <Text className="!text-2xl !font-bold !text-green-600">
                            {ourMarketShare}%
                        </Text>
                        <Text className="!text-xs !text-gray-500">Market Leadership</Text>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card size="small" className="!border-purple-200 !bg-purple-50 text-center">
                        <Text className="!text-purple-700 !text-sm !block !mb-1">Growth Rate</Text>
                        <Text className="!text-2xl !font-bold !text-purple-600">
                            +{marketGrowthRate}%
                        </Text>
                        <Text className="!text-xs !text-gray-500">YoY Growth</Text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[24, 24]}>
                {/* Market Segments */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <PieChartOutlined className="text-blue-500" />
                                <Text strong>Market Segments</Text>
                            </div>
                        }
                        size="small"
                        className="h-full"
                    >
                        <div className="space-y-4">
                            {marketSegments.map((segment, index) => (
                                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <Text strong className="text-sm">{segment.name}</Text>
                                        <Space size="small">
                                            <Badge
                                                color={getCompetitiveColor(segment.competitive)}
                                                text={getCompetitiveText(segment.competitive)}
                                                className="text-xs"
                                            />
                                        </Space>
                                    </div>

                                    <Row gutter={[8, 8]}>
                                        <Col xs={8}>
                                            <Text className="text-xs text-gray-500 block">Market Share</Text>
                                            <Text className="text-sm font-medium">{segment.marketShare}%</Text>
                                        </Col>
                                        <Col xs={8}>
                                            <Text className="text-xs text-gray-500 block">Growth</Text>
                                            <Text className="text-sm font-medium text-green-600">
                                                +{segment.growth}%
                                            </Text>
                                        </Col>
                                        <Col xs={8}>
                                            <Text className="text-xs text-gray-500 block">Potential</Text>
                                            <Progress
                                                percent={segment.potential}
                                                size="small"
                                                strokeColor="#1890ff"
                                                format={(percent) => `${percent}%`}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* Competitive Landscape */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <BarChartOutlined className="text-red-500" />
                                <Text strong>Competitive Landscape</Text>
                            </div>
                        }
                        size="small"
                        className="h-full"
                    >
                        <div className="space-y-4">
                            {competitors.map((competitor, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{
                                                backgroundColor: index === 0 ? '#1890ff' :
                                                    index === 1 ? '#52c41a' :
                                                        index === 2 ? '#faad14' : '#8c8c8c'
                                            }}
                                        />
                                        <div>
                                            <Text strong className="text-sm">{competitor.name}</Text>
                                            <div>
                                                <Badge
                                                    color={getThreatColor(competitor.threat)}
                                                    text={`Threat: ${getThreatText(competitor.threat)}`}
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <Text className="text-sm font-bold">
                                            {competitor.marketShare}%
                                        </Text>
                                        <div className="flex items-center gap-1">
                                            <ArrowUpOutlined
                                                className={`text-xs ${competitor.change > 0 ? 'text-green-500' : 'text-red-500'
                                                    }`}
                                            />
                                            <Text
                                                className={`text-xs ${competitor.change > 0 ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {competitor.change > 0 ? '+' : ''}{competitor.change}%
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Market Opportunity */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <Text strong className="text-blue-700 text-sm block mb-2">
                                Market Opportunity
                            </Text>
                            <Text className="text-xs text-gray-600">
                                Potential market expansion in government auctions (+15.2% growth)
                                and online marketplace segments (+25.4% growth) presents significant
                                opportunities for revenue diversification.
                            </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default MarketAnalysis;
