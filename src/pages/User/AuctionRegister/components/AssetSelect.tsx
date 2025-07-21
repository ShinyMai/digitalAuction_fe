/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo } from "react";
import {
  Tooltip,
  Pagination,
  Button,
  Input,
  Select,
  Slider,
  Card,
  Tag,
  Radio,
  Row,
  Col,
  Modal,
} from "antd";
import {
  TagOutlined,
  ApartmentOutlined,
  FileTextOutlined,
  DollarOutlined,
  WalletOutlined,
  CreditCardOutlined,
  PictureOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  AppstoreOutlined,
  BarsOutlined,
  TableOutlined,
  EyeOutlined,
  SwapOutlined,
} from "@ant-design/icons";

interface Props {
  listAsset?: DataType[];
  onGetAssetSelect: (value: string) => void;
  onNext: (assetId: string) => void;
  onPrev: () => void;
}

interface DataType {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: string;
  unit: string;
  deposit: string;
  registrationFee: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auction?: string;
  imageUrl?: string;
}

const formatVND = (value: string) => {
  const number = parseFloat(value);
  if (isNaN(number)) return value;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

const truncateDescription = (description: string, maxLength: number = 100) => {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength) + "...";
};

const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

const AssetSelect = ({ listAsset, onGetAssetSelect, onNext }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState<"name" | "price" | "deposit" | "fee">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);

  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const priceRangeData = useMemo(() => {
    if (!listAsset?.length) return [0, 0];
    const prices = listAsset.map((asset) => parseFloat(asset.startingPrice));
    return [Math.min(...prices), Math.max(...prices)];
  }, [listAsset]);

  useEffect(() => {
    if (priceRangeData[0] !== priceRangeData[1]) {
      setPriceRange(priceRangeData as [number, number]);
    }
  }, [priceRangeData]);

  // Get unique categories from assets
  const categories = useMemo(() => {
    if (!listAsset?.length) return [];
    const uniqueCategories = [...new Set(listAsset.map((asset) => asset.unit || "Khác"))];
    return uniqueCategories.sort();
  }, [listAsset]);

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    if (!listAsset?.length) return [];
    const filtered = listAsset.filter((asset) => {
      // Search filter - now supports accent-insensitive search
      const searchMatch =
        !searchTerm ||
        removeAccents(asset.tagName.toLowerCase()).includes(
          removeAccents(searchTerm.toLowerCase())
        ) ||
        (asset.description &&
          removeAccents(asset.description.toLowerCase()).includes(
            removeAccents(searchTerm.toLowerCase())
          ));

      // Category filter
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(asset.unit || "Khác");

      // Price range filter
      const price = parseFloat(asset.startingPrice);
      const priceMatch = price >= priceRange[0] && price <= priceRange[1];

      return searchMatch && categoryMatch && priceMatch;
    });

    filtered.sort((a, b) => {
      let valueA: any, valueB: any;

      switch (sortBy) {
        case "name":
          valueA = a.tagName.toLowerCase();
          valueB = b.tagName.toLowerCase();
          break;
        case "price":
          valueA = parseFloat(a.startingPrice);
          valueB = parseFloat(b.startingPrice);
          break;
        case "deposit":
          valueA = parseFloat(a.deposit);
          valueB = parseFloat(b.deposit);
          break;
        case "fee":
          valueA = parseFloat(a.registrationFee);
          valueB = parseFloat(b.registrationFee);
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    return filtered;
  }, [listAsset, searchTerm, selectedCategories, priceRange, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedAssets.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedAssets, currentPage, pageSize]);

  const handleGetValueAssetAndNext = (value: string) => {
    onGetAssetSelect(value);
    onNext(value);
  };

  const toggleSelection = (assetId: string) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange(priceRangeData as [number, number]);
    setSortBy("name");
    setSortOrder("asc");
  };

  // Render asset card for grid view
  const renderGridCard = (asset: DataType, index: number) => (
    <div
      key={asset.auctionAssetsId}
      className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:scale-105 hover:shadow-3xl transition-all duration-500 cursor-pointer animate-slide-in-up"
      style={{ animationDelay: `${0.1 * index}s` }}
    >
      {/* Asset Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
        {/* Floating Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="small"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelection(asset.auctionAssetsId);
            }}
            className={`!border-0 !shadow-md !hover:scale-110 !transition-transform ${
              selectedAssets.includes(asset.auctionAssetsId)
                ? "bg-blue-500 text-white"
                : "bg-white/80"
            }`}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button
              type="primary"
              onClick={() => handleGetValueAssetAndNext(asset.auctionAssetsId)}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-semibold"
              icon={<ShoppingCartOutlined />}
            >
              Chọn tài sản này
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {asset.tagName}
        </h3>

        <div className="space-y-3 mb-6">
          {asset.unit && (
            <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <ApartmentOutlined className="text-blue-600 text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Đơn vị</p>
                <p className="text-sm font-bold text-gray-700">{asset.unit}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <DollarOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Giá khởi điểm</p>
              <p className="text-sm font-bold text-green-700">{formatVND(asset.startingPrice)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <WalletOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Tiền đặt trước</p>
              <p className="text-sm font-bold text-blue-700">{formatVND(asset.deposit)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <CreditCardOutlined className="text-white text-sm" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Phí đăng ký</p>
              <p className="text-sm font-bold text-purple-700">
                {formatVND(asset.registrationFee)}
              </p>
            </div>
          </div>
        </div>

        {asset.description && (
          <div className="mb-4">
            <Tooltip title={asset.description} placement="top">
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-2">
                  <FileTextOutlined className="text-gray-400 text-sm mt-1" />
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {truncateDescription(asset.description)}
                  </p>
                </div>
              </div>
            </Tooltip>
          </div>
        )}

        <Button
          type="primary"
          block
          size="large"
          onClick={() => handleGetValueAssetAndNext(asset.auctionAssetsId)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
        >
          <span className="flex items-center justify-center gap-2">
            <CheckCircleOutlined />
            Chọn tài sản này
            <ArrowRightOutlined />
          </span>
        </Button>
      </div>
    </div>
  );

  // Render asset card for list view
  const renderListCard = (asset: DataType, index: number) => (
    <Card
      key={asset.auctionAssetsId}
      className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 animate-slide-in-up"
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Asset Image */}
        <div className="lg:w-48 h-32 lg:h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden flex-shrink-0">
          {asset.imageUrl ? (
            <img src={asset.imageUrl} alt={asset.tagName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PictureOutlined className="text-3xl text-gray-300" />
            </div>
          )}
        </div>

        {/* Asset Info */}
        <div className="flex-1">
          <div className="flex flex-col lg:flex-row gap-4 h-full">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{asset.tagName}</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <ApartmentOutlined className="text-blue-600" />
                  {asset.unit}
                </span>
                <span className="flex items-center gap-1 text-green-600 font-semibold">
                  <DollarOutlined />
                  {formatVND(asset.startingPrice)}
                </span>
                <span className="flex items-center gap-1 text-blue-600">
                  <WalletOutlined />
                  {formatVND(asset.deposit)}
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <CreditCardOutlined />
                  {formatVND(asset.registrationFee)}
                </span>
              </div>
              {asset.description && (
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {truncateDescription(asset.description, 150)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col lg:flex-row gap-2 lg:items-center">
              <div className="flex gap-2">
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => toggleSelection(asset.auctionAssetsId)}
                  type={selectedAssets.includes(asset.auctionAssetsId) ? "primary" : "default"}
                />
              </div>
              <Button
                type="primary"
                onClick={() => handleGetValueAssetAndNext(asset.auctionAssetsId)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
              >
                Chọn tài sản
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
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
                  💎 CHỌN TÀI SẢN ĐẤU GIÁ
                </span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text">
              Lựa Chọn Tài Sản
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chọn tài sản bạn muốn tham gia đấu giá từ danh sách dưới đây
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
                <TagOutlined className="text-blue-600" />
                <span className="font-semibold text-gray-700">
                  {filteredAndSortedAssets.length} / {listAsset?.length || 0} tài sản
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-xl border border-white/20">
                <SwapOutlined className="text-purple-600" />
                <span className="font-semibold text-gray-700">{selectedAssets.length} so sánh</span>
              </div>
            </div>
          </div>{" "}
          <Card className="!mb-4 shadow-xl border-0 bg-white/80 ">
            <div className="space-y-4">
              {/* Main Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
                <div className="flex-1">
                  <Input.Search
                    size="large"
                    placeholder="Tìm kiếm tài sản theo tên, mô tả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    allowClear
                    className="search-input-no-border"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    icon={<FilterOutlined />}
                    onClick={() => setShowFilters(!showFilters)}
                    className={`rounded-xl ${showFilters ? "bg-blue-50 border-blue-300" : ""}`}
                  >
                    Bộ lọc
                  </Button>

                  {/* View Mode Toggle */}
                  <Radio.Group
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="rounded-xl"
                  >
                    <Radio.Button value="grid" className="rounded-l-xl">
                      <AppstoreOutlined />
                    </Radio.Button>
                    <Radio.Button value="list">
                      <BarsOutlined />
                    </Radio.Button>
                    <Radio.Button value="table" className="rounded-r-xl">
                      <TableOutlined />
                    </Radio.Button>
                  </Radio.Group>
                </div>
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="p-4 bg-gray-50 rounded-xl space-y-4">
                  <Row gutter={[16, 16]}>
                    {/* Category Filter */}
                    <Col xs={24} sm={12} lg={6}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Danh mục
                        </label>
                        <Select
                          mode="multiple"
                          placeholder="Chọn danh mục..."
                          value={selectedCategories}
                          onChange={setSelectedCategories}
                          className="w-full"
                          size="large"
                          allowClear
                        >
                          {categories.map((category) => (
                            <Select.Option key={category} value={category}>
                              {category}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </Col>

                    {/* Price Range */}
                    <Col xs={24} sm={12} lg={6}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Khoảng giá ({formatVND(priceRange[0].toString())} -{" "}
                          {formatVND(priceRange[1].toString())})
                        </label>
                        <Slider
                          range
                          min={priceRangeData[0]}
                          max={priceRangeData[1]}
                          value={priceRange}
                          onChange={(value) => setPriceRange(value as [number, number])}
                          tooltip={{
                            formatter: (value?: number) => formatVND(value?.toString() || "0"),
                          }}
                        />
                      </div>
                    </Col>

                    {/* Sort Options */}
                    <Col xs={24} sm={12} lg={6}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sắp xếp theo
                        </label>
                        <Select value={sortBy} onChange={setSortBy} className="w-full" size="large">
                          <Select.Option value="name">Tên tài sản</Select.Option>
                          <Select.Option value="price">Giá khởi điểm</Select.Option>
                          <Select.Option value="deposit">Tiền đặt trước</Select.Option>
                          <Select.Option value="fee">Phí đăng ký</Select.Option>
                        </Select>
                      </div>
                    </Col>

                    {/* Sort Order */}
                    <Col xs={24} sm={12} lg={6}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thứ tự
                        </label>
                        <Select
                          value={sortOrder}
                          onChange={setSortOrder}
                          className="w-full"
                          size="large"
                        >
                          <Select.Option value="asc">
                            <SortAscendingOutlined /> Tăng dần
                          </Select.Option>
                          <Select.Option value="desc">
                            <SortAscendingOutlined style={{ transform: "rotate(180deg)" }} /> Giảm
                            dần
                          </Select.Option>
                        </Select>
                      </div>
                    </Col>
                  </Row>

                  {/* Filter Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex flex-wrap gap-2">
                      {searchTerm && (
                        <Tag closable onClose={() => setSearchTerm("")} color="blue">
                          Tìm: "{searchTerm}"
                        </Tag>
                      )}
                      {selectedCategories.map((category) => (
                        <Tag
                          key={category}
                          closable
                          onClose={() =>
                            setSelectedCategories((prev) => prev.filter((c) => c !== category))
                          }
                          color="green"
                        >
                          {category}
                        </Tag>
                      ))}
                    </div>
                    <Button onClick={clearFilters} type="link">
                      Xóa tất cả bộ lọc
                    </Button>
                  </div>
                </div>
              )}

              {/* Quick Actions Bar */}
              <div className="flex flex-wrap justify-between items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Hiển thị {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, filteredAndSortedAssets.length)}
                    trong số {filteredAndSortedAssets.length} tài sản
                  </span>
                  <Select
                    value={pageSize}
                    onChange={(value) => {
                      setPageSize(value);
                      setCurrentPage(1);
                    }}
                    className="w-20"
                    size="small"
                  >
                    <Select.Option value={12}>12</Select.Option>
                    <Select.Option value={24}>24</Select.Option>
                    <Select.Option value={48}>48</Select.Option>
                    <Select.Option value={96}>96</Select.Option>
                  </Select>
                  <span className="text-sm text-gray-500">mục/trang</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAssets.length > 0 && (
                    <>
                      <Button
                        onClick={() => setShowComparison(true)}
                        icon={<SwapOutlined />}
                        type="primary"
                        ghost
                      >
                        So sánh ({selectedAssets.length})
                      </Button>
                      <Button onClick={() => setSelectedAssets([])} size="small">
                        Bỏ chọn tất cả
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>
          {/* Enhanced Asset Display */}
          {listAsset && listAsset.length > 0 ? (
            <>
              {/* Grid View */}
              {viewMode === "grid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                  {paginatedData?.map((asset, index) => renderGridCard(asset, index))}
                </div>
              )}

              {/* List View */}
              {viewMode === "list" && (
                <div className="space-y-4 mb-12">
                  {paginatedData?.map((asset, index) => renderListCard(asset, index))}
                </div>
              )}

              {/* Table View */}
              {viewMode === "table" && (
                <Card className="mb-12 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-4 px-2 font-semibold text-gray-700">
                            Tài sản
                          </th>
                          <th className="text-left py-4 px-2 font-semibold text-gray-700">
                            Đơn vị
                          </th>
                          <th className="text-right py-4 px-2 font-semibold text-gray-700">
                            Giá khởi điểm
                          </th>
                          <th className="text-right py-4 px-2 font-semibold text-gray-700">
                            Tiền đặt trước
                          </th>
                          <th className="text-right py-4 px-2 font-semibold text-gray-700">
                            Phí đăng ký
                          </th>
                          <th className="text-center py-4 px-2 font-semibold text-gray-700">
                            Thao tác
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData?.map((asset, index) => (
                          <tr
                            key={asset.auctionAssetsId}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-slide-in-up"
                            style={{ animationDelay: `${0.05 * index}s` }}
                          >
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {asset.imageUrl ? (
                                    <img
                                      src={asset.imageUrl}
                                      alt={asset.tagName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <PictureOutlined className="text-gray-300" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{asset.tagName}</div>
                                  {asset.description && (
                                    <div className="text-sm text-gray-500 line-clamp-1">
                                      {truncateDescription(asset.description, 50)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-2 text-gray-600">{asset.unit}</td>
                            <td className="py-4 px-2 text-right font-semibold text-green-600">
                              {formatVND(asset.startingPrice)}
                            </td>
                            <td className="py-4 px-2 text-right font-semibold text-blue-600">
                              {formatVND(asset.deposit)}
                            </td>
                            <td className="py-4 px-2 text-right font-semibold text-purple-600">
                              {formatVND(asset.registrationFee)}
                            </td>
                            <td className="py-4 px-2">
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  size="small"
                                  icon={<EyeOutlined />}
                                  onClick={() => toggleSelection(asset.auctionAssetsId)}
                                  type={
                                    selectedAssets.includes(asset.auctionAssetsId)
                                      ? "primary"
                                      : "default"
                                  }
                                />
                                <Button
                                  type="primary"
                                  size="small"
                                  onClick={() => handleGetValueAssetAndNext(asset.auctionAssetsId)}
                                  className="bg-gradient-to-r from-blue-500 to-purple-600 border-0"
                                >
                                  Chọn
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <PictureOutlined className="text-6xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-4">Chưa có tài sản</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Hiện tại chưa có tài sản nào có thể đấu giá. Vui lòng quay lại sau.
              </p>
            </div>
          )}
          {/* Enhanced Pagination */}
          {filteredAndSortedAssets && filteredAndSortedAssets.length > pageSize && (
            <div className="flex justify-center">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredAndSortedAssets.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                  className="custom-pagination"
                  showQuickJumper
                  showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} tài sản`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Comparison Modal */}
      <Modal
        title={<span className="text-xl font-bold">So sánh tài sản ({selectedAssets.length})</span>}
        open={showComparison}
        onCancel={() => setShowComparison(false)}
        footer={[
          <Button key="close" onClick={() => setShowComparison(false)}>
            Đóng
          </Button>,
          <Button
            key="clear"
            onClick={() => {
              setSelectedAssets([]);
              setShowComparison(false);
            }}
          >
            Xóa so sánh
          </Button>,
        ]}
        width={Math.min(selectedAssets.length * 350, 1200)}
        className="comparison-modal"
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {selectedAssets.map((assetId) => {
            const asset = listAsset?.find((a) => a.auctionAssetsId === assetId);
            if (!asset) return null;

            return (
              <Card
                key={assetId}
                className="flex-shrink-0 w-80 shadow-lg"
                cover={
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100">
                    {asset.imageUrl ? (
                      <img
                        src={asset.imageUrl}
                        alt={asset.tagName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PictureOutlined className="text-4xl text-gray-300" />
                      </div>
                    )}
                  </div>
                }
                actions={[
                  <Button key="remove" type="text" danger onClick={() => toggleSelection(assetId)}>
                    Bỏ chọn
                  </Button>,
                  <Button
                    key="select"
                    type="primary"
                    onClick={() => {
                      handleGetValueAssetAndNext(assetId);
                      setShowComparison(false);
                    }}
                  >
                    Chọn
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={<span className="text-sm font-bold line-clamp-2">{asset.tagName}</span>}
                  description={
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Đơn vị:</span>
                        <span className="font-medium">{asset.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Giá khởi điểm:</span>
                        <span className="font-bold text-green-600">
                          {formatVND(asset.startingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tiền đặt trước:</span>
                        <span className="font-bold text-blue-600">{formatVND(asset.deposit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phí đăng ký:</span>
                        <span className="font-bold text-purple-600">
                          {formatVND(asset.registrationFee)}
                        </span>
                      </div>
                      {asset.description && (
                        <div className="mt-2 pt-2 border-t">
                          <p className="text-gray-600 line-clamp-3">
                            {truncateDescription(asset.description, 80)}
                          </p>
                        </div>
                      )}
                    </div>
                  }
                />
              </Card>
            );
          })}
        </div>
      </Modal>
      <style>{`
        .search-input-no-border .ant-input {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        .search-input-no-border .ant-input:focus {
          border: none !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        .search-input-no-border .ant-input-search {
          border: none !important;
        }
        
        .search-input-no-border .ant-input-group-addon {
          border: none !important;
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
        
        .custom-pagination .ant-pagination-prev,
        .custom-pagination .ant-pagination-next {
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: white;
          transition: all 0.3s ease;
        }
        
        .custom-pagination .ant-pagination-prev:hover,
        .custom-pagination .ant-pagination-next:hover {
          border-color: #3b82f6;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          transform: translateY(-2px);
        }

        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

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
      `}</style>
    </section>
  );
};

export default AssetSelect;
