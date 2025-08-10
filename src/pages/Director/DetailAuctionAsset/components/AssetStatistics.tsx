import { Card, Typography, Badge, Divider, Progress, Tooltip } from "antd";
import {
  FileTextOutlined,
  DollarOutlined,
  WalletOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";

const { Title, Text } = Typography;

interface AssetStatisticsProps {
  totalAuctionDocument: number;
  totalRegistrationFee: number;
  totalDeposit: number;
  deposit: number;
}

const AssetStatistics = ({
  totalAuctionDocument,
  totalRegistrationFee,
  totalDeposit,
  deposit,
}: AssetStatisticsProps) => {
  const formatVND = (amount: number) => {
    return `${formatNumber(amount)} VND`;
  };

  const getCompetitiveRate = () => {
    return Math.round((totalDeposit / deposit) * 100);
  };

  return (
    <Card
      className="!shadow-xl !bg-white/80 !backdrop-blur-sm !border-0 !rounded-2xl animate-slide-in-up"
      style={{ animationDelay: "0.4s" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
          <Badge count={totalAuctionDocument} color="#52c41a">
            <FileTextOutlined className="text-white text-lg" />
          </Badge>
        </div>
        <Title level={4} className="!mb-0 !text-gray-800">
          Thống kê tổng quan
        </Title>
      </div>

      <div className="space-y-4">
        <div className="!p-4 !bg-gradient-to-r from-blue-50 to-indigo-50 !rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Text className="!text-gray-600 !font-medium">
              Tổng số người đăng ký
            </Text>
            <Badge count={totalAuctionDocument} color="#1890ff" />
          </div>
          <div className="!text-2xl !font-bold !text-blue-600">
            {totalAuctionDocument} người
          </div>
        </div>

        <div className="!p-4 !bg-gradient-to-r from-green-50 to-emerald-50 !rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Text className="!text-gray-600 !font-medium">
              Tổng phí đăng ký
            </Text>
            <DollarOutlined className="text-green-500" />
          </div>
          <div className="!text-2xl !font-bold !text-green-600">
            {formatVND(totalRegistrationFee)}
          </div>
        </div>

        <div className="!p-4 !bg-gradient-to-r from-purple-50 to-pink-50 !rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <Text className="!text-gray-600 !font-medium">Tổng tiền cọc</Text>
            <WalletOutlined className="text-purple-500" />
          </div>
          <div className="!text-2xl !font-bold !text-purple-600">
            {formatVND(totalDeposit)}
          </div>
        </div>
      </div>

      <Divider className="!my-4" />

      {/* Competitive Analysis */}
      <div className="!p-4 !bg-gradient-to-r from-orange-50 to-red-50 !rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="!text-sm !font-medium !text-gray-600">
            Mức độ cạnh tranh
          </div>
          <Tooltip title="Dựa trên tỷ lệ tổng tiền cọc so với tiền cọc của tài sản">
            <InfoCircleOutlined className="text-gray-400" />
          </Tooltip>
        </div>
        <div className="flex items-center gap-3">
          <Progress
            percent={getCompetitiveRate()}
            size="small"
            strokeColor={
              getCompetitiveRate() >= 80
                ? "#52c41a"
                : getCompetitiveRate() >= 60
                ? "#fa8c16"
                : "#f5222d"
            }
            className="flex-1"
          />
          <Text
            className={`!font-bold ${
              getCompetitiveRate() >= 80
                ? "!text-green-600"
                : getCompetitiveRate() >= 60
                ? "!text-orange-600"
                : "!text-red-600"
            }`}
          >
            {getCompetitiveRate() >= 80
              ? "Cao"
              : getCompetitiveRate() >= 60
              ? "Trung bình"
              : "Thấp"}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default AssetStatistics;
