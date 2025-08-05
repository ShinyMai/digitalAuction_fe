import React from 'react';
import { Card, Row, Col, Statistic, Typography, List, Space, Progress } from 'antd';
import {
    TeamOutlined,
    ClockCircleOutlined,
    TrophyOutlined,
    BarChartOutlined
} from '@ant-design/icons';
import { Pie } from '@ant-design/plots';

const { Title, Text } = Typography;

interface PerformanceAnalyticsProps {
    loading?: boolean;
}

interface StaffPerformance {
    userId: string;
    name: string;
    role: string;
    efficiency: number;
    totalApprovals: number;
    avgProcessingTime: number; // hours
    customerSatisfaction: number;
    completedAuctions: number;
    processingDocuments: number;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({ loading = false }) => {
    // Mock data based on real database structure
    const staffPerformance: StaffPerformance[] = [
        {
            userId: "user_001",
            name: 'Nguyễn Văn A',
            role: 'Quản lý cấp cao',
            efficiency: 95,
            totalApprovals: 28,
            avgProcessingTime: 1.2,
            customerSatisfaction: 92,
            completedAuctions: 15,
            processingDocuments: 3
        },
        {
            userId: "user_002",
            name: 'Trần Thị B',
            role: 'Chuyên viên phê duyệt',
            efficiency: 88,
            totalApprovals: 35,
            avgProcessingTime: 1.8,
            customerSatisfaction: 89,
            completedAuctions: 12,
            processingDocuments: 5
        },
        {
            userId: "user_003",
            name: 'Lê Văn C',
            role: 'Chuyên viên xem xét hồ sơ',
            efficiency: 91,
            totalApprovals: 31,
            avgProcessingTime: 1.5,
            customerSatisfaction: 94,
            completedAuctions: 18,
            processingDocuments: 2
        }
    ];

    const departmentStats = {
        totalStaff: 12,
        activeStaff: 11,
        avgEfficiency: 91.2,
        avgSatisfaction: 90.8
    };

    // Data for pie chart
    const efficiencyDistribution = [
        { type: 'Xuất sắc (90%+)', value: 8, percent: 66.7 },
        { type: 'Tốt (80-89%)', value: 3, percent: 25.0 },
        { type: 'Cần cải thiện (<80%)', value: 1, percent: 8.3 }
    ];

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
                    <Title level={4} className="!mb-0">Phân tích hiệu suất</Title>
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
                            title={<span className="!text-blue-700 !text-xs">Tổng nhân viên</span>}
                            value={departmentStats.totalStaff}
                            prefix={<TeamOutlined className="!text-blue-500" />}
                            valueStyle={{ color: '#1890ff', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" className="!border-green-200 !bg-green-50 text-center">
                        <Statistic
                            title={<span className="!text-green-700 !text-xs">Đang hoạt động</span>}
                            value={departmentStats.activeStaff}
                            valueStyle={{ color: '#52c41a', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={6}>
                    <Card size="small" className="!border-yellow-200 !bg-yellow-50 text-center">
                        <Statistic
                            title={<span className="!text-yellow-700 !text-xs">Hiệu suất TB</span>}
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
                            title={<span className="!text-purple-700 !text-xs">Hài lòng TB</span>}
                            value={departmentStats.avgSatisfaction}
                            suffix="%"
                            precision={1}
                            valueStyle={{ color: '#722ed1', fontSize: '1.2rem' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Efficiency Distribution Chart */}
            <Row gutter={[24, 24]} className="mb-6">
                <Col xs={24} lg={12}>
                    <div>
                        <div className="mb-3 text-gray-600 font-medium">Phân bố hiệu suất nhân viên</div>
                        <Pie
                            data={efficiencyDistribution}
                            angleField="value"
                            colorField="type"
                            radius={0.8}
                            height={250}
                            color={['#52c41a', '#faad14', '#f5222d']}
                            label={{
                                type: 'outer',
                                content: '{name} ({percentage})',
                            }}
                            interactions={[
                                {
                                    type: 'element-active',
                                },
                            ]}
                        />
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div className="space-y-4 pt-8">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <span className="text-sm font-medium text-green-700">Hiệu suất xuất sắc</span>
                            <span className="text-lg font-bold text-green-600">8 người (67%)</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <span className="text-sm font-medium text-yellow-700">Hiệu suất tốt</span>
                            <span className="text-lg font-bold text-yellow-600">3 người (25%)</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <span className="text-sm font-medium text-red-700">Cần cải thiện</span>
                            <span className="text-lg font-bold text-red-600">1 người (8%)</span>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Individual Performance */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <TrophyOutlined className="text-yellow-500" />
                    <Title level={5} className="!mb-0">Hiệu suất cá nhân</Title>
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
                                                    <Text className="text-xs text-gray-500">Hiệu suất</Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-blue-600">
                                                        {staff.totalApprovals}
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Phê duyệt</Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-green-600">
                                                        {staff.avgProcessingTime}h
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Thời gian TB</Text>
                                                </div>
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <div className="text-center">
                                                    <div className="text-lg font-bold text-purple-600">
                                                        {staff.customerSatisfaction}%
                                                    </div>
                                                    <Text className="text-xs text-gray-500">Đánh giá</Text>
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
                    <Text strong className="text-blue-700">Nhận xét hiệu suất</Text>
                </div>
                <Space direction="vertical" size="small">
                    <Text className="text-sm text-gray-600">
                        • Hiệu suất nhóm vượt mục tiêu (91.2% so với 85% mục tiêu)
                    </Text>
                    <Text className="text-sm text-gray-600">
                        • Thời gian xử lý trung bình cải thiện 15% trong quý này
                    </Text>
                    <Text className="text-sm text-gray-600">
                        • Mức độ hài lòng của khách hàng duy trì ổn định cao (90.8%)
                    </Text>
                </Space>
            </div>
        </Card>
    );
};

export default PerformanceAnalytics;
