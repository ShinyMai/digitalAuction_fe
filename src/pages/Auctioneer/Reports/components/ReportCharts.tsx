import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import type { RevenueData, TopAsset } from '../types';

const { Title } = Typography;

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface ParticipantTrendData {
    month: string;
    participants: number;
    newUsers: number;
}

interface ReportChartsProps {
    revenueData: RevenueData[];
    topAssets: TopAsset[];
    categoryDistribution: CategoryData[];
    participantTrend: ParticipantTrendData[];
}

const ReportCharts: React.FC<ReportChartsProps> = ({
    revenueData,
    topAssets,
    categoryDistribution,
    participantTrend
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Row gutter={[16, 16]} className="!mb-6">
            {/* Biểu đồ doanh thu theo tháng */}
            <Col xs={24} lg={12}>
                <Card
                    title={<Title level={4} className="!m-0">Doanh Thu Theo Tháng</Title>}
                    className="!h-full"
                >
                    <div className="!h-80 !flex !items-center !justify-center !bg-gray-50 !rounded-lg">
                        <div className="!text-center">
                            <div className="!text-4xl !mb-4">📊</div>
                            <p className="!text-gray-600 !m-0">Biểu đồ doanh thu</p>
                            <p className="!text-sm !text-gray-500 !mt-2">
                                Tích hợp Chart.js hoặc Recharts
                            </p>
                        </div>
                    </div>

                    {/* Summary data */}
                    <div className="!mt-4 !grid !grid-cols-3 !gap-4">
                        <div className="!text-center">
                            <div className="!text-lg !font-semibold !text-blue-600">
                                {formatCurrency(revenueData.reduce((sum, item) => sum + item.revenue, 0))}
                            </div>
                            <div className="!text-sm !text-gray-600">Tổng doanh thu</div>
                        </div>
                        <div className="!text-center">
                            <div className="!text-lg !font-semibold !text-green-600">
                                {formatCurrency(revenueData.reduce((sum, item) => sum + item.fees, 0))}
                            </div>
                            <div className="!text-sm !text-gray-600">Tổng phí</div>
                        </div>
                        <div className="!text-center">
                            <div className="!text-lg !font-semibold !text-orange-600">
                                {revenueData.reduce((sum, item) => sum + item.auctions, 0)}
                            </div>
                            <div className="!text-sm !text-gray-600">Cuộc đấu giá</div>
                        </div>
                    </div>
                </Card>
            </Col>

            {/* Phân bố danh mục */}
            <Col xs={24} lg={12}>
                <Card
                    title={<Title level={4} className="!m-0">Phân Bố Danh Mục</Title>}
                    className="!h-full"
                >
                    <div className="!h-80 !flex !items-center !justify-center !bg-gray-50 !rounded-lg">
                        <div className="!text-center">
                            <div className="!text-4xl !mb-4">🥧</div>
                            <p className="!text-gray-600 !m-0">Biểu đồ tròn danh mục</p>
                            <p className="!text-sm !text-gray-500 !mt-2">
                                Pie chart phân bố theo danh mục
                            </p>
                        </div>
                    </div>

                    {/* Category legend */}
                    <div className="!mt-4 !space-y-2">
                        {categoryDistribution.map((item, index) => (
                            <div key={index} className="!flex !items-center !justify-between">
                                <div className="!flex !items-center !gap-2">
                                    <div
                                        className="!w-3 !h-3 !rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="!text-sm">{item.name}</span>
                                </div>
                                <span className="!text-sm !font-medium">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </Col>

            {/* Top tài sản đấu giá */}
            <Col xs={24} lg={12}>
                <Card
                    title={<Title level={4} className="!m-0">Top Tài Sản Đấu Giá</Title>}
                    className="!h-full"
                >
                    <div className="!space-y-3">
                        {topAssets.slice(0, 5).map((asset, index) => (
                            <div key={asset.assetId} className="!flex !items-center !justify-between !p-3 !bg-gray-50 !rounded-lg">
                                <div className="!flex !items-center !gap-3">
                                    <div className="!w-8 !h-8 !bg-blue-100 !rounded-full !flex !items-center !justify-center !text-blue-600 !font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="!font-medium !text-gray-800">{asset.tagName}</div>
                                        <div className="!text-xs !text-gray-500">{asset.participants} người tham gia</div>
                                    </div>
                                </div>
                                <div className="!text-right">
                                    <div className="!font-semibold !text-green-600">
                                        {formatCurrency(asset.finalPrice)}
                                    </div>
                                    <div className="!text-xs !text-gray-500">
                                        Từ {formatCurrency(asset.startingPrice)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </Col>

            {/* Xu hướng người tham gia */}
            <Col xs={24} lg={12}>
                <Card
                    title={<Title level={4} className="!m-0">Xu Hướng Người Tham Gia</Title>}
                    className="!h-full"
                >
                    <div className="!h-64 !flex !items-center !justify-center !bg-gray-50 !rounded-lg">
                        <div className="!text-center">
                            <div className="!text-4xl !mb-4">📈</div>
                            <p className="!text-gray-600 !m-0">Biểu đồ đường</p>
                            <p className="!text-sm !text-gray-500 !mt-2">
                                Xu hướng người tham gia theo thời gian
                            </p>
                        </div>
                    </div>

                    {/* Trend summary */}
                    <div className="!mt-4 !grid !grid-cols-2 !gap-4">
                        <div className="!text-center !p-2 !bg-blue-50 !rounded">
                            <div className="!text-lg !font-semibold !text-blue-600">
                                {participantTrend[participantTrend.length - 1]?.participants || 0}
                            </div>
                            <div className="!text-sm !text-gray-600">Tháng này</div>
                        </div>
                        <div className="!text-center !p-2 !bg-green-50 !rounded">
                            <div className="!text-lg !font-semibold !text-green-600">
                                {participantTrend.reduce((sum, item) => sum + item.newUsers, 0)}
                            </div>
                            <div className="!text-sm !text-gray-600">Người mới</div>
                        </div>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};

export default ReportCharts;
