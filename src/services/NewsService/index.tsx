/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../types/responseAxios";
import { http } from "../../utils/axiosConfigs";
import { NewsAPI } from "./urls.tsx";

const getListNews = (params?: any): Promise<ApiResponse<any>> =>
  http.get(NewsAPI.GET_LIST_NEWS, { params: params });

const getBlogDetail = (blogId: string): Promise<ApiResponse<any>> =>
  http.get(`${NewsAPI.DETAIL_BLOG}?BlogId=${blogId}`);

const createBlog = (body: any): Promise<ApiResponse<any>> =>
  http.post(NewsAPI.CREATE_BLOG, body);

const updateBlog = (body: any): Promise<ApiResponse<any>> =>
  http.post(NewsAPI.UPDATE_BLOG, body);

const changeStatusBlog = (body: {
  BlogId: string;
  Status: number;
  Note: string;
}): Promise<ApiResponse<any>> => http.post(NewsAPI.CHANGE_STATUS_BLOG, body);

const NewsServices = {
  getListNews,
  createBlog,
  updateBlog,
  getBlogDetail,
  changeStatusBlog,
};

export default NewsServices;
