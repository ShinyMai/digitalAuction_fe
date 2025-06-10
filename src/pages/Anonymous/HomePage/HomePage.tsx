import { useEffect, useState } from "react";
import { assets } from "../../../assets";
import Footer from "../../../components/Footer/Footer";
import Header from "../../../components/Header/Header";
import {
  DollarOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";

interface ImageItem {
  id: number;
  url: string;
}

const images: ImageItem[] = [
  { id: 0, url: assets.banner },
  { id: 1, url: assets.banner2 },
];

interface PropertyInfor {
  id: number;
  name: string;
  imageUrl: string;
  auctionDay: Date;
  startingPrice: number;
}

const properties: PropertyInfor[] = [
  {
    id: 1,
    name: "Tài sản đảm bảo",
    imageUrl:
      "https://tse1.mm.bing.net/th/id/OIP.-IAlyndSbk_ZpEILNowpGQHaGK?cb=iwc2&rs=1&pid=ImgDetMain",
    auctionDay: new Date("2023-10-01"),
    startingPrice: 1000000,
  },
  {
    id: 2,
    name: "Quyền sử dụng đất",
    imageUrl:
      "https://thamdinhgiathanhdo.com/wp-content/uploads/2020/10/quyen-su-dung-dat-la-gi.jpg",
    auctionDay: new Date("2023-10-05"),
    startingPrice: 2000000,
  },
  {
    id: 3,
    name: "Tài sản vi phạm hành chính",
    imageUrl:
      "https://static.hieuluat.vn/uploaded/Images/Original/2024/01/19/to-chuc-thanh-ly-tai-san-vi-pham-hanh-chinh_1901103113.jpg",
    auctionDay: new Date("2023-10-10"),
    startingPrice: 1500000,
  },
];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] =
    useState<number>(0);

  const [isAnimating, setIsAnimating] =
    useState<boolean>(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);

      setTimeout(() => {
        setCurrentIndex(
          (prevIndex) => (prevIndex + 1) % images.length
        );
        setIsAnimating(false);
      }, 700);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentImageItem = images[currentIndex];
  const nextImageItem =
    images[(currentIndex + 1) % images.length];

  return (
    <div>
      {/* <Header /> */}
      <div className="mx-auto px-4 md:py-8 flex flex-col md:flex-row items-center justify-evenly bg-sky-100">
        <div className="w-full md:w-2xl text-center mb-6 md:mb-0">
          <div>
            <img
              src={assets.logoNo}
              alt="VDA Logo"
              className="w-32 md:w-40 rounded-2xl m-auto"
            />
            <div className="-mt-4 text-[#0A3A58] font-bold text-lg md:text-xl">
              CÔNG TY HỢP DANH ĐẤU GIÁ TÀI SẢN SỐ
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">
            Nền tảng đấu giá trực tuyến của Việt Nam
          </h1>
          <div className="text-sm md:text-base mb-6">
            CÔNG TY HỢP DANH ĐẤU GIÁ TÀI SẢN SỐ VDA (Vietnam
            Digital Auction) - là một Tổ chức hoạt động
            chuyên nghiệp trong lĩnh vực dịch vụ tư vấn, tổ
            chức đấu giá tài sản, quyền tài sản, vật tư,
            thiết bị, hàng hóa và các dịch vụ khác liên quan
            đến đấu giá tài sản.
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <div className="relative w-full h-48 md:h-[350px] overflow-hidden rounded-lg shadow-xl mx-auto my-5 border border-gray-200">
            <img
              key={currentImageItem.id}
              src={currentImageItem.url}
              alt="Banner hiện tại"
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-all duration-700 ease-in-out 
                ${isAnimating
                  ? "opacity-0 scale-90"
                  : "opacity-100 scale-100"
                }
              `}
            />

            <img
              key={nextImageItem.id}
              src={nextImageItem.url}
              alt="Banner kế tiếp"
              className={`
                absolute inset-0 w-full h-full object-cover
                transition-all duration-700 ease-in-out
                ${isAnimating
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
                }
              `}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 py-8">
        <div className="text-4xl font-bold text-center mb-6">
          Danh mục tài sản
        </div>
        <div className="flex justify-center flex-wrap gap-4">
          <div className="w-[300px] h-[200px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-2xl">
            <img
              src={assets.ts1}
              alt="Tài sản 1"
              className="w-16 h-16 mb-2"
            />
            Tài sản đảm bảo
          </div>
          <div className="w-[300px] h-[200px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-2xl">
            <img
              src={assets.ts2}
              alt="Tài sản 1"
              className="w-16 h-16 mb-2"
            />
            Quyền sử dụng đất
          </div>
          <div className="w-[300px] h-[200px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-2xl">
            <img
              src={assets.ts3}
              alt="Tài sản 1"
              className="w-16 h-16 mb-2"
            />
            Tài sản vi phạm hành chính
          </div>
          <div className="w-[300px] h-[200px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-2xl">
            <img
              src={assets.ts4}
              alt="Tài sản 1"
              className="w-16 h-16 mb-2"
            />
            Tài sản nhà nước
          </div>
          <div className="w-[300px] h-[200px] bg-white shadow-lg rounded-lg p-4 flex flex-col items-center justify-center hover:shadow-2xl">
            <img
              src={assets.ts5}
              alt="Tài sản 1"
              className="w-16 h-16 mb-2"
            />
            Tài sản khác
          </div>
        </div>
      </div>

      <div className="mx-auto px-4 md:px-18 py-8 bg-sky-100">
        <div className="text-2xl md:text-4xl font-bold text-center mb-6">
          Tài sản sắp được đấu giá
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white shadow-lg shadow-blue-400 rounded-lg p-4 mb-4 cursor-pointer hover:shadow-2xl transition-shadow duration-300 hover:scale-105"
            >
              <img
                src={property.imageUrl}
                alt={property.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <h2 className="text-lg md:text-xl font-semibold my-4 text-center">
                {property.name}
              </h2>
              <p className="text-gray-800 text-sm md:text-base">
                <FieldTimeOutlined className="mr-2" />
                Ngày đấu giá:
                <span className="ml-2 font-bold text-lg">
                  {property.auctionDay.toLocaleDateString()}
                </span>
              </p>
              <p className="text-gray-800 text-sm md:text-base">
                <DollarOutlined className="mr-2" />
                Giá khởi điểm:
                <span className="ml-2 font-bold text-green-500 text-lg">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(property.startingPrice)}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default HomePage;
