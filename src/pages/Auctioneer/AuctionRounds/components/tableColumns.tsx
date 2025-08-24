import { Button, Tag, Space, Typography, Tooltip } from "antd";
import {
  EyeOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { AuctionRound } from "../modalsData";
import type { AuctionDataDetail } from "../../Modals";

const { Text } = Typography;

const getStatusInfo = (status: number) => {
  switch (status) {
    case 0:
      return {
        text: "Chưa bắt đầu",
        color: "default",
        icon: <PauseCircleOutlined />,
      };
    case 1:
      return {
        text: "Đang diễn ra",
        color: "processing",
        icon: <PlayCircleOutlined />,
      };
    case 2:
      return {
        text: "Đã kết thúc",
        color: "success",
        icon: <CheckCircleOutlined />,
      };
    default:
      return {
        text: "Không xác định",
        color: "default",
        icon: <PauseCircleOutlined />,
      };
  }
};

interface ColumnProps {
  onViewDetails?: (record: AuctionRound) => void;
  onInputPrice?: (record: AuctionRound) => void;
  auction?: AuctionDataDetail;
  userRole?: string;
}

export const getAuctionRoundsColumns = ({
  onViewDetails,
  onInputPrice,
  auction,
  userRole,
}: ColumnProps = {}) => [
  {
    title: "Vòng đấu giá",
    dataIndex: "roundNumber",
    key: "roundNumber",
    width: 120,
    render: (roundNumber: number) => (
      <div className="flex justify-center items-center">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-400 font-semibold text-white">
          {roundNumber}
        </div>
      </div>
    ),
  },
  {
    title: "Tên cuộc đấu giá",
    dataIndex: "roundNumber",
    key: "auctionName",
    ellipsis: true,
    width: 400,
    render: (roundNumber: number) => {
      const displayName = auction?.auctionName
        ? `${auction.auctionName} - Vòng ${roundNumber}`
        : `Vòng ${roundNumber}`;
      return (
        <Tooltip title={displayName}>
          <Text strong className="!text-gray-800">
            {displayName}
          </Text>
        </Tooltip>
      );
    },
  },
  {
    title: "Danh mục",
    dataIndex: ["auction", "categoryName"],
    key: "categoryName",
    render: (category: string) => (
      <Tag color="blue" className="!border-blue-300 !bg-blue-50 !text-blue-700">
        {auction?.categoryName || category}
      </Tag>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
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
    title: "Đấu giá viên",
    dataIndex: ["auction", "auctioneer"],
    key: "auctioneer",
    render: (auctioneer: string) => (
      <Space>
        <UserOutlined className="!text-green-500" />
        <Text className="!text-gray-700">
          {auction?.auctioneerBy || auctioneer}
        </Text>
      </Space>
    ),
  },
  {
    title: "Thao tác",
    key: "action",
    align: "center" as const,
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
        {userRole === "Staff" && record.status == 1 && (
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
