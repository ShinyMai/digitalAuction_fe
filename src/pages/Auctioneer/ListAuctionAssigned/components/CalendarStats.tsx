import { Card, Statistic, Row, Col } from "antd";
import {
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
    // Đảm bảo auctions luôn là array
    const auctionList = Array.isArray(auctions) ? auctions : [];

    // Function xác định giai đoạn hiện tại
    const getCurrentPhase = (auction: Auctions) => {
        const now = new Date();
        const registerOpen = new Date(auction.RegisterOpenDate);
        const registerEnd = new Date(auction.RegisterEndDate);
        const auctionStart = new Date(auction.AuctionStartDate);
        const auctionEnd = new Date(auction.AuctionEndDate);

        if (now < registerOpen) return "waiting";
        if (now >= registerOpen && now <= registerEnd) return "registration";
        if (now > registerEnd && now < auctionStart) return "preparation";
        if (now >= auctionStart && now <= auctionEnd) return "auction";
        return "finished";
    };

    const stats = {
        total: auctionList.length,
        registration: auctionList.filter(a => getCurrentPhase(a) === "registration").length,
        preparation: auctionList.filter(a => getCurrentPhase(a) === "preparation").length,
        ongoing: auctionList.filter(a => getCurrentPhase(a) === "auction").length,
        cancelled: auctionList.filter(a => a.Status === 3).length,
    }; return (
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
                        title={<span className="!text-yellow-700 !font-medium">Thu hồ sơ</span>}
                        value={stats.registration}
                        prefix={<FileTextOutlined className="!text-yellow-500" />}
                        valueStyle={{ color: '#d97706' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                <Card className="!border-orange-200 !bg-orange-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-orange-700 !font-medium">Chuẩn bị</span>}
                        value={stats.preparation}
                        prefix={<ClockCircleOutlined className="!text-orange-500" />}
                        valueStyle={{ color: '#ea580c' }}
                    />
                </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={8} xl={5}>
                <Card className="!border-green-200 !bg-green-50 hover:!shadow-md !transition-shadow">
                    <Statistic
                        title={<span className="!text-green-700 !font-medium">Đang đấu giá</span>}
                        value={stats.ongoing}
                        prefix={<CheckCircleOutlined className="!text-green-500" />}
                        valueStyle={{ color: '#059669' }}
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
