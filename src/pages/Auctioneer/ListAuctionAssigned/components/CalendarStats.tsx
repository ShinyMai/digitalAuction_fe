import { Card, Statistic, Row, Col } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import type { Auctions } from "../../ModalsDatabase";

interface CalendarStatsProps {
    auctions: Auctions[];
}

const CalendarStats = ({ auctions }: CalendarStatsProps) => {
    const stats = {
        total: auctions.length,
        upcoming: auctions.filter(a => new Date(a.AuctionStartDate) > new Date()).length,
        ongoing: auctions.filter(a => {
            const now = new Date();
            return new Date(a.AuctionStartDate) <= now && new Date(a.AuctionEndDate) >= now;
        }).length,
        completed: auctions.filter(a => a.Status === 2).length,
        cancelled: auctions.filter(a => a.Status === 3).length,
    };

    return (
        <Row gutter={[16, 16]} className="!mb-6">
            <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                <Card className="!border-blue-200 !bg-blue-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-blue-700 !font-medium">Tổng số cuộc đấu giá</span>}
                        value={stats.total}
                        prefix={<FileTextOutlined className="!text-blue-500" />}
                        valueStyle={{ color: '#1d4ed8' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                <Card className="!border-yellow-200 !bg-yellow-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-yellow-700 !font-medium">Sắp diễn ra</span>}
                        value={stats.upcoming}
                        prefix={<CalendarOutlined className="!text-yellow-500" />}
                        valueStyle={{ color: '#d97706' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                <Card className="!border-green-200 !bg-green-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-green-700 !font-medium">Đang diễn ra</span>}
                        value={stats.ongoing}
                        prefix={<ClockCircleOutlined className="!text-green-500" />}
                        valueStyle={{ color: '#059669' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                <Card className="!border-purple-200 !bg-purple-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-purple-700 !font-medium">Hoàn thành</span>}
                        value={stats.completed}
                        prefix={<CheckCircleOutlined className="!text-purple-500" />}
                        valueStyle={{ color: '#7c3aed' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                <Card className="!border-red-200 !bg-red-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-red-700 !font-medium">Đã hủy</span>}
                        value={stats.cancelled}
                        prefix={<ExclamationCircleOutlined className="!text-red-500" />}
                        valueStyle={{ color: '#dc2626' }}
                    />
                </Card>
            </Col>
        </Row>
    );
};

export default CalendarStats;
