/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Empty,
  Spin,
  Input,
  Select,
  DatePicker,
  Pagination,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { FilterOutlined } from "@ant-design/icons";
import AuctionServices from "../../../services/AuctionServices";
import { StatsCards, AuctionCard, getStatusString } from "./components";
import type { RegisteredAuction } from "./components";

const { RangePicker } = DatePicker;

const RegistedAuction = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [registeredAuctions, setRegisteredAuctions] = useState<
    RegisteredAuction[]
  >([]);
  const [filteredAuctions, setFilteredAuctions] = useState<RegisteredAuction[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalAuctions, setTotalAuctions] = useState(0);

  const applyFilters = useCallback(() => {
    const auctions = Array.isArray(registeredAuctions)
      ? registeredAuctions
      : [];
    let filtered = auctions;

    if (statusFilter) {
      filtered = filtered.filter(
        (auction) => getStatusString(auction) === statusFilter
      );
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = filtered.slice(startIndex, endIndex);
      setFilteredAuctions(paginatedResults);
    } else {
      setFilteredAuctions(auctions);
    }
  }, [registeredAuctions, statusFilter, currentPage, pageSize]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getListAuctionRegisted = useCallback(
    async (searchValue?: string) => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const requestBody = {
          pageNumber: currentPage,
          pageSize: pageSize,
          userId: user.id,
          search: {
            auctionName: searchValue ?? searchTerm ?? null,
            auctionStartDate: dateRange?.[0]
              ? dayjs(dateRange[0]).format("YYYY-MM-DD") + "T00:00:00.000Z"
              : null,
            auctionEndDate: dateRange?.[1]
              ? dayjs(dateRange[1]).format("YYYY-MM-DD") + "T23:59:59.999Z"
              : null,
          },
        };
        const res = await AuctionServices.getListAuctionRegisted(requestBody);
        if (res?.code === 200) {
          const auctionData = res.data?.auctionResponse || [];
          setRegisteredAuctions(Array.isArray(auctionData) ? auctionData : []);
          setTotalAuctions(res.data?.totalAuctionRegisted || 0);
        }
      } catch (error) {
        console.error("Error fetching registered auctions:", error);
      } finally {
        setLoading(false);
      }
    },
    [user?.id, dateRange, currentPage, pageSize]
  );

  useEffect(() => {
    getListAuctionRegisted();
  }, [currentPage, pageSize, dateRange]);

  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      setCurrentPage(1);
      getListAuctionRegisted(value);
    },
    [getListAuctionRegisted]
  );

  // Effect for date range changes
  useEffect(() => {
    setCurrentPage(1);
    if (user?.id) {
      getListAuctionRegisted();
    }
  }, [dateRange, getListAuctionRegisted, user?.id]);

  // Effect for status filter changes (no API call needed since it's client-side filtering)
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);
  const handleViewDetails = (auctionId: string) => {
    navigate(`/registed-auction-detail/${auctionId}`);
  };

  const getStats = () => {
    const auctions = Array.isArray(registeredAuctions)
      ? registeredAuctions
      : [];

    const total = totalAuctions || auctions.length;
    const registration = auctions.filter(
      (a) => getStatusString(a) === "registration"
    ).length;
    const upcoming = auctions.filter(
      (a) => getStatusString(a) === "upcoming"
    ).length;
    const ongoing = auctions.filter(
      (a) => getStatusString(a) === "ongoing"
    ).length;
    const completed = auctions.filter(
      (a) => getStatusString(a) === "completed"
    ).length;
    const cancelled = auctions.filter(
      (a) => getStatusString(a) === "cancelled"
    ).length;

    return { total, registration, upcoming, ongoing, completed, cancelled };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-4">
            Đấu Giá Đã Đăng Ký
          </h1>
          <p className="text-gray-600 text-lg">
            Quản lý và theo dõi các phiên đấu giá bạn đã tham gia
          </p>
        </div>
        {/* Stats Cards */}
        <StatsCards stats={stats} />
        {/* Filters */}
        <Card className="!mb-8 !shadow-lg !border-0">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input.Search
                placeholder="Tìm kiếm theo tên đấu giá hoặc tài sản..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onSearch={handleSearch}
                size="large"
                allowClear
              />
            </div>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              size="large"
              className="!w-full md:!w-48"
              allowClear
              defaultValue=""
            >
              <Select.Option value="">Tất cả</Select.Option>
              <Select.Option value="registration">Đang đăng ký</Select.Option>
              <Select.Option value="upcoming">Sắp diễn ra</Select.Option>
              <Select.Option value="ongoing">Đang diễn ra</Select.Option>
              <Select.Option value="completed">Đã kết thúc</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
            <RangePicker
              placeholder={["Ngày bắt đầu ", "Ngày kết thúc"]}
              value={dateRange}
              onChange={setDateRange}
              size="large"
              className="!w-full md:!w-72"
            />
            <Button
              icon={<FilterOutlined />}
              size="large"
              className="!w-full md:!w-auto"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("");
                setDateRange(null);
                setCurrentPage(1);
                setTimeout(() => {
                  if (user?.id) {
                    getListAuctionRegisted();
                  }
                }, 0);
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </Card>
        {/* Auction Cards */}
        {filteredAuctions.length === 0 ? (
          <Card className="!text-center !p-12 !shadow-lg !border-0">
            <Empty
              description={
                <div>
                  <div className="text-lg text-gray-500 mb-2">
                    {(Array.isArray(registeredAuctions)
                      ? registeredAuctions.length
                      : 0) === 0
                      ? "Bạn chưa đăng ký tham gia đấu giá nào"
                      : "Không tìm thấy đấu giá nào phù hợp với bộ lọc"}
                  </div>
                  <div className="text-gray-400">
                    Hãy tham gia các phiên đấu giá để xem thông tin tại đây
                  </div>
                </div>
              }
            />
            <Button
              type="primary"
              size="large"
              className="!mt-4 !bg-gradient-to-r !from-blue-500 !to-purple-600 !border-0"
              onClick={() => navigate("/auction-list")}
            >
              Khám phá đấu giá
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAuctions.map((auction) => (
              <AuctionCard
                key={auction.auctionId}
                auction={auction}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        {(statusFilter ? filteredAuctions.length : totalAuctions) > 0 && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={statusFilter ? filteredAuctions.length : totalAuctions}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) =>
                `${range[0]}-${range[1]} của ${total} đấu giá`
              }
              onChange={(page, size) => {
                setCurrentPage(page);
                if (size !== pageSize) {
                  setPageSize(size);
                }
              }}
              onShowSizeChange={(_, size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              pageSizeOptions={["4", "8", "12", "16"]}
              className="!mt-6"
              disabled={loading}
            />
          </div>
        )}
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .ant-table-thead > tr > th {
          background: rgba(255, 255, 255, 0.8) !important;
          border-bottom: 1px solid #e5e7eb !important;
          font-weight: 600 !important;
          color: #374151 !important;
        }
        
        .ant-table-tbody > tr > td {
          background: rgba(255, 255, 255, 0.6) !important;
          border-bottom: 1px solid #f3f4f6 !important;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: rgba(255, 255, 255, 0.8) !important;
        }
        
        .ant-table {
          background: transparent !important;
        }
        
        .ant-table-container {
          border-radius: 8px !important;
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
};

export default RegistedAuction;
