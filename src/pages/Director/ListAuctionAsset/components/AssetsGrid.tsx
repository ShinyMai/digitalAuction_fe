import React from "react";
import { Card, Tag, Button, Row, Col } from "antd";
import { TagOutlined, EyeOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import dayjs from "dayjs";
import type { AuctionAsset, AssetsGridProps } from "../types";

const AssetsGrid: React.FC<AssetsGridProps> = ({ assets, onAssetClick }) => {
  const formatVND = (amount: number) => {
    return `${formatNumber(amount)} VND`;
  };

  const AssetCard: React.FC<{ asset: AuctionAsset }> = ({ asset }) => (
    <Card
      hoverable
      className="h-full shadow-md hover:shadow-lg transition-all duration-300 border-0 rounded-xl"
      cover={
        <div className="h-32 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
          <TagOutlined className="text-4xl text-blue-400" />
        </div>
      }
      actions={[
        <Button
          key="detail"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => onAssetClick(asset)}
          className="border-0"
        >
          Chi tiết
        </Button>,
      ]}
    >
      <div className="space-y-3">
        <div>
          <div className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">
            {asset.tagName}
          </div>
          <Tag color="blue" className="text-xs">
            {asset.categoryName}
          </Tag>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Giá khởi điểm:</span>
            <span className="font-bold text-green-600 text-sm">
              {formatVND(asset.startingPrice)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Tiền cọc:</span>
            <span className="font-semibold text-blue-600 text-sm">
              {formatVND(asset.deposit)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Phí đăng ký:</span>
            <span className="font-semibold text-purple-600 text-sm">
              {formatVND(asset.registrationFee)}
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-400 border-t pt-2">
          Tạo: {dayjs(asset.createdAt).format("DD/MM/YYYY")}
        </div>
      </div>
    </Card>
  );

  return (
    <Row gutter={[16, 16]}>
      {assets.map((asset) => (
        <Col key={asset.auctionAssetsId} xs={24} sm={12} md={8} lg={6}>
          <AssetCard asset={asset} />
        </Col>
      ))}
    </Row>
  );
};

export default AssetsGrid;
