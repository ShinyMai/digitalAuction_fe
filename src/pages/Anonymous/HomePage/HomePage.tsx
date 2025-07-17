import { FieldTimeOutlined } from "@ant-design/icons";
import { assets } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import type { AuctionDataList } from "../Modals";
import dayjs from "dayjs";
import { GUEST_ROUTERS } from "../../../routers";
import { convertToVietnamTime } from "../../../utils/timeConfig";
interface SearchParams {
  AuctionName?: string;
  CategoryId?: number;
  RegisterOpenDate?: string;
  RegisterEndDate?: string;
  AuctionStartDate?: string;
  AuctionEndDate?: string;
  SortBy?: string;
  IsAscending?: boolean;
  PageNumber?: number;
  PageSize?: number;
}

const categories = [
  { id: 1, name: "Tài sản đảm bảo", image: assets.ts1 },
  { id: 2, name: "Quyền sử dụng đất", image: assets.ts2 },
  {
    id: 3,
    name: "Tài sản vi phạm hành chính",
    image: assets.ts3,
  },
  { id: 4, name: "Tài sản nhà nước", image: assets.ts4 },
  { id: 5, name: "Tài sản khác", image: assets.ts5 },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 3,
  });
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);

  const getListAuction = async () => {
    try {
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 3,
        AuctionStartDate: dayjs().add(3, "day").format("YYYY-MM-DD"),
      };

      const response = await AuctionServices.getListAuction(params);
      setAuctionList(response.data.auctions || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đấu giá!");
      console.error(error);
      setAuctionList([]);
    }
  };

  useEffect(() => {
    getListAuction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Banner Section */}
      <section className="flex items-center min-h-screen px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 max-w-2xl text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Hệ thống đăng ký tham gia{" "}
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-extrabold">
                đấu giá trực tuyến
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl mb-6 sm:mb-8 opacity-90 leading-relaxed">
              Nền tảng đăng ký đấu giá hàng đầu Việt Nam - Kết nối bạn với các phiên đấu giá chính
              thức
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/register")}
                className="px-6 sm:px-8 py-3 sm:py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-sm sm:text-base"
              >
                Đăng ký ngay
              </button>
              <button
                onClick={() => navigate("/auction-list")}
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold rounded-full transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
              >
                Xem danh sách đấu giá
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:pl-8 order-1 lg:order-2 mt-8 lg:mt-0">
            <div className="relative">
              <div className="text-8xl md:text-9xl lg:text-[12rem] mb-4 animate-bounce">🏛️</div>{" "}
              <div className="absolute -top-2 sm:-top-4 -right-4 sm:-right-6 text-xl sm:text-2xl md:text-3xl animate-pulse delay-300">
                ⚖️
              </div>
              <div className="absolute -bottom-1 sm:-bottom-2 -left-3 sm:-left-4 text-xl sm:text-2xl md:text-3xl animate-pulse delay-500">
                📝
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Categories Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-800">
            Danh mục tài sản đấu giá
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center cursor-pointer"
                onClick={() =>
                  navigate("/auction-list", {
                    state: { key: category.id },
                  })
                }
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
                />
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 leading-tight">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Upcoming Auctions Section */}
      {auctionList.length > 0 && (
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-800">
              Tài sản sắp mở đăng ký đấu giá
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
              {auctionList.map((property) => (
                <div
                  key={property.auctionId}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden"
                  onClick={() =>
                    navigate(GUEST_ROUTERS.AUCITON_LIST + "/" + GUEST_ROUTERS.AUCTION_DETAIL, {
                      state: { key: property.auctionId },
                      replace: true,
                    })
                  }
                >
                  <img
                    alt={property.auctionName}
                    src="https://tse1.mm.bing.net/th/id/OIP.-IAlyndSbk_ZpEILNowpGQHaGK?cb=iwc2&rs=1&pid=ImgDetMain"
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 text-center line-clamp-2">
                      {property.auctionName}
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 gap-1 sm:gap-2">
                        <span className="flex items-center text-sm sm:text-base">
                          <FieldTimeOutlined className="mr-1 sm:mr-2 text-blue-500" />
                          Hạn đăng ký:
                        </span>
                        <span className="font-bold text-red-600 text-sm sm:text-base">
                          {convertToVietnamTime(property.registerEndDate)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 gap-1 sm:gap-2">
                        <span className="flex items-center text-sm sm:text-base">
                          <FieldTimeOutlined className="mr-1 sm:mr-2 text-green-500" />
                          Ngày đấu giá:
                        </span>
                        <span className="font-bold text-green-600 text-sm sm:text-base">
                          {convertToVietnamTime(property.auctionStartDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
