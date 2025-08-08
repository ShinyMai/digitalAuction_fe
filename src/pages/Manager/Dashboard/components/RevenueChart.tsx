import React, { useState } from 'react';
import { Card, Row, Col, Typography, Select } from 'antd';
import { LineChartOutlined, CalendarOutlined } from '@ant-design/icons';
import { Line, Column } from '@ant-design/plots';

const { Title } = Typography;

interface RevenueChartProps {
    loading?: boolean;
}

type TimePeriod = 'week' | 'month' | 'year';

interface AuctionData {
    period: string;
    totalRevenue: number;
    completedAuctions: number;
    totalParticipants: number;
    averageAssetValue: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ loading = false }) => {
    const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');

    // Mock data for different time periods
    const weeklyData: AuctionData[] = [
        { period: 'T1', totalRevenue: 0.3, completedAuctions: 3, totalParticipants: 60, averageAssetValue: 0.1 },
        { period: 'T2', totalRevenue: 0.4, completedAuctions: 4, totalParticipants: 80, averageAssetValue: 0.1 },
        { period: 'T3', totalRevenue: 0.5, completedAuctions: 5, totalParticipants: 90, averageAssetValue: 0.1 },
        { period: 'T4', totalRevenue: 0.6, completedAuctions: 6, totalParticipants: 100, averageAssetValue: 0.1 },
    ];

    const monthlyData: AuctionData[] = [
        { period: 'T1', totalRevenue: 1.2, completedAuctions: 12, totalParticipants: 240, averageAssetValue: 0.1 },
        { period: 'T2', totalRevenue: 1.8, completedAuctions: 18, totalParticipants: 320, averageAssetValue: 0.1 },
        { period: 'T3', totalRevenue: 2.1, completedAuctions: 22, totalParticipants: 380, averageAssetValue: 0.095 },
        { period: 'T4', totalRevenue: 1.9, completedAuctions: 19, totalParticipants: 310, averageAssetValue: 0.1 },
        { period: 'T5', totalRevenue: 2.4, completedAuctions: 25, totalParticipants: 420, averageAssetValue: 0.096 },
        { period: 'T6', totalRevenue: 2.8, completedAuctions: 28, totalParticipants: 480, averageAssetValue: 0.1 },
    ];

    const yearlyData: AuctionData[] = [
        { period: '2021', totalRevenue: 8.5, completedAuctions: 85, totalParticipants: 1200, averageAssetValue: 0.1 },
        { period: '2022', totalRevenue: 12.3, completedAuctions: 123, totalParticipants: 1800, averageAssetValue: 0.1 },
        { period: '2023', totalRevenue: 15.7, completedAuctions: 157, totalParticipants: 2300, averageAssetValue: 0.1 },
        { period: '2024', totalRevenue: 18.2, completedAuctions: 182, totalParticipants: 2800, averageAssetValue: 0.1 },
    ];

    // Get current data based on selected period
    const getCurrentData = (): AuctionData[] => {
        switch (selectedPeriod) {
            case 'week':
                return weeklyData;
            case 'year':
                return yearlyData;
            default:
                return monthlyData;
        }
    };

    const getPeriodLabel = (): string => {
        switch (selectedPeriod) {
            case 'week':
                return 'Tuần';
            case 'year':
                return 'Năm';
            default:
                return 'Tháng';
        }
    };

    const getRevenueUnit = (): string => {
        switch (selectedPeriod) {
            case 'week':
                return 'Triệu VNĐ';
            case 'year':
                return 'Tỷ VNĐ';
            default:
                return 'Tỷ VNĐ';
        }
    };

    const currentData = getCurrentData();

    return (
        <Card
            title={
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <LineChartOutlined className="text-purple-500" />
                        <Title level={4} className="!mb-0">Xu hướng doanh thu & hiệu suất</Title>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarOutlined className="text-gray-400" />
                        <Select
                            value={selectedPeriod}
                            onChange={setSelectedPeriod}
                            className="!w-32"
                            size="small"
                            options={[
                                { label: 'Theo tuần', value: 'week' },
                                { label: 'Theo tháng', value: 'month' },
                                { label: 'Theo năm', value: 'year' }
                            ]}
                        />
                    </div>
                </div>
            }
            loading={loading}
            className="shadow-md"
        >
            {/* Charts */}
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                    <div>
                        <div className="mb-3 text-gray-600 font-medium">
                            Xu hướng doanh thu ({getRevenueUnit()})
                        </div>
                        <Line
                            data={currentData}
                            height={250}
                            xField="period"
                            yField="totalRevenue"
                            point={{
                                size: 5,
                                shape: 'diamond',
                            }}
                            smooth={true}
                            color="#1890ff"
                            meta={{
                                totalRevenue: {
                                    alias: `Doanh thu (${getRevenueUnit()})`,
                                },
                                period: {
                                    alias: getPeriodLabel(),
                                },
                            }}
                        />
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div>
                        <div className="mb-3 text-gray-600 font-medium">
                            Số phiên đấu giá theo {getPeriodLabel().toLowerCase()}
                        </div>
                        <Column
                            data={currentData}
                            height={250}
                            xField="period"
                            yField="completedAuctions"
                            color="#52c41a"
                            meta={{
                                completedAuctions: {
                                    alias: 'Số phiên đấu giá',
                                },
                                period: {
                                    alias: getPeriodLabel(),
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
                        {currentData[currentData.length - 1].totalRevenue}
                        {selectedPeriod === 'week' ? 'M' : 'B'} VNĐ
                    </div>
                    <div className="text-sm text-gray-600">
                        Doanh thu {getPeriodLabel().toLowerCase()} này
                    </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                        {currentData[currentData.length - 1].completedAuctions}
                    </div>
                    <div className="text-sm text-gray-600">Phiên đấu giá</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">
                        {currentData[currentData.length - 1].totalParticipants}
                    </div>
                    <div className="text-sm text-gray-600">Người tham gia</div>
                </div>
            </div>
        </Card>
    );
};

export default RevenueChart;
