import { Card, Statistic, Row, Col } from "antd";
import {
    FileTextOutlined,
    PlayCircleOutlined,
    UserOutlined,
    DollarOutlined,
    TrophyOutlined
} from "@ant-design/icons";

interface StatisticsData {
    totalRounds: number;
    activeRounds: number;
    completedRounds: number;
    totalBidders: number;
    totalBids: number;
    winners: number;
    totalBidValue: number;
    averageBidValue: number;
}

interface StatisticsCardsProps {
    stats: StatisticsData;
    formatCurrency: (value: string) => string;
}

const StatisticsCards = ({ stats, formatCurrency }: StatisticsCardsProps) => {
    return (
        <>
            {/* Main Statistics Cards */}
            <Row gutter={[16, 16]} className="!mb-6">
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-blue-200 !bg-blue-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-blue-700 !font-medium">Tổng số vòng</span>}
                            value={stats.totalRounds}
                            prefix={<FileTextOutlined className="!text-blue-500" />}
                            valueStyle={{ color: '#1d4ed8' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-green-200 !bg-green-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-green-700 !font-medium">Đang diễn ra</span>}
                            value={stats.activeRounds}
                            prefix={<PlayCircleOutlined className="!text-green-500" />}
                            valueStyle={{ color: '#059669' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-purple-200 !bg-purple-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-purple-700 !font-medium">Người tham gia</span>}
                            value={stats.totalBidders}
                            prefix={<UserOutlined className="!text-purple-500" />}
                            valueStyle={{ color: '#7c3aed' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card className="!border-orange-200 !bg-orange-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-orange-700 !font-medium">Tổng lượt đấu giá</span>}
                            value={stats.totalBids}
                            prefix={<DollarOutlined className="!text-orange-500" />}
                            valueStyle={{ color: '#ea580c' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional Statistics */}
            <Row gutter={[16, 16]} className="!mb-6">
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-yellow-200 !bg-yellow-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-yellow-700 !font-medium">Người chiến thắng</span>}
                            value={stats.winners}
                            prefix={<TrophyOutlined className="!text-yellow-500" />}
                            valueStyle={{ color: '#d97706' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-red-200 !bg-red-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-red-700 !font-medium">Tổng giá trị đấu giá</span>}
                            value={formatCurrency(stats.totalBidValue.toString())}
                            valueStyle={{ color: '#dc2626', fontSize: '18px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card className="!border-indigo-200 !bg-indigo-50 hover:!shadow-md !transition-shadow">
                        <Statistic
                            title={<span className="!text-indigo-700 !font-medium">Giá trị trung bình</span>}
                            value={formatCurrency(stats.averageBidValue.toString())}
                            valueStyle={{ color: '#4f46e5', fontSize: '18px' }}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default StatisticsCards;
export type { StatisticsData };
