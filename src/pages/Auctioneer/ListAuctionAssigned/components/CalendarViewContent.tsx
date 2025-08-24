import { Typography, Space } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import type { Auctions } from "../../ModalsDatabase";
import AuctionTimeline from "./AuctionTimeline";

const { Title } = Typography;

interface CalendarViewContentProps {
    loading?: boolean;
    auctions: Auctions[];
}

const CalendarViewContent = ({
    loading = false,
    auctions,
}: CalendarViewContentProps) => {
    return (
        <div className="!min-h-screen !bg-gray-50 !p-6">
            <div className="!max-w-7xl !mx-auto">
                {/* Header */}
                <div className="!mb-6">
                    <Space align="center" className="!mb-4">
                        <ClockCircleOutlined className="!text-2xl !text-blue-500" />
                        <Title level={2} className="!m-0 !text-gray-800">
                            Lịch Đấu Giá Được Phân Công
                        </Title>
                    </Space>
                </div>

                {/* Timeline */}
                <AuctionTimeline
                    auctions={auctions}
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default CalendarViewContent;
