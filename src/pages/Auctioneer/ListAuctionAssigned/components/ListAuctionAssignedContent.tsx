import { motion } from "framer-motion";
import { Card, Typography, Tabs, Badge } from "antd";
import {
    CalendarOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import type { Auctions } from "../../ModalsDatabase";
import StatisticCard from "./StatisticCard";
import AuctionTable from "./AuctionTable";

const { Title } = Typography;

interface ListAuctionAssignedContentProps {
    loading?: boolean;
    onNavigate: (path: string) => void;
    categorizedAuctions: {
        upcoming: Auctions[];
        ongoing: Auctions[];
        past: Auctions[];
    };
    activeTab: string;
    onTabChange: (key: string) => void;
}

const ListAuctionAssignedContent = ({
    loading = false,
    categorizedAuctions,
    activeTab,
    onTabChange,
    onNavigate,
}: ListAuctionAssignedContentProps) => {
    const tabItems: TabsProps["items"] = [
        {
            key: "upcoming",
            label: (
                <span>
                    <CalendarOutlined />
                    <span className="ml-2">Sắp diễn ra</span>
                    <Badge count={categorizedAuctions.upcoming.length} className="ml-2" />
                </span>
            ),
            children: (
                <AuctionTable
                    auctions={categorizedAuctions.upcoming}
                    loading={loading}
                    colorScheme={{
                        hover: "blue",
                        text: "blue",
                        loading: "blue",
                    }}
                    onNavigate={onNavigate}
                />
            ),
        },
        {
            key: "ongoing",
            label: (
                <span>
                    <ClockCircleOutlined />
                    <span className="ml-2">Đang diễn ra</span>
                    <Badge count={categorizedAuctions.ongoing.length} className="ml-2" />
                </span>
            ),
            children: (
                <AuctionTable
                    auctions={categorizedAuctions.ongoing}
                    loading={loading}
                    colorScheme={{
                        hover: "green",
                        text: "green-600",
                        loading: "green-500",
                    }}
                    onNavigate={onNavigate}
                />
            ),
        },
        {
            key: "past",
            label: (
                <span>
                    <CheckCircleOutlined />
                    <span className="ml-2">Đã kết thúc</span>
                    <Badge count={categorizedAuctions.past.length} className="ml-2" />
                </span>
            ),
            children: (
                <AuctionTable
                    auctions={categorizedAuctions.past}
                    loading={loading}
                    colorScheme={{
                        hover: "purple",
                        text: "purple-600",
                        loading: "purple-500",
                    }}
                    onNavigate={onNavigate}
                />
            ),
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 space-y-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <StatisticCard
                        icon={<CalendarOutlined />}
                        title="Sắp diễn ra"
                        count={categorizedAuctions.upcoming.length}
                        color={{
                            from: "blue-500",
                            to: "blue-600",
                            text: "blue-600",
                            hover: "blue-700",
                        }}
                        onClick={() => onTabChange("upcoming")}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <StatisticCard
                        icon={<ClockCircleOutlined />}
                        title="Đang diễn ra"
                        count={categorizedAuctions.ongoing.length}
                        color={{
                            from: "green-500",
                            to: "green-600",
                            text: "green-600",
                            hover: "green-700",
                        }}
                        onClick={() => onTabChange("ongoing")}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <StatisticCard
                        icon={<CheckCircleOutlined />}
                        title="Đã kết thúc"
                        count={categorizedAuctions.past.length}
                        color={{
                            from: "purple-500",
                            to: "purple-600",
                            text: "purple-600",
                            hover: "purple-700",
                        }}
                        onClick={() => onTabChange("past")}
                    />
                </motion.div>
            </div>

            <Card className="shadow-lg rounded-lg">
                <div className="flex items-center justify-between mb-6">
                    <Title level={3} className="mb-0">
                        Danh Sách Phiên Đấu Giá Được Phân Công
                    </Title>
                </div>

                <Tabs
                    activeKey={activeTab}
                    items={tabItems}
                    onChange={onTabChange}
                    className="auction-tabs"
                />
            </Card>
        </motion.div>
    );
};

export default ListAuctionAssignedContent;


