/* eslint-disable @typescript-eslint/no-explicit-any */
import { Layout, Pagination, Spin, Input } from "antd";
import { FrownOutlined } from "@ant-design/icons";
import AuctionServices from "../../../services/AuctionServices";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import AuctionCard from "./components/AuctionCard";
import { useLocation } from "react-router-dom";
import type {
  //   AuctionCategory,
  AuctionDataList,
} from "../Modals";

const { Content } = Layout;

interface SearchParams {
  CategoryId?: number;
  PageNumber?: number;
  PageSize?: number;
  Status: number;
  AuctionName?: string;
}

const AuctionListAnonyMous = () => {
  //   const [listAuctionCategory, setListAuctionCategory] =
  //     useState<AuctionCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 9,
    CategoryId: location.state?.key,
    Status: 1,
  });
  const [totalData, setTotalData] = useState<number>(0);
  const [auctionList, setAuctionList] = useState<AuctionDataList[]>([]);

  useEffect(() => {
    getListAuction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const getListAuction = async () => {
    try {
      setLoading(true);
      const params: SearchParams = {
        PageNumber: searchParams.PageNumber || 1,
        PageSize: searchParams.PageSize || 9,
        CategoryId: location.state?.key, // Luôn bao gồm CategoryId từ location.state.key
        Status: searchParams.Status,
      };
      if (searchParams.AuctionName) {
        params.AuctionName = searchParams.AuctionName;
      }

      const response = await AuctionServices.getListAuction(params);
      setTotalData(response.data.totalCount || 0);
      setAuctionList(response.data.auctions || []);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách đấu giá!");
      console.error(error);
      setAuctionList([]); // Đảm bảo danh sách rỗng khi có lỗi
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      PageNumber: page,
      PageSize: pageSize,
    }));
  };

  return (
    <Layout className="bg-gradient-to-b from-blue-50 to-teal-50 min-h-screen">
      <Content className="p-4 md:p-8">
        <h2 className="text-center mb-6 text-3xl md:text-4xl text-blue-800">
          Danh sách phiên đấu giá
        </h2>
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-full lg:w-1/3 [&_.ant-input]:border-teal-200 [&_.ant-input]:bg-blue-50">
            <Input
              placeholder="Tìm kiếm theo tên phiên đấu giá..."
              value={searchParams.AuctionName || ""}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  AuctionName: e.target.value,
                }))
              }
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" className="text-teal-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mt-8">
              {auctionList.length > 0 ? (
                auctionList.map((item) => <AuctionCard key={item.auctionId} dataCard={item} />)
              ) : (
                <div className="col-span-full text-center text-teal-600 bg-blue-50 p-6 rounded-lg flex flex-col items-center justify-center">
                  <FrownOutlined
                    style={{
                      fontSize: "48px",
                      color: "#08979c",
                      marginBottom: "16px",
                    }}
                  />
                  <span className="text-lg">Không có dữ liệu phiên đấu giá</span>
                </div>
              )}
            </div>
            <Pagination
              className="text-center text-teal-700 [&_.ant-pagination-item]:opacity-80 [&_.ant-pagination-item]:bg-transparent [&_.ant-pagination-item]:border-none [&_.ant-pagination-item]:text-teal-600 [&_.ant-pagination-item]:hover:text-blue-500 [&_.ant-pagination-item]:hover:opacity-100 [&_.ant-pagination-item-active]:text-blue-500 [&_.ant-pagination-item-active]:font-semibold [&_.ant-pagination-item-active]:opacity-100 [&_.ant-pagination-prev]:bg-transparent [&_.ant-pagination-prev]:border-none [&_.ant-pagination-prev]:text-teal-600 [&_.ant-pagination-prev]:hover:text-blue-500 [&_.ant-pagination-next]:bg-transparent [&_.ant-pagination-next]:border-none [&_.ant-pagination-next]:text-teal-600 [&_.ant-pagination-next]:hover:text-blue-500 [&_.ant-pagination-prev.ant-pagination-disabled]:text-teal-300 [&_.ant-pagination-prev.ant-pagination-disabled]:opacity-80 [&_.ant-pagination-next.ant-pagination-disabled]:text-teal-300 [&_.ant-pagination-next.ant-pagination-disabled]:opacity-80 [&_.ant-pagination-jump-prev]:text-teal-600 [&_.ant-pagination-jump-prev]:hover:text-blue-500 [&_.ant-pagination-jump-next]:text-teal-600 [&_.ant-pagination-jump-next]:hover:text-blue-500"
              current={searchParams.PageNumber}
              pageSize={searchParams.PageSize}
              total={totalData}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </>
        )}
      </Content>
    </Layout>
  );
};

export default AuctionListAnonyMous;
