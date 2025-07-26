import { Button, Divider } from "antd";
import { CloseOutlined, EyeOutlined, UserOutlined, CalendarOutlined } from "@ant-design/icons";
import type { BlogData } from "../types";

interface BlogDetailViewProps {
  blog: BlogData;
  onClose: () => void;
}

const BlogDetailView = ({ blog, onClose }: BlogDetailViewProps) => {
  const generateRandomViews = () => Math.floor(Math.random() * 1000) + 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
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
    <div className="max-h-fit bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in-right">
      {/* Header with Close Button */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Chi tiết tin tức</h2>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            className="rounded-full hover:bg-gray-100 lg:hover:scale-105 transition-transform duration-300"
            size="large"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6 overflow-y-auto h-full pb-20">
        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8 leading-tight">
          {blog.title}
        </h1>
        <Divider /> {/* Content */}
        <div className="prose max-w-none mb-10">
          <div
            className="text-gray-700 leading-relaxed text-lg"
            style={{ lineHeight: "1.8", columnGap: "2rem" }}
          >
            {blog.content.split("\n").map(
              (paragraph, index) =>
                paragraph.trim() && (
                  <p key={index} className="mb-6 text-justify">
                    {paragraph}
                  </p>
                )
            )}
          </div>
        </div>
        {/* Meta Information */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <UserOutlined className="text-blue-500" />
              <span className="font-medium">Digital Auction</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarOutlined className="text-green-500" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeOutlined className="text-purple-500" />
              <span>{formatViews(generateRandomViews())} lượt xem</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes animate-slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in-right {
          animation: animate-slide-in-right 0.4s ease-out forwards;
        }

        .prose p {
          margin-bottom: 1rem;
          text-align: justify;
        }
      `}</style>
    </div>
  );
};

export default BlogDetailView;
