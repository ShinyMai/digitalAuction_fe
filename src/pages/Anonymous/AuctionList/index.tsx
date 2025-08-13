import { Layout, Pagination } from "antd";
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
  ConditionAuction: number;
  AuctionName?: string;
  SortBy: "register_open_date";
  IsAscending: false;
}

const AuctionListAnonyMous = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 8,
    CategoryId: location.state?.key,
    Status: 1,
    SortBy: "register_open_date",
    IsAscending: false,
    ConditionAuction: 1,
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
        PageSize: searchParams.PageSize || 8,
        CategoryId: location.state?.key,
        Status: searchParams.Status,
        SortBy: searchParams.SortBy,
        IsAscending: searchParams.IsAscending,
        ConditionAuction: searchParams.ConditionAuction,
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
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Content className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-float"></div>
          <div
            className="absolute top-40 right-20 w-24 h-24 bg-purple-200/30 rounded-full blur-xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-40 left-1/3 w-28 h-28 bg-indigo-200/30 rounded-full blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 p-6 md:p-8 lg:p-12">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-slide-in-up">
            <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <div className="bg-white px-6 py-2 rounded-xl">
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                  🏛️ PHIÊN ĐẤU GIÁ CHÍNH THỨC
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text mb-4">
              Danh Sách Đấu Giá
            </h1>
          </div>

          {/* Enhanced Search Section */}
          <div
            className="max-w-4xl mx-auto mb-12 animate-slide-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/50">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <div className="w-5 h-5 text-gray-400">🔍</div>
                  </div>
                  <input
                    className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 text-gray-700 placeholder-gray-400"
                    placeholder="Tìm kiếm phiên đấu giá theo tên, danh mục..."
                    value={searchParams.AuctionName || ""}
                    onChange={(e) =>
                      setSearchParams((prev) => ({
                        ...prev,
                        AuctionName: e.target.value,
                      }))
                    }
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 glow-button">
                  <span className="flex items-center gap-2">
                    <span>Tìm kiếm</span>
                    <span className="text-lg">→</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div
                  className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
                  style={{
                    animationDirection: "reverse",
                    animationDuration: "1.5s",
                  }}
                ></div>
              </div>
              <p className="mt-6 text-lg text-gray-600 animate-pulse">
                Đang tải danh sách đấu giá...
              </p>
            </div>
          ) : (
            <>
              {/* Results Summary */}
              <div
                className="text-center mb-8 animate-slide-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
                  <span className="text-2xl">📊</span>
                  <span className="font-medium text-gray-700">
                    Tìm thấy{" "}
                    <span className="font-bold text-blue-600">{totalData}</span>{" "}
                    phiên đấu giá
                  </span>
                </div>
              </div>

              {/* Enhanced Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {auctionList.length > 0 ? (
                  auctionList.map((item, index) => (
                    <div
                      key={item.auctionId}
                      className="animate-slide-in-up hover-lift"
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <AuctionCard dataCard={item} />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full">
                    <div className="text-center py-16 animate-slide-in-up">
                      <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-6xl opacity-50">😔</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-700 mb-4">
                        Không tìm thấy phiên đấu giá nào
                      </h3>
                      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                        Hiện tại chưa có phiên đấu giá nào phù hợp với tiêu chí
                        tìm kiếm của bạn
                      </p>
                      <button
                        onClick={() =>
                          setSearchParams((prev) => ({
                            ...prev,
                            AuctionName: "",
                          }))
                        }
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105"
                      >
                        Xem tất cả đấu giá
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Enhanced Pagination */}
              {totalData > 0 && (
                <div
                  className="flex justify-center animate-slide-in-up"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
                    <Pagination
                      current={searchParams.PageNumber}
                      pageSize={searchParams.PageSize}
                      total={totalData}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      showTotal={(total, range) => (
                        <span className="text-gray-600 font-medium">
                          Hiển thị {range[0]}-{range[1]} / {total} phiên đấu giá
                        </span>
                      )}
                      className="[&_.ant-pagination-item]:bg-gradient-to-r [&_.ant-pagination-item]:from-blue-50 [&_.ant-pagination-item]:to-purple-50 [&_.ant-pagination-item]:border-blue-200 [&_.ant-pagination-item]:hover:border-blue-400 [&_.ant-pagination-item-active]:from-blue-500 [&_.ant-pagination-item-active]:to-purple-600 [&_.ant-pagination-item-active]:text-white [&_.ant-pagination-item-active]:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default AuctionListAnonyMous;
