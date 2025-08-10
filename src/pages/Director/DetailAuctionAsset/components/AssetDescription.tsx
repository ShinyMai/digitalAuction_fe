import { Card, Typography } from "antd";
import { FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface AssetDescriptionProps {
  description: string;
}

const AssetDescription = ({ description }: AssetDescriptionProps) => {
  if (!description) return null;

  return (
    <Card
      className="!shadow-xl !bg-white/80 !backdrop-blur-sm !border-0 !rounded-2xl animate-slide-in-up"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
          <FileTextOutlined className="text-white" />
        </div>
        <Title level={4} className="!mb-0 !text-gray-800">
          Mô tả tài sản
        </Title>
      </div>

      <div className="!bg-gradient-to-r from-gray-50 to-blue-50 !p-6 !rounded-xl">
        <Text className="!text-gray-700 !text-base !leading-relaxed">
          {description}
        </Text>
      </div>
    </Card>
  );
};

export default AssetDescription;
