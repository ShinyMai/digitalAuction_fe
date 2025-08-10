import { Card, Descriptions, Typography, Space, Tag } from "antd";
import {
  InfoCircleOutlined,
  TagOutlined,
  ApartmentOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface AssetBasicInfoProps {
  auctionAssetResponse: {
    tagName: string;
    unit: string;
    createdAt: string;
    auctionName: string;
  };
}

const AssetBasicInfo = ({ auctionAssetResponse }: AssetBasicInfoProps) => {
  return (
    <Card
      className="!shadow-xl !bg-white/80 !backdrop-blur-sm !border-0 !rounded-2xl animate-slide-in-up"
      style={{ animationDelay: "0.1s" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <InfoCircleOutlined className="text-white" />
        </div>
        <Title level={4} className="!mb-0 !text-gray-800">
          Thông tin cơ bản
        </Title>
      </div>

      <Descriptions
        column={{ xs: 1, sm: 1, md: 3 }}
        bordered
        size="middle"
        className="custom-descriptions"
      >
        <Descriptions.Item
          label={
            <Space>
              <TagOutlined className="text-blue-500" />
              Tên tài sản
            </Space>
          }
          span={2}
        >
          <Text className="!text-lg !font-semibold !text-gray-800">
            {auctionAssetResponse.tagName}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space>
              <ApartmentOutlined className="text-purple-500" />
              Đơn vị
            </Space>
          }
          span={2}
        >
          <Tag color="purple" className="!font-medium">
            {auctionAssetResponse.unit}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space>
              <CalendarOutlined className="text-orange-500" />
              Ngày tạo
            </Space>
          }
          span={4}
        >
          <Text className="!font-medium">
            {dayjs(auctionAssetResponse.createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <Space>
              <HomeOutlined className="text-green-500" />
              Buổi đấu giá
            </Space>
          }
          span={4}
        >
          <div className="max-w-full">
            <div className="!bg-green-50 !border !border-green-200 !rounded-lg !px-3 !py-2 !text-green-700 !font-medium !text-sm !break-words !whitespace-normal !leading-relaxed">
              {auctionAssetResponse.auctionName}
            </div>
          </div>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default AssetBasicInfo;
