import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface RevenueChartProps {
    loading?: boolean;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ loading = false }) => {
    // TODO: Implement chart with @ant-design/plots or recharts
    const mockData = [
        { month: 'Jan', revenue: 1.2, auctions: 12, participants: 240 },
        { month: 'Feb', revenue: 1.8, auctions: 18, participants: 320 },
        { month: 'Mar', revenue: 2.1, auctions: 22, participants: 380 },
        { month: 'Apr', revenue: 1.9, auctions: 19, participants: 310 },
        { month: 'May', revenue: 2.4, auctions: 25, participants: 420 },
        { month: 'Jun', revenue: 2.8, auctions: 28, participants: 480 }
    ];

    return (
        <Card
            title={
                <div className="flex items-center gap-2">
                    <LineChartOutlined className="text-purple-500" />
                    <Title level={4} className="!mb-0">Xu hướng doanh thu & hiệu suất</Title>
                </div>
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Placeholder for charts - Will implement with real charting library */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📈</div>
                            <div className="text-gray-600 font-medium">Revenue Trend Chart</div>
                            <div className="text-sm text-gray-500 mt-2">
                                Line chart showing monthly revenue growth
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div className="h-64 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-4">📊</div>
                            <div className="text-gray-600 font-medium">Performance Metrics</div>
                            <div className="text-sm text-gray-500 mt-2">
                                Bar chart comparing auctions vs participants
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                        {mockData[mockData.length - 1].revenue}B VNĐ
                    </div>
                    <div className="text-sm text-gray-600">Doanh thu tháng này</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                        {mockData[mockData.length - 1].auctions}
                    </div>
                    <div className="text-sm text-gray-600">Phiên đấu giá</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                        {mockData[mockData.length - 1].participants}
                    </div>
                    <div className="text-sm text-gray-600">Người tham gia</div>
                </div>
            </div>
        </Card>
    );
};

export default RevenueChart;
