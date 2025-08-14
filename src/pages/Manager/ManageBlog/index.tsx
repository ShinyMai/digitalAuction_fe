import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import NewsServices from "../../../services/NewsService";
import BlogTable from "./components/BlogTable";
import SearchBlogTable from "./components/SearchBlogTable";
import DetailBlog from "./modal/DetailBlog";
import type { ApiResponse } from "../../../types/responseAxios";
import type {
  BlogData,
  BlogParams,
  BlogResponse,
} from "../../Staff/ManageBlog/types";

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
  PageSize: 6,
  Status: 4,
};

const ManageBlog = () => {
  const [blogList, setBlogList] = useState<BlogData[]>([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams, setSearchParams] =
    useState<SearchParams>(DEFAULT_PARAMS);
  const [selectedBlog, setSelectedBlog] = useState<BlogData | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const fetchBlogList = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const params: BlogParams = {
        PageNumber: searchParams.PageNumber ?? 1,
        PageSize: searchParams.PageSize ?? 6,
        SearchTitle: searchParams.SearchTitle,
        Status: searchParams.Status,
      };

      // Remove undefined values
      Object.keys(params).forEach((key) => {
        if (params[key as keyof BlogParams] === undefined) {
          delete params[key as keyof BlogParams];
        }
      });

      const response: ApiResponse<BlogResponse> =
        await NewsServices.getListNews(params);

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

  const handleRowClick = (record: BlogData): void => {
    setSelectedBlog(record);
    setDetailModalOpen(true);
  };

  const handleCloseDetailModal = (): void => {
    setDetailModalOpen(false);
    setSelectedBlog(null);
  };

  return (
    <section className="w-full h-full p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {" "}
        {/* Main Content */}
        <div className="w-full" id="blog-table-list">
          <BlogTable
            blogData={blogList}
            headerTable={<SearchBlogTable onSearch={onSearch} />}
            onChange={onChangeTable}
            total={totalData}
            loading={loading}
            pageSize={searchParams.PageSize}
            currentPage={searchParams.PageNumber}
            onStatusChange={fetchBlogList}
            onRowClick={handleRowClick}
          />
        </div>
        {/* Detail Blog Modal */}
        <DetailBlog
          open={detailModalOpen}
          onCancel={handleCloseDetailModal}
          blogData={selectedBlog}
        />
      </div>
    </section>
  );
};

export default ManageBlog;
