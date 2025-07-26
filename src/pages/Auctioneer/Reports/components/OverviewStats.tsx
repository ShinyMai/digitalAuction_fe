import React from 'react';
import { Card, Statistic, Row, Col, Progress } from 'antd';
import {
    DollarOutlined,
    TrophyOutlined,
    UserOutlined,
    BarChartOutlined,
    RiseOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import type { PerformanceStats, ParticipantStats } from '../types';

interface OverviewStatsProps {
    performanceStats: PerformanceStats;
    participantStats: ParticipantStats;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({
    performanceStats,
    participantStats
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="!mb-6">
            <Row gutter={[16, 16]}>
                {/* Tổng số cuộc đấu giá */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="!border-blue-200 !bg-blue-50 hover:!shadow-lg !transition-all">
                        <Statistic
                            title={<span className="!text-blue-700 !font-medium">Tổng cuộc đấu giá</span>}
                            value={performanceStats.totalAuctions}
                            prefix={<CalendarOutlined className="!text-blue-500" />}
                            valueStyle={{ color: '#1d4ed8' }}
                        />
                        <div className="!mt-2">
                            <Progress
                                percent={Math.round((performanceStats.completedAuctions / performanceStats.totalAuctions) * 100)}
                                size="small"
                                strokeColor="#1890ff"
                                showInfo={false}
                            />
                            <span className="!text-xs !text-gray-500">
                                {performanceStats.completedAuctions} hoàn thành
                            </span>
                        </div>
                    </Card>
                </Col>

                {/* Tỷ lệ thành công */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="!border-green-200 !bg-green-50 hover:!shadow-lg !transition-all">
                        <Statistic
                            title={<span className="!text-green-700 !font-medium">Tỷ lệ thành công</span>}
                            value={performanceStats.successRate}
                            precision={1}
                            suffix="%"
                            prefix={<TrophyOutlined className="!text-green-500" />}
                            valueStyle={{ color: '#059669' }}
                        />
                        <div className="!mt-2">
                            <Progress
                                percent={performanceStats.successRate}
                                size="small"
                                strokeColor="#52c41a"
                                showInfo={false}
                            />
                            <span className="!text-xs !text-gray-500">
                                {performanceStats.cancelledAuctions} bị hủy
                            </span>
                        </div>
                    </Card>
                </Col>

                {/* Tổng doanh thu */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="!border-yellow-200 !bg-yellow-50 hover:!shadow-lg !transition-all">
                        <Statistic
                            title={<span className="!text-yellow-700 !font-medium">Tổng doanh thu</span>}
                            value={performanceStats.totalRevenue}
                            prefix={<DollarOutlined className="!text-yellow-500" />}
                            valueStyle={{ color: '#d97706' }}
                            formatter={(value) => formatCurrency(Number(value))}
                        />
                        <div className="!mt-2 !flex !items-center !gap-1">
                            <RiseOutlined className="!text-green-500 !text-xs" />
                            <span className="!text-xs !text-green-600 !font-medium">+12.5%</span>
                            <span className="!text-xs !text-gray-500">so với tháng trước</span>
                        </div>
                    </Card>
                </Col>

                {/* Người tham gia trung bình */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <Card className="!border-purple-200 !bg-purple-50 hover:!shadow-lg !transition-all">
                        <Statistic
                            title={<span className="!text-purple-700 !font-medium">TB người tham gia</span>}
                            value={performanceStats.averageParticipants}
                            prefix={<UserOutlined className="!text-purple-500" />}
                            valueStyle={{ color: '#7c3aed' }}
                            suffix="người"
                        />
                        <div className="!mt-2">
                            <Progress
                                percent={Math.round((performanceStats.averageParticipants / 25) * 100)}
                                size="small"
                                strokeColor="#722ed1"
                                showInfo={false}
                            />
                            <span className="!text-xs !text-gray-500">
                                Mục tiêu: 25 người
                            </span>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Thống kê người tham gia */}
            <Row gutter={[16, 16]} className="!mt-4">
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-gray-200 hover:!shadow-md !transition-all">
                        <Statistic
                            title="Tổng người tham gia"
                            value={participantStats.totalParticipants}
                            prefix={<BarChartOutlined className="!text-gray-500" />}
                            valueStyle={{ color: '#374151' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-gray-200 hover:!shadow-md !transition-all">
                        <Statistic
                            title="Đang hoạt động"
                            value={participantStats.activeParticipants}
                            prefix={<UserOutlined className="!text-green-500" />}
                            valueStyle={{ color: '#059669' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-gray-200 hover:!shadow-md !transition-all">
                        <Statistic
                            title="Người mới"
                            value={participantStats.newParticipants}
                            prefix={<RiseOutlined className="!text-blue-500" />}
                            valueStyle={{ color: '#1d4ed8' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-gray-200 hover:!shadow-md !transition-all">
                        <Statistic
                            title="Blacklist"
                            value={participantStats.blacklistedUsers}
                            valueStyle={{ color: '#dc2626' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default OverviewStats;
