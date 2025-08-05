import React from 'react';
import { Card, Row, Col, Statistic, Badge, Typography, Space } from 'antd';
import {
    RiseOutlined,
    FallOutlined,
    DollarOutlined,
    TrophyOutlined,
    GlobalOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    SafetyOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface ExecutiveSummaryProps {
    loading?: boolean;
}

interface KPIData {
    title: string;
    value: number;
    target: number;
    change: number;
    unit: string;
    status: 'up' | 'down' | 'stable';
    icon: React.ReactNode;
    color: string;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const kpiData: KPIData[] = [
        {
            title: 'Tổng doanh thu',
            value: 15.2,
            target: 18.0,
            change: 12.5,
            unit: 'tỷ VNĐ',
            status: 'up',
            icon: <DollarOutlined />,
            color: '#52c41a'
        },
        {
            title: 'Market Share',
            value: 34.7,
            target: 40.0,
            change: 2.3,
            unit: '%',
            status: 'up',
            icon: <GlobalOutlined />,
            color: '#1890ff'
        },
        {
            title: 'ROI',
            value: 28.4,
            target: 25.0,
            change: 5.6,
            unit: '%',
            status: 'up',
            icon: <TrophyOutlined />,
            color: '#faad14'
        },
        {
            title: 'Customer Satisfaction',
            value: 94.2,
            target: 95.0,
            change: -1.1,
            unit: '%',
            status: 'down',
            icon: <TeamOutlined />,
            color: '#f5222d'
        }
    ];

    const formatValue = (value: number, unit: string) => {
        if (unit === 'tỷ VNĐ') {
            return `${value}`;
        }
        return value.toString();
    };

    const getStatusIcon = (status: string) => {
        if (status === 'up') {
            return <RiseOutlined className="text-green-500" />;
        } else if (status === 'down') {
            return <FallOutlined className="text-red-500" />;
        }
        return null;
    };

    const getTargetStatus = (value: number, target: number): 'success' | 'warning' | 'error' => {
        const percentage = (value / target) * 100;
        if (percentage >= 95) return 'success';
        if (percentage >= 80) return 'warning';
        return 'error';
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <ThunderboltOutlined className="text-yellow-500" />
                    <Title level={4} className="!mb-0">Executive KPIs</Title>
                </div>
            }
            extra={
                <Badge
                    status="processing"
                    text="Real-time"
                    className="text-blue-600"
                />
            }
            loading={loading}
            className="shadow-lg border-0"
        >
            <Row gutter={[24, 24]}>
                {kpiData.map((kpi, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            className={`
                                !border-2 hover:!shadow-xl !transition-all !duration-300 !cursor-pointer
                                ${getTargetStatus(kpi.value, kpi.target) === 'success' ? '!border-green-200 !bg-green-50' :
                                    getTargetStatus(kpi.value, kpi.target) === 'warning' ? '!border-yellow-200 !bg-yellow-50' :
                                        '!border-red-200 !bg-red-50'}
                            `}
                        >
                            <div className="text-center">
                                {/* Icon */}
                                <div
                                    className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 text-xl"
                                    style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}
                                >
                                    {kpi.icon}
                                </div>

                                {/* Value */}
                                <Statistic
                                    title={
                                        <Text className="!text-gray-700 !font-medium !text-sm">
                                            {kpi.title}
                                        </Text>
                                    }
                                    value={formatValue(kpi.value, kpi.unit)}
                                    suffix={kpi.unit}
                                    valueStyle={{
                                        color: kpi.color,
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}
                                />

                                {/* Change Indicator */}
                                <Space className="mt-2" size="small">
                                    {getStatusIcon(kpi.status)}
                                    <Text
                                        className={`
                                            !text-sm !font-medium
                                            ${kpi.status === 'up' ? '!text-green-600' : '!text-red-600'}
                                        `}
                                    >
                                        {Math.abs(kpi.change)}%
                                    </Text>
                                </Space>

                                {/* Target Progress */}
                                <div className="mt-3">
                                    <div className="flex justify-between items-center mb-1">
                                        <Text className="!text-xs !text-gray-500">Mục tiêu</Text>
                                        <Text className="!text-xs !text-gray-500">
                                            {kpi.target}{kpi.unit}
                                        </Text>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                        <div
                                            className={`
                                                h-1.5 rounded-full transition-all duration-500
                                                ${getTargetStatus(kpi.value, kpi.target) === 'success' ? 'bg-green-500' :
                                                    getTargetStatus(kpi.value, kpi.target) === 'warning' ? 'bg-yellow-500' :
                                                        'bg-red-500'}
                                            `}
                                            style={{
                                                width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Risk Indicators */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                    <SafetyOutlined className="text-orange-500" />
                    <Title level={5} className="!mb-0">Risk Dashboard</Title>
                </div>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                        <div className="text-center">
                            <Badge status="success" />
                            <Text className="!text-sm !ml-2">Operational Risk: Low</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <div className="text-center">
                            <Badge status="warning" />
                            <Text className="!text-sm !ml-2">Market Risk: Medium</Text>
                        </div>
                    </Col>
                    <Col xs={24} sm={8}>
                        <div className="text-center">
                            <Badge status="success" />
                            <Text className="!text-sm !ml-2">Compliance: Good</Text>
                        </div>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default ExecutiveSummary;
