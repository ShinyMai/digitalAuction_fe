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
