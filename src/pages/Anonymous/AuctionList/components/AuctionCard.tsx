import {
  FieldTimeOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
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

  // State để lưu thời gian đếm ngược hoặc trạng thái hết hạn
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = dayjs();
      const end = dayjs(dataCard.registerEndDate);

      if (now.isAfter(end)) {
        setTimeLeft("Đã hết hạn đăng ký");
        setIsExpired(true);
        return;
      }

      const diff = end.diff(now);
      const durationObj = dayjs.duration(diff); // Tính ngày, giờ, phút
      const days = Math.floor(durationObj.asDays());
      const hours = durationObj.hours();
      const minutes = durationObj.minutes();

      setTimeLeft(`${days} ngày, ${hours} giờ, ${minutes} phút`);
      setIsExpired(false);
    };

    // Tính toán ngay khi component mount
    calculateTimeLeft();

    // Cập nhật mỗi giây
    const interval = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval khi component unmount
    return () => clearInterval(interval);
  }, [dataCard.registerEndDate]);

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift animate-slide-in-up">
      {/* Status Badge */}
      <div className="absolute top-2 right-4 z-10">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
            isExpired
              ? "bg-red-500/90 text-white"
              : "bg-green-500/90 text-white animate-pulse-glow"
          }`}
        >
          {isExpired ? "Hết hạn" : "Đang mở"}
        </div>
      </div>

      {/* Image Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Floating Action Button */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button
            onClick={() =>
              navigate(STAFF_ROUTES.SUB.AUCTION_DETAIL, {
                state: { key: dataCard.auctionId },
                replace: true,
              })
            }
            className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
          >
            →
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {dataCard.auctionName}
        </h3>

        {/* Info Grid */}
        <div className="space-y-3">
          {/* Auction Date */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <CalendarOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Ngày đấu giá</p>
              <p className="text-sm font-bold text-gray-800">
                {dayjs(dataCard.auctionStartDate).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>

          {/* Registration Deadline */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <FieldTimeOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Hạn đăng ký</p>
              <p className="text-sm font-bold text-gray-800">
                {dayjs(dataCard.registerEndDate).format("DD/MM/YYYY")}
              </p>
            </div>
          </div>

          {/* Time Remaining */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isExpired
                  ? "bg-gradient-to-r from-gray-400 to-gray-500"
                  : "bg-gradient-to-r from-purple-500 to-pink-600 animate-pulse-glow"
              }`}
            >
              <ClockCircleOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">
                Thời gian còn lại
              </p>
              <p
                className={`text-sm font-bold ${
                  isExpired ? "text-red-500" : "text-purple-600"
                }`}
              >
                {timeLeft}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() =>
            navigate(STAFF_ROUTES.SUB.AUCTION_DETAIL, {
              state: { key: dataCard.auctionId },
              replace: true,
            })
          }
          className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
            isExpired
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl glow-button"
          }`}
          disabled={isExpired}
        >
          {isExpired ? "Đã hết hạn" : "Xem chi tiết phiên đấu giá"}
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-400/20 to-pink-400/20 rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
};

export default AuctionCard;
