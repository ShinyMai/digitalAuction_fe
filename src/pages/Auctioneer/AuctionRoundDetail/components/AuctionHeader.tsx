import { Card, Statistic, Badge, Row, Col, Typography, Space, Divider, Button } from "antd";
import { UserOutlined, HomeOutlined, ClockCircleOutlined, SyncOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface AuctionHeaderProps {
    auctionRoundId: string; // Required - no default value
    totalParticipants: number;
    totalAssets: number;
    status?: 'active' | 'completed' | 'pending';
    onBack?: () => void;
}

const AuctionHeader = ({
    auctionRoundId,
    totalParticipants,
    totalAssets,
    status = 'active',
    onBack
}: AuctionHeaderProps) => {
    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            // Fallback sử dụng browser history nếu không có onBack
            window.history.back();
        }
    };
    const getStatusBadge = () => {
        switch (status) {
            case 'active':
                return (
                    <Badge
                        status="processing"
                        text="Đang diễn ra"
                        className="!text-green-600"
                    />
                );
            case 'completed':
                return (
                    <Badge
                        status="default"
                        text="Đã kết thúc"
                        className="!text-gray-600"
                    />
                );
            case 'pending':
                return (
                    <Badge
                        status="warning"
                        text="Sắp diễn ra"
                        className="!text-yellow-600"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Card className="!mb-6 !shadow-md">
            <Row gutter={[24, 16]} align="middle">
                <Col xs={24} lg={16}>
                    <Space direction="vertical" size="small" className="!w-full">
                        <Space align="center" wrap>
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={handleBack}
                                className="!text-gray-600 hover:!text-blue-600 !p-1"
                                size="large"
                            >
                                Quay lại
                            </Button>
                            <Title level={2} className="!mb-0">
                                Chi tiết phiên đấu giá - {auctionRoundId}
                            </Title>
                            {getStatusBadge()}
                        </Space>
                        <Text type="secondary" className="!text-base">
                            Quản lý và theo dõi tiến trình đấu giá tài sản
                        </Text>
                    </Space>
                </Col>

                <Col xs={24} lg={8}>
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
                <Col xs={24} sm={12}>
                    <Space align="center">
                        <SyncOutlined spin className="!text-green-500" />
                        <Text type="secondary">
                            Dữ liệu realtime
                        </Text>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default AuctionHeader;
