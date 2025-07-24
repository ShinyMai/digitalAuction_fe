import React from 'react';
import { Alert, Card } from 'antd';
import { Area } from '@ant-design/plots';
import { statisticsData } from '../fakeData';

const AuctionChart: React.FC = () => {
    const config = {
        data: statisticsData.monthlyStats,
        xField: 'month',
        yField: 'auctions',
        smooth: true,
        areaStyle: {
            fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        },
    };

    return (
        <Card
            title="Thống kê theo tháng"
            className="mt-6"
            extra={
                <Alert
                    message="Cập nhật theo thời gian thực"
                    type="info"
                    showIcon
                    className="!mb-0"
                />
            }
        >
            <Area {...config} />
        </Card>
    );
};

export default AuctionChart;

// API Comments:
/*
GET /api/auctioneer/statistics/monthly
Parameters:
  - year: number
  - month?: number
Response: {
  data: {
    month: string;
    auctions: number;
  }[]
}
*/
