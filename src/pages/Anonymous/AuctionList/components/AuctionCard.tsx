import { Card, Space, Typography } from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration"; // Import plugin duration
import type { AuctionDataList } from "../../Modals";
import { STAFF_ROUTES } from "../../../../routers";
import { useState, useEffect } from "react";

// Kích hoạt plugin duration
dayjs.extend(duration);

interface Props {
  dataCard: AuctionDataList;
}

const AuctionCard = ({ dataCard }: Props) => {
  const navigate = useNavigate();
  const { Text } = Typography;

  // State để lưu thời gian đếm ngược hoặc trạng thái hết hạn
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const end = dayjs(dataCard.registerEndDate);

      if (now.isAfter(end)) {
        setTimeLeft("Đã hết hạn đăng ký");
        return;
      }

      const diff = end.diff(now);
      const durationObj = dayjs.duration(diff); // Sử dụng duration

      // Tính ngày, giờ, phút, giây
      const days = Math.floor(durationObj.asDays());
      const hours = durationObj.hours();
      const minutes = durationObj.minutes();
      const seconds = durationObj.seconds();

      setTimeLeft(
        `${days} ngày, ${hours} giờ, ${minutes} phút, ${seconds} giây`
      );
    };

    // Tính toán ngay khi component mount
    calculateTimeLeft();

    // Cập nhật mỗi giây
    const interval = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, [dataCard.registerEndDate]);

  return (
    <Card
      hoverable
      cover={
        <img
          alt={dataCard.auctionName}
          src="https://thamdinhgiathanhdo.com/wp-content/uploads/2020/10/quyen-su-dung-dat-la-gi.jpg"
          className="w-full h-48 object-cover rounded-t-lg"
        />
      }
      className="shadow-lg mb-4"
      onClick={() =>
        navigate(STAFF_ROUTES.SUB.AUCTION_DETAIL, {
          state: { key: dataCard.auctionId },
          replace: true,
        })
      }
    >
      <Card.Meta
        title={
          <div className="text-center text-lg font-semibold">
            {dataCard.auctionName}
          </div>
        }
        description={
          <Space direction="vertical" className="w-full">
            <div className="flex items-center text-gray-800">
              <FieldTimeOutlined className="mr-2" />
              Ngày đấu giá:{" "}
              <Text strong className="ml-2 text-lg">
                {dayjs(dataCard.auctionStartDate).format(
                  "DD/MM/YYYY"
                )}
              </Text>
            </div>
            <div className="flex items-center text-gray-800">
              <FieldTimeOutlined className="mr-2" />
              Ngày kết thúc đăng ký:{" "}
              <Text strong className="ml-2 text-lg">
                {dayjs(dataCard.registerEndDate).format(
                  "DD/MM/YYYY"
                )}
              </Text>
            </div>
            <div className="flex items-center text-gray-800">
              <FieldTimeOutlined className="mr-2" />
              Thời gian còn lại:{" "}
              <Text strong className="ml-2 text-lg text-red-500">
                {timeLeft}
              </Text>
            </div>
            {/* Uncomment if startingPrice is available in AuctionDataList */}
            {/* <div className="flex items-center text-gray-800">
              <DollarOutlined className="mr-2" />
              Giá khởi điểm:{" "}
              <Text strong className="ml-2 text-lg text-green-500">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(dataCard.startingPrice)}
              </Text>
            </div> */}
          </Space>
        }
      />
    </Card>
  );
};

export default AuctionCard;