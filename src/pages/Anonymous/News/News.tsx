import { useState, useEffect, useCallback } from "react";
import { Card, Input, Tag, Pagination, Button } from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  EyeOutlined,
  UserOutlined,
  FireOutlined,
  ClockCircleOutlined,
  ReadOutlined,
  TrophyOutlined,
  StarOutlined,
} from "@ant-design/icons";

// Mock news data - replace with actual API call
const mockNewsData = [
  {
    id: 1,
    title: "Phiên đấu giá tài sản bất động sản tại Hà Nội thu hút hàng nghìn người tham gia",
    excerpt:
      "Phiên đấu giá được tổ chức tại trung tâm Hà Nội đã thu hút sự quan tâm lớn từ các nhà đầu tư...",
    content: "Chi tiết đầy đủ về phiên đấu giá...",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=400&fit=crop",
    category: "Đấu giá",
    author: "Admin",
    publishDate: "2024-01-15",
    views: 1250,
    featured: true,
    tags: ["Bất động sản", "Hà Nội", "Đấu giá"],
  },
  {
    id: 2,
    title: "Hướng dẫn tham gia đấu giá trực tuyến hiệu quả cho người mới",
    excerpt:
      "Cẩm nang chi tiết giúp người mới bắt đầu tham gia đấu giá trực tuyến một cách hiệu quả...",
    content: "Hướng dẫn từng bước...",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop",
    category: "Hướng dẫn",
    author: "Digital Auction",
    publishDate: "2024-01-12",
    views: 890,
    featured: false,
    tags: ["Hướng dẫn", "Đấu giá trực tuyến"],
  },
  {
    id: 3,
    title: "Thị trường đấu giá tài sản tăng trưởng mạnh trong quý 1/2024",
    excerpt: "Báo cáo thống kê cho thấy thị trường đấu giá có những bước phát triển đáng kể...",
    content: "Phân tích chi tiết thị trường...",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
    category: "Thống kê",
    author: "Phòng Phân tích",
    publishDate: "2024-01-10",
    views: 654,
    featured: true,
    tags: ["Thống kê", "Thị trường", "2024"],
  },
  {
    id: 4,
    title: "Những lưu ý quan trọng khi đăng ký tham gia đấu giá tài sản",
    excerpt: "Các điều kiện và thủ tục cần thiết mà người tham gia đấu giá cần biết...",
    content: "Danh sách các lưu ý...",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
    category: "Hướng dẫn",
    author: "Bộ phận Hỗ trợ",
    publishDate: "2024-01-08",
    views: 432,
    featured: false,
    tags: ["Hướng dẫn", "Đăng ký", "Thủ tục"],
  },
  {
    id: 5,
    title: "Digital Auction - Nền tảng đấu giá số hàng đầu Việt Nam",
    excerpt: "Tìm hiểu về hành trình phát triển và những thành tựu của Digital Auction...",
    content: "Câu chuyện thương hiệu...",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=400&fit=crop",
    category: "Tin tức",
    author: "Digital Auction",
    publishDate: "2024-01-05",
    views: 1100,
    featured: true,
    tags: ["Digital Auction", "Thương hiệu", "Việt Nam"],
  },
];

const categories = ["Tất cả", "Đấu giá", "Hướng dẫn", "Thống kê", "Tin tức"];

const News = () => {
  const [newsData] = useState(mockNewsData);
  const [filteredNews, setFilteredNews] = useState(mockNewsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const filterNews = useCallback(() => {
    let filtered = newsData;

    if (searchTerm) {
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          news.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "Tất cả") {
      filtered = filtered.filter((news) => news.category === selectedCategory);
    }

    setFilteredNews(filtered);
  }, [newsData, searchTerm, selectedCategory]);
  useEffect(() => {
    filterNews();
  }, [filterNews]);

  const featuredNews = filteredNews.filter((news) => news.featured);
  const regularNews = filteredNews.filter((news) => !news.featured);
  const paginatedNews = regularNews.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-200/20 rounded-full blur-xl animate-float"></div>
        <div
          className="absolute top-40 right-32 w-32 h-32 bg-purple-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-1/3 w-28 h-28 bg-indigo-200/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-slide-in-up">
            <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <div className="bg-white px-6 py-2 rounded-xl">
                <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text">
                  📰 TIN TỨC & THÔNG TIN
                </span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text mb-4">
              Tin Tức Đấu Giá
            </h1>
          </div>

          {/* Search and Filter Section */}
          <div
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 border border-white/20 animate-slide-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <Input
                  size="large"
                  placeholder="Tìm kiếm tin tức..."
                  prefix={<SearchOutlined className="text-blue-600" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl border-2 border-gray-200 hover:border-blue-400 focus:border-blue-600 transition-all duration-300"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type={selectedCategory === category ? "primary" : "default"}
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-6 py-2 font-semibold transition-all duration-300 hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 border-0 shadow-lg"
                        : "bg-white/70 hover:bg-blue-50 border-gray-300"
                    }`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Featured News Section */}
          {featuredNews.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <StarOutlined className="text-white text-sm" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Tin Nổi Bật</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                  <FireOutlined />
                  <span>Hot</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {featuredNews.map((news, index) => (
                  <Card
                    key={news.id}
                    hoverable
                    className="group overflow-hidden rounded-3xl shadow-2xl border-0 hover:shadow-3xl transition-all duration-500 hover:scale-105 animate-slide-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                    cover={
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

                        {/* Featured Badge */}
                        <div className="absolute top-4 left-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-white text-sm font-bold">
                            <TrophyOutlined />
                            <span>Nổi bật</span>
                          </div>
                        </div>

                        {/* Category Tag */}
                        <div className="absolute top-4 right-4">
                          <Tag className="bg-white/90 backdrop-blur-sm border-0 rounded-full px-3 py-1 text-sm font-semibold">
                            {news.category}
                          </Tag>
                        </div>

                        {/* Stats Overlay */}
                        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-white">
                          <div className="flex items-center gap-1 text-sm">
                            <EyeOutlined />
                            <span>{formatViews(news.views)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <CalendarOutlined />
                            <span>{formatDate(news.publishDate)}</span>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <UserOutlined className="text-blue-600" />
                        <span className="text-sm text-gray-600 font-medium">{news.author}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {news.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                        {news.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {news.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Button
                        type="primary"
                        className="w-full rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:scale-105 transition-transform duration-300"
                        icon={<ReadOutlined />}
                      >
                        Đọc tiếp
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular News Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ReadOutlined className="text-white text-sm" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Tin Tức Mới Nhất</h2>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <ClockCircleOutlined />
                <span>Cập nhật</span>
              </div>
            </div>

            {paginatedNews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {paginatedNews.map((news, index) => (
                  <Card
                    key={news.id}
                    hoverable
                    className="group overflow-hidden rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-slide-in-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                    cover={
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={news.image}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                        {/* Category Tag */}
                        <div className="absolute top-3 right-3">
                          <Tag className="bg-white/90 backdrop-blur-sm border-0 rounded-full px-2 py-1 text-xs font-semibold">
                            {news.category}
                          </Tag>
                        </div>

                        {/* Quick Stats */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs">
                          <div className="flex items-center gap-1">
                            <EyeOutlined />
                            <span>{formatViews(news.views)}</span>
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <UserOutlined className="text-gray-500 text-xs" />
                          <span className="text-xs text-gray-600">{news.author}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatDate(news.publishDate)}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {news.title}
                      </h3>

                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm leading-relaxed">
                        {news.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {news.tags.slice(0, 2).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Button
                        type="primary"
                        size="small"
                        className="w-full rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                        icon={<ReadOutlined />}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-slide-in-up">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <SearchOutlined className="text-6xl text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy tin tức</h3>
                <p className="text-gray-500 mb-6">Thử thay đổi từ khóa tìm kiếm hoặc danh mục</p>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("Tất cả");
                  }}
                  className="rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:scale-105 transition-transform duration-300"
                >
                  Xem tất cả tin tức
                </Button>
              </div>
            )}
          </div>

          {/* Enhanced Pagination */}
          {regularNews.length > pageSize && (
            <div
              className="flex justify-center animate-slide-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={regularNews.length}
                onChange={setCurrentPage}
                showSizeChanger={false}
                className="custom-pagination"
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} tin tức`}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-pagination .ant-pagination-item {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          margin: 0 4px;
          background: white;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .ant-pagination-item:hover {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .custom-pagination .ant-pagination-item-active {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
        }
        
        .custom-pagination .ant-pagination-item-active a {
          color: white;
        }

        @keyframes animate-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }

        @keyframes animate-slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: animate-float 6s ease-in-out infinite;
        }

        .animate-slide-in-up {
          animation: animate-slide-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default News;
