import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import {
    AuditOutlined,
    CheckCircleOutlined,
    TeamOutlined,
    DollarOutlined
} from '@ant-design/icons';
import { statisticsData } from '../fakeData';

const StatisticsCards: React.FC = () => {
    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow">
                    <Statistic
                        title="Tổng số phiên đấu giá"
                        value={statisticsData.totalAuctions}
                        prefix={<AuditOutlined className="text-blue-500" />}
                        className="[&_.ant-statistic-title]:text-gray-600 [&_.ant-statistic-content]:text-blue-600"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow">
                    <Statistic
                        title="Phiên thành công"
                        value={statisticsData.completedAuctions}
                        prefix={<CheckCircleOutlined className="text-green-500" />}
                        className="[&_.ant-statistic-title]:text-gray-600 [&_.ant-statistic-content]:text-green-600"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow">
                    <Statistic
                        title="Tổng người tham gia"
                        value={statisticsData.totalParticipants}
                        prefix={<TeamOutlined className="text-purple-500" />}
                        className="[&_.ant-statistic-title]:text-gray-600 [&_.ant-statistic-content]:text-purple-600"
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
                <Card className="hover:shadow-lg transition-shadow">
                    <Statistic
                        title="Tổng giá trị (VNĐ)"
                        value={statisticsData.totalValue}
                        prefix={<DollarOutlined className="text-orange-500" />}
                        formatter={(value) => (value as number).toLocaleString()}
                        className="[&_.ant-statistic-title]:text-gray-600 [&_.ant-statistic-content]:text-orange-600"
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default StatisticsCards;

// API Comments:
/*
GET /api/auctioneer/statistics/overview
Response: {
  totalAuctions: number;
  successfulAuctions: number;
  totalParticipants: number;
  totalValue: number;
}
*/
