import {
  Table,
  Button,
  Space,
  Image,
  Tooltip,
  Popconfirm,
  message,
  type PopconfirmProps,
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import NewsServices from "../../../../services/NewsService";
import type { ApiResponse } from "../../../../types/responseAxios";
import type { BlogData } from "../../../Staff/ManageBlog/types";
import { getBlogStatusTag } from "../../../Staff/ManageBlog/utils";
import { useState } from "react";
import ReasonReject from "../modal/ReasonReject";

interface BlogTableProps {
  blogData: BlogData[];
  headerTable: React.ReactNode;
  onChange: (pagination: { current?: number; pageSize?: number }) => void;
  total: number;
  loading: boolean;
  pageSize?: number;
  currentPage?: number;
  onEdit?: (record: BlogData) => void;
  onRowClick?: (record: BlogData) => void;
  onStatusChange?: () => void;
}

const BlogTable = ({
  blogData,
  headerTable,
  onChange,
  total,
  loading,
  pageSize = 8,
  currentPage = 1,
  onRowClick,
  onStatusChange,
}: BlogTableProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const [openModal, setOpenModal] = useState<string>("");

  const handleApprove = async (record: BlogData) => {
    try {
      const response: ApiResponse<unknown> =
        await NewsServices.changeStatusBlog({
          BlogId: record.blogId,
          Status: 2,
          Note: "",
        });

      if (response.code === 200) {
        message.success("Duyệt bài viết thành công!");
        onStatusChange?.(); // Refresh the list
      } else {
        message.error(response.message || "Lỗi khi duyệt bài viết!");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Lỗi khi xóa bài viết!");
    }
  };

  const handleHideBlog = async (record: BlogData) => {
    try {
      const response: ApiResponse<unknown> =
        await NewsServices.changeStatusBlog({
          BlogId: record.blogId,
          Status: 3,
          Note: "",
        });

      if (response.code === 200) {
        message.success("Xóa bài viết thành công!");
        onStatusChange?.(); // Refresh the list
      } else {
        message.error(response.message || "Lỗi khi xóa bài viết!");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      message.error("Lỗi khi xóa bài viết!");
    }
  };

  const cancel: PopconfirmProps["onCancel"] = () => {
    console.log("Operation cancelled");
  };

  const columns: ColumnsType<BlogData> = [
    {
      title: "STT",
      key: "index",
      width: 60,
      align: "center",
      render: (_: unknown, __: BlogData, index: number) => {
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      width: 100,
      align: "center",
      render: (thumbnailUrl: string, record: BlogData) => (
        <Image
          src={thumbnailUrl}
          alt={record.title}
          width={60}
          height={40}
          className="rounded-lg object-cover"
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          preview={false}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (title: string) => (
        <Tooltip title={title}>
          <div className="font-medium text-gray-800">
            {truncateText(title, 50)}
          </div>
        </Tooltip>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 400,
      render: (content: string) => (
        <Tooltip title={content}>
          <div className="text-gray-600">{truncateText(content, 80)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: number) => getBlogStatusTag(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (createdAt: string) => (
        <div className="text-sm text-gray-600">{formatDate(createdAt)}</div>
      ),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (updatedAt: string) => (
        <div className="text-sm text-gray-600">
          {updatedAt && updatedAt !== "0001-01-01T00:00:00"
            ? formatDate(updatedAt)
            : "Chưa cập nhật"}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      align: "center",
      fixed: "right",
      render: (_: unknown, record: BlogData) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          {record.status === 1 && (
            <>
              <Tooltip title="Duyệt bài viết">
                <Popconfirm
                  title="Xác nhận duyệt bài viết"
                  description={`Bạn có chắc chắn muốn duyệt bài viết "${record.title}"?`}
                  onConfirm={() => handleApprove(record)}
                  onCancel={cancel}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    className="!text-green-600 !hover:bg-green-50"
                  />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Từ chối bài viết">
                <Popconfirm
                  title="Xác nhận từ chối bài viết"
                  description={`Bạn có chắc chắn muốn từ chối bài viết "${record.title}"?`}
                  onConfirm={() => setOpenModal(record.blogId)}
                  onCancel={cancel}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    className="!text-red-600 !hover:bg-red-50"
                  />
                </Popconfirm>
              </Tooltip>
            </>
          )}
          {record.status === 2 && (
            <Tooltip title="Ẩn bài viết">
              <Popconfirm
                title="Xác nhận ẩn bài viết"
                description={`Bạn có chắc chắn muốn ẩn bài viết "${record.title}"?`}
                onConfirm={() => handleHideBlog(record)}
                onCancel={cancel}
                okText="Xác nhận"
                cancelText="Hủy"
              >
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  className="!text-red-600 !hover:bg-red-50"
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
      {headerTable}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table
          columns={columns}
          dataSource={blogData}
          rowKey="blogId"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} bài viết`,
            pageSizeOptions: ["6", "12", "24", "32"],
          }}
          onChange={onChange}
          className="ant-table-custom"
          onRow={(record) => ({
            onClick: () => onRowClick?.(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      <style>{`
        .ant-table-custom .ant-table-thead > tr > th {
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }
          .ant-table-custom .ant-table-tbody > tr:hover > td {
          background: #e0f2fe !important;
          transition: background-color 0.2s ease;
        }
        
        .ant-table-custom .ant-table-tbody > tr {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .ant-table-custom .ant-table-tbody > tr:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }
        
        .ant-table-custom .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 16px;
        }
          .ant-table-custom .ant-pagination {
          margin: 16px 0;
          text-align: center;
        }
        
        .ant-table-custom .ant-btn {
          z-index: 10;
          position: relative;
        }
        
        .ant-table-custom .ant-btn:hover {
          transform: none !important;
        }
      `}</style>

      <ReasonReject
        open={!!openModal}
        onCancel={() => setOpenModal("")}
        blogId={openModal}
        onStatusChange={onStatusChange}
      />
    </div>
  );
};

export default BlogTable;
