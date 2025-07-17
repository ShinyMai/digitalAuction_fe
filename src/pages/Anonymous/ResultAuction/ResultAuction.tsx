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
  Empty,
  Spin,
  Image,
  Table,
  Modal,
  Descriptions,
  Statistic,
  Progress,
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
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <TrophyOutlined className="text-4xl text-white" />
            </div>
            <Title level={1} className="!text-white !mb-4 font-bold">
              Kết Quả Đấu Giá
            </Title>
            <Text className="text-white/90 text-xl block max-w-2xl mx-auto leading-relaxed">
              Khám phá những phiên đấu giá đã kết thúc với thông tin chi tiết về tài sản và giá
              thành công
            </Text>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {" "}
        {/* Filter Section */}
        <Card className="!mb-8 !shadow-lg !border-0">
          <div className="flex items-center mb-6">
            <FilterOutlined className="text-blue-600 text-xl mr-3" />
            <Title level={4} className="!mb-0">
              Bộ lọc kết quả
            </Title>
          </div>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Tìm kiếm đấu giá..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!rounded-lg"
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="Danh mục"
                value={selectedCategory}
                onChange={setSelectedCategory}
                className="!w-full"
                size="large"
                allowClear
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
            </Col>
            <Col xs={24} sm={12} md={5}>
              <Select
                placeholder="Trạng thái"
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
            </Col>
            <Col xs={24} sm={12} md={5}>
              {" "}
              <RangePicker
                placeholder={["Từ ngày", "Đến ngày"]}
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                className="!w-full"
                size="large"
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={12} md={3}>
              <Select
                placeholder="Sắp xếp"
                value={sortBy}
                onChange={setSortBy}
                className="!w-full"
                size="large"
                suffixIcon={<SortAscendingOutlined />}
              >
                <Option value="endDate">Ngày kết thúc</Option>
                <Option value="winningPrice">Giá thắng</Option>
                <Option value="totalBids">Số lượt đấu</Option>
              </Select>
            </Col>
          </Row>
        </Card>
        {/* Results Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <Title level={3} className="!mb-0">
              Tìm thấy {filteredResults.length} kết quả
            </Title>
            <Text className="text-gray-600">
              Hiển thị {Math.min((currentPage - 1) * pageSize + 1, filteredResults.length)} -{" "}
              {Math.min(currentPage * pageSize, filteredResults.length)} của{" "}
              {filteredResults.length}
            </Text>
          </div>
        </div>
        {loading ? (
          <div className="text-center py-20">
            <Spin size="large" />
            <Text className="block mt-4 text-gray-600">Đang tải dữ liệu...</Text>
          </div>
        ) : currentResults.length === 0 ? (
          <Card className="!text-center !py-20">
            <Empty
              description="Không tìm thấy kết quả phù hợp"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
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
