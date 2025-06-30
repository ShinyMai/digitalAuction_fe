import { Carousel, Card, Typography, Space } from "antd";
import { DollarOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { assets } from "../../../assets";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import type { AuctionDataList } from "../Modals";
import dayjs from "dayjs";
import { STAFF_ROUTES } from "../../../routers";

interface PropertyInfor {
  id: number;
  name: string;
  imageUrl: string;
  auctionDay: Date;
  startingPrice: number;
}

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

const categories = [
  { id: 1, name: "Tài sản đảm bảo", image: assets.ts1 },
  { id: 2, name: "Quyền sử dụng đất", image: assets.ts2 },
  { id: 3, name: "Tài sản vi phạm hành chính", image: assets.ts3 },
  { id: 4, name: "Tài sản nhà nước", image: assets.ts4 },
  { id: 5, name: "Tài sản khác", image: assets.ts5 },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { Title, Paragraph } = Typography;
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 3,
  });
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);

  const getListAuction = async () => {
    try {
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 3,
        AuctionStartDate: dayjs().add(3, 'day').format("YYYY-MM-DD")
      };

      const response = await AuctionServices.getListAuction(params);
      setAuctionList(response.data.auctions || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đấu giá!");
      console.error(error);
      setAuctionList([]); // Đảm bảo danh sách rỗng khi có lỗi
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Banner Section */}
      <div className="bg-sky-100 py-8 px-4 md:px-12 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 text-center mb-8 md:mb-0">
          <div className="flex flex-col items-center">
            <img
              src={assets.logoNo}
              alt="VDA Logo"
              className="w-32 md:w-40 rounded-2xl mb-2"
            />
            <Title level={4} className="text-[#0A3A58] !mb-0">
              CÔNG TY HỢP DANH ĐẤU GIÁ TÀI SẢN SỐ
            </Title>
          </div>
          <Title level={2} className="mt-4 mb-2 !text-2xl md:!text-3xl">
            Nền tảng đấu giá trực tuyến của Việt Nam
          </Title>
          <Paragraph className="text-sm md:text-base mb-6 max-w-2xl mx-auto">
            CÔNG TY HỢP DANH ĐẤU GIÁ TÀI SẢN SỐ VDA (Vietnam Digital Auction) - là một Tổ chức hoạt động
            chuyên nghiệp trong lĩnh vực dịch vụ tư vấn, tổ chức đấu giá tài sản, quyền tài sản, vật tư,
            thiết bị, hàng hóa và các dịch vụ khác liên quan đến đấu giá tài sản.
          </Paragraph>
        </div>
        <div className="w-full md:w-1/2">
          <Carousel autoplay autoplaySpeed={3000} effect="fade" className="rounded-lg shadow-xl border border-gray-200">
            <div>
              <img
                src={assets.banner}
                alt="Banner 1"
                className="w-full h-48 md:h-[350px] object-cover rounded-lg"
              />
            </div>
            <div>
              <img
                src={assets.banner2}
                alt="Banner 2"
                className="w-full h-48 md:h-[350px] object-cover rounded-lg"
              />
            </div>
          </Carousel>
        </div>
      </div>

      {/* Categories Section */}
      <div className="px-4 md:px-12 py-8">
        <Title level={2} className="text-center mb-6 !text-3xl md:!text-4xl">
          Danh mục tài sản
        </Title>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              hoverable
              className="w-[300px] h-[200px] flex flex-col items-center justify-center"
              onClick={() => navigate("/auction-list", { state: { key: category.id } })}
            >
              <img src={category.image} alt={category.name} className="w-16 h-16 mb-2" />
              <Paragraph className="text-center font-semibold">{category.name}</Paragraph>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Auctions Section */}
      {
        auctionList.length > 0 &&
        <div className="bg-sky-100 px-4 md:px-12 py-8">
          <Title level={2} className="text-center mb-6 !text-3xl md:!text-4xl">
            Tài sản sắp được đấu giá
          </Title>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {auctionList.map((property) => (
              <Card
                key={property.auctionId}
                hoverable
                cover={
                  <img
                    alt={property.auctionName}
                    src={'https://tse1.mm.bing.net/th/id/OIP.-IAlyndSbk_ZpEILNowpGQHaGK?cb=iwc2&rs=1&pid=ImgDetMain'}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                }
                className="shadow-lg"
                onClick={() => navigate(STAFF_ROUTES.SUB.AUCTION_DETAIL, { state: { key: property.auctionId }, replace: true })}
              >
                <Card.Meta
                  title={<div className="text-center text-lg font-semibold">{property.auctionName}</div>}
                  description={
                    <Space direction="vertical" className="w-full">
                      <div className="flex items-center text-gray-800">
                        <FieldTimeOutlined className="mr-2" />
                        Ngày kết thúc đăng kí:{" "}
                        <span className="font-bold text-lg ml-2">
                          {property.registerEndDate}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-800">
                        <FieldTimeOutlined className="mr-2" />
                        Ngày đấu giá:{" "}
                        <span className="font-bold text-lg ml-2">
                          {property.auctionStartDate}
                        </span>
                      </div>
                    </Space>
                  }
                />
              </Card>
            ))}
          </div>
        </div>
      }

    </div>
  );
};

export default HomePage;