import React from 'react';
import { Table, Tag, Button, Typography, Modal } from 'antd';
import {
    ClockCircleOutlined,
    TeamOutlined,
    DollarOutlined,
    RightOutlined,
    HistoryOutlined,
    PlayCircleOutlined,
    StopOutlined,
    ReloadOutlined,
    PlusOutlined
} from '@ant-design/icons';
import type { ExtendedAuctionRound } from '../types';
import { useNavigate } from 'react-router-dom';
import { AUCTIONEER_ROUTES } from '../../../../routers';

const { Text } = Typography;
const { confirm } = Modal;

interface RoundListProps {
    rounds: ExtendedAuctionRound[];
    loading?: boolean;
    onRefresh: () => Promise<void>;
    onStartRound: (roundId: string) => Promise<void>;
    onEndRound: (roundId: string) => Promise<void>;
}

const RoundList: React.FC<RoundListProps> = ({
    rounds,
    loading,
    onRefresh,
    onStartRound,
    onEndRound
}) => {
    const navigate = useNavigate();
    const formatTimeRemaining = (seconds?: number) => {
        if (!seconds) return '-';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusTag = (status: number) => {
        const statusConfig = {
            0: { color: 'default', text: 'Chờ bắt đầu' },
            1: { color: 'processing', text: 'Đang diễn ra' },
            2: { color: 'success', text: 'Đã hoàn thành' },
            3: { color: 'error', text: 'Đã hủy' }
        };

        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    const handleStartRoundClick = (round: ExtendedAuctionRound) => {
        confirm({
            title: `Bắt đầu vòng ${round.RoubdNumber}?`,
            content: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn bắt đầu vòng đấu giá này?',
            okText: 'Bắt đầu',
            cancelText: 'Hủy',
            onOk: () => onStartRound(round.AuctionRoundId)
        });
    };

    const handleEndRoundClick = (round: ExtendedAuctionRound) => {
        confirm({
            title: `Kết thúc vòng ${round.RoubdNumber}?`,
            content: 'Hành động này không thể hoàn tác. Bạn có chắc chắn muốn kết thúc vòng đấu giá này?',
            okText: 'Kết thúc',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: () => onEndRound(round.AuctionRoundId)
        });
    };

    const columns = [
        {
            title: 'Vòng',
            key: 'round',
            render: (round: ExtendedAuctionRound) => (
                <div className="flex flex-col space-y-1">
                    <Text strong className="text-gray-800">Vòng {round.RoubdNumber}</Text>
                    {round.Status === 1 && round.remainingTime && (
                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 w-fit">
                            <ClockCircleOutlined className="mr-1" />
                            {formatTimeRemaining(round.remainingTime)}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'Status',
            key: 'status',
            render: getStatusTag
        },
        {
            title: 'Người tham gia',
            key: 'participants',
            render: (round: ExtendedAuctionRound) => (
                <div className="flex items-center space-x-2">
                    <TeamOutlined className="text-gray-500" />
                    <Text className="text-gray-700">{round.participantCount}</Text>
                    <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green-500 rounded-full">
                        {round.bids.length}
                    </div>
                </div>
            )
        },
        {
            title: 'Giá hiện tại',
            key: 'price',
            render: (round: ExtendedAuctionRound) => (
                <div className="flex flex-col space-y-1">
                    <Text strong className="text-green-600 flex items-center">
                        <DollarOutlined className="mr-1" /> {formatCurrency(round.currentPrice)}
                    </Text>
                    <Text className="text-xs text-gray-500">
                        Khởi điểm: {formatCurrency(round.startPrice)}
                    </Text>
                </div>
            )
        },
        {
            title: 'Thời gian',
            key: 'time',
            render: (round: ExtendedAuctionRound) => (
                <div className="flex flex-col space-y-1">
                    <Text className="text-xs text-gray-600">
                        Tạo: {new Date(round.CreatedAt).toLocaleString()}
                    </Text>
                    <Text className="text-xs text-gray-500">
                        Bởi: {round.CreatedBy}
                    </Text>
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            render: (round: ExtendedAuctionRound) => {
                const actions = [];

                if (round.Status === 0) {
                    actions.push(
                        <Button
                            key="start"
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={() => handleStartRoundClick(round)}
                            className="bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                        >
                            Bắt đầu
                        </Button>
                    );
                }

                if (round.Status === 1) {
                    actions.push(
                        <Button
                            key="end"
                            danger
                            icon={<StopOutlined />}
                            onClick={() => handleEndRoundClick(round)}
                            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white"
                        >
                            Kết thúc
                        </Button>
                    );
                }

                actions.push(
                    <Button
                        key="history"
                        type="link"
                        icon={<HistoryOutlined />}
                        className="text-gray-600 hover:text-blue-600"
                    >
                        Lịch sử
                    </Button>
                );

                if (round.Status !== 0) {
                    actions.push(
                        <Button
                            key="detail"
                            type="link"
                            icon={<RightOutlined />}
                            className="text-gray-600 hover:text-blue-600"
                            onClick={() => navigate(AUCTIONEER_ROUTES.SUB.AUCTION_ROUND_DETAIL)}
                        >
                            Chi tiết
                        </Button>
                    );
                }

                return (
                    <div className="flex flex-col sm:flex-row gap-2">
                        {actions}
                    </div>
                );
            }
        }
    ];

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Text className="text-xl font-semibold text-gray-800">Danh sách vòng đấu giá</Text>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={onRefresh}
                        loading={loading}
                        className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700"
                    >
                        Làm mới
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 border-blue-500 hover:border-blue-600"
                    >
                        Tạo vòng mới
                    </Button>
                </div>
            </div>

            <div className="bg-white border-gray-200 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={rounds}
                    rowKey="AuctionRoundId"
                    loading={loading}
                    pagination={{
                        total: rounds.length,
                        pageSize: 10,
                        showTotal: (total) => `Tổng số ${total} vòng`,
                        className: "px-4 py-3",
                    }}
                    className="rounded-xl overflow-hidden"
                    rowClassName="hover:bg-blue-50 transition-all duration-200"
                    scroll={{ x: true }}
                />
            </div>
        </div>
    );
};

export default RoundList;
