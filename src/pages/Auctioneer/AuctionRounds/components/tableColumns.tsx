import { Button, Tag, Space, Typography, Tooltip, Badge } from "antd";
import {
    EyeOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    CheckCircleOutlined,
    UserOutlined,
    FileTextOutlined
} from "@ant-design/icons";
import type { AuctionRound } from "../modalsData";

const { Text } = Typography;

const getStatusInfo = (status: number) => {
    switch (status) {
        case 0:
            return { text: "Chưa bắt đầu", color: "default", icon: <PauseCircleOutlined /> };
        case 1:
            return { text: "Đang diễn ra", color: "processing", icon: <PlayCircleOutlined /> };
        case 2:
            return { text: "Đã kết thúc", color: "success", icon: <CheckCircleOutlined /> };
        default:
            return { text: "Không xác định", color: "default", icon: <PauseCircleOutlined /> };
    }
};

interface ColumnProps {
    onViewDetails?: (record: AuctionRound) => void;
}

export const getAuctionRoundsColumns = ({ onViewDetails }: ColumnProps = {}) => [
    {
        title: 'Vòng đấu giá',
        dataIndex: 'roundNumber',
        key: 'roundNumber',
        width: 120,
        render: (roundNumber: number) => (
            <Badge count={roundNumber} showZero className="!bg-blue-500">
                <div className="!w-12 !h-8 !bg-blue-50 !rounded-md !flex !items-center !justify-center">
                    <FileTextOutlined className="!text-blue-500" />
                </div>
            </Badge>
        ),
    },
    {
        title: 'Tên cuộc đấu giá',
        dataIndex: ['auction', 'auctionName'],
        key: 'auctionName',
        ellipsis: true,
        render: (text: string) => (
            <Tooltip title={text}>
                <Text strong className="!text-gray-800">{text}</Text>
            </Tooltip>
        ),
    },
    {
        title: 'Danh mục',
        dataIndex: ['auction', 'categoryName'],
        key: 'categoryName',
        width: 120,
        render: (category: string) => (
            <Tag color="blue" className="!border-blue-300 !bg-blue-50 !text-blue-700">
                {category}
            </Tag>
        ),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        render: (status: number) => {
            const statusInfo = getStatusInfo(status);
            return (
                <Tag
                    color={statusInfo.color}
                    icon={statusInfo.icon}
                    className="!flex !items-center !gap-1 !w-fit !px-3 !py-1"
                >
                    {statusInfo.text}
                </Tag>
            );
        },
    },
    {
        title: 'Tổng vòng tối đa',
        dataIndex: ['auction', 'numberRoundMax'],
        key: 'numberRoundMax',
        width: 140,
        align: 'center' as const,
        render: (maxRounds: number) => (
            <Tag color="purple" className="!border-purple-300 !bg-purple-50 !text-purple-700">
                {maxRounds} vòng
            </Tag>
        ),
    },
    {
        title: 'Người đấu giá',
        dataIndex: ['auction', 'auctioneer'],
        key: 'auctioneer',
        width: 150,
        render: (auctioneer: string) => (
            <Space>
                <UserOutlined className="!text-green-500" />
                <Text className="!text-gray-700">{auctioneer}</Text>
            </Space>
        ),
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: 120,
        align: 'center' as const,
        render: (_text: unknown, record: AuctionRound) => (
            <Space>
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600"
                        onClick={() => onViewDetails?.(record)}
                    />
                </Tooltip>
            </Space>
        ),
    },
];
