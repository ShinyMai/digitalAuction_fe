import { Card, Statistic, Row, Col, Divider, Typography, Progress } from "antd";
import {
  DollarOutlined,
  WalletOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";
import { formatNumber } from "../../../../utils/numberFormat";

const { Title, Text } = Typography;

interface AssetFinancialInfoProps {
  auctionAssetResponse: {
    startingPrice: number;
    deposit: number;
    registrationFee: number;
  };
}

const AssetFinancialInfo = ({
  auctionAssetResponse,
}: AssetFinancialInfoProps) => {
  const formatVND = (amount: number) => {
    return `${formatNumber(amount)} VND`;
  };

  return (
    <Card
      className="!shadow-xl !bg-white/80 !backdrop-blur-sm !border-0 !rounded-2xl animate-slide-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <DollarOutlined className="text-white" />
        </div>
        <Title level={4} className="!mb-0 !text-gray-800">
          Thông tin tài chính
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card className="!text-center !bg-gradient-to-br from-green-50 to-emerald-50 !border-green-200">
            <Statistic
              title={
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <DollarOutlined className="text-green-500" />
                  Giá khởi điểm
                </div>
              }
              value={auctionAssetResponse.startingPrice}
              formatter={(value) => formatVND(Number(value))}
              valueStyle={{
                color: "#52c41a",
                fontSize: "20px",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="!text-center !bg-gradient-to-br from-blue-50 to-indigo-50 !border-blue-200">
            <Statistic
              title={
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <WalletOutlined className="text-blue-500" />
                  Tiền đặt trước
                </div>
              }
              value={auctionAssetResponse.deposit}
              formatter={(value) => formatVND(Number(value))}
              valueStyle={{
                color: "#1890ff",
                fontSize: "20px",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card className="!text-center !bg-gradient-to-br from-purple-50 to-pink-50 !border-purple-200">
            <Statistic
              title={
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <CreditCardOutlined className="text-purple-500" />
                  Phí đăng ký
                </div>
              }
              value={auctionAssetResponse.registrationFee}
              formatter={(value) => formatVND(Number(value))}
              valueStyle={{
                color: "#722ed1",
                fontSize: "20px",
                fontWeight: "bold",
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Percentage Analysis */}
      <Divider className="!my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="!p-4 !bg-gradient-to-r from-blue-50 to-indigo-50 !rounded-xl">
          <div className="!text-sm !text-gray-600 !mb-2">
            Tỷ lệ tiền cọc so với giá khởi điểm
          </div>
          <div className="flex items-center gap-3">
            <Progress
              percent={Math.round(
                (auctionAssetResponse.deposit /
                  auctionAssetResponse.startingPrice) *
                  100
              )}
              size="small"
              strokeColor="#1890ff"
              className="flex-1"
            />
            <Text className="!font-bold !text-blue-600">
              {Math.round(
                (auctionAssetResponse.deposit /
                  auctionAssetResponse.startingPrice) *
                  100
              )}
              %
            </Text>
          </div>
        </div>
        <div className="!p-4 !bg-gradient-to-r from-purple-50 to-pink-50 !rounded-xl">
          <div className="!text-sm !text-gray-600 !mb-2">
            Tỷ lệ phí đăng ký so với tiền cọc
          </div>
          <div className="flex items-center gap-3">
            <Progress
              percent={Math.round(
                (auctionAssetResponse.registrationFee /
                  auctionAssetResponse.deposit) *
                  100
              )}
              size="small"
              strokeColor="#722ed1"
              className="flex-1"
            />
            <Text className="!font-bold !text-purple-600">
              {Math.round(
                (auctionAssetResponse.registrationFee /
                  auctionAssetResponse.deposit) *
                  100
              )}
              %
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AssetFinancialInfo;
