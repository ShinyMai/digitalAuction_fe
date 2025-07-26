import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Modal, message } from "antd";
import NewsServices from "../../../services/NewsService";
import BlogTable from "./components/BlogTable";
import SearchBlogTable from "./components/SearchBlogTable";
import type { BlogData, BlogResponse, BlogParams } from "./types";
import type { ApiResponse } from "../../../types/responseAxios";

interface SearchParams {
  SearchTitle?: string;
  Status?: number;
  PageNumber?: number;
  PageSize?: number;
}

interface SearchValue {
  searchTitle?: string;
  status?: number;
}

interface PaginationChangeParams {
  current?: number;
  pageSize?: number;
}

const DEFAULT_PARAMS: SearchParams = {
  PageNumber: 1,
  PageSize: 8,
};

const ManageBlog = () => {
  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<SearchParams>(DEFAULT_PARAMS);
  const fetchBlogList = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const params: BlogParams = {
        PageNumber: searchParams.PageNumber ?? 1,
        PageSize: searchParams.PageSize ?? 8,
        SearchTitle: searchParams.SearchTitle,
        Status: searchParams.Status,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key as keyof BlogParams] === undefined) {
          delete params[key as keyof BlogParams];
        }
      });

      const response: ApiResponse<BlogResponse> = await NewsServices.getListNews(params);

      if (response.code === 200 && response.data) {
        const data = response.data;
        setTotalData(data.totalCount || 0);
        setBlogList(data.blogs || []);
      } else {
        toast.error(response.message || "Không thể tải danh sách bài viết!");
        setBlogList([]);
        setTotalData(0);
      }
    } catch (error) {
      console.error("Error fetching blog list:", error);
      toast.error("Lỗi khi tải danh sách bài viết!");
      setBlogList([]);
      setTotalData(0);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchBlogList();
  }, [fetchBlogList]);

  const onSearch = (searchValue: SearchValue): void => {
    const newParams: SearchParams = {
      ...searchParams,
      PageNumber: 1,
    };

    if (searchValue.searchTitle) {
      newParams.SearchTitle = searchValue.searchTitle;
    } else {
      delete newParams.SearchTitle;
    }

    if (searchValue.status !== undefined) {
      newParams.Status = searchValue.status;
    } else {
      delete newParams.Status;
    }

    setSearchParams(newParams);
  };

  const onChangeTable = (pagination: PaginationChangeParams): void => {
    const newParams: SearchParams = {
      ...searchParams,
      PageNumber: pagination.current || 1,
      PageSize: pagination.pageSize || 8,
    };

    setSearchParams(newParams);
  };

  const handleView = (record: BlogData): void => {
    message.info(`Xem chi tiết bài viết: ${record.title}`);
  };

  const handleEdit = (record: BlogData): void => {
    message.info(`Chỉnh sửa bài viết: ${record.title}`);
  };

  const handleDelete = (record: BlogData): void => {
    Modal.confirm({
      title: "Xác nhận xóa bài viết",
      content: `Bạn có chắc chắn muốn xóa bài viết "${record.title}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          message.success("Xóa bài viết thành công!");
          fetchBlogList(); // Refresh the list
        } catch (error) {
          console.error("Error deleting blog:", error);
          message.error("Lỗi khi xóa bài viết!");
        }
      },
    });
  };

  const handleAddNew = (): void => {
    message.info("Chức năng thêm bài viết mới đang được phát triển");
  };

  return (
    <section className="w-full h-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="w-full" id="blog-table-list">
          <BlogTable
            blogData={blogList}
            headerTable={<SearchBlogTable onSearch={onSearch} onAddNew={handleAddNew} />}
            onChange={onChangeTable}
            total={totalData}
            loading={loading}
            pageSize={searchParams.PageSize}
            currentPage={searchParams.PageNumber}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </section>
  );
};

export default ManageBlog;
