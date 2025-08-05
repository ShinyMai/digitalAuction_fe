import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';

const { Title } = Typography;

interface RevenueChartProps {
    loading?: boolean;
}

interface MonthlyAuctionData {
    month: string;
    totalRevenue: number; // Sum of all StartingPrice from AuctionAsset
    completedAuctions: number; // Count of Auctions with Status = 1 (Public/Completed)
    totalParticipants: number; // Count of unique users from AuctionDocument
    averageAssetValue: number; // Average StartingPrice
}

const RevenueChart: React.FC<RevenueChartProps> = ({ loading = false }) => {
    // Mock data representing monthly aggregated auction data
    const monthlyData: MonthlyAuctionData[] = [
        {
            month: 'T1',
            totalRevenue: 1.2,
            completedAuctions: 12,
            totalParticipants: 240,
            averageAssetValue: 0.1
        },
        {
            month: 'T2',
            totalRevenue: 1.8,
            completedAuctions: 18,
            totalParticipants: 320,
            averageAssetValue: 0.1
        },
        {
            month: 'T3',
            totalRevenue: 2.1,
            completedAuctions: 22,
            totalParticipants: 380,
            averageAssetValue: 0.095
        },
        {
            month: 'T4',
            totalRevenue: 1.9,
            completedAuctions: 19,
            totalParticipants: 310,
            averageAssetValue: 0.1
        },
        {
            month: 'T5',
            totalRevenue: 2.4,
            completedAuctions: 25,
            totalParticipants: 420,
            averageAssetValue: 0.096
        },
        {
            month: 'T6',
            totalRevenue: 2.8,
            completedAuctions: 28,
            totalParticipants: 480,
            averageAssetValue: 0.1
        }
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
            {/* Charts */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <div>
                        <div className="mb-3 text-gray-600 font-medium">Xu hướng doanh thu (Tỷ VNĐ)</div>
                        <Line
                            data={monthlyData}
                            height={250}
                            xField="month"
                            yField="totalRevenue"
                            point={{
                                size: 5,
                                shape: 'diamond',
                            }}
                            smooth={true}
                            color="#1890ff"
                            meta={{
                                totalRevenue: {
                                    alias: 'Doanh thu (Tỷ VNĐ)',
                                },
                                month: {
                                    alias: 'Tháng',
                                },
                            }}
                        />
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div>
                        <div className="mb-3 text-gray-600 font-medium">Số phiên đấu giá theo tháng</div>
                        <Column
                            data={monthlyData}
                            height={250}
                            xField="month"
                            yField="completedAuctions"
                            color="#52c41a"
                            meta={{
                                completedAuctions: {
                                    alias: 'Số phiên đấu giá',
                                },
                                month: {
                                    alias: 'Tháng',
                                },
                            }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                        {monthlyData[monthlyData.length - 1].totalRevenue}B VNĐ
                    </div>
                    <div className="text-sm text-gray-600">Doanh thu tháng này</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                        {monthlyData[monthlyData.length - 1].completedAuctions}
                    </div>
                    <div className="text-sm text-gray-600">Phiên đấu giá</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                        {monthlyData[monthlyData.length - 1].totalParticipants}
                    </div>
                    <div className="text-sm text-gray-600">Người tham gia</div>
                </div>
            </div>
        </Card>
    );
};

export default RevenueChart;
