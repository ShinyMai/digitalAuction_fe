import { Image, Button } from "antd";
import {
  CloseOutlined,
  CalendarOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import CustomModal from "../../../../components/Common/CustomModal";
import type { BlogData } from "../../../Staff/ManageBlog/types";
import { getBlogStatusTag } from "../../../Staff/ManageBlog/utils";

interface DetailBlogProps {
  open: boolean;
  onCancel: () => void;
  blogData: BlogData | null;
  onEdit?: (blog: BlogData) => void;
}

const DetailBlog = ({ open, onCancel, blogData }: DetailBlogProps) => {
  if (!blogData) return null;

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Chưa có thông tin";
    }
    return new Date(dateString).toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <CustomModal
      title={
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Chi tiết bài viết</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={900}
      footer={null}
      className="detail-blog-modal"
      style={{ top: 20 }}
    >
      <div className=" rounded-lg">
        {/* Header with Status and Actions */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
          {/* Blog ID and Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {" "}
              <div className="flex items-start gap-3">
                <span className="text-sm font-medium text-gray-500 min-w-[100px]">
                  Trạng thái:
                </span>
                {getBlogStatusTag(blogData.status)}
              </div>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <FileTextOutlined className="text-white text-xs" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Tiêu đề bài viết
            </h3>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <h1 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {blogData.title}
            </h1>
          </div>
        </div>

        {/* Thumbnail Section */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-green-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <PictureOutlined className="text-white text-xs" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Hình ảnh đại diện
            </h3>
          </div>
          <div className="flex justify-center">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src={blogData.thumbnailUrl}
                alt={blogData.title}
                className="max-w-full h-auto"
                style={{ maxHeight: "400px", objectFit: "cover" }}
                fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEQTAlysHBgZPFkYGEKcQY0BwkOEGewgYCbGP7w4AA=="
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <FileTextOutlined className="text-white text-xs" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">
              Nội dung bài viết
            </h3>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {blogData.content.split("\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p
                      key={index}
                      className="mb-4 text-justify text-base leading-7"
                    >
                      {paragraph}
                    </p>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Timestamps Section */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <CalendarOutlined className="text-gray-500 text-lg" />
            <h3 className="text-lg font-semibold text-gray-800">
              Thông tin thời gian
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <CalendarOutlined className="text-blue-500" />
                <span className="font-medium text-blue-800">Ngày tạo</span>
              </div>
              <p className="text-gray-700 text-sm">
                {formatDate(blogData.createdAt)}
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CalendarOutlined className="text-green-500" />
                <span className="font-medium text-green-800">
                  Ngày cập nhật
                </span>
              </div>
              <p className="text-gray-700 text-sm">
                {formatDate(blogData.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            size="large"
            onClick={onCancel}
            className="px-8 py-2 h-12 rounded-xl border-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
            icon={<CloseOutlined />}
          >
            Đóng
          </Button>
        </div>
      </div>

      <style>{`
        .detail-blog-modal .ant-modal-content {
          border-radius: 20px !important;
          overflow: hidden !important;
        }
        
        .detail-blog-modal .ant-modal-body {
          max-height: 80vh !important;
          overflow-y: auto !important;
        }
        
        .detail-blog-modal .ant-image {
          border-radius: 12px !important;
        }
        
        .detail-blog-modal .ant-btn:hover {
          transform: translateY(-1px) !important;
        }
        
        .detail-blog-modal .prose p {
          margin-bottom: 1rem !important;
          line-height: 1.7 !important;
        }
        
        .detail-blog-modal .ant-tag {
          border-radius: 8px !important;
          font-weight: 500 !important;
        }
      `}</style>
    </CustomModal>
  );
};

export default DetailBlog;
