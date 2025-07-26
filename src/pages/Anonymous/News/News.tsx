import { useState, useEffect, useCallback } from "react";
import { Input, Pagination } from "antd";
import { SearchOutlined, ReadOutlined, ClockCircleOutlined } from "@ant-design/icons";
import NewsServices from "../../../services/NewsService";
import RegularNewsSection from "./components/RegularNewsSection";
import BlogDetailView from "./components/BlogDetailView";
import type { BlogData, BlogResponse, BlogParams } from "./types";

const News = () => {
  const [filteredNews, setFilteredNews] = useState<BlogData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const pageSize = 6;
  const getListNews = async (page: number = 1, search: string = "") => {
    try {
      setLoading(true);
      const params: BlogParams = {
        PageNumber: page,
        PageSize: pageSize,
        Status: 2,
      };

      if (search.trim()) {
        params.SearchTitle = search.trim();
      }
      const res = await NewsServices.getListNews(params);
      if (res.code === 200 && res.data) {
        const blogResponse: BlogResponse = res.data;
        setFilteredNews(blogResponse.blogs);
        setTotalCount(blogResponse.totalCount);
      } else {
        console.error("Failed to fetch news data:", res.message);
        setFilteredNews([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching news data:", error);
      setFilteredNews([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };
  // Search with debouncing
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    getListNews(1, value);
  }, []);

  useEffect(() => {
    getListNews(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  }; // Utility functions for working with BlogData
  const handleRefresh = () => {
    setSearchTerm("");
    setCurrentPage(1);
    getListNews(1, "");
  };

  const handleViewDetail = (blog: BlogData) => {
    setSelectedBlog(blog);
  };

  const handleCloseDetail = () => {
    setSelectedBlog(null);
  };

  const regularNews = filteredNews;

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
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 mb-8 animate-slide-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <Input
                  size="large"
                  placeholder="Tìm kiếm tin tức..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="rounded-xl transition-all duration-300"
                  prefix={<SearchOutlined />}
                />
              </div>
            </div>
          </div>

          {/* Section Header */}
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
          <div
            className={`flex gap-8 transition-all duration-500 ${
              selectedBlog ? "lg:flex-row flex-col" : "flex-col"
            }`}
          >
            <div
              className={`${
                selectedBlog ? "lg:w-1/3 w-full" : "w-full"
              } transition-all duration-500`}
            >
              <RegularNewsSection
                news={regularNews}
                loading={loading}
                onRefresh={handleRefresh}
                onViewDetail={handleViewDetail}
                isDetailOpen={!!selectedBlog}
              />
              {/* Enhanced Pagination */}
              {totalCount > pageSize && !selectedBlog && (
                <div
                  className="flex justify-center animate-slide-in-up"
                  style={{ animationDelay: "0.3s" }}
                >
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={totalCount}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="custom-pagination"
                    showQuickJumper
                    showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} tin tức`}
                  />
                </div>
              )}
            </div>
            {/* Blog Detail Section */}
            {selectedBlog && (
              <div className="lg:w-2/3 w-full transition-all duration-500">
                <div className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] h-auto">
                  <BlogDetailView blog={selectedBlog} onClose={handleCloseDetail} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
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
        }        .animate-slide-in-up {
          animation: animate-slide-in-up 0.6s ease-out forwards;
        }

        @media (max-width: 1024px) {
          .lg\\:w-2\\/3 {
            width: 100% !important;
          }
          .lg\\:w-1\\/3 {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default News;
