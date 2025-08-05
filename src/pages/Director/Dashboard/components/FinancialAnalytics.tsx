import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Space, Badge } from 'antd';
import {
    DollarOutlined,
    RiseOutlined,
    FallOutlined,
    ArrowUpOutlined,
    PieChartOutlined,
    LineChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface FinancialAnalyticsProps {
    loading?: boolean;
}

interface FinancialMetric {
    title: string;
    value: number;
    change: number;
    unit: string;
    target?: number;
    trend: 'up' | 'down' | 'stable';
}

const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const financialMetrics: FinancialMetric[] = [
        {
            title: 'Revenue Growth',
            value: 24.8,
            change: 12.5,
            unit: '%',
            target: 25.0,
            trend: 'up'
        },
        {
            title: 'Profit Margin',
            value: 18.7,
            change: 3.2,
            unit: '%',
            target: 20.0,
            trend: 'up'
        },
        {
            title: 'EBITDA',
            value: 5.2,
            change: -2.1,
            unit: 'tỷ VNĐ',
            trend: 'down'
        },
        {
            title: 'Cash Flow',
            value: 3.8,
            change: 8.9,
            unit: 'tỷ VNĐ',
            trend: 'up'
        }
    ];

    const revenueBreakdown = [
        { category: 'Đấu giá BĐS', value: 45.2, color: '#1890ff' },
        { category: 'Đấu giá TSC', value: 28.7, color: '#52c41a' },
        { category: 'Phí dịch vụ', value: 16.8, color: '#faad14' },
        { category: 'Khác', value: 9.3, color: '#f5222d' }
    ];

    const formatValue = (value: number, unit: string) => {
        if (unit === 'tỷ VNĐ') {
            return value.toFixed(1);
        }
        return value.toString();
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <RiseOutlined className="text-green-500" />;
            case 'down': return <FallOutlined className="text-red-500" />;
            default: return <ArrowUpOutlined className="text-gray-500" />;
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up': return '#52c41a';
            case 'down': return '#f5222d';
            default: return '#8c8c8c';
        }
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <DollarOutlined className="text-green-500" />
                    <Title level={4} className="!mb-0">Financial Analytics</Title>
                </div>
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Key Financial Metrics */}
            <Row gutter={[16, 16]} className="mb-6">
                {financialMetrics.map((metric, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            className="!border-gray-200 hover:!shadow-md !transition-all"
                            size="small"
                        >
                            <div className="text-center">
                                <Statistic
                                    title={
                                        <Text className="!text-gray-600 !text-xs">
                                            {metric.title}
                                        </Text>
                                    }
                                    value={formatValue(metric.value, metric.unit)}
                                    suffix={metric.unit}
                                    valueStyle={{
                                        color: getTrendColor(metric.trend),
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold'
                                    }}
                                />

                                <Space className="mt-2" size="small">
                                    {getTrendIcon(metric.trend)}
                                    <Text
                                        className={`!text-xs !font-medium`}
                                        style={{ color: getTrendColor(metric.trend) }}
                                    >
                                        {Math.abs(metric.change)}%
                                    </Text>
                                </Space>

                                {metric.target && (
                                    <div className="mt-2">
                                        <Progress
                                            percent={Math.min((metric.value / metric.target) * 100, 100)}
                                            size="small"
                                            strokeColor={getTrendColor(metric.trend)}
                                            showInfo={false}
                                        />
                                        <Text className="!text-xs !text-gray-500">
                                            Target: {metric.target}{metric.unit}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Revenue Breakdown */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <PieChartOutlined className="text-blue-500" />
                                <Text strong>Revenue Breakdown</Text>
                            </div>
                        }
                        size="small"
                        className="h-full"
                    >
                        <div className="space-y-3">
                            {revenueBreakdown.map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <Text className="text-sm">{item.category}</Text>
                                    </div>
                                    <div className="text-right">
                                        <Text strong className="text-sm">{item.value}%</Text>
                                        <div>
                                            <Progress
                                                percent={item.value}
                                                size="small"
                                                strokeColor={item.color}
                                                showInfo={false}
                                                className="w-20"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <div className="flex items-center gap-2">
                                <LineChartOutlined className="text-purple-500" />
                                <Text strong>Financial Health Score</Text>
                            </div>
                        }
                        size="small"
                        className="h-full"
                    >
                        <div className="text-center mb-4">
                            <div className="text-3xl font-bold text-green-600 mb-2">8.7/10</div>
                            <Badge status="success" text="Excellent" className="text-green-600" />
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text className="text-sm">Liquidity</Text>
                                    <Text className="text-sm">9.2</Text>
                                </div>
                                <Progress percent={92} size="small" strokeColor="#52c41a" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text className="text-sm">Profitability</Text>
                                    <Text className="text-sm">8.5</Text>
                                </div>
                                <Progress percent={85} size="small" strokeColor="#1890ff" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text className="text-sm">Efficiency</Text>
                                    <Text className="text-sm">8.4</Text>
                                </div>
                                <Progress percent={84} size="small" strokeColor="#faad14" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-1">
                                    <Text className="text-sm">Stability</Text>
                                    <Text className="text-sm">8.8</Text>
                                </div>
                                <Progress percent={88} size="small" strokeColor="#722ed1" />
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default FinancialAnalytics;
