import React from "react";
import { Card, Button } from "antd";
import { TagOutlined, EyeOutlined } from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";
import dayjs from "dayjs";
import type { AssetsListProps } from "../types";

const AssetsList: React.FC<AssetsListProps> = ({ assets, onAssetClick }) => {
  const formatVND = (amount: number) => {
    return `${formatNumber(amount)} VND`;
  };

  return (
    <div className="space-y-4">
      {assets.map((asset) => (
        <Card
          key={asset.auctionAssetsId}
          hoverable
          className="border border-gray-200 hover:border-blue-300 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TagOutlined className="text-blue-500 text-xl" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-lg text-gray-800">
                    {asset.tagName}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Danh mục: {asset.categoryName}</span>
                    <span>Đơn vị: {asset.unit}</span>
                    <span>
                      Tạo: {dayjs(asset.createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-gray-500">Giá khởi điểm</div>
                <div className="font-bold text-green-600">
                  {formatVND(asset.startingPrice)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Tiền cọc</div>
                <div className="font-semibold text-blue-600">
                  {formatVND(asset.deposit)}
                </div>
              </div>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => onAssetClick(asset)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Chi tiết
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AssetsList;
