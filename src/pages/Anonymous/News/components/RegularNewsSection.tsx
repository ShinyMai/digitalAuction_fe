import { Card, Tag, Button, Spin } from "antd";
import { EyeOutlined, UserOutlined, ReadOutlined, SearchOutlined } from "@ant-design/icons";
import type { BlogData } from "../types";

interface RegularNewsSectionProps {
  news: BlogData[];
  loading: boolean;
  onRefresh: () => void;
  onViewDetail: (blog: BlogData) => void;
  isDetailOpen?: boolean;
}

const RegularNewsSection = ({
  news,
  loading,
  onRefresh,
  onViewDetail,
  isDetailOpen = false,
}: RegularNewsSectionProps) => {
  const generateRandomViews = () => Math.floor(Math.random() * 1000) + 100;
  const createExcerpt = (content: string, maxLength: number = 200) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

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
    <div className="mb-8">
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <Spin size="large" />
          <span className="ml-4 text-lg text-gray-600">Đang tải tin tức...</span>
        </div>
      ) : news.length > 0 ? (
        <div
          className={`grid grid-cols-1 ${
            isDetailOpen ? "lg:grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
          } gap-6 mb-8`}
        >
          {news.map((blog, index) => (
            <Card
              key={blog.blogId}
              hoverable
              className="group overflow-hidden rounded-2xl shadow-lg border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-slide-in-up"
              style={{ animationDelay: `${0.1 * index}s` }}
              cover={
                <div className={`relative ${isDetailOpen ? "h-40" : "h-48"} overflow-hidden`}>
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                  {/* Category Tag */}
                  <div className="absolute top-3 right-3">
                    <Tag className="bg-white/90 backdrop-blur-sm border-0 rounded-full px-2 py-1 text-xs font-semibold">
                      Tin tức
                    </Tag>
                  </div>

                  {/* Quick Stats */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs">
                    <div className="flex items-center gap-1">
                      <EyeOutlined />
                      <span>{formatViews(generateRandomViews())}</span>
                    </div>
                  </div>
                </div>
              }
            >
              {" "}
              <div className={`${isDetailOpen ? "p-3" : "p-4"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserOutlined className="text-gray-500 text-xs" />
                    <span className="text-xs text-gray-600">Digital Auction</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(blog.createdAt)}</span>
                </div>
                <h3
                  className={`font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 ${
                    isDetailOpen ? "text-base" : "text-lg"
                  }`}
                >
                  {blog.title}
                </h3>{" "}
                {/* Limited to 3 lines for content */}
                <p
                  className={`text-gray-600 mb-3 line-clamp-3 leading-relaxed ${
                    isDetailOpen ? "text-xs" : "text-sm"
                  }`}
                >
                  {createExcerpt(blog.content)}
                </p>{" "}
                <Button
                  type="primary"
                  size="small"
                  className="w-full rounded-lg font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                  icon={<ReadOutlined />}
                  onClick={() => onViewDetail(blog)}
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
            onClick={onRefresh}
            className="rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:scale-105 transition-transform duration-300"
          >
            Xem tất cả tin tức
          </Button>
        </div>
      )}

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

        .animate-slide-in-up {
          animation: animate-slide-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RegularNewsSection;
