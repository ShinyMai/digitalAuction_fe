// Core interfaces
export interface AuctionAsset {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: number;
  unit: string;
  deposit: number;
  registrationFee: number;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auctionName: string;
  categoryName: string;
}

export interface CategoryCount {
  [key: string]: number;
}

export interface SearchParams {
  PageNumber: number;
  PageSize: number;
  Search?: {
    CategoryId?: number;
    TagName?: string;
    AuctionStartDate?: string;
    AuctionEndDate?: string;
    AuctionStatus?: number;
  };
}

export interface AuctionAssetApiResponse {
  code: number;
  message: string;
  data: {
    pageNumber: number;
    pageSize: number;
    totalAuctionAsset: number;
    auctionAssetResponses: AuctionAsset[];
    categoryCounts: CategoryCount;
  };
}

export interface AdvancedFilterValues {
  categoryId?: number;
  tagName?: string;
  auctionStartDate?: string;
  auctionEndDate?: string;
  auctionStatus?: number;
}

// Constants
export const AUCTION_STATUS_OPTIONS = [
  { value: 1, label: "Công khai" },
  { value: 2, label: "Hoàn thành" },
  { value: 3, label: "Hủy" },
];

export const CATEGORY_OPTIONS = [
  { id: 1, name: "Tài sản đảm bảo" },
  { id: 2, name: "Quyền sử dụng đất" },
  { id: 3, name: "Tài sản vi phạm hành chính" },
  { id: 4, name: "Tài sản nhà nước" },
  { id: 5, name: "Tài sản khác" },
];

// Legacy interfaces for backward compatibility
export interface AuctionAssetSearchParams {
  PageNumber: number;
  PageSize: number;
  Search?: {
    CategoryId?: number;
    TagName?: string;
    AuctionStartDate?: string;
    AuctionEndDate?: string;
    AuctionStatus?: number;
  };
}

export interface AuctionAssetResponse {
  auctionAssetsId: string;
  tagName: string;
  startingPrice: number;
  unit: string;
  deposit: number;
  registrationFee: number;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  auctionId: string;
  auctionName: string;
  categoryName: string;
}

export interface CategoryCounts {
  [categoryName: string]: number;
}

export interface AuctionAssetListData {
  pageNumber: number;
  pageSize: number;
  totalAuctionAsset: number;
  auctionAssetResponses: AuctionAssetResponse[];
  categoryCounts: CategoryCounts;
}

export type AuctionStatusType = 1 | 2 | 3;
export type ViewMode = "grid" | "table" | "list";

// Component prop interfaces
export interface StatisticsCardsProps {
  totalAssets: number;
  assets: AuctionAsset[];
  categoryCounts: CategoryCount;
}

export interface CategoryFilterProps {
  categoryCounts: CategoryCount;
  selectedCategory?: number;
  onCategoryChange: (categoryId: string) => void;
}

export interface SearchFilterProps {
  form: import("antd").FormInstance;
  showFilters: boolean;
  onShowFiltersChange: (show: boolean) => void;
  onSearch: (value: string) => void;
  onAdvancedFilter: (values: AdvancedFilterValues) => void;
  onReset: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export interface AssetsTableProps {
  assets: AuctionAsset[];
  searchParams: SearchParams;
  onSort: (sortBy: string, isAscending: boolean) => void;
  onAssetClick: (asset: AuctionAsset) => void;
}

export interface AssetsGridProps {
  assets: AuctionAsset[];
  onAssetClick: (asset: AuctionAsset) => void;
}

export interface AssetsListProps {
  assets: AuctionAsset[];
  onAssetClick: (asset: AuctionAsset) => void;
}

export interface AssetDetailModalProps {
  visible: boolean;
  asset: AuctionAsset | null;
  onClose: () => void;
}
