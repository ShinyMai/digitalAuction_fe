import React from 'react';
import { Card, Row, Col, Statistic, Typography, List, Space, Progress } from 'antd';
import {
    TeamOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface PerformanceAnalyticsProps {
    loading?: boolean;
}

interface StaffPerformance {
    name: string;
    role: string;
    efficiency: number;
    approvals: number;
    avgTime: number; // hours
    satisfaction: number;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const staffPerformance: StaffPerformance[] = [
        {
            name: 'Nguyễn Văn A',
            role: 'Senior Manager',
            efficiency: 95,
            approvals: 28,
            avgTime: 1.2,
            satisfaction: 92
        },
        {
            name: 'Trần Thị B',
            role: 'Approval Specialist',
            efficiency: 88,
            approvals: 35,
            avgTime: 1.8,
            satisfaction: 89
        },
        {
            name: 'Lê Văn C',
            role: 'Document Reviewer',
            efficiency: 91,
            approvals: 31,
            avgTime: 1.5,
            satisfaction: 94
        }
    ];

    const departmentStats = {
        totalStaff: 12,
        activeStaff: 11,
        avgEfficiency: 91.2,
        avgSatisfaction: 90.8
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 90) return '#52c41a';
        if (efficiency >= 80) return '#faad14';
        return '#f5222d';
    };

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <BarChartOutlined className="text-orange-500" />
                    <Title level={4} className="!mb-0">Performance Analytics</Title>
                </div>
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Department Overview */}
            <Row gutter={[16, 16]} className="mb-6">
                <Col xs={24} sm={6}>
                    <Card size="small" className="!border-blue-200 !bg-blue-50 text-center">
                        <Statistic
                            title={<span className="!text-blue-700 !text-xs">Total Staff</span>}
                            value={departmentStats.totalStaff}
                            prefix={<TeamOutlined className="!text-blue-500" />}
                            valueStyle={{ color: '#1890ff', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" className="!border-green-200 !bg-green-50 text-center">
                        <Statistic
                            title={<span className="!text-green-700 !text-xs">Active</span>}
                            value={departmentStats.activeStaff}
                            valueStyle={{ color: '#52c41a', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" className="!border-yellow-200 !bg-yellow-50 text-center">
                        <Statistic
                            title={<span className="!text-yellow-700 !text-xs">Avg Efficiency</span>}
                            value={departmentStats.avgEfficiency}
                            suffix="%"
                            precision={1}
                            valueStyle={{ color: '#faad14', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" className="!border-purple-200 !bg-purple-50 text-center">
                        <Statistic
                            title={<span className="!text-purple-700 !text-xs">Satisfaction</span>}
                            value={departmentStats.avgSatisfaction}
                            suffix="%"
                            precision={1}
                            valueStyle={{ color: '#722ed1', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Individual Performance */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrophyOutlined className="text-yellow-500" />
                    <Title level={5} className="!mb-0">Individual Performance</Title>
                </div>

                <List
                    dataSource={staffPerformance}
                    renderItem={(staff, index) => (
                        <List.Item key={index} className="!border-0 !p-4 !bg-gray-50 !rounded !mb-3">
                            <div className="w-full">
                                <Row gutter={[16, 8]} align="middle">
                                    <Col xs={24} sm={8}>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${index === 0 ? 'bg-blue-500' :
                                                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                                                    }`}
                                            >
                                                {staff.name.charAt(0)}
                                            </div>
                                            <div>
                                                <Text strong className="text-sm">{staff.name}</Text>
                                                <div>
                                                    <Text className="text-xs text-gray-500">{staff.role}</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col xs={24} sm={16}>
                                        <Row gutter={[8, 8]}>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div
                                                        className="text-lg font-bold"
                                                        style={{ color: getEfficiencyColor(staff.efficiency) }}
                                                    >
                                                        {staff.efficiency}%
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Efficiency</Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {staff.approvals}
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Approvals</Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-green-600">
                                                        {staff.avgTime}h
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Avg Time</Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {staff.satisfaction}%
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Rating</Text>
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Performance Bar */}
                                        <div className="mt-2">
                                            <Progress
                                                percent={staff.efficiency}
                                                size="small"
                                                strokeColor={getEfficiencyColor(staff.efficiency)}
                                                showInfo={false}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            {/* Performance Insights */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                    <ClockCircleOutlined className="text-blue-500" />
                    <Text strong className="text-blue-700">Performance Insights</Text>
                </div>
                <Space direction="vertical" size="small">
                    <Text className="text-sm text-gray-600">
                        • Team efficiency is above target (91.2% vs 85% target)
                    </Text>
                    <Text className="text-sm text-gray-600">
                        • Average processing time has improved by 15% this quarter
                    </Text>
                    <Text className="text-sm text-gray-600">
                        • Customer satisfaction remains consistently high (90.8%)
                    </Text>
                </Space>
            </div>
        </Card>
    );
};

export default PerformanceAnalytics;
