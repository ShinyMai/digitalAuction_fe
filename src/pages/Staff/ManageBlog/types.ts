export interface BlogData {
  blogId: string;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  status: number;
}

export interface BlogResponse {
  blogs: BlogData[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
}

export interface BlogParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTitle?: string;
  Status?: number;
}

// Blog Status Constants
export const BlogStatus = {
  DRAFT: 0,
  PENDING: 1,
  PUBLISHED: 2,
  HIDDEN: 3,
  PUBLISHED_AND_HIDDEN: 4,
  REJECTED: 5,
} as const;

export type BlogStatusType = (typeof BlogStatus)[keyof typeof BlogStatus];

export const getBlogStatusLabel = (status: number): string => {
  switch (status) {
    case BlogStatus.DRAFT:
      return "Nháp";
    case BlogStatus.PENDING:
      return "Chờ duyệt";
    case BlogStatus.PUBLISHED:
      return "Đã xuất bản";
    case BlogStatus.HIDDEN:
      return "Đã ẩn";
    case BlogStatus.PUBLISHED_AND_HIDDEN:
      return "Đã xuất bản & Đã ẩn";
    case BlogStatus.REJECTED:
      return "Bị từ chối";
    default:
      return "Không xác định";
  }
};

export const getBlogStatusColor = (status: number): string => {
  switch (status) {
    case BlogStatus.DRAFT:
      return "orange";
    case BlogStatus.PENDING:
      return "blue";
    case BlogStatus.PUBLISHED:
      return "green";
    case BlogStatus.HIDDEN:
      return "red";
    case BlogStatus.PUBLISHED_AND_HIDDEN:
      return "purple";
    case BlogStatus.REJECTED:
      return "gray";
    default:
      return "default";
  }
};

export const BlogStatusOptions = [
  { label: getBlogStatusLabel(BlogStatus.DRAFT), value: BlogStatus.DRAFT },
  { label: getBlogStatusLabel(BlogStatus.PENDING), value: BlogStatus.PENDING },
  { label: getBlogStatusLabel(BlogStatus.PUBLISHED), value: BlogStatus.PUBLISHED },
  { label: getBlogStatusLabel(BlogStatus.HIDDEN), value: BlogStatus.HIDDEN },
  {
    label: getBlogStatusLabel(BlogStatus.PUBLISHED_AND_HIDDEN),
    value: BlogStatus.PUBLISHED_AND_HIDDEN,
  },
  {
    label: getBlogStatusLabel(BlogStatus.REJECTED),
    value: BlogStatus.REJECTED,
  },
];
