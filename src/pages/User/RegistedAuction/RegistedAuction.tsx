/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { Card, Tag, Button, Empty, Spin, Input, Select, DatePicker, Table, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

// Enable the isBetween plugin
dayjs.extend(isBetween);
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FireOutlined,
  EyeOutlined,
  SearchOutlined,
  FilterOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { formatNumber } from "../../../utils/numberFormat";
import AuctionServices from "../../../services/AuctionServices";

const { RangePicker } = DatePicker;

interface RegisteredAuction {
  auctionId: string;
  auctionName: string;
  categoryName: string;
  auctionDescription: string;
  auctionRules: string;
  auctionPlanningMap: string;
  registerOpenDate: string;
  registerEndDate: string;
  auctionStartDate: string;
  auctionEndDate: string;
  numberRoundMax: number;
  status: number;
  auctionAssets: {
    auctionAssetsId: string;
    tagName: string;
    startingPrice: number;
    unit: string;
    deposit: number;
    registrationFee: number;
    description: string;
    auctionId: string;
  }[];
}

const RegistedAuction = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const [registeredAuctions, setRegisteredAuctions] = useState<RegisteredAuction[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<RegisteredAuction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<any>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalAuctions, setTotalAuctions] = useState(0);

  // Status determination based on auction dates
  const getStatusString = (auction: RegisteredAuction): string => {
    const now = dayjs();
    const auctionStart = dayjs(auction.auctionStartDate);
    const auctionEnd = dayjs(auction.auctionEndDate);
    const registerEnd = dayjs(auction.registerEndDate);

    if (now.isBefore(registerEnd)) {
      return "registration";
    } else if (now.isBefore(auctionStart)) {
      return "upcoming"; // Registration closed, auction not started yet
    } else if (now.isBetween(auctionStart, auctionEnd, "day", "[]")) {
      return "ongoing"; // Auction is currently happening
    } else {
      return "completed"; // Auction has ended
    }
  };

  const getStatusInfo = (auction: RegisteredAuction) => {
    const statusString = getStatusString(auction);
    switch (statusString) {
      case "upcoming":
        return {
          color: "blue",
          icon: <ClockCircleOutlined />,
          text: "Sắp diễn ra",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        };
      case "ongoing":
        return {
          color: "orange",
          icon: <FireOutlined />,
          text: "Đang diễn ra",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        };
      case "completed":
        return {
          color: "green",
          icon: <CheckCircleOutlined />,
          text: "Đã kết thúc",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "cancelled":
        return {
          color: "red",
          icon: <CloseCircleOutlined />,
          text: "Đã hủy",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          color: "default",
          icon: <ExclamationCircleOutlined />,
          text: "Không xác định",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = registeredAuctions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.auctionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.auctionAssets.some((asset) =>
            asset.tagName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((auction) => getStatusString(auction) === statusFilter);
    }

    // Apply date range filter
    if (dateRange && dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      filtered = filtered.filter((auction) => {
        const auctionDate = dayjs(auction.auctionStartDate);
        return auctionDate.isBetween(dayjs(startDate), dayjs(endDate), "day", "[]");
      });
    }

    // Update total count for pagination
    setTotalAuctions(filtered.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = filtered.slice(startIndex, endIndex);

    setFilteredAuctions(paginatedResults);
  }, [registeredAuctions, searchTerm, statusFilter, dateRange, currentPage, pageSize]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const getListAuctionRegisted = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await AuctionServices.getListAuctionRegisted();
      if (res?.code === 200) {
        setRegisteredAuctions(res.data || []);
      } else {
        toast.error("Không thể tải danh sách đấu giá đã đăng ký!");
      }
    } catch (error) {
      console.error("Error fetching registered auctions:", error);
      toast.error("Lỗi khi tải danh sách đấu giá đã đăng ký!");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    getListAuctionRegisted();
  }, [getListAuctionRegisted]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateRange]);

  const handleViewDetails = (auctionId: string) => {
    navigate(`/auction-detail/${auctionId}`);
  };

  const getStats = () => {
    const total = registeredAuctions.length;
    const registration = registeredAuctions.filter(
      (a) => getStatusString(a) === "registration"
    ).length;
    const upcoming = registeredAuctions.filter((a) => getStatusString(a) === "upcoming").length;
    const ongoing = registeredAuctions.filter((a) => getStatusString(a) === "ongoing").length;
    const completed = registeredAuctions.filter((a) => getStatusString(a) === "completed").length;
    const cancelled = registeredAuctions.filter((a) => getStatusString(a) === "cancelled").length;

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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="!text-center !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-0 !shadow-lg">
            <div className="text-white">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm opacity-90">Tổng đăng ký</div>
            </div>
          </Card>
          <Card className="!text-center !bg-gradient-to-r !from-cyan-500 !to-cyan-600 !border-0 !shadow-lg">
            <div className="text-white">
              <div className="text-2xl font-bold">{stats.registration}</div>
              <div className="text-sm opacity-90">Đang đăng ký</div>
            </div>
          </Card>
          <Card className="!text-center !bg-gradient-to-r !from-orange-500 !to-orange-600 !border-0 !shadow-lg">
            <div className="text-white">
              <div className="text-2xl font-bold">{stats.upcoming}</div>
              <div className="text-sm opacity-90">Sắp diễn ra</div>
            </div>
          </Card>
          <Card className="!text-center !bg-gradient-to-r !from-green-500 !to-green-600 !border-0 !shadow-lg">
            <div className="text-white">
              <div className="text-2xl font-bold">{stats.ongoing}</div>
              <div className="text-sm opacity-90">Đang diễn ra</div>
            </div>
          </Card>
          <Card className="!text-center !bg-gradient-to-r !from-purple-500 !to-purple-600 !border-0 !shadow-lg">
            <div className="text-white">
              <div className="text-2xl font-bold">{stats.completed}</div>
              <div className="text-sm opacity-90">Đã kết thúc</div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="!mb-8 !shadow-lg !border-0">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Tìm kiếm theo tên đấu giá hoặc tài sản..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="large"
                className="!rounded-lg"
              />
            </div>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              size="large"
              className="!w-full md:!w-48"
              allowClear
            >
              <Select.Option value="registration">Đang đăng ký</Select.Option>
              <Select.Option value="upcoming">Sắp diễn ra</Select.Option>
              <Select.Option value="ongoing">Đang diễn ra</Select.Option>
              <Select.Option value="completed">Đã kết thúc</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
            <RangePicker
              placeholder={["Từ ngày", "Đến ngày"]}
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
                  <p className="text-lg text-gray-500 mb-2">
                    {registeredAuctions.length === 0
                      ? "Bạn chưa đăng ký tham gia đấu giá nào"
                      : "Không tìm thấy đấu giá nào phù hợp với bộ lọc"}
                  </p>
                  <p className="text-gray-400">
                    Hãy tham gia các phiên đấu giá để xem thông tin tại đây
                  </p>
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
            {filteredAuctions.map((auction) => {
              const statusInfo = getStatusInfo(auction);
              const registrationInfo = { color: "green", text: "Đã đăng ký" };

              return (
                <Card
                  key={auction.auctionId}
                  className={`!shadow-lg !border-0 hover:!shadow-xl !transition-all !duration-300 !transform hover:!-translate-y-1 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                          {auction.auctionName}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag color={statusInfo.color} className="!flex !items-center !gap-1">
                            {statusInfo.icon}
                            {statusInfo.text}
                          </Tag>
                          <Tag color={registrationInfo.color}>{registrationInfo.text}</Tag>
                          <Tag color="default">{auction.categoryName}</Tag>
                        </div>
                      </div>
                    </div>

                    {/* Assets */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <TrophyOutlined className="text-yellow-500" />
                        Tài sản đăng ký ({auction.auctionAssets.length})
                      </h4>
                      <div className="overflow-x-auto">
                        <Table
                          dataSource={auction.auctionAssets}
                          pagination={false}
                          size="small"
                          rowKey="auctionAssetsId"
                          className="!bg-transparent"
                          columns={[
                            {
                              title: "Tên tài sản",
                              dataIndex: "tagName",
                              key: "tagName",
                              render: (text: string) => (
                                <div className="font-medium text-gray-800">{text}</div>
                              ),
                            },
                            {
                              title: "Giá khởi điểm",
                              dataIndex: "startingPrice",
                              key: "startingPrice",
                              align: "right" as const,
                              render: (value: number) => (
                                <div className="font-bold text-blue-600">
                                  {formatNumber(value)} VND
                                </div>
                              ),
                            },
                            {
                              title: "Tiền cọc",
                              dataIndex: "deposit",
                              key: "deposit",
                              align: "right" as const,
                              render: (value: number) => (
                                <div className="font-semibold text-green-600">
                                  {formatNumber(value)} VND
                                </div>
                              ),
                            },
                            {
                              title: "Phí đăng ký",
                              dataIndex: "registrationFee",
                              key: "registrationFee",
                              align: "right" as const,
                              render: (value: number) => (
                                <div className="font-semibold text-orange-600">
                                  {formatNumber(value)} VND
                                </div>
                              ),
                            },
                          ]}
                        />
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="grid grid-cols-2 gap-4 text-sm p-3">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <CalendarOutlined className="text-blue-500" />
                          <span>Hạn đăng ký:</span>
                        </div>
                        <div className="font-semibold text-gray-800">
                          {dayjs(auction.registerEndDate).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FireOutlined className="text-orange-500" />
                          <span>Ngày đấu giá:</span>
                        </div>
                        <div className="font-semibold text-gray-800">
                          {dayjs(auction.auctionStartDate).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    </div>

                    {/* Financial Info */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <DollarOutlined className="text-green-500" />
                            <span>Tổng tiền cọc:</span>
                          </div>
                          <div className="font-bold text-green-600">
                            {formatNumber(
                              auction.auctionAssets.reduce((sum, asset) => sum + asset.deposit, 0)
                            )}
                            VND
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <DollarOutlined className="text-blue-500" />
                            <span>Tổng phí đăng ký:</span>
                          </div>
                          <div className="font-bold text-blue-600">
                            {formatNumber(
                              auction.auctionAssets.reduce(
                                (sum, asset) => sum + asset.registrationFee,
                                0
                              )
                            )}
                            VND
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Registration Date */}
                    <div className="text-xs text-gray-500 border-t pt-2">
                      Hạn đăng ký: {dayjs(auction.registerEndDate).format("DD/MM/YYYY HH:mm")}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(auction.auctionId)}
                        className="!flex-1 !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-0"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalAuctions > pageSize && (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              total={totalAuctions}
              pageSize={pageSize}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} đấu giá`}
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
              pageSizeOptions={["6", "12", "24", "48"]}
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
