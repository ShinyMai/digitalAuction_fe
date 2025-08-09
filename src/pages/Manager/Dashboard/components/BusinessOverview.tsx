import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import {
    FileTextOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    UserOutlined
} from '@ant-design/icons';

interface BusinessOverviewProps {
    loading?: boolean;
}

const BusinessOverview: React.FC<BusinessOverviewProps> = ({ loading = false }) => {
    // Business metrics data matching your requirements
    const businessMetrics = {
        totalAuctions: 156,        // Tổng số phiên đấu giá
        successfulAuctions: 136,   // Tổng số phiên thành công
        canceledAuctions: 20,      // Tổng số phiên bị hủy
        totalParticipants: 1240    // Tổng số người tham gia
    };

    return (
        <Card title="📊 Tổng quan kinh doanh" loading={loading} className="!border-0">
            <Row gutter={[24, 24]}>
                {/* Tổng số phiên đấu giá */}
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-blue-50 !to-blue-100 !rounded-2xl !overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-blue-700 !font-semibold !text-base !mb-2 !block">
                                            Tổng phiên đấu giá
                                        </span>
                                    }
                                    value={businessMetrics.totalAuctions}
                                    valueStyle={{
                                        color: '#1d4ed8',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        lineHeight: '1'
                                    }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <FileTextOutlined className="!text-white !text-2xl" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Tổng số phiên thành công */}
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-green-50 !to-green-100 !rounded-2xl !overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-green-700 !font-semibold !text-base !mb-2 !block">
                                            Phiên thành công
                                        </span>
                                    }
                                    value={businessMetrics.successfulAuctions}
                                    valueStyle={{
                                        color: '#059669',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        lineHeight: '1'
                                    }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircleOutlined className="!text-white !text-2xl" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Tổng số phiên bị hủy */}
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-red-50 !to-red-100 !rounded-2xl !overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-red-700 !font-semibold !text-base !mb-2 !block">
                                            Phiên bị hủy
                                        </span>
                                    }
                                    value={businessMetrics.canceledAuctions}
                                    valueStyle={{
                                        color: '#dc2626',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        lineHeight: '1'
                                    }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <CloseCircleOutlined className="!text-white !text-2xl" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Tổng số người tham gia */}
                <Col xs={24} sm={12} lg={6}>
                    <Card className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-purple-50 !to-purple-100 !rounded-2xl !overflow-hidden group">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-purple-700 !font-semibold !text-base !mb-2 !block">
                                            Tổng người tham gia
                                        </span>
                                    }
                                    value={businessMetrics.totalParticipants}
                                    valueStyle={{
                                        color: '#7c3aed',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        lineHeight: '1'
                                    }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <UserOutlined className="!text-white !text-2xl" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default BusinessOverview;
