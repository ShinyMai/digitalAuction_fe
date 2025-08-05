import React from 'react';
import { Card, Row, Col, Statistic, Typography, Progress, Badge, Space } from 'antd';
import {
    GlobalOutlined,
    TrophyOutlined,
    RiseOutlined,
    FallOutlined,
    AimOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface StrategicOverviewProps {
    loading?: boolean;
}

interface StrategicGoal {
    title: string;
    current: number;
    target: number;
    unit: string;
    progress: number;
    status: 'on-track' | 'at-risk' | 'behind';
    priority: 'high' | 'medium' | 'low';
}

const StrategicOverview: React.FC<StrategicOverviewProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const strategicGoals: StrategicGoal[] = [
        {
            title: 'Market Expansion',
            current: 34.7,
            target: 45.0,
            unit: '%',
            progress: 77,
            status: 'on-track',
            priority: 'high'
        },
        {
            title: 'Digital Transformation',
            current: 68,
            target: 85,
            unit: '%',
            progress: 80,
            status: 'on-track',
            priority: 'high'
        },
        {
            title: 'Customer Acquisition',
            current: 15200,
            target: 20000,
            unit: 'customers',
            progress: 76,
            status: 'at-risk',
            priority: 'medium'
        },
        {
            title: 'Revenue Growth',
            current: 24.8,
            target: 30.0,
            unit: '%',
            progress: 83,
            status: 'on-track',
            priority: 'high'
        }
    ];

    const kpiMetrics = [
        {
            title: 'Strategic Score',
            value: 8.4,
            maxValue: 10,
            change: 0.3,
            trend: 'up',
            color: '#52c41a'
        },
        {
            title: 'Innovation Index',
            value: 7.8,
            maxValue: 10,
            change: 0.5,
            trend: 'up',
            color: '#1890ff'
        },
        {
            title: 'Market Position',
            value: 8.1,
            maxValue: 10,
            change: -0.2,
            trend: 'down',
            color: '#faad14'
        },
        {
            title: 'Competitive Advantage',
            value: 7.9,
            maxValue: 10,
            change: 0.4,
            trend: 'up',
            color: '#722ed1'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'on-track': return '#52c41a';
            case 'at-risk': return '#faad14';
            case 'behind': return '#f5222d';
            default: return '#8c8c8c';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'on-track': return 'Đúng tiến độ';
            case 'at-risk': return 'Có rủi ro';
            case 'behind': return 'Chậm tiến độ';
            default: return 'Chưa đánh giá';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'orange';
            case 'low': return 'green';
            default: return 'default';
        }
    };

    const formatValue = (value: number, unit: string) => {
        if (unit === 'customers') {
            return new Intl.NumberFormat('vi-VN').format(value);
        }
        return value.toString();
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <AimOutlined className="text-purple-500" />
                    <Title level={4} className="!mb-0">Strategic Overview</Title>
                </div>
            }
            extra={
                <Badge status="processing" text="Q4 2024" className="text-blue-600" />
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Strategic KPIs */}
            <Row gutter={[16, 16]} className="mb-6">
                {kpiMetrics.map((metric, index) => (
                    <Col xs={24} sm={12} lg={6} key={index}>
                        <Card
                            size="small"
                            className="!border-gray-200 hover:!shadow-md !transition-all text-center"
                        >
                            <div className="mb-2">
                                <div
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-full mb-2"
                                    style={{ backgroundColor: `${metric.color}20`, color: metric.color }}
                                >
                                    <ThunderboltOutlined />
                                </div>
                            </div>

                            <Statistic
                                title={
                                    <Text className="!text-gray-600 !text-xs">
                                        {metric.title}
                                    </Text>
                                }
                                value={metric.value}
                                precision={1}
                                suffix={`/${metric.maxValue}`}
                                valueStyle={{
                                    color: metric.color,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                }}
                            />

                            <Space size="small" className="mt-2">
                                {metric.trend === 'up' ?
                                    <RiseOutlined className="text-green-500 text-xs" /> :
                                    <FallOutlined className="text-red-500 text-xs" />
                                }
                                <Text
                                    className={`!text-xs !font-medium ${metric.trend === 'up' ? '!text-green-600' : '!text-red-600'
                                        }`}
                                >
                                    {Math.abs(metric.change)}
                                </Text>
                            </Space>

                            <Progress
                                percent={(metric.value / metric.maxValue) * 100}
                                size="small"
                                strokeColor={metric.color}
                                showInfo={false}
                                className="mt-2"
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Strategic Goals */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <GlobalOutlined className="text-blue-500" />
                    <Title level={5} className="!mb-0">Strategic Goals Progress</Title>
                </div>

                <div className="space-y-4">
                    {strategicGoals.map((goal, index) => (
                        <Card
                            key={index}
                            size="small"
                            className="!border-gray-200"
                        >
                            <Row gutter={[16, 8]} align="middle">
                                <Col xs={24} sm={8}>
                                    <div className="flex items-center gap-2">
                                        <TrophyOutlined style={{ color: getStatusColor(goal.status) }} />
                                        <div>
                                            <Text strong className="text-sm">{goal.title}</Text>
                                            <div className="flex gap-2 mt-1">
                                                <Badge
                                                    color={getStatusColor(goal.status)}
                                                    text={getStatusText(goal.status)}
                                                    className="text-xs"
                                                />
                                                <Badge
                                                    color={getPriorityColor(goal.priority)}
                                                    text={goal.priority.toUpperCase()}
                                                    className="text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <div className="text-center">
                                        <Text className="text-lg font-bold" style={{ color: getStatusColor(goal.status) }}>
                                            {formatValue(goal.current, goal.unit)}
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            /{formatValue(goal.target, goal.unit)} {goal.unit}
                                        </Text>
                                    </div>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <div>
                                        <div className="flex justify-between mb-1">
                                            <Text className="text-xs text-gray-500">Progress</Text>
                                            <Text className="text-xs font-medium">{goal.progress}%</Text>
                                        </div>
                                        <Progress
                                            percent={goal.progress}
                                            size="small"
                                            strokeColor={getStatusColor(goal.status)}
                                            trailColor="#f0f0f0"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </div>
            </div>
        </Card>
    );
};

export default StrategicOverview;
