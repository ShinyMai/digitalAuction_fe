import { Card, Tag, Button, Table } from "antd";
import dayjs from "dayjs";
import {
  CalendarOutlined,
  DollarOutlined,
  FireOutlined,
  EyeOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import type { RegisteredAuction } from "../types";
import { getStatusInfo } from "./utils";

interface AuctionCardProps {
  auction: RegisteredAuction;
  onViewDetails: (auctionId: string) => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onViewDetails }) => {
  const statusInfo = getStatusInfo(auction);
  const registrationInfo = { color: "green", text: "Đã đăng ký" };

  return (
    <Card
      className={`!shadow-lg !border-0 hover:!shadow-xl !transition-all !duration-300 !transform hover:!-translate-y-1 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
              {auction.auctionName}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Tag color={statusInfo.color} className="!flex !items-center !gap-1">
                {statusInfo.icon}
                {statusInfo.text}
              </Tag>
              <Tag color={registrationInfo.color}>{registrationInfo.text}</Tag>
              <Tag color="default">{auction.categoryName}</Tag>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrophyOutlined className="text-yellow-500" />
            Tài sản đăng ký ({auction.auctionAssets.length})
          </h4>
          <div className="overflow-x-auto">
            <Table
              dataSource={auction.auctionAssets}
              pagination={false}
              size="small"
              rowKey="auctionAssetsId"
              className="!bg-transparent"
              columns={[
                {
                  title: "Tên tài sản",
                  dataIndex: "tagName",
                  key: "tagName",
                  render: (text: string) => <div className="font-medium text-gray-800">{text}</div>,
                },
                {
                  title: "Giá khởi điểm",
                  dataIndex: "startingPrice",
                  key: "startingPrice",
                  align: "right" as const,
                  render: (value: number) => (
                    <div className="font-bold text-blue-600">{formatNumber(value)} VND</div>
                  ),
                },
                {
                  title: "Tiền cọc",
                  dataIndex: "deposit",
                  key: "deposit",
                  align: "right" as const,
                  render: (value: number) => (
                    <div className="font-semibold text-green-600">{formatNumber(value)} VND</div>
                  ),
                },
                {
                  title: "Phí đăng ký",
                  dataIndex: "registrationFee",
                  key: "registrationFee",
                  align: "right" as const,
                  render: (value: number) => (
                    <div className="font-semibold text-orange-600">{formatNumber(value)} VND</div>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4 text-sm p-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarOutlined className="text-blue-500" />
              <span>Hạn đăng ký:</span>
            </div>
            <div className="font-semibold text-gray-800">
              {dayjs(auction.registerEndDate).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <FireOutlined className="text-orange-500" />
              <span>Ngày đấu giá:</span>
            </div>
            <div className="font-semibold text-gray-800">
              {dayjs(auction.auctionStartDate).format("DD/MM/YYYY HH:mm")}
            </div>
          </div>
        </div>

        {/* Financial Info */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarOutlined className="text-green-500" />
                <span>Tổng tiền cọc:</span>
              </div>
              <div className="font-bold text-green-600">
                {formatNumber(auction.auctionAssets.reduce((sum, asset) => sum + asset.deposit, 0))}
                VND
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarOutlined className="text-blue-500" />
                <span>Tổng phí đăng ký:</span>
              </div>
              <div className="font-bold text-blue-600">
                {formatNumber(
                  auction.auctionAssets.reduce((sum, asset) => sum + asset.registrationFee, 0)
                )}
                VND
              </div>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Hạn đăng ký: {dayjs(auction.registerEndDate).format("DD/MM/YYYY HH:mm")}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(auction.auctionId)}
            className="!flex-1 !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-0"
          >
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AuctionCard;
