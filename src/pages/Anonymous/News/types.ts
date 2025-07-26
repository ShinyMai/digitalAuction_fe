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

// Status mapping
export const BlogStatus = {
  DRAFT: 0,
  PENDING: 1,
  PUBLISH: 2,
  DISABLE: 3,
  PUBLISH_AND_DISABLE: 4, // Get both 2 and 3
} as const;

// Helper types for the UI
export type BlogStatusType = (typeof BlogStatus)[keyof typeof BlogStatus];
