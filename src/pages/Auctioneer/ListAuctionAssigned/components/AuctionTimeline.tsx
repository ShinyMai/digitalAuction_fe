import { useState } from "react";
import { Timeline, Card, Typography, Tag, Button, Collapse, Badge, Empty } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    UserOutlined,
    CheckCircleOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import type { Auctions } from "../../ModalsDatabase";
import { formatDate } from "../utils/dateUtils";

const { Title, Text } = Typography;
const { Panel } = Collapse;

interface AuctionTimelineProps {
    auctions: Auctions[];
    loading?: boolean;
    onNavigate: (path: string) => void;
}

const AuctionTimeline = ({ auctions, loading = false, onNavigate }: AuctionTimelineProps) => {
    const [activeKeys, setActiveKeys] = useState<string[]>([]);

    // Đảm bảo auctions luôn là array
    const auctionList = Array.isArray(auctions) ? auctions : [];

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 1: return <PlayCircleOutlined className="!text-blue-500" />;
            case 2: return <CheckCircleOutlined className="!text-green-500" />;
            case 3: return <ExclamationCircleOutlined className="!text-red-500" />;
            default: return <PauseCircleOutlined className="!text-gray-500" />;
        }
    };

    // Function xác định giai đoạn hiện tại của cuộc đấu giá
    const getCurrentPhase = (auction: Auctions) => {
        const now = new Date();
        const registerOpen = new Date(auction.RegisterOpenDate);
        const registerEnd = new Date(auction.RegisterEndDate);
        const auctionStart = new Date(auction.AuctionStartDate);
        const auctionEnd = new Date(auction.AuctionEndDate);

        if (now < registerOpen) {
            return { phase: "waiting", text: "Chưa mở thu hồ sơ", color: "#d9d9d9" };
        } else if (now >= registerOpen && now <= registerEnd) {
            return { phase: "registration", text: "Đang thu hồ sơ", color: "#1890ff" };
        } else if (now > registerEnd && now < auctionStart) {
            return { phase: "preparation", text: "Chuẩn bị đấu giá", color: "#faad14" };
        } else if (now >= auctionStart && now <= auctionEnd) {
            return { phase: "auction", text: "Đang đấu giá", color: "#52c41a" };
        } else {
            return { phase: "finished", text: "Đã kết thúc", color: "#8c8c8c" };
        }
    };

    const getPhaseIcon = (phase: string) => {
        switch (phase) {
            case "waiting": return <PauseCircleOutlined />;
            case "registration": return <FileTextOutlined />;
            case "preparation": return <ClockCircleOutlined />;
            case "auction": return <PlayCircleOutlined />;
            case "finished": return <CheckCircleOutlined />;
            default: return <PauseCircleOutlined />;
        }
    };

    // Sắp xếp auctions theo thời gian
    const sortedAuctions = [...auctionList].sort((a, b) =>
        new Date(a.AuctionStartDate).getTime() - new Date(b.AuctionStartDate).getTime()
    );

    // Nhóm auctions theo ngày
    const groupedByDate = sortedAuctions.reduce((acc, auction) => {
        const date = formatDate(auction.AuctionStartDate, 'DD/MM/YYYY');
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(auction);
        return acc;
    }, {} as Record<string, Auctions[]>);

    const handleViewDetails = (auctionId: string) => {
        onNavigate(`/auctioneer/auction-detail/${auctionId}`);
    };

    const handleCollapseChange = (keys: string | string[]) => {
        setActiveKeys(Array.isArray(keys) ? keys : [keys]);
    };

    if (sortedAuctions.length === 0) {
        return (
            <Card className="!border-0">
                <Empty
                    description="Không có cuộc đấu giá nào được phân công"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
            </Card>
        );
    }

    const timelineItems = Object.entries(groupedByDate).map(([date, dayAuctions]) => {
        const isToday = date === formatDate(new Date(), 'DD/MM/YYYY');
        const dateObj = new Date(dayAuctions[0].AuctionStartDate);
        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

        return {
            key: date,
            color: isToday ? '#1890ff' : isWeekend ? '#faad14' : '#52c41a',
            dot: isToday ? (
                <div className="!w-4 !h-4 !bg-blue-500 !rounded-full !border-2 !border-white !shadow-lg">
                    <div className="!w-2 !h-2 !bg-white !rounded-full !m-auto !mt-0.5"></div>
                </div>
            ) : undefined,
            children: (
                <div className="!pb-6">
                    <div className="!flex !items-center !gap-3 !mb-4">
                        <Title level={4} className="!m-0 !text-gray-800">
                            {date}
                        </Title>
                        <Badge count={dayAuctions.length} className="!bg-blue-500" />
                        {isToday && (
                            <Tag color="blue" className="!ml-2">
                                Hôm nay
                            </Tag>
                        )}
                        {isWeekend && !isToday && (
                            <Tag color="orange" className="!ml-2">
                                Cuối tuần
                            </Tag>
                        )}
                    </div>

                    <Collapse
                        ghost
                        activeKey={activeKeys}
                        onChange={handleCollapseChange}
                        className="!bg-transparent"
                    >
                        {dayAuctions.map((auction) => (
                            <Panel
                                key={`${date}-${auction.AuctionId}`}
                                header={
                                    <div className="!flex !items-center !justify-between !w-full !pr-4">
                                        <div className="!flex !items-center !gap-3">
                                            {getStatusIcon(auction.Status)}
                                            <div>
                                                <Text strong className="!text-gray-800 !text-base">
                                                    {auction.AuctionName}
                                                </Text>
                                                <br />
                                                <Text className="!text-gray-500 !text-sm">
                                                    {formatDate(auction.AuctionStartDate, 'HH:mm')} - {formatDate(auction.AuctionEndDate, 'HH:mm')}
                                                </Text>
                                            </div>
                                        </div>
                                        {(() => {
                                            const currentPhase = getCurrentPhase(auction);
                                            return (
                                                <Tag
                                                    icon={getPhaseIcon(currentPhase.phase)}
                                                    color={currentPhase.color}
                                                    className="!mr-0"
                                                >
                                                    {currentPhase.text}
                                                </Tag>
                                            );
                                        })()}
                                    </div>
                                }
                                className="!bg-white !border !border-gray-200 !rounded-lg !mb-3 hover:!border-blue-300 !transition-all"
                            >
                                <Card
                                    size="small"
                                    className="!border-0 !shadow-none !bg-gray-50"
                                    actions={[
                                        <Button
                                            key="view"
                                            type="primary"
                                            icon={<EyeOutlined />}
                                            onClick={() => handleViewDetails(auction.AuctionId)}
                                            className="!bg-blue-500 !border-blue-500"
                                        >
                                            Xem chi tiết
                                        </Button>
                                    ]}
                                >
                                    <div className="!space-y-3">
                                        <Text className="!text-gray-600 !block">
                                            {auction.AuctionDescription}
                                        </Text>

                                        <div className="!grid !grid-cols-1 !gap-3">
                                            {/* Giai đoạn Thu hồ sơ */}
                                            <div className="!flex !items-center !gap-2">
                                                <FileTextOutlined className="!text-blue-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    <strong>Thu hồ sơ:</strong> {formatDate(auction.RegisterOpenDate, 'DD/MM/YYYY HH:mm')} - {formatDate(auction.RegisterEndDate, 'DD/MM/YYYY HH:mm')}
                                                </span>
                                            </div>

                                            {/* Giai đoạn Chuẩn bị */}
                                            <div className="!flex !items-center !gap-2">
                                                <ClockCircleOutlined className="!text-orange-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    <strong>Chuẩn bị:</strong> {formatDate(auction.RegisterEndDate, 'DD/MM/YYYY HH:mm')} - {formatDate(auction.AuctionStartDate, 'DD/MM/YYYY HH:mm')}
                                                </span>
                                            </div>

                                            {/* Giai đoạn Đấu giá */}
                                            <div className="!flex !items-center !gap-2">
                                                <PlayCircleOutlined className="!text-green-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    <strong>Đấu giá:</strong> {formatDate(auction.AuctionStartDate, 'DD/MM/YYYY HH:mm')} - {formatDate(auction.AuctionEndDate, 'DD/MM/YYYY HH:mm')}
                                                </span>
                                            </div>

                                            <div className="!flex !items-center !gap-2">
                                                <CalendarOutlined className="!text-purple-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    Danh mục: {auction.CategoryId}
                                                </span>
                                            </div>
                                            {auction.AuctioneersId && (
                                                <div className="!flex !items-center !gap-2">
                                                    <UserOutlined className="!text-blue-500" />
                                                    <span className="!text-gray-600 !text-sm">
                                                        Đấu giá viên: {auction.AuctioneersId}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {auction.CancelReason && (
                                            <div className="!bg-red-50 !border !border-red-200 !rounded-md !p-3">
                                                <Text className="!text-red-600 !text-sm !font-medium">
                                                    Lý do hủy: {auction.CancelReason}
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </Panel>
                        ))}
                    </Collapse>
                </div>
            )
        };
    });

    return (
        <Card
            title={
                <div className="!flex !items-center !gap-2">
                    <ClockCircleOutlined className="!text-blue-500" />
                    <Title level={4} className="!m-0">
                        Timeline Đấu Giá
                    </Title>
                </div>
            }
            className="!border-0"
            loading={loading}
        >
            <Timeline
                mode="left"
                items={timelineItems}
                className="!mt-4"
            />
        </Card>
    );
};

export default AuctionTimeline;
