import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Input,
  Select,
  DatePicker,
  Pagination,
  Badge,
  Space,
  Typography,
  Divider,
  Spin,
  Image,
  Table,
  Modal,
  Descriptions,
  Statistic,
  Progress,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  TrophyOutlined,
  DollarOutlined,
  UserOutlined,
  EyeOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  CarOutlined,
  StarOutlined,
  BankOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface LotResult {
  lotNumber: number;
  lotName: string;
  startingPrice: number;
  winningPrice: number;
  winnerName: string;
  winnerBidCount: number;
  totalBidsForLot: number;
  status: "completed" | "paid" | "delivered";
  lotDetails?: {
    area?: number;
    address?: string;
    specifications?: string[];
  };
}

interface AuctionResult {
  id: string;
  title: string;
  description: string;
  category: string;
  images: string[];
  startDate: string;
  endDate: string;
  location: string;
  auctioneer: string;
  totalLots: number;
  totalBids: number;
  assetDetails: {
    condition: string;
    year?: number;
    brand?: string;
    model?: string;
    specifications?: string[];
  };
  lots: LotResult[];
}

// Mock data for demonstration
const mockAuctionResults: AuctionResult[] = [
  {
    id: "1",
    title: "Đấu giá 30 lô đất khu dân cư Phú Mỹ Hưng",
    description: "30 lô đất nền thuộc khu dân cư cao cấp Phú Mỹ Hưng, diện tích từ 100-200m²",
    category: "real-estate",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    ],
    startDate: "2024-12-01T09:00:00Z",
    endDate: "2024-12-01T15:30:00Z",
    location: "TP. Hồ Chí Minh",
    totalLots: 30,
    totalBids: 1247,
    auctioneer: "Trần Thị B",
    assetDetails: {
      condition: "Đất nền sạch",
      specifications: ["Đã có sổ đỏ", "Pháp lý đầy đủ", "Hạ tầng hoàn thiện"],
    },
    lots: [
      {
        lotNumber: 1,
        lotName: "Lô A01 - Mặt tiền đường chính",
        startingPrice: 2500000000,
        winningPrice: 3200000000,
        winnerName: "Nguyễn Văn A",
        winnerBidCount: 23,
        totalBidsForLot: 89,
        status: "completed",
        lotDetails: {
          area: 150,
          address: "Đường Nguyễn Văn Linh, Q7",
          specifications: ["Mặt tiền 6m", "Hướng Đông Nam"],
        },
      },
      {
        lotNumber: 2,
        lotName: "Lô A02 - Góc đường",
        startingPrice: 2200000000,
        winningPrice: 2850000000,
        winnerName: "Lê Thị C",
        winnerBidCount: 18,
        totalBidsForLot: 67,
        status: "paid",
        lotDetails: {
          area: 120,
          address: "Đường Nguyễn Văn Linh, Q7",
          specifications: ["Mặt tiền 5m", "Hướng Nam"],
        },
      },
      {
        lotNumber: 3,
        lotName: "Lô A03 - Vị trí trung tâm",
        startingPrice: 2000000000,
        winningPrice: 2650000000,
        winnerName: "Phạm Minh D",
        winnerBidCount: 15,
        totalBidsForLot: 54,
        status: "delivered",
        lotDetails: {
          area: 100,
          address: "Đường Nguyễn Văn Linh, Q7",
          specifications: ["Mặt tiền 4m", "Hướng Tây"],
        },
      }, // Adding more lots for demonstration with realistic pricing progression
      ...Array.from({ length: 27 }, (_, index) => {
        const lotNum = index + 4;
        const basePrice = 1800000000 + Math.random() * 400000000;
        const multiplier = 1.2 + Math.random() * 0.5; // 20% to 70% increase
        const winPrice = Math.floor(basePrice * multiplier);
        const statuses: ("completed" | "paid" | "delivered")[] = ["completed", "paid", "delivered"];

        return {
          lotNumber: lotNum,
          lotName: `Lô A${String(lotNum).padStart(2, "0")} - ${
            lotNum <= 10 ? "Vị trí đẹp" : lotNum <= 20 ? "Lô thường" : "Lô cuối"
          }`,
          startingPrice: Math.floor(basePrice),
          winningPrice: winPrice,
          winnerName: `Khách hàng ${String.fromCharCode(65 + (lotNum % 26))}${lotNum}`,
          winnerBidCount: Math.floor(Math.random() * 25) + 5,
          totalBidsForLot: Math.floor(Math.random() * 90) + 30,
          status: statuses[Math.floor(Math.random() * 3)],
          lotDetails: {
            area: Math.floor(Math.random() * 120) + 80, // 80-200m²
            address: `Đường Nguyễn Văn Linh, Q7 - Số ${lotNum * 2}`,
            specifications: [
              `Mặt tiền ${Math.floor(Math.random() * 4) + 4}m`,
              ["Hướng Đông", "Hướng Tây", "Hướng Nam", "Hướng Bắc"][Math.floor(Math.random() * 4)],
              lotNum <= 15 ? "Gần trường học" : "Khu yên tĩnh",
            ],
          },
        };
      }),
    ],
  },
  {
    id: "2",
    title: "Mercedes-Benz C300 AMG",
    description: "Xe sedan hạng sang, bảo dưỡng định kỳ, màu đen",
    category: "vehicle",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500",
      "https://images.unsplash.com/photo-1606016915229-d71b83b44ba5?w=500",
    ],
    startDate: "2024-11-28T10:00:00Z",
    endDate: "2024-11-28T16:00:00Z",
    location: "Hà Nội",
    totalLots: 1,
    totalBids: 89,
    auctioneer: "Phạm Văn D",
    assetDetails: {
      condition: "Đã qua sử dụng",
      year: 2020,
      brand: "Mercedes-Benz",
      model: "C300 AMG",
      specifications: ["Động cơ 2.0L", "Hộp số tự động", "Màu đen", "Nội thất da"],
    },
    lots: [
      {
        lotNumber: 1,
        lotName: "Mercedes-Benz C300 AMG 2020",
        startingPrice: 1200000000,
        winningPrice: 1850000000,
        winnerName: "Lê Minh C",
        winnerBidCount: 23,
        totalBidsForLot: 89,
        status: "paid",
      },
    ],
  },
  {
    id: "3",
    title: "Bộ trang sức kim cương",
    description: "Bộ trang sức kim cương thiên nhiên, chế tác thủ công",
    category: "jewelry",
    images: ["https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500"],
    startDate: "2024-11-25T14:00:00Z",
    endDate: "2024-11-25T18:00:00Z",
    location: "Đà Nẵng",
    totalLots: 1,
    totalBids: 156,
    auctioneer: "Vũ Văn F",
    assetDetails: {
      condition: "Mới",
      specifications: ["Kim cương thiên nhiên 2 carat", "Vàng 18K", "Chứng nhận GIA"],
    },
    lots: [
      {
        lotNumber: 1,
        lotName: "Bộ trang sức kim cương cao cấp",
        startingPrice: 500000000,
        winningPrice: 780000000,
        winnerName: "Hoàng Thị E",
        winnerBidCount: 31,
        totalBidsForLot: 156,
        status: "delivered",
      },
    ],
  },
];

const ResultAuction = () => {
  const [loading] = useState(false);
  const [auctionResults] = useState<AuctionResult[]>(mockAuctionResults);
  const [filteredResults, setFilteredResults] = useState<AuctionResult[]>(mockAuctionResults);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [sortBy, setSortBy] = useState<string>("endDate");
  const [selectedAuction, setSelectedAuction] = useState<AuctionResult | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  // Add custom styles for enhanced search experience
  useEffect(() => {
    const customSearchStyles = `
      .search-section-gradient {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 69, 219, 0.1) 100%);
        backdrop-filter: blur(10px);
      }
      
      .filter-tag-hover:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.2s ease;
      }
      
      .quick-filter-btn {
        transition: all 0.2s ease;
        border: 1px solid transparent;
      }
      
      .quick-filter-btn:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-color: #e5e7eb;
      }
      
      .search-input-focus .ant-input:focus {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        border-color: #3b82f6;
      }
    `;

    const style = document.createElement("style");
    style.textContent = customSearchStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Add keyboard shortcuts for better UX
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Nhập tên đấu giá"]'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      if (e.key === "Escape") {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedStatus("");
        setDateRange(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categoryOptions = [
    { value: "real-estate", label: "Bất động sản", icon: <HomeOutlined /> },
    { value: "vehicle", label: "Phương tiện", icon: <CarOutlined /> },
    { value: "jewelry", label: "Trang sức", icon: <StarOutlined /> },
    { value: "art", label: "Nghệ thuật", icon: <BankOutlined /> },
  ];

  const statusOptions = [
    { value: "completed", label: "Hoàn thành", color: "green" },
    { value: "paid", label: "Đã thanh toán", color: "blue" },
    { value: "delivered", label: "Đã giao hàng", color: "purple" },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    const option = categoryOptions.find((opt) => opt.value === category);
    return option?.icon || <BankOutlined />;
  };

  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find((opt) => opt.value === category);
    return option?.label || category;
  };
  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.color || "default";
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option?.label || status;
  };

  const getAuctionOverallStatus = (auction: AuctionResult) => {
    if (auction.lots.every((lot) => lot.status === "delivered")) return "delivered";
    if (auction.lots.every((lot) => lot.status === "paid" || lot.status === "delivered"))
      return "paid";
    return "completed";
  };

  const getTotalStartingPrice = (auction: AuctionResult) => {
    return auction.lots.reduce((total, lot) => total + lot.startingPrice, 0);
  };

  const getTotalWinningPrice = (auction: AuctionResult) => {
    return auction.lots.reduce((total, lot) => total + lot.winningPrice, 0);
  };

  // Filter and search logic
  const handleViewDetails = (auction: AuctionResult) => {
    setSelectedAuction(auction);
    setIsDetailModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalVisible(false);
    setSelectedAuction(null);
  };

  // Enhanced lot table columns for detailed view
  const lotTableColumns = [
    {
      title: "Lô số",
      dataIndex: "lotNumber",
      key: "lotNumber",
      width: 80,
      render: (lotNumber: number) => (
        <Tag color="blue" className="!font-semibold">
          #{lotNumber}
        </Tag>
      ),
    },
    {
      title: "Tên lô",
      dataIndex: "lotName",
      key: "lotName",
      ellipsis: true,
      render: (lotName: string) => <Text className="!font-medium">{lotName}</Text>,
    },
    {
      title: "Diện tích",
      dataIndex: ["lotDetails", "area"],
      key: "area",
      width: 100,
      render: (area: number) => (area ? `${area}m²` : "N/A"),
    },
    {
      title: "Giá khởi điểm",
      dataIndex: "startingPrice",
      key: "startingPrice",
      width: 150,
      render: (price: number) => <Text className="!text-gray-600">{formatPrice(price)}</Text>,
    },
    {
      title: "Giá thắng cuộc",
      dataIndex: "winningPrice",
      key: "winningPrice",
      width: 150,
      render: (price: number) => (
        <Text className="!font-semibold !text-green-600">{formatPrice(price)}</Text>
      ),
    },
    {
      title: "Người thắng",
      dataIndex: "winnerName",
      key: "winnerName",
      width: 140,
      render: (name: string) => (
        <div className="flex items-center gap-1">
          <UserOutlined className="text-blue-500" />
          <Text>{name}</Text>
        </div>
      ),
    },
    {
      title: "Lượt đấu",
      dataIndex: "totalBidsForLot",
      key: "totalBidsForLot",
      width: 100,
      render: (bids: number) => <Badge count={bids} showZero color="blue" />,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="!rounded-full !font-medium">
          <CheckCircleOutlined className="mr-1" />
          {getStatusLabel(status)}
        </Tag>
      ),
    },
  ];

  useEffect(() => {
    let filtered = [...auctionResults];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (auction) =>
          auction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          auction.lots.some((lot) =>
            lot.winnerName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((auction) => auction.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter((auction) => getAuctionOverallStatus(auction) === selectedStatus);
    }

    // Date range filter
    if (dateRange) {
      filtered = filtered.filter((auction) => {
        const endDate = dayjs(auction.endDate);
        return endDate.isAfter(dateRange[0]) && endDate.isBefore(dateRange[1]);
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "endDate":
          return dayjs(b.endDate).valueOf() - dayjs(a.endDate).valueOf();
        case "winningPrice":
          return getTotalWinningPrice(b) - getTotalWinningPrice(a);
        case "totalBids":
          return b.totalBids - a.totalBids;
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, dateRange, sortBy, auctionResults]);

  const currentResults = filteredResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-slide-in-up">
          <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
            <div className="bg-white px-6 py-2 rounded-xl">
              <span className="text-2xl font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                📰 TIN TỨC & THÔNG TIN
              </span>
            </div>
          </div>
        </div>{" "}
        {/* Enhanced Search & Filter Section */}
        <Card className="!mb-8 !shadow-lg !border-0 !bg-gradient-to-r !from-blue-50/50 !to-indigo-50/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <SearchOutlined className="text-blue-600 text-xl" />
              </div>
              <div>
                <Title level={4} className="!mb-1">
                  Tìm kiếm & Lọc kết quả
                </Title>
                <Text className="text-gray-500 text-sm">
                  Sử dụng các bộ lọc bên dưới để tìm kiếm kết quả phù hợp
                </Text>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setSelectedStatus("");
                  setDateRange(null);
                  setSortBy("endDate");
                }}
                icon={<FilterOutlined />}
                className="!rounded-lg"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Main Search Bar */}
          <div className="mb-6">
            {" "}
            <Text className="!font-medium !text-gray-700 !block !mb-2">
              🔍 Tìm kiếm nhanh
              <Tooltip
                title={
                  <div className="text-sm">
                    <div>⌨️ Phím tắt hữu ích:</div>
                    <div>• Ctrl+K: Focus vào ô tìm kiếm</div>
                    <div>• Esc: Xóa tất cả bộ lọc</div>
                  </div>
                }
                placement="right"
              >
                <Button type="text" size="small" className="!text-gray-400 !ml-2">
                  ❓
                </Button>
              </Tooltip>
            </Text>
            <div className="search-input-focus">
              <Input
                placeholder="Nhập tên đấu giá, mô tả, hoặc tên người thắng cuộc..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onPressEnter={() => {
                  // Optional: Add search analytics or focus management here
                }}
                className="!rounded-xl !shadow-sm"
                size="large"
                allowClear
              />
              <Text className="!text-xs !text-gray-500 !mt-1 !block">
                💡 Mẹo: Nhấn Enter để tìm kiếm nhanh, hoặc sử dụng các bộ lọc bên dưới
              </Text>
            </div>
          </div>

          {/* Filter Section */}
          <div className="space-y-6">
            {/* Category & Status Filters */}
            <div>
              <Text className="!font-medium !text-gray-700 !block !mb-3">
                📂 Phân loại & Trạng thái
              </Text>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text className="!text-sm !text-gray-600 !block !mb-2">Danh mục tài sản</Text>
                    <Select
                      placeholder="Chọn danh mục..."
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      className="!w-full"
                      size="large"
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {categoryOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <Space>
                            {option.icon}
                            {option.label}
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text className="!text-sm !text-gray-600 !block !mb-2">
                      Trạng thái hoàn thành
                    </Text>
                    <Select
                      placeholder="Chọn trạng thái..."
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      className="!w-full"
                      size="large"
                      allowClear
                    >
                      {statusOptions.map((option) => (
                        <Option key={option.value} value={option.value}>
                          <Badge color={option.color} text={option.label} />
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <div>
                    <Text className="!text-sm !text-gray-600 !block !mb-2">Sắp xếp theo</Text>
                    <Select
                      placeholder="Chọn cách sắp xếp..."
                      value={sortBy}
                      onChange={setSortBy}
                      className="!w-full"
                      size="large"
                      suffixIcon={<SortAscendingOutlined />}
                    >
                      <Option value="endDate">
                        <Space>
                          <ClockCircleOutlined />
                          Ngày kết thúc (mới nhất)
                        </Space>
                      </Option>
                      <Option value="winningPrice">
                        <Space>
                          <DollarOutlined />
                          Giá thắng cuộc (cao nhất)
                        </Space>
                      </Option>
                      <Option value="totalBids">
                        <Space>
                          <TrophyOutlined />
                          Số lượt đấu (nhiều nhất)
                        </Space>
                      </Option>
                    </Select>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Date Range Filter */}
            <div>
              <Text className="!font-medium !text-gray-700 !block !mb-3">
                📅 Thời gian kết thúc
              </Text>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <RangePicker
                    placeholder={["Từ ngày", "Đến ngày"]}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                    className="!w-full !rounded-lg"
                    size="large"
                    format="DD/MM/YYYY"
                    allowClear
                  />
                </Col>
                <Col xs={24} md={12}>
                  {" "}
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      size="small"
                      onClick={() => {
                        const today = dayjs();
                        const weekAgo = today.subtract(7, "day");
                        setDateRange([weekAgo, today]);
                      }}
                      className="!rounded-full quick-filter-btn"
                    >
                      7 ngày qua
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        const today = dayjs();
                        const monthAgo = today.subtract(1, "month");
                        setDateRange([monthAgo, today]);
                      }}
                      className="!rounded-full quick-filter-btn"
                    >
                      Tháng này
                    </Button>
                    <Button
                      size="small"
                      onClick={() => {
                        const today = dayjs();
                        const quarterAgo = today.subtract(3, "month");
                        setDateRange([quarterAgo, today]);
                      }}
                      className="!rounded-full quick-filter-btn"
                    >
                      3 tháng qua
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || selectedCategory || selectedStatus || dateRange) && (
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-3">
                  <Text className="!font-medium !text-gray-700">🏷️ Bộ lọc đang áp dụng:</Text>
                  <Button
                    type="link"
                    size="small"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setSelectedStatus("");
                      setDateRange(null);
                    }}
                    className="!text-red-500 !p-0"
                  >
                    Xóa tất cả
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {" "}
                  {searchTerm && (
                    <Tag
                      closable
                      onClose={() => setSearchTerm("")}
                      color="blue"
                      className="!rounded-full !px-3 !py-1 filter-tag-hover"
                    >
                      <SearchOutlined className="mr-1" />
                      Tìm: "{searchTerm}"
                    </Tag>
                  )}
                  {selectedCategory && (
                    <Tag
                      closable
                      onClose={() => setSelectedCategory("")}
                      color="green"
                      className="!rounded-full !px-3 !py-1 filter-tag-hover"
                    >
                      {getCategoryIcon(selectedCategory)}
                      <span className="ml-1">{getCategoryLabel(selectedCategory)}</span>
                    </Tag>
                  )}
                  {selectedStatus && (
                    <Tag
                      closable
                      onClose={() => setSelectedStatus("")}
                      color={getStatusColor(selectedStatus)}
                      className="!rounded-full !px-3 !py-1 filter-tag-hover"
                    >
                      <CheckCircleOutlined className="mr-1" />
                      {getStatusLabel(selectedStatus)}
                    </Tag>
                  )}
                  {dateRange && (
                    <Tag
                      closable
                      onClose={() => setDateRange(null)}
                      color="purple"
                      className="!rounded-full !px-3 !py-1 filter-tag-hover"
                    >
                      <ClockCircleOutlined className="mr-1" />
                      {dateRange[0].format("DD/MM/YYYY")} - {dateRange[1].format("DD/MM/YYYY")}
                    </Tag>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>{" "}
        {/* Enhanced Results Section */}
        <div className="mb-6">
          <Card className="!shadow-sm !border-0 !bg-gradient-to-r !from-green-50/50 !to-emerald-50/50">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <TrophyOutlined className="text-green-600 text-xl" />
                </div>
                <div>
                  <Title level={3} className="!mb-1">
                    Tìm thấy {filteredResults.length} kết quả đấu giá
                  </Title>
                  <Text className="text-gray-600">
                    {filteredResults.length === auctionResults.length
                      ? "Hiển thị tất cả kết quả"
                      : `Đã lọc từ ${auctionResults.length} kết quả ban đầu`}
                  </Text>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <Text className="text-gray-600 text-sm">
                  Hiển thị {Math.min((currentPage - 1) * pageSize + 1, filteredResults.length)} -{" "}
                  {Math.min(currentPage * pageSize, filteredResults.length)} của{" "}
                  {filteredResults.length} kết quả
                </Text>
                {filteredResults.length > 0 && (
                  <div className="flex gap-2">
                    <Tag color="blue" className="!rounded-full">
                      📊 {filteredResults.reduce((total, auction) => total + auction.totalLots, 0)}{" "}
                      lô
                    </Tag>
                    <Tag color="green" className="!rounded-full">
                      💰{" "}
                      {formatPrice(
                        filteredResults.reduce(
                          (total, auction) => total + getTotalWinningPrice(auction),
                          0
                        )
                      )}
                    </Tag>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <Text className="block mt-4 text-gray-600">Đang tải dữ liệu...</Text>
          </div>
        ) : currentResults.length === 0 ? (
          <Card className="!text-center !py-20 !shadow-lg !border-0">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <SearchOutlined className="text-6xl text-gray-400" />
              </div>
              <Title level={3} className="!text-gray-700 !mb-4">
                Không tìm thấy kết quả phù hợp
              </Title>
              <Text className="!text-gray-500 !text-lg !block !mb-8">
                {searchTerm || selectedCategory || selectedStatus || dateRange
                  ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để có kết quả tốt hơn"
                  : "Hiện tại chưa có kết quả đấu giá nào trong hệ thống"}
              </Text>

              {(searchTerm || selectedCategory || selectedStatus || dateRange) && (
                <div className="space-y-4">
                  <Text className="!text-gray-600 !font-medium !block">💡 Gợi ý tìm kiếm:</Text>
                  <div className="text-left space-y-2 bg-blue-50 p-4 rounded-lg">
                    <Text className="!text-sm !text-gray-600 !block">
                      • Thử sử dụng từ khóa ngắn gọn hơn
                    </Text>
                    <Text className="!text-sm !text-gray-600 !block">• Kiểm tra lại chính tả</Text>
                    <Text className="!text-sm !text-gray-600 !block">
                      • Mở rộng khoảng thời gian tìm kiếm
                    </Text>
                    <Text className="!text-sm !text-gray-600 !block">
                      • Thử bỏ bớt một số bộ lọc
                    </Text>
                  </div>

                  <Button
                    type="primary"
                    size="large"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("");
                      setSelectedStatus("");
                      setDateRange(null);
                      setSortBy("endDate");
                    }}
                    className="!mt-6 !bg-gradient-to-r !from-blue-500 !to-purple-500 !border-0 !rounded-xl"
                    icon={<FilterOutlined />}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {currentResults.map((auction) => (
              <Col xs={24} lg={12} key={auction.id}>
                <Card
                  className="!h-full !shadow-lg hover:!shadow-xl !transition-all !duration-300 !border-0 !overflow-hidden"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="relative">
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={auction.images[0]}
                        alt={auction.title}
                        className="!w-full !h-full !object-cover"
                        preview={false}
                      />{" "}
                      <div className="absolute top-4 left-4">
                        <Tag
                          color={getStatusColor(getAuctionOverallStatus(auction))}
                          className="!px-3 !py-1 !rounded-full !text-sm !font-semibold"
                        >
                          <CheckCircleOutlined className="mr-1" />
                          {getStatusLabel(getAuctionOverallStatus(auction))}
                        </Tag>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Tag className="!bg-white/90 !text-gray-700 !border-0 !px-3 !py-1 !rounded-full">
                          {getCategoryIcon(auction.category)}
                          <span className="ml-1">{getCategoryLabel(auction.category)}</span>
                        </Tag>
                      </div>
                      {auction.totalLots > 1 && (
                        <div className="absolute bottom-4 right-4">
                          <Tag className="!bg-blue-600 !text-white !border-0 !px-3 !py-1 !rounded-full !font-semibold">
                            {auction.totalLots} lô
                          </Tag>
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                      {/* Title and Description */}
                      <div className="mb-4">
                        <Title level={4} className="!mb-2 line-clamp-1">
                          {auction.title}
                        </Title>
                        <Paragraph
                          className="text-gray-600 !mb-0 line-clamp-2"
                          ellipsis={{ rows: 2 }}
                        >
                          {auction.description}
                        </Paragraph>
                      </div>{" "}
                      {/* Price Information */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                        <Row gutter={16}>
                          <Col span={12}>
                            <div className="text-center">
                              <Text className="!text-sm !text-gray-600 !block">
                                {auction.totalLots > 1 ? "Tổng giá khởi điểm" : "Giá khởi điểm"}
                              </Text>
                              <Text className="!text-lg !font-bold !text-gray-800">
                                {formatPrice(getTotalStartingPrice(auction))}
                              </Text>
                            </div>
                          </Col>
                          <Col span={12}>
                            <div className="text-center">
                              <Text className="!text-sm !text-green-600 !block">
                                {auction.totalLots > 1 ? "Tổng giá thắng cuộc" : "Giá thắng cuộc"}
                              </Text>
                              <Text className="!text-xl !font-bold !text-green-700">
                                <TrophyOutlined className="mr-1" />
                                {formatPrice(getTotalWinningPrice(auction))}
                              </Text>
                            </div>
                          </Col>
                        </Row>
                      </div>
                      {/* Lots Summary for Multi-lot Auctions */}
                      {auction.totalLots > 1 ? (
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <Text className="!font-semibold !text-gray-800">
                              Thông tin {auction.totalLots} lô đấu giá
                            </Text>
                            <Text className="!text-sm !text-blue-600">
                              {auction.lots.filter((lot) => lot.status === "delivered").length} lô
                              đã giao
                            </Text>
                          </div>

                          <div className="max-h-60 overflow-y-auto">
                            <div className="space-y-2">
                              {auction.lots.slice(0, 5).map((lot) => (
                                <div key={lot.lotNumber} className="bg-white rounded-lg p-3 border">
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Tag
                                          color={getStatusColor(lot.status)}
                                          className="!rounded-full !text-xs"
                                        >
                                          Lô {lot.lotNumber}
                                        </Tag>
                                        <Text className="!text-sm !font-medium">{lot.lotName}</Text>
                                      </div>
                                      <div className="flex justify-between text-xs text-gray-600">
                                        <span>Khởi điểm: {formatPrice(lot.startingPrice)}</span>
                                        <span className="font-semibold text-green-600">
                                          Thắng: {formatPrice(lot.winningPrice)}
                                        </span>
                                      </div>
                                      <Text className="!text-xs !text-blue-600">
                                        Người thắng: {lot.winnerName}
                                      </Text>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {auction.lots.length > 5 && (
                                <div className="text-center">
                                  <Text className="!text-sm !text-gray-500">
                                    ... và {auction.lots.length - 5} lô khác
                                  </Text>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Single lot winner information */
                        <div className="bg-blue-50 rounded-xl p-4 mb-4">
                          <Row gutter={16} align="middle">
                            <Col span={12}>
                              <div className="flex items-center">
                                <UserOutlined className="text-blue-600 mr-2" />
                                <div>
                                  <Text className="!text-sm !text-gray-600 !block">
                                    Người thắng cuộc
                                  </Text>
                                  <Text className="!font-semibold !text-gray-800">
                                    {auction.lots[0]?.winnerName}
                                  </Text>
                                </div>
                              </div>
                            </Col>
                            <Col span={12}>
                              <div className="text-right">
                                <Text className="!text-sm !text-gray-600 !block">
                                  Số lần đấu giá
                                </Text>
                                <Text className="!font-bold !text-blue-600">
                                  {auction.lots[0]?.winnerBidCount} lần
                                </Text>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      )}
                      {/* Auction Details */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600">
                            <ClockCircleOutlined className="mr-2" />
                            Thời gian kết thúc
                          </span>
                          <Text className="!font-semibold">
                            {dayjs(auction.endDate).format("DD/MM/YYYY HH:mm")}
                          </Text>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600">
                            <DollarOutlined className="mr-2" />
                            Tổng lượt đấu giá
                          </span>
                          <Text className="!font-semibold">{auction.totalBids} lượt</Text>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-gray-600">
                            <UserOutlined className="mr-2" />
                            Đấu giá viên
                          </span>
                          <Text className="!font-semibold">{auction.auctioneer}</Text>
                        </div>
                      </div>
                      <Divider className="!my-4" /> {/* Asset Details */}
                      <div className="mb-4">
                        <Text className="!font-semibold !text-gray-800 !block !mb-2">
                          Chi tiết tài sản:
                        </Text>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <Text className="!text-gray-600">Tình trạng:</Text>
                            <Text className="!font-medium">{auction.assetDetails.condition}</Text>
                          </div>
                          {auction.assetDetails.year && (
                            <div className="flex justify-between">
                              <Text className="!text-gray-600">Năm sản xuất:</Text>
                              <Text className="!font-medium">{auction.assetDetails.year}</Text>
                            </div>
                          )}
                          {auction.assetDetails.brand && (
                            <div className="flex justify-between">
                              <Text className="!text-gray-600">Thương hiệu:</Text>
                              <Text className="!font-medium">{auction.assetDetails.brand}</Text>
                            </div>
                          )}
                        </div>

                        {auction.assetDetails.specifications && (
                          <div className="mt-3">
                            <Text className="!text-gray-600 !block !mb-2">Thông số kỹ thuật:</Text>
                            <div className="flex flex-wrap gap-1">
                              {auction.assetDetails.specifications.map((spec, index) => (
                                <Tag key={index} className="!rounded-full">
                                  {spec}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Action Button */}{" "}
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => handleViewDetails(auction)}
                        className="!w-full !bg-gradient-to-r !from-blue-500 !to-purple-500 !border-0 !rounded-xl !font-semibold"
                        icon={<EyeOutlined />}
                      >
                        {auction.totalLots > 1
                          ? `Xem chi tiết ${auction.totalLots} lô`
                          : "Xem chi tiết"}
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}{" "}
        {/* Pagination */}
        {filteredResults.length > pageSize && (
          <div className="mt-8 text-center">
            <Pagination
              current={currentPage}
              total={filteredResults.length}
              pageSize={pageSize}
              onChange={setCurrentPage}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} kết quả`}
              className="!custom-pagination"
            />
          </div>
        )}
      </div>

      {/* Detailed Auction Modal */}
      <Modal
        title={null}
        open={isDetailModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        width={1200}
        style={{ top: 20 }}
        className="!rounded-xl"
      >
        {selectedAuction && (
          <div className="max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-6 mb-6 p-6 text-white">
              <div className="absolute inset-0 bg-black/10 rounded-t-xl"></div>
              <div className="relative">
                <div className="flex items-start justify-between ">
                  <div className="flex-1">
                    <Title level={3} className="!text-white !mb-2">
                      {selectedAuction.title}
                    </Title>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Tag className="!bg-white/20 !text-white !border-0">
                        {getCategoryIcon(selectedAuction.category)}
                        <span className="ml-1">{getCategoryLabel(selectedAuction.category)}</span>
                      </Tag>
                      <Tag className="!bg-white/20 !text-white !border-0">
                        <ClockCircleOutlined className="mr-1" />
                        {dayjs(selectedAuction.endDate).format("DD/MM/YYYY HH:mm")}
                      </Tag>
                      <Tag className="!bg-white/20 !text-white !border-0">
                        {selectedAuction.totalLots} lô
                      </Tag>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-white/20 rounded-lg p-3">
                      <Text className="!text-white/80 !text-sm !block">Tổng giá thắng cuộc</Text>
                      <Text className="!text-white !text-2xl !font-bold">
                        {formatPrice(getTotalWinningPrice(selectedAuction))}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="space-y-6">
              {/* Auction Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Statistic
                  title="Tổng số lượt đấu"
                  value={selectedAuction.totalBids}
                  prefix={<DollarOutlined className="text-blue-500" />}
                  className="!bg-blue-50 !p-4 !rounded-xl"
                />
                <Statistic
                  title="Số lô đã hoàn thành"
                  value={selectedAuction.lots.filter((lot) => lot.status === "delivered").length}
                  suffix={`/ ${selectedAuction.totalLots}`}
                  prefix={<CheckCircleOutlined className="text-green-500" />}
                  className="!bg-green-50 !p-4 !rounded-xl"
                />
                <Statistic
                  title="Tỷ lệ hoàn thành"
                  value={Math.round(
                    (selectedAuction.lots.filter((lot) => lot.status === "delivered").length /
                      selectedAuction.totalLots) *
                      100
                  )}
                  suffix="%"
                  prefix={<TrophyOutlined className="text-orange-500" />}
                  className="!bg-orange-50 !p-4 !rounded-xl"
                />
              </div>

              {/* Progress Bar */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="mb-2">
                  <Text className="!font-semibold">Tiến độ giao hàng</Text>
                </div>
                <Progress
                  percent={Math.round(
                    (selectedAuction.lots.filter((lot) => lot.status === "delivered").length /
                      selectedAuction.totalLots) *
                      100
                  )}
                  strokeColor={{
                    "0%": "#108ee9",
                    "100%": "#87d068",
                  }}
                  className="!mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>
                    {selectedAuction.lots.filter((lot) => lot.status === "delivered").length} lô đã
                    giao
                  </span>
                  <span>
                    {selectedAuction.lots.filter((lot) => lot.status === "paid").length} lô đã thanh
                    toán
                  </span>
                  <span>
                    {selectedAuction.lots.filter((lot) => lot.status === "completed").length} lô
                    hoàn thành
                  </span>
                </div>
              </div>

              {/* Auction Information */}
              <Card title="Thông tin đấu giá" className="!shadow-sm">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="Mô tả">{selectedAuction.description}</Descriptions.Item>
                  <Descriptions.Item label="Địa điểm">{selectedAuction.location}</Descriptions.Item>
                  <Descriptions.Item label="Người đấu giá">
                    {selectedAuction.auctioneer}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian bắt đầu">
                    {dayjs(selectedAuction.startDate).format("DD/MM/YYYY HH:mm")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian kết thúc">
                    {dayjs(selectedAuction.endDate).format("DD/MM/YYYY HH:mm")}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tình trạng tài sản">
                    {selectedAuction.assetDetails.condition}
                  </Descriptions.Item>
                </Descriptions>
              </Card>

              {/* Lots Details Table */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span>Chi tiết {selectedAuction.totalLots} lô đấu giá</span>
                    <div className="flex gap-2">
                      <Tag color="green">
                        {selectedAuction.lots.filter((lot) => lot.status === "delivered").length} đã
                        giao
                      </Tag>
                      <Tag color="blue">
                        {selectedAuction.lots.filter((lot) => lot.status === "paid").length} đã
                        thanh toán
                      </Tag>
                      <Tag color="orange">
                        {selectedAuction.lots.filter((lot) => lot.status === "completed").length}{" "}
                        hoàn thành
                      </Tag>
                    </div>
                  </div>
                }
                className="!shadow-sm"
              >
                <Table
                  columns={lotTableColumns}
                  dataSource={selectedAuction.lots}
                  rowKey="lotNumber"
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lô`,
                  }}
                  scroll={{ x: 1000 }}
                  className="!rounded-xl"
                  size="small"
                />
              </Card>

              {/* Images Gallery */}
              {selectedAuction.images && selectedAuction.images.length > 0 && (
                <Card title="Hình ảnh tài sản" className="!shadow-sm">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAuction.images.map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`${selectedAuction.title} - ${index + 1}`}
                          className="!w-full !h-full !object-cover !rounded-lg"
                          preview={{
                            mask: (
                              <div className="flex items-center justify-center">
                                <EyeOutlined className="text-white text-xl" />
                              </div>
                            ),
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ResultAuction;
