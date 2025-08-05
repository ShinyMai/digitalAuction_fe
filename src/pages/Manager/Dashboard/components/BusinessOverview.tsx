import React from 'react';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import {
    TrophyOutlined,
    DollarOutlined,
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';

interface BusinessOverviewProps {
    loading?: boolean;
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({ loading = false }) => {
    // TODO: Replace with real data from API
    const businessMetrics = {
        totalAuctions: 156,
        totalRevenue: 2450000000,
        averageParticipants: 24,
        successRate: 87.5,
        pendingApprovals: 12,
        approvalRate: 94.2
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(value);
    };

    return (
        <Card title="📊 Tổng quan kinh doanh" loading={loading}>
            <Row gutter={[16, 16]}>
                {/* Tổng phiên đấu giá */}
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-blue-200 !bg-blue-50 hover:!shadow-md !transition-all">
                        <Statistic
                            title={<span className="!text-blue-700 !font-medium">Tổng phiên đấu giá</span>}
                            value={businessMetrics.totalAuctions}
                            prefix={<FileTextOutlined className="!text-blue-500" />}
                            valueStyle={{ color: '#1d4ed8' }}
                        />
                        <div className="!mt-2">
                            <Progress
                                percent={Math.round((businessMetrics.totalAuctions / 200) * 100)}
                                size="small"
                                strokeColor="#1890ff"
                                showInfo={false}
                            />
                            <span className="!text-xs !text-gray-500">
                                Mục tiêu: 200 phiên
                            </span>
                        </div>
                    </Card>
                </Col>

                {/* Tổng doanh thu */}
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-green-200 !bg-green-50 hover:!shadow-md !transition-all">
                        <Statistic
                            title={<span className="!text-green-700 !font-medium">Tổng doanh thu</span>}
                            value={businessMetrics.totalRevenue}
                            prefix={<DollarOutlined className="!text-green-500" />}
                            valueStyle={{ color: '#059669' }}
                            formatter={(value) => formatCurrency(Number(value))}
                        />
                        <div className="!mt-2 !flex !items-center !gap-1">
                            <span className="!text-xs !text-green-600 !font-medium">+15.2%</span>
                            <span className="!text-xs !text-gray-500">so với tháng trước</span>
                        </div>
                    </Card>
                </Col>

                {/* Tỷ lệ thành công */}
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-yellow-200 !bg-yellow-50 hover:!shadow-md !transition-all">
                        <Statistic
                            title={<span className="!text-yellow-700 !font-medium">Tỷ lệ thành công</span>}
                            value={businessMetrics.successRate}
                            precision={1}
                            suffix="%"
                            prefix={<TrophyOutlined className="!text-yellow-500" />}
                            valueStyle={{ color: '#d97706' }}
                        />
                        <div className="!mt-2">
                            <Progress
                                percent={businessMetrics.successRate}
                                size="small"
                                strokeColor="#faad14"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>

                {/* Người tham gia TB */}
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-purple-200 !bg-purple-50 hover:!shadow-md !transition-all">
                        <Statistic
                            title={<span className="!text-purple-700 !font-medium">Người tham gia TB</span>}
                            value={businessMetrics.averageParticipants}
                            prefix={<UserOutlined className="!text-purple-500" />}
                            valueStyle={{ color: '#7c3aed' }}
                            suffix="người"
                        />
                    </Card>
                </Col>

                {/* Chờ phê duyệt */}
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-orange-200 !bg-orange-50 hover:!shadow-md !transition-all">
                        <Statistic
                            title={<span className="!text-orange-700 !font-medium">Chờ phê duyệt</span>}
                            value={businessMetrics.pendingApprovals}
                            prefix={<ClockCircleOutlined className="!text-orange-500" />}
                            valueStyle={{ color: '#ea580c' }}
                        />
                    </Card>
                </Col>

                {/* Tỷ lệ phê duyệt */}
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-emerald-200 !bg-emerald-50 hover:!shadow-md !transition-all">
                        <Statistic
                            title={<span className="!text-emerald-700 !font-medium">Tỷ lệ phê duyệt</span>}
                            value={businessMetrics.approvalRate}
                            precision={1}
                            suffix="%"
                            prefix={<CheckCircleOutlined className="!text-emerald-500" />}
                            valueStyle={{ color: '#059669' }}
                        />
                        <div className="!mt-2">
                            <Progress
                                percent={businessMetrics.approvalRate}
                                size="small"
                                strokeColor="#10b981"
                                showInfo={false}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default BusinessOverview;
