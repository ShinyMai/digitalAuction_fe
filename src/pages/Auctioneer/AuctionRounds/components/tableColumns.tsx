import { Button, Tag, Space, Typography, Tooltip, Badge } from "antd";
import {
    EyeOutlined,
    PlayCircleOutlined,
    PauseCircleOutlined,
    CheckCircleOutlined,
    UserOutlined,
    FileTextOutlined,
    DollarOutlined
} from "@ant-design/icons";
import type { AuctionRound } from "../modalsData";
import type { AuctionDataDetail } from "../../Modals";

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
    onInputPrice?: (record: AuctionRound) => void;
    auction?: AuctionDataDetail;
    userRole?: string;
}

export const getAuctionRoundsColumns = ({ onViewDetails, onInputPrice, auction, userRole }: ColumnProps = {}) => [
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
        dataIndex: 'roundNumber',
        key: 'auctionName',
        ellipsis: true,
        render: (roundNumber: number) => {
            const displayName = auction?.auctionName ? `${auction.auctionName} - Vòng ${roundNumber}` : `Vòng ${roundNumber}`;
            return (
                <Tooltip title={displayName}>
                    <Text strong className="!text-gray-800">{displayName}</Text>
                </Tooltip>
            );
        },
    },
    {
        title: 'Danh mục',
        dataIndex: ['auction', 'categoryName'],
        key: 'categoryName',
        width: 120,
        render: (category: string) => (
            <Tag color="blue" className="!border-blue-300 !bg-blue-50 !text-blue-700">
                {auction?.categoryName || category}
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
        title: 'Đấu giá viên',
        dataIndex: ['auction', 'auctioneer'],
        key: 'auctioneer',
        width: 150,
        render: (auctioneer: string) => (
            <Space>
                <UserOutlined className="!text-green-500" />
                <Text className="!text-gray-700">{auction?.auctioneer || auctioneer}</Text>
            </Space>
        ),
    },
    {
        title: 'Thao tác',
        key: 'action',
        width: userRole === 'Staff' ? 180 : 120,
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
                {userRole === 'Staff' && (
                    <Tooltip title="Nhập giá">
                        <Button
                            type="default"
                            icon={<DollarOutlined />}
                            size="small"
                            className="!bg-green-500 !border-green-500 !text-white hover:!bg-green-600 hover:!border-green-600"
                            onClick={() => onInputPrice?.(record)}
                        />
                    </Tooltip>
                )}
            </Space>
        ),
    },
];
