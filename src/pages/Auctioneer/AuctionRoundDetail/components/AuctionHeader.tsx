import { Card, Statistic, Row, Col, Typography, Space, Divider, Button } from "antd";
import { UserOutlined, HomeOutlined, ClockCircleOutlined, StopOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import type { AuctionRound } from "../modalsData";

const { Title, Text } = Typography;

interface AuctionHeaderProps {
    totalParticipants: number;
    totalAssets: number;
    auctionName: string;
    auctionRound?: AuctionRound;
    onEndAuction?: () => void; // Callback function for ending auction
}

const USER_ROLES = {
    USER: "Customer",
    ADMIN: "Admin",
    STAFF: "Staff",
    AUCTIONEER: "Auctioneer",
    MANAGER: "Manager",
    DIRECTOR: "Director",
} as const;

type UserRole =
    (typeof USER_ROLES)[keyof typeof USER_ROLES];

const AuctionHeader = ({
    totalParticipants,
    totalAssets,
    auctionName,
    onEndAuction,
    auctionRound
}: AuctionHeaderProps) => {
    const getStatusBadge = () => {
        switch (auctionRound?.status) {
            case 1:
                return (
                    <div className="!inline-flex !items-center !gap-2 !px-4 !py-2 !bg-gradient-to-r !from-emerald-50 !to-green-50 !border !border-emerald-200 !rounded-full !shadow-sm">
                        <div className="!w-2 !h-2 !bg-emerald-400 !rounded-full !animate-pulse"></div>
                        <span className="!text-emerald-700 !font-semibold !text-sm">Đang diễn ra</span>
                    </div>
                );
            case 2:
                return (
                    <div className="!inline-flex !items-center !gap-2 !px-4 !py-2 !bg-gradient-to-r !from-slate-50 !to-gray-50 !border !border-slate-200 !rounded-full !shadow-sm">
                        <div className="!w-2 !h-2 !bg-slate-400 !rounded-full"></div>
                        <span className="!text-slate-600 !font-semibold !text-sm">Đã kết thúc</span>
                    </div>
                );
            default:
                return null;
        }
    };

    const { user } = useSelector(
        (state: RootState) => state.auth
    );
    const role = user?.roleName as UserRole | undefined;

    return (
        <Card className="!mb-6 !shadow-md">
            <Row gutter={[24, 16]} align="middle">
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size="small" className="!w-full">
                        <Space align="center" wrap>
                            <Title level={2} className="!mb-0">
                                Chi tiết phiên đấu giá - {auctionName}
                            </Title>
                            {getStatusBadge()}
                        </Space>
                    </Space>
                </Col>

                <Col xs={24} lg={8}>
                    <Space direction="vertical" size="middle" className="!w-full">
                        <Row gutter={24}>
                            <Col xs={12} lg={24} xl={12}>
                                <Statistic
                                    title="Người tham gia"
                                    value={totalParticipants}
                                    prefix={<UserOutlined />}
                                    valueStyle={{ color: '#1890ff' }}
                                />
                            </Col>
                            <Col xs={12} lg={24} xl={12}>
                                <Statistic
                                    title="Tài sản đấu giá"
                                    value={totalAssets}
                                    prefix={<HomeOutlined />}
                                    valueStyle={{ color: '#722ed1' }}
                                />
                            </Col>
                        </Row>

                        {/* End Auction Button - Only show when auction is active */}
                        {auctionRound?.status === 1 && onEndAuction && role === USER_ROLES.AUCTIONEER && (
                            <Button
                                type="primary"
                                danger
                                size="large"
                                icon={<StopOutlined />}
                                onClick={onEndAuction}
                                className="!w-full"
                            >
                                Kết thúc vòng đấu giá
                            </Button>
                        )}
                    </Space>
                </Col>
            </Row>

            <Divider />

            <Row gutter={16}>
                <Col xs={24} sm={12}>
                    <Space align="center">
                        <ClockCircleOutlined className="!text-blue-500" />
                        <Text type="secondary">
                            Cập nhật: {new Date().toLocaleString('vi-VN')}
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default AuctionHeader;
