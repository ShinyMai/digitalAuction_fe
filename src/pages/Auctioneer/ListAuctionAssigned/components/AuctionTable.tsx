import { motion } from "framer-motion";
import { Tag, Tooltip, Button, Dropdown } from "antd";
import { EyeOutlined, HistoryOutlined, SettingOutlined } from "@ant-design/icons";
import type { Auctions } from "../../ModalsDatabase";

interface AuctionTableRowProps {
    auction: Auctions;
    index: number;
    colorScheme: {
        hover: string;
        text: string;
        loading: string;
    };
    onNavigate: (path: string) => void;
}

const AuctionTableRow = ({ auction, index, colorScheme, onNavigate }: AuctionTableRowProps) => {
    const getStatusTag = (status: number) => {
        switch (status) {
            case 0:
                return <Tag color="default">Nháp</Tag>;
            case 1:
                return <Tag color="processing">Công khai</Tag>;
            case 3:
                return <Tag color="error">Đã hủy</Tag>;
            default:
                return <Tag>Không xác định</Tag>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`grid grid-cols-7 hover:bg-${colorScheme.hover}/50 transition-colors duration-150 ease-in-out`}
        >
            <div className="px-6 py-4 text-sm text-gray-800 flex items-center">{index + 1}</div>
            <div className="px-6 py-4">
                <Tooltip title={auction.AuctionName}>
                    <span className={`text-sm font-medium text-${colorScheme.text} truncate block max-w-md`}>
                        {auction.AuctionName}
                    </span>
                </Tooltip>
            </div>
            <div className="px-6 py-4 text-sm text-gray-600">
                {new Date(auction.AuctionStartDate).toLocaleString("vi-VN")}
            </div>
            <div className="px-6 py-4 text-sm text-gray-600">
                {new Date(auction.AuctionEndDate).toLocaleString("vi-VN")}
            </div>
            <div className="px-6 py-4 text-sm text-gray-600 text-center">{auction.NumberRoundMax}</div>
            <div className="px-6 py-4">{getStatusTag(auction.Status)}</div>
            <div className="px-6 py-4">
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: '1',
                                icon: <EyeOutlined />,
                                label: 'Xem chi tiết',
                                onClick: () => onNavigate(`/auctioneer/auction/${auction.AuctionId}`),
                                className: `text-${colorScheme.text} hover:text-${colorScheme.hover} hover:bg-${colorScheme.hover}/50`
                            },
                            {
                                key: '2',
                                icon: <HistoryOutlined />,
                                label: 'Xem lịch sử',
                                onClick: () => onNavigate(`/auctioneer/auction/${auction.AuctionId}/history`),
                                className: `text-${colorScheme.text} hover:text-${colorScheme.hover} hover:bg-${colorScheme.hover}/50`
                            }
                        ]
                    }}
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button
                        type="text"
                        icon={<SettingOutlined />}
                        className={`hover:bg-${colorScheme.hover}/50 hover:text-${colorScheme.text} w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300`}
                    />
                </Dropdown>
            </div>
        </motion.div>
    );
};

interface AuctionTableProps {
    auctions: Auctions[];
    loading?: boolean;
    colorScheme: {
        hover: string;
        text: string;
        loading: string;
    };
    onNavigate: (path: string) => void;
}

const AuctionTable = ({ auctions, loading = false, colorScheme, onNavigate }: AuctionTableProps) => {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-full bg-white rounded-lg overflow-hidden">
                <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600 w-16">STT</div>
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600">Tên phiên đấu giá</div>
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600">Thời gian bắt đầu</div>
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600">Thời gian kết thúc</div>
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Số vòng tối đa</div>
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600">Trạng thái</div>
                    <div className="px-6 py-4 text-sm font-semibold text-gray-600">Thao tác</div>
                </div>
                <div className="divide-y divide-gray-200">
                    {auctions.map((auction, index) => (
                        <AuctionTableRow
                            key={auction.AuctionId}
                            auction={auction}
                            index={index}
                            colorScheme={colorScheme}
                            onNavigate={onNavigate}
                        />
                    ))}
                    {loading && (
                        <div className="flex justify-center items-center py-8">
                            <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${colorScheme.loading}`}></div>
                        </div>
                    )}
                    {!loading && auctions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                            <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <span className="text-lg">Không có phiên đấu giá nào</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuctionTable;
