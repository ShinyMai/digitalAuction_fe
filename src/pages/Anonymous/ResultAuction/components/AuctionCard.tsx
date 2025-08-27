import {
  FieldTimeOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import type { AuctionDataList } from "../../Modals";
import { STAFF_ROUTES } from "../../../../routers";
interface Props {
  dataCard: AuctionDataList;
  onViewResults?: (auctionId: string) => void;
}

const AuctionCard = ({ dataCard, onViewResults }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift animate-slide-in-up">
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
      <div className="p-6 space-y-4">
        {/* Title */}
        <div className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {dataCard.auctionName}
        </div>

        {/* Info Grid */}
        <div className="space-y-3">
          {/* Auction Date */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <CalendarOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium">
                Ngày đấu giá
              </div>
              <div className="text-sm font-bold text-gray-800">
                {dayjs(dataCard.auctionStartDate).format("DD/MM/YYYY")}
              </div>
            </div>
          </div>

          {/* Registration Deadline */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <FieldTimeOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium">
                Hạn đăng ký
              </div>
              <div className="text-sm font-bold text-gray-800">
                {dayjs(dataCard.registerEndDate).format("DD/MM/YYYY")}
              </div>
            </div>
          </div>

          {/* Trạng thái đấu giá */}
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircleOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <div className="text-xs text-gray-500 font-medium">
                Trạng thái
              </div>
              <div className="text-sm font-bold text-emerald-600">
                Đấu giá thành công
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {onViewResults && (
            <button
              onClick={() => onViewResults(dataCard.auctionId)}
              className="w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:-translate-y-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl glow-button"
            >
              🏆 Xem kết quả đấu giá
            </button>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-400/20 to-pink-400/20 rounded-full translate-y-8 -translate-x-8 group-hover:scale-150 transition-transform duration-700"></div>
    </div>
  );
};

export default AuctionCard;
