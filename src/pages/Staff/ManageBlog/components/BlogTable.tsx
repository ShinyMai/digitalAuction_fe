import { Table, Tag, Button, Space, Image, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { BlogData } from "../types";

interface BlogTableProps {
  blogData: BlogData[];
  headerTable: React.ReactNode;
  onChange: (pagination: { current?: number; pageSize?: number }) => void;
  total: number;
  loading: boolean;
  pageSize?: number;
  currentPage?: number;
  onView?: (record: BlogData) => void;
  onEdit?: (record: BlogData) => void;
  onDelete?: (record: BlogData) => void;
}

const BlogTable = ({
  blogData,
  headerTable,
  onChange,
  total,
  loading,
  pageSize = 8,
  currentPage = 1,
  onView,
  onEdit,
  onDelete,
}: BlogTableProps) => {
  const getStatusTag = (status: number) => {
    switch (status) {
      case 0:
        return <Tag color="orange">Nháp</Tag>;
      case 1:
        return <Tag color="blue">Chờ duyệt</Tag>;
      case 2:
        return <Tag color="green">Đã xuất bản</Tag>;
      case 3:
        return <Tag color="red">Đã ẩn</Tag>;
      default:
        return <Tag color="default">Không xác định</Tag>;
    }
  };

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
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
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
      width: 300,
      render: (title: string) => (
        <Tooltip title={title}>
          <div className="font-medium text-gray-800">{truncateText(title, 50)}</div>
        </Tooltip>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: 350,
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
      render: (status: number) => getStatusTag(status),
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 120,
      render: (createdBy: string) => (
        <div className="text-sm text-gray-600">{truncateText(createdBy, 12)}</div>
      ),
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
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView?.(record)}
              className="text-blue-600 hover:bg-blue-50"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
              className="text-green-600 hover:bg-green-50"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete?.(record)}
              className="text-red-600 hover:bg-red-50"
            />
          </Tooltip>
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
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`,
            pageSizeOptions: ["8", "16", "24", "32"],
          }}
          onChange={onChange}
          className="ant-table-custom"
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
          background: #f1f5f9;
        }
        
        .ant-table-custom .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f1f5f9;
          padding: 12px 16px;
        }
        
        .ant-table-custom .ant-pagination {
          margin: 16px 0;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default BlogTable;
