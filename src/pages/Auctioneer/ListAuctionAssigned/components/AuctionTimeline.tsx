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
    ExclamationCircleOutlined
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

    const getStatusColor = (status: number) => {
        switch (status) {
            case 1: return "#1890ff"; // Đang diễn ra - Blue
            case 2: return "#52c41a"; // Hoàn thành - Green
            case 3: return "#ff4d4f"; // Đã hủy - Red
            default: return "#d9d9d9"; // Chờ duyệt - Gray
        }
    };

    const getStatusIcon = (status: number) => {
        switch (status) {
            case 1: return <PlayCircleOutlined className="!text-blue-500" />;
            case 2: return <CheckCircleOutlined className="!text-green-500" />;
            case 3: return <ExclamationCircleOutlined className="!text-red-500" />;
            default: return <PauseCircleOutlined className="!text-gray-500" />;
        }
    };

    const getStatusText = (status: number) => {
        switch (status) {
            case 1: return "Đang diễn ra";
            case 2: return "Hoàn thành";
            case 3: return "Đã hủy";
            default: return "Chờ duyệt";
        }
    };

    // Sắp xếp auctions theo thời gian
    const sortedAuctions = [...auctions].sort((a, b) =>
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
                                        <Tag color={getStatusColor(auction.Status)} className="!mr-0">
                                            {getStatusText(auction.Status)}
                                        </Tag>
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

                                        <div className="!grid !grid-cols-1 md:!grid-cols-2 !gap-3">
                                            <div className="!flex !items-center !gap-2">
                                                <CalendarOutlined className="!text-purple-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    Danh mục: {auction.CategoryId}
                                                </span>
                                            </div>
                                            <div className="!flex !items-center !gap-2">
                                                <UserOutlined className="!text-green-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    Số vòng tối đa: {auction.NumberRoundMax}
                                                </span>
                                            </div>
                                            <div className="!flex !items-center !gap-2">
                                                <ClockCircleOutlined className="!text-orange-500" />
                                                <span className="!text-gray-600 !text-sm">
                                                    Đăng ký: {formatDate(auction.RegisterOpenDate, 'DD/MM')} - {formatDate(auction.RegisterEndDate, 'DD/MM')}
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
