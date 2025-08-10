import { Button, Typography, Tag } from "antd";
import {
  TagOutlined,
  ArrowLeftOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface AssetHeaderProps {
  auctionAssetResponse: {
    auctionAssetsId: string;
    tagName: string;
    auctionName: string;
  };
  onGoBack: () => void;
}

const AssetHeader = ({ auctionAssetResponse, onGoBack }: AssetHeaderProps) => {
  return (
    <div className="mb-8 animate-slide-in-up">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={onGoBack}
              className="hover:bg-white/50 !rounded-full"
            >
              Quay lại
            </Button>
            <div className="h-8 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TagOutlined className="text-white text-lg" />
              </div>
              <div>
                <Title level={2} className="!mb-0 !text-gray-800">
                  Chi tiết tài sản đấu giá
                </Title>
                <Text className="text-gray-500">
                  ID: {auctionAssetResponse.auctionAssetsId.slice(0, 8)}...
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <HomeOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="text-xl font-bold">
                {auctionAssetResponse.tagName}
              </div>
              <div className="text-green-100">
                Đấu giá: {auctionAssetResponse.auctionName}
              </div>
            </div>
          </div>
          <Tag
            color="green"
            className="!bg-white/20 !border-white/30 !text-white !font-semibold"
          >
            ✅ Hoạt động
          </Tag>
        </div>
      </div>
    </div>
  );
};

export default AssetHeader;
