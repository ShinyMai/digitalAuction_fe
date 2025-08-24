import { Card, Statistic, Row, Col } from "antd";
import {
    FileTextOutlined,
    UserOutlined,
    DollarOutlined
} from "@ant-design/icons";

interface StatisticsData {
    totalRounds: number;
    activeRounds: number;
    completedRounds: number;
    totalBidders: number;
    totalBids: number;
    totalBidValue: number;
    averageBidValue: number;
}

interface StatisticsCardsProps {
    stats?: { totalAssets: number, totalBids: number, totalParticipants: number };
    formatCurrency: (value: string) => string;
}

const StatisticsCards = ({ stats }: StatisticsCardsProps) => {
    return (
        <div className="mb-8">
            {/* Enhanced Statistics Cards with better spacing and design */}
            <Row gutter={[24, 24]} justify="center">
                <Col xs={24} sm={12} lg={8}>
                    <Card
                        className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-blue-50 !to-blue-100 !rounded-2xl !overflow-hidden group"
                        bodyStyle={{ padding: '32px 24px' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-blue-700 !font-semibold !text-base !mb-2 !block">
                                            Tổng số Tài sản
                                        </span>
                                    }
                                    value={stats?.totalAssets}
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

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-purple-50 !to-purple-100 !rounded-2xl !overflow-hidden group"
                        bodyStyle={{ padding: '32px 24px' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-purple-700 !font-semibold !text-base !mb-2 !block">
                                            Người tham gia
                                        </span>
                                    }
                                    value={stats?.totalParticipants}
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

                <Col xs={24} sm={12} lg={8}>
                    <Card
                        className="!border-0 !shadow-lg hover:!shadow-xl !transition-all !duration-300 !bg-gradient-to-br !from-orange-50 !to-orange-100 !rounded-2xl !overflow-hidden group"
                        bodyStyle={{ padding: '32px 24px' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <Statistic
                                    title={
                                        <span className="!text-orange-700 !font-semibold !text-base !mb-2 !block">
                                            Tổng lượt đấu giá
                                        </span>
                                    }
                                    value={stats?.totalBids}
                                    valueStyle={{
                                        color: '#ea580c',
                                        fontSize: '2.5rem',
                                        fontWeight: '700',
                                        lineHeight: '1'
                                    }}
                                />
                            </div>
                            <div className="ml-4">
                                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <DollarOutlined className="!text-white !text-2xl" />
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StatisticsCards;
export type { StatisticsData };
