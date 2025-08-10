/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { Card, Spin, Empty, Pagination, Typography, Button, Form } from "antd";
import { ReloadOutlined, ExportOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuctionAssetServices from "../../../services/AuctionAssetServices";
import dayjs from "dayjs";

import CategoryFilter from "./components/CategoryFilter";
import SearchFilter from "./components/SearchFilter";
import AssetsTable from "./components/AssetsTable";
import AssetsGrid from "./components/AssetsGrid";
import AssetsList from "./components/AssetsList";

import type {
  AuctionAsset,
  CategoryCount,
  SearchParams,
  AuctionAssetApiResponse,
  AdvancedFilterValues,
} from "./types";
import { DIRECTOR_ROUTES, MANAGER_ROUTES } from "../../../routers";
import { useSelector } from "react-redux";

const { Title } = Typography;

const ListAuctionAsset: React.FC = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<AuctionAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    PageNumber: 1,
    PageSize: 10,
    Search: {
      CategoryId: undefined,
      TagName: "",
      AuctionStartDate: "",
      AuctionEndDate: "",
      AuctionStatus: undefined,
    },
  });
  const [totalAssets, setTotalAssets] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount>({});
  const [viewMode, setViewMode] = useState<"table" | "grid" | "list">("table");
  const [showFilters, setShowFilters] = useState(false);

  const [form] = Form.useForm();
  const { user } = useSelector((state: any) => state.auth);

  const fetchAuctionAssets = useCallback(async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        PageNumber: searchParams.PageNumber,
        PageSize: searchParams.PageSize,
        "Search.CategoryId": searchParams.Search?.CategoryId || "",
        "Search.TagName": searchParams.Search?.TagName || "",
        "Search.AuctionStartDate": searchParams.Search?.AuctionStartDate || "",
        "Search.AuctionEndDate": searchParams.Search?.AuctionEndDate || "",
        "Search.AuctionStatus": searchParams.Search?.AuctionStatus || "",
      };

      const response = (await AuctionAssetServices.getListAuctionAsset(
        params
      )) as AuctionAssetApiResponse;

      if (response.code === 200 && response.data) {
        setAssets(response.data.auctionAssetResponses || []);
        setTotalAssets(response.data.totalAuctionAsset || 0);
        setCategoryCounts(response.data.categoryCounts || {});
      } else {
        toast.error(
          response.message || "Không thể tải danh sách tài sản đấu giá"
        );
        setAssets([]);
        setTotalAssets(0);
        setCategoryCounts({});
      }
    } catch (error) {
      console.error("Error fetching auction assets:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu");
      setAssets([]);
      setTotalAssets(0);
      setCategoryCounts({});
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchAuctionAssets();
  }, [fetchAuctionAssets]);

  const handleSearch = (value: string) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: {
        ...prev.Search,
        TagName: value,
      },
      PageNumber: 1,
    }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: {
        ...prev.Search,
        CategoryId: categoryId === "all" ? undefined : parseInt(categoryId),
      },
      PageNumber: 1,
    }));
  };

  const handleAdvancedFilter = (values: AdvancedFilterValues) => {
    setSearchParams((prev) => ({
      ...prev,
      Search: {
        CategoryId: values.categoryId,
        TagName: values.tagName,
        AuctionStartDate: values.auctionStartDate
          ? dayjs(values.auctionStartDate).format("YYYY-MM-DD")
          : undefined,
        AuctionEndDate: values.auctionEndDate
          ? dayjs(values.auctionEndDate).format("YYYY-MM-DD")
          : undefined,
        AuctionStatus: values.auctionStatus,
      },
      PageNumber: 1,
    }));
    setShowFilters(false);
    toast.success("Đã áp dụng bộ lọc");
  };

  const handleReset = () => {
    setSearchParams({
      PageNumber: 1,
      PageSize: 10,
      Search: {},
    });
    form.resetFields();
    toast.info("Đã đặt lại bộ lọc");
  };

  const handlePagination = (page: number, pageSize: number) => {
    setSearchParams((prev) => ({
      ...prev,
      PageNumber: page,
      PageSize: pageSize,
    }));
  };

  const handleSort = (sortBy: string, isAscending: boolean) => {
    setSearchParams((prev) => ({
      ...prev,
      sortBy,
      isAscending,
    }));
  };

  const getRoute = () => {
    if (user.roleName === "Director") {
      return DIRECTOR_ROUTES;
    } else if (user.roleName === "Manager") {
      return MANAGER_ROUTES;
    }
  };

  const showAssetDetail = (asset: AuctionAsset) => {
    const route = getRoute();
    if (route) {
      navigate(
        `/${route.PATH}/${route.SUB.AUCTION_ASSET_DETAIL}/${asset.auctionAssetsId}`
      );
    }
  };

  const handleExport = () => {
    toast.info("Tính năng xuất dữ liệu đang được phát triển");
  };

  return (
    <div className="auction-assets-container p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto !space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <Title level={2} className="!mb-2 text-gray-800">
                Danh sách tài sản đấu giá
              </Title>
              <p className="text-gray-600">
                Quản lý và theo dõi các tài sản đấu giá trong hệ thống
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchAuctionAssets}
                loading={loading}
                className="hover:bg-blue-50 hover:border-blue-300"
              >
                Làm mới
              </Button>
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </div>

        <Card className="!shadow-sm">
          <div className="!space-y-4">
            <CategoryFilter
              categoryCounts={categoryCounts}
              selectedCategory={searchParams.Search?.CategoryId}
              onCategoryChange={handleCategoryFilter}
            />

            <SearchFilter
              form={form}
              showFilters={showFilters}
              onShowFiltersChange={setShowFilters}
              onSearch={handleSearch}
              onAdvancedFilter={handleAdvancedFilter}
              onReset={handleReset}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </Card>

        <Card className="!shadow-sm !border !border-gray-200">
          <Spin spinning={loading}>
            {assets.length === 0 && !loading ? (
              <Empty
                description="Không có tài sản nào"
                className="py-16"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="!space-y-4">
                {viewMode === "table" && (
                  <AssetsTable
                    assets={assets}
                    searchParams={searchParams}
                    onSort={handleSort}
                    onAssetClick={showAssetDetail}
                  />
                )}
                {viewMode === "grid" && (
                  <AssetsGrid assets={assets} onAssetClick={showAssetDetail} />
                )}
                {viewMode === "list" && (
                  <AssetsList assets={assets} onAssetClick={showAssetDetail} />
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Hiển thị {assets.length} trong tổng số {totalAssets} tài sản
                  </div>
                  <Pagination
                    current={searchParams.PageNumber}
                    pageSize={searchParams.PageSize}
                    total={totalAssets}
                    onChange={handlePagination}
                    showQuickJumper
                    showTotal={(total, range) =>
                      `${range[0]}-${range[1]} của ${total} mục`
                    }
                  />
                </div>
              </div>
            )}
          </Spin>
        </Card>
      </div>
      <style>{`
    /* Custom styles for ListAuctionAsset component */

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ant-card-hoverable:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
    }

    .ant-statistic-content {
      font-weight: 600;
    }

    .ant-table-tbody > tr:hover > td {
      background: #f0f9ff !important;
    }

    .ant-pagination-item-active {
      border-color: #1890ff;
      background: #1890ff;
    }

    .ant-pagination-item-active a {
      color: white;
    }

    .ant-tag {
      border-radius: 6px;
      font-weight: 500;
    }

    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .glass-effect {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  `}</style>
    </div>
  );
};

export default ListAuctionAsset;
